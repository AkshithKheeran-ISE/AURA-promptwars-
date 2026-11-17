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
  res.status(result.statusCode).json(JSON.parse(result.body));
}
