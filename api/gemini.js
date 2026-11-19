/**
 * @file api/gemini.js
 * Standard Vercel/Node serverless function proxy for Gemini API.
 */

import { handler } from '../netlify/functions/gemini.js';

export default async function (req, res) {
  const event = {
    httpMethod: req.method,
    body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {}),
    headers: req.headers
  };

  const result = await handler(event);
  if (result.headers) {
    for (const [key, val] of Object.entries(result.headers)) {
      res.setHeader(key, val);
    }
  }
  res.status(result.statusCode).json(JSON.parse(result.body));
}
