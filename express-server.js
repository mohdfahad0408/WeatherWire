import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleNewsRequest } from './apiHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for development configurations if requested from other ports, 
// though we use same-origin proxy in our default configuration.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// JSON API Endpoint for News
app.get('/api/news', async (req, res) => {
  const query = req.query.query || '';
  const country = req.query.country || '';
  const category = req.query.category || 'All';

  try {
    const data = await handleNewsRequest(query, country, category);
    res.json(data);
  } catch (err) {
    console.error(`[API Proxy Error] Fetch failed for query "${query}", country "${country}", category "${category}":`, err.message);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Serve client-side static assets
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback all other GET requests to index.html (SPA Router support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Production Server] WeatherWire is listening at http://localhost:${PORT}`);
});
