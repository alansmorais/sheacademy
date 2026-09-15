# SHE Academy Booking System

This project is a full-stack booking application for SHE Academy.

## 🚨 URGENT: FIX FOR "WHITE BLANK PAGE"
If you are seeing a white page after uploading your ZIP or pushing to GitHub, it is because **browsers cannot run source code (.tsx files) directly.**

### How to fix it (Local Build):
1. **Unzip** the file on your computer.
2. Open your terminal and run:
   ```bash
   npm install
   npm run build
   ```
3. Upload **ONLY the contents of the `dist` folder** to your web host.

### How to fix it (GitHub Pages):
1. Go to your GitHub Repository -> **Settings** -> **Pages**.
2. Under "Build and deployment", change the **Source** to **GitHub Actions**.
3. The automatic script I included (`.github/workflows/static.yml`) will now handle everything for you.

## Hosting Options

### 1. GitHub Pages (Static Hosting)
This project is configured to work on GitHub Pages out of the box.
- The `base` path in `vite.config.ts` is set to `./` for compatibility with sub-directory URLs (e.g., `username.github.io/repo-name/`).
- A GitHub Action is included in `.github/workflows/static.yml` to automatically build and deploy the site whenever you push to the `main` branch.
- **Note**: Static hosting does NOT run the `server.ts` backend. However, the app is designed to fall back to direct Google Sheets synchronization from the browser.

### 2. Railway / Render / Heroku (Full-Stack Hosting)
To use the full-stack features (like the domain-masking security headers or advanced Stripe integrations), use a host that supports Node.js.
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: 3000

## Environment Variables
Ensure you set the following environment variables in your hosting provider's dashboard:
- `STRIPE_SECRET_KEY`: Your Stripe secret key.
- `GOOGLE_SCRIPT_URL`: Your Google Apps Script deployment URL.

## Local Development
```bash
npm install
npm run dev
```
