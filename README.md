# SHE Academy Booking System

This project is a full-stack booking and wellness application for SHE Academy.

## 🚀 Instant GitHub Pages Deployment (No Build Needed!)

The project already contains the pre-compiled, production-ready website inside both **`/docs`** and **`/dist`**.

### How to deploy to GitHub Pages in 30 seconds:
1. Upload/Push all files to your GitHub repository (e.g. `main` branch).
2. On GitHub, go to your repository **Settings** -> **Pages** (in the left sidebar).
3. Under **"Build and deployment"**:
   - **Source**: Select **Deploy from a branch**
   - **Branch**: Select **`main`**
   - **Folder**: Select **`/docs`**
4. Click **Save**.
5. Wait ~60 seconds and your website will be live at `https://<username>.github.io/<repository-name>/`!

---

### Alternative: GitHub Actions
If you prefer automated continuous deployment via GitHub Actions:
1. On GitHub, go to **Settings** -> **Pages**.
2. Under **"Build and deployment"** > **Source**, choose **GitHub Actions**.
3. The included workflow (`.github/workflows/static.yml`) will automatically compile the project from `./dist` and deploy your site on every push.

---

### Why did a white page happen before?
- Browsers cannot run raw TypeScript source files (`/src/main.tsx`) directly.
- If GitHub Pages was pointed to the root `/` without building, the browser was receiving uncompiled source code.
- We have pre-compiled the entire site into **`/docs`** and **`/dist`**, and added an automatic fallback in the root `index.html`. Setting GitHub Pages to **`/docs`** will load the site immediately with all styles, images, and features.

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
