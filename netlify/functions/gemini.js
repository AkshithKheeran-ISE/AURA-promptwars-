/**
 * @file netlify/functions/gemini.js
 * Secure server-side proxy for Google Gemini API.
 * Keeps API secrets exclusively on the server (process.env.GEMINI_API_KEY).
 * Never exposes credentials to client browsers.
 */

const AURA_SYSTEM_INSTRUCTION = `You are AURA (Atmospheric Understanding & Real-time Air Quality Intelligence), an elite AI-powered urban air quality and family smog defense assistant.
You specialize in helping families and communities navigate severe winter smog and urban air pollution in Delhi-NCR and global metropolitan basins.
Your advice is grounded in peer-reviewed environmental health studies, CPCB standards, WHO air quality guidelines, and AIIMS pediatric protocols.
Provide actionable low-emission daily routines, indoor air quality (IAQ) hacks (such as DIY Corsi-Rosenthal boxes, weatherstripping, wet-mopping), and sustainable lifestyle alternatives.
Always clearly explain the direct impact of choices: quantify inhaled PM2.5 lung burden reduced (in µg/day), avoided carbon emissions (kg CO2), and prevented respiratory clinic visits.
Maintain a concise, authoritative, cyber-tactical yet compassionate tone.`;

/**
 * In-memory sliding rate limiter: clientIp -> { count, resetTime }
 */
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

function checkRateLimit(clientIp) {
  const now = Date.now();
  const record = rateLimitMap.get(clientIp);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { limited: false };
  }

  record.count += 1;
  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
    return { limited: true, retryAfterSeconds };
  }

  return { limited: false };
}

const DEFAULT_ALLOWED_ORIGINS = [
  'https://auratheairqualityassistant.vercel.app',
  'https://aura-the-urbanairqualityassistant.netlify.app',
  'https://urban-air-quality-assistant.netlify.app',
  'https://akshithkheerankr.github.io',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
];

function getCorsOrigin(requestHeaders) {
  const origin = requestHeaders?.origin || requestHeaders?.Origin || '';
  if (!origin) return '*';
  const allowed = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const allowedOrigins = allowed.length > 0 ? allowed : DEFAULT_ALLOWED_ORIGINS;
  return allowedOrigins.includes(origin) ? origin : 'null';
}

function getClientIp(headers) {
  return headers?.['client-ip'] || headers?.['x-forwarded-for']?.split(',')[0]?.trim() || 'global';
}

function checkMethodPrecondition(method, headers) {
  if (method !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    };
  }
  return null;
}

function checkRateLimitPrecondition(clientIp, headers) {
  const rateLimitStatus = checkRateLimit(clientIp);
  if (rateLimitStatus.limited) {
    return {
      statusCode: 429,
      headers: {
        ...headers,
        'Retry-After': String(rateLimitStatus.retryAfterSeconds || 60)
      },
      body: JSON.stringify({
        success: false,
        fallback: true,
        message:
          'Rate limit exceeded (30 req/min). Falling back to local deterministic expert system.'
      })
    };
  }
  return null;
}

function checkApiKeyPrecondition(apiKey, headers) {
  const isValid = apiKey && typeof apiKey === 'string' && apiKey.length >= 20;
  if (!isValid) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({
        success: false,
        fallback: true,
        message:
          'Server GEMINI_API_KEY is not configured. Falling back to local deterministic expert system.'
      })
    };
  }
  return null;
}

function checkPayloadSizePrecondition(body, headers) {
  const isTooLarge = typeof body === 'string' && body.length > 10240;
  if (isTooLarge) {
    return {
      statusCode: 413,
      headers,
      body: JSON.stringify({ error: 'Payload exceeds 10KB limit.' })
    };
  }
  return null;
}

function validatePreconditions(event, headers) {
  const methodError = checkMethodPrecondition(event.httpMethod, headers);
  if (methodError) return methodError;

  const clientIp = getClientIp(event.headers);
  const rateError = checkRateLimitPrecondition(clientIp, headers);
  if (rateError) return rateError;

  const apiKey = process.env.GEMINI_API_KEY;
  const keyError = checkApiKeyPrecondition(apiKey, headers);
  if (keyError) return keyError;

  const sizeError = checkPayloadSizePrecondition(event.body, headers);
  if (sizeError) return sizeError;

  return { apiKey };
}

/**
 * Sanitizes raw user prompt text for Gemini:
 * 1. Binds input length to 1000 characters before processing
 * 2. Strips HTML tags using a linear character-by-character scan
 * 3. Trims whitespace and clamps to maxLength
 * @param {string} rawPrompt - User question string
 * @param {number} maxLength - Maximum allowable length (default: 600)
 * @returns {string} Sanitized prompt
 */
export function sanitizePromptText(rawPrompt, maxLength = 600) {
  if (!rawPrompt || typeof rawPrompt !== 'string') return '';
  const cappedPrompt = rawPrompt.slice(0, 1000);
  const chars = [];
  let inTag = false;
  for (let i = 0; i < cappedPrompt.length; i++) {
    const ch = cappedPrompt[i];
    if (ch === '<') {
      inTag = true;
    } else if (ch === '>') {
      inTag = false;
    } else if (!inTag) {
      chars.push(ch);
    }
  }
  return chars.join('').trim().slice(0, maxLength);
}

function parseAndSanitizePrompt(eventBody, headers) {
  let body;
  try {
    body = JSON.parse(eventBody || '{}');
  } catch {
    return {
      errorResponse: {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON request payload.' })
      }
    };
  }

  const rawPrompt = body.prompt;
  if (!rawPrompt || typeof rawPrompt !== 'string' || !rawPrompt.trim()) {
    return {
      errorResponse: {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt is required.' })
      }
    };
  }

  const cleanPrompt = sanitizePromptText(rawPrompt, 600);
  return { cleanPrompt };
}

function formatGeminiSuccessResponse(data, startTime, headers) {
  const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!candidateText || typeof candidateText !== 'string') {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({
        success: false,
        fallback: true,
        message: 'Empty response from model. Using offline expert protocol.'
      })
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      text: candidateText.trim().slice(0, 4000),
      model: 'gemini-2.0-flash',
      latencyMs: Date.now() - startTime
    })
  };
}

function handleGeminiFetchError(err, headers) {
  const isTimeout = err.name === 'AbortError';
  return {
    statusCode: isTimeout ? 504 : 500,
    headers,
    body: JSON.stringify({
      success: false,
      fallback: true,
      message: isTimeout
        ? 'Upstream inference timed out (7s). Using offline expert protocol.'
        : 'Inference request failed. Using offline expert protocol.'
    })
  };
}

async function callGeminiApi(cleanPrompt, apiKey, headers) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);
  const startTime = Date.now();

  try {
    const apiUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${AURA_SYSTEM_INSTRUCTION}\n\nUser Question: ${cleanPrompt}` }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800
        }
      })
    });

    if (!response.ok) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          success: false,
          fallback: true,
          message: 'Upstream Gemini API returned an error. Using offline expert protocol.'
        })
      };
    }

    const data = await response.json();
    return formatGeminiSuccessResponse(data, startTime, headers);
  } catch (err) {
    return handleGeminiFetchError(err, headers);
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function handler(event) {
  const allowedOrigin = getCorsOrigin(event.headers);

  // Security and CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const preconditions = validatePreconditions(event, headers);
  if (preconditions.statusCode) {
    return preconditions;
  }

  const { errorResponse, cleanPrompt } = parseAndSanitizePrompt(event.body, headers);
  if (errorResponse) {
    return errorResponse;
  }

  return callGeminiApi(cleanPrompt, preconditions.apiKey, headers);
}
