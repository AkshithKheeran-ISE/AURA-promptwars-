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

export async function handler(event) {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    };
  }

  // Retrieve server-side secret (never exposed to client bundle)
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 20) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({
        success: false,
        fallback: true,
        message: 'Server GEMINI_API_KEY is not configured. Falling back to local deterministic expert system.'
      })
    };
  }

  // Parse and validate request body
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON request payload.' })
    };
  }

  const rawPrompt = body.prompt;
  if (!rawPrompt || typeof rawPrompt !== 'string' || !rawPrompt.trim()) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Prompt is required.' })
    };
  }

  // Sanitize and limit length to prevent payload stuffing
  const cleanPrompt = rawPrompt
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, 600);

  // Set timeout with AbortController (7000ms)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  const startTime = Date.now();

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${AURA_SYSTEM_INSTRUCTION}\n\nUser Question: ${cleanPrompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800
        }
      })
    });

    clearTimeout(timeoutId);

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
        text: candidateText.trim(),
        model: 'gemini-2.0-flash',
        latencyMs: Date.now() - startTime
      })
    };
  } catch (err) {
    clearTimeout(timeoutId);
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
}
