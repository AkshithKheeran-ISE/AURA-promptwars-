import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handler } from '../netlify/functions/gemini.js';

describe('AURA Secure Gemini Serverless Proxy (netlify/functions/gemini.js)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('handles CORS OPTIONS preflight with status 200', async () => {
    const event = {
      httpMethod: 'OPTIONS',
      headers: { origin: 'https://auratheairqualityassistant.vercel.app' }
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(200);
    expect(res.headers['Access-Control-Allow-Origin']).toBe(
      'https://auratheairqualityassistant.vercel.app'
    );
  });

  it('returns null CORS origin when no origin header is provided', async () => {
    const event = { httpMethod: 'OPTIONS' };
    const res = await handler(event);
    expect(res.statusCode).toBe(200);
    expect(res.headers['Access-Control-Allow-Origin']).toBe('null');
  });

  it('rejects non-POST HTTP methods with 405 Method Not Allowed', async () => {
    const event = { httpMethod: 'GET' };
    const res = await handler(event);
    expect(res.statusCode).toBe(405);
    const body = JSON.parse(res.body);
    expect(body.error).toContain('Method not allowed');
  });

  it('returns 503 fallback when server GEMINI_API_KEY is not configured', async () => {
    delete process.env.GEMINI_API_KEY;
    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({ prompt: 'How to build Corsi-Rosenthal box?' })
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(503);
    const body = JSON.parse(res.body);
    expect(body.fallback).toBe(true);
    expect(body.message).toContain('GEMINI_API_KEY is not configured');
  });

  it('rejects payloads exceeding 10KB with 413 Payload Too Large', async () => {
    process.env.GEMINI_API_KEY = 'AIzaSyFakeKeyForTestingPurposesOnly12345678';
    const largePrompt = 'a'.repeat(12000);
    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({ prompt: largePrompt })
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(413);
    const body = JSON.parse(res.body);
    expect(body.error).toContain('Payload exceeds 10KB limit');
  });

  it('rejects malformed non-JSON payloads with 400 Bad Request', async () => {
    process.env.GEMINI_API_KEY = 'AIzaSyFakeKeyForTestingPurposesOnly12345678';
    const event = {
      httpMethod: 'POST',
      body: '{ not valid json'
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.error).toContain('Invalid JSON');
  });

  it('rejects empty prompt payloads with 400 Bad Request', async () => {
    process.env.GEMINI_API_KEY = 'AIzaSyFakeKeyForTestingPurposesOnly12345678';
    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({ prompt: '   ' })
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.error).toContain('Prompt is required');
  });

  it('returns 502 fallback when upstream Gemini API fails', async () => {
    process.env.GEMINI_API_KEY = 'AIzaSyFakeKeyForTestingPurposesOnly12345678';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: { message: 'Internal Server Error' } })
      })
    );

    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({ prompt: 'Diurnal smog schedule' })
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(502);
    const body = JSON.parse(res.body);
    expect(body.fallback).toBe(true);
    expect(body.message).toContain('Upstream Gemini API returned an error');
  });

  it('returns 504 fallback when upstream request times out (AbortError)', async () => {
    process.env.GEMINI_API_KEY = 'AIzaSyFakeKeyForTestingPurposesOnly12345678';
    const abortErr = new Error('The operation was aborted');
    abortErr.name = 'AbortError';

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortErr));

    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({ prompt: 'Ventilation window' })
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(504);
    const body = JSON.parse(res.body);
    expect(body.fallback).toBe(true);
    expect(body.message).toContain('timed out');
  });

  it('successfully returns candidate response when upstream succeeds', async () => {
    process.env.GEMINI_API_KEY = 'AIzaSyFakeKeyForTestingPurposesOnly12345678';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: 'Deploy DIY Corsi-Rosenthal box using 4 MERV-13 filters and box fan.'
                  }
                ]
              }
            }
          ]
        })
      })
    );

    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({ prompt: 'How to build Corsi-Rosenthal box?' })
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.text).toContain('Corsi-Rosenthal');
    expect(body.model).toBe('gemini-2.0-flash');
    expect(typeof body.latencyMs).toBe('number');
  });

  it('reflects trusted origins and restricts untrusted origins in CORS headers', async () => {
    const trustedEvent = {
      httpMethod: 'OPTIONS',
      headers: { origin: 'https://aura-the-urbanairqualityassistant.netlify.app' }
    };
    const trustedRes = await handler(trustedEvent);
    expect(trustedRes.headers['Access-Control-Allow-Origin']).toBe(
      'https://aura-the-urbanairqualityassistant.netlify.app'
    );

    const untrustedEvent = {
      httpMethod: 'OPTIONS',
      headers: { origin: 'https://malicious-phishing-site.example.com' }
    };
    const untrustedRes = await handler(untrustedEvent);
    expect(untrustedRes.headers['Access-Control-Allow-Origin']).toBe('null');
  });

  it('enforces rate limiting and returns 429 when abuse threshold is exceeded', async () => {
    process.env.GEMINI_API_KEY = 'AIzaSyFakeKeyForTestingPurposesOnly12345678';
    const clientIp = '198.51.100.42';

    // Simulate 31 consecutive requests from the same IP
    for (let i = 0; i < 30; i++) {
      await handler({
        httpMethod: 'POST',
        headers: { 'client-ip': clientIp },
        body: JSON.stringify({ prompt: 'test' })
      });
    }

    const rateLimitedRes = await handler({
      httpMethod: 'POST',
      headers: { 'client-ip': clientIp },
      body: JSON.stringify({ prompt: 'test' })
    });

    expect(rateLimitedRes.statusCode).toBe(429);
    const body = JSON.parse(rateLimitedRes.body);
    expect(body.fallback).toBe(true);
    expect(body.message).toContain('Rate limit exceeded');
    expect(rateLimitedRes.headers).toHaveProperty('Retry-After');
  });
});
