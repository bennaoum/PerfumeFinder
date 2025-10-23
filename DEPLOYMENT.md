# GitHub Pages Deployment Guide

This guide will help you deploy your Perfume Finder website to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your computer
- Your project files ready

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top right corner
3. Select **New repository**
4. Name your repository (e.g., `windsurf-project-2` or `perfume-finder`)
5. Choose **Public** (required for free GitHub Pages)
6. **Do NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **Create repository**

## Step 2: Initialize Git and Push to GitHub

Open your terminal/command prompt in the project directory and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Perfume Finder application"

# Add your GitHub repository as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Important:** Replace `YOUR_USERNAME` with your GitHub username and `REPO_NAME` with your repository name.

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar under "Code and automation")
4. Under **Source**, select **GitHub Actions**
5. Click **Save**

## Step 4: Configure Repository Base Path

If your repository name is **NOT** `windsurf-project-2`, you need to update the base path:

1. Open `frontend/vite.config.js`
2. Find this line:
   ```javascript
   base: process.env.NODE_ENV === 'production' ? '/windsurf-project-2/' : '/',
   ```
3. Replace `/windsurf-project-2/` with `/YOUR_REPO_NAME/`
4. Save the file
5. Commit and push the change:
   ```bash
   git add frontend/vite.config.js
   git commit -m "Update base path for GitHub Pages"
   git push
   ```

## Step 5: Automatic Deployment

The GitHub Actions workflow will automatically:
- Build your React application
- Deploy it to GitHub Pages
- Make it available at: `https://YOUR_USERNAME.github.io/REPO_NAME/`

You can monitor the deployment:
1. Go to your repository on GitHub
2. Click the **Actions** tab
3. You'll see the deployment workflow running
4. Wait for it to complete (usually 1-2 minutes)

## Step 6: Access Your Website

Once deployment is complete, your website will be available at:

```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

For example: `https://johndoe.github.io/perfume-finder/`

## Important Notes

### Backend API Limitations

⚠️ **GitHub Pages only hosts static files (HTML, CSS, JavaScript)**. The Python/Flask backend **will NOT work** on GitHub Pages.

To use the full application with backend features:

**Option 1: Use a Backend Hosting Service**
- Deploy backend to [Render](https://render.com), [Railway](https://railway.app), or [PythonAnywhere](https://www.pythonanywhere.com)
- Update the API endpoint in your frontend code
- See `BACKEND_DEPLOYMENT.md` for instructions

**Option 2: Local Development**
- Keep using the local setup with `start.bat`
- GitHub Pages version will be a demo/portfolio piece

### Custom Domain (Optional)

To use a custom domain:
1. Go to repository **Settings** → **Pages**
2. Under **Custom domain**, enter your domain
3. Configure DNS settings with your domain provider
4. Add a CNAME record pointing to `YOUR_USERNAME.github.io`

## Updating Your Website

Whenever you make changes:

```bash
# Make your changes to the code
# Then commit and push
git add .
git commit -m "Description of your changes"
git push
```

GitHub Actions will automatically rebuild and redeploy your site.

## Troubleshooting

### Deployment Failed
- Check the **Actions** tab for error messages
- Ensure all dependencies are in `package.json`
- Verify the build works locally: `cd frontend && npm run build`

### 404 Page Not Found
- Verify the base path in `vite.config.js` matches your repository name
- Check that GitHub Pages is enabled in repository settings
- Wait a few minutes after deployment completes

### Blank Page
- Check browser console for errors (F12)
- Verify the base path configuration
- Ensure all assets are loading correctly

### API Calls Not Working
- This is expected on GitHub Pages (static hosting only)
- Deploy backend separately or use local development

## Need Help?

- [GitHub Pages Documentation](https://docs.github.com/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions Documentation](https://docs.github.com/actions)

---

**Quick Reference Commands:**

```bash
# Check git status
git status

# View commit history
git log --oneline

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Pull latest changes
git pull origin main
```
