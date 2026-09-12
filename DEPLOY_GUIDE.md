# 🚀 How to Deploy & Share Your Birthday Webapp

This website is configured to deploy with **zero 404 errors** to **GitHub Pages**, **Vercel**, or **Netlify**.

---

### Option 1: Deploy on GitHub Pages (Recommended if you already pushed to Git)

Because we added `.github/workflows/deploy.yml`, GitHub can build and deploy automatically!

1. Open your repository on **GitHub**.
2. Go to **Settings** (tab at the top).
3. On the left sidebar, click **Pages** (under "Code and automation").
4. Under **Build and deployment** → **Source**, click the dropdown and choose:
   👉 **GitHub Actions** (Do NOT choose "Deploy from a branch").
5. That's it! GitHub Actions will automatically run the build.
6. Click the **Actions** tab on your GitHub repository to watch the deployment complete (takes ~1 minute).
7. Once finished, your live website link will be displayed right under **Settings → Pages** (e.g. `https://yourusername.github.io/your-repo-name/`)!
8. Copy that link and share it with everyone! 💌

---

### Option 2: Deploy on Vercel (Fastest & 1-Click Free Hosting)

If you prefer an instant link with zero setup:

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** → **Project**.
3. Select your GitHub repository and click **Import**.
4. Vercel automatically detects `Vite` and `dist` from `vercel.json`.
5. Click **Deploy**.
6. In 30 seconds, you'll get a live URL (e.g., `https://sailu-birthday.vercel.app`) that you can share with Sailu and all your friends!

---

### Option 3: Deploy on Netlify

1. Go to [netlify.com](https://netlify.com) and sign in.
2. Click **Add new site** → **Import an existing project** from GitHub.
3. Select your repository.
4. Settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy**. Netlify will use `_redirects` to handle all page routes smoothly!
