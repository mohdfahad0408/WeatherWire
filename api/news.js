// api/news.js - Vercel Serverless Function
import { handleNewsRequest } from '../apiHandler.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const query = req.query.query || '';
  const country = req.query.country || '';
  const category = req.query.category || 'All';

  try {
    const data = await handleNewsRequest(query, country, category);
    res.status(200).json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
