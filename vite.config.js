import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { handleNewsRequest } from './apiHandler.js';

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      name: 'api-news-proxy',
      configureServer(server) {
        server.middlewares.use('/api/news', async (req, res) => {
          try {
            // req.url contains only the query string relative to the middleware mount point
            // e.g. "?query=San%20Francisco&category=All"
            const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
            const query = url.searchParams.get('query') || '';
            const country = url.searchParams.get('country') || '';
            const category = url.searchParams.get('category') || 'All';

            const data = await handleNewsRequest(query, country, category);

            res.writeHead(200, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            });
            res.end(JSON.stringify(data));
          } catch (err) {
            console.error(`[Dev API Middleware Error] failed for req: "${req.url}":`, err.message);
            res.writeHead(err.status || 500, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      }
    }
  ],
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});
