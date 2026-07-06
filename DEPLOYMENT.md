# Deployment Guide for WeatherWire

This guide describes how to deploy the WeatherWire application (Vite static frontend + Vercel Serverless Function backend) to production.

---

## 🔐 Required Environment Variables

To run the news functionality, you must configure the following secret on your hosting provider (Vercel):

* **`NEWS_API_KEY`**: Your GNews.io API key (e.g. `cec41ff4a1d38cfead988b5242f55062`).

---

## 🚀 Option A: Deploy Entire App on Vercel (Recommended)

This is the easiest, most reliable, and secure method. Vercel hosts both the static frontend assets and runs the API backend proxy (`api/news.js`) on the same domain, preventing CORS errors.

### Step-by-Step Instructions

1. **Push your code** to a GitHub repository.
2. Log in to [Vercel](https://vercel.com) and click **Add New** > **Project**.
3. Import your GitHub repository.
4. Vercel will automatically detect the Vite configuration. Keep the default settings:
   * **Framework Preset**: `Vite` (or `Other`)
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Open the **Environment Variables** section and add:
   * **Key**: `NEWS_API_KEY`
   * **Value**: `[Your GNews API Key]`
6. Click **Deploy**. Once completed, Vercel will provide a URL (e.g. `https://weatherwire.vercel.app`).
7. Open the page and verify news and weather load immediately!

---

## 🌐 Option B: Deploy Frontend on GitHub Pages & Backend on Vercel

If you want to keep the frontend hosted on GitHub Pages, you can deploy the backend proxy separately on Vercel and point your GitHub Pages build to it.

### Step 1: Deploy Backend Proxy on Vercel
1. Follow the **Option A** steps above to deploy the project to Vercel. Vercel will deploy the backend serverless functions at:
   `https://[your-vercel-app-name].vercel.app/api/news`
2. Keep this URL handy.

### Step 2: Configure and Deploy Frontend to GitHub Pages
1. Open your repository's settings on GitHub.
2. In the local terminal or inside a GitHub Actions workflow, configure the environment variable `VITE_API_URL` to point to your Vercel proxy.
3. **Local build & manual deploy**:
   ```bash
   # Build the project with the custom API URL pointed to Vercel
   VITE_API_URL=https://[your-vercel-app-name].vercel.app/api/news npm run build
   
   # Deploy the built "dist" directory to GitHub Pages (e.g. using gh-pages CLI)
   npx gh-pages -d dist
   ```
4. **Automated deployment (GitHub Actions Workflow)**:
   If you use a workflow file (e.g., `.github/workflows/deploy.yml`), add the environment variable to your build step:
   ```yaml
   - name: Build
     run: npm run build
     env:
       VITE_API_URL: https://[your-vercel-app-name].vercel.app/api/news
   ```

Now, the frontend hosted on GitHub Pages will call the Vercel Serverless Function to fetch news. The serverless function handles GNews calls securely using the server-side API key and returns responses with correct CORS headers.
