import { handleNewsRequest } from '../apiHandler.js';

export default async function handler(req, res) {
  // Set CORS headers for cross-origin requests (e.g. from GitHub Pages)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  // Handle CORS preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
    return;
  }

  const query = req.query.query || '';
  const category = req.query.category || 'All';

  try {
    const data = await handleNewsRequest(query, category);
    res.status(200).json(data);
  } catch (err) {
    console.error(`[Vercel Serverless Function Error] Query: "${query}", Category: "${category}":`, err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
}
