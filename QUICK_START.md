# 🚀 Quick Start Guide - Deploy to GitHub Pages

Follow these steps to get your Perfume Finder website live on GitHub Pages in under 10 minutes!

## Step 1: Create GitHub Repository (2 minutes)

1. Go to https://github.com/new
2. Repository name: `perfume-finder` (or any name you like)
3. Make it **Public**
4. **Don't** check any initialization options
5. Click **Create repository**

## Step 2: Push Your Code (3 minutes)

Open PowerShell/Command Prompt in your project folder and run:

```powershell
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Perfume Finder app"

# Add GitHub as remote (REPLACE with your actual URL from GitHub)
git remote add origin https://github.com/YOUR_USERNAME/perfume-finder.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Important:** Replace `YOUR_USERNAME` and `perfume-finder` with your actual GitHub username and repository name!

## Step 3: Update Configuration (1 minute)

If your repository name is **NOT** `windsurf-project-2`, update the base path:

1. Open `frontend/vite.config.js`
2. Change line 6 from:
   ```javascript
   base: process.env.NODE_ENV === 'production' ? '/windsurf-project-2/' : '/',
   ```
   to:
   ```javascript
   base: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '/',
   ```
3. Save the file
4. Commit and push:
   ```powershell
   git add frontend/vite.config.js
   git commit -m "Update base path"
   git push
   ```

## Step 4: Enable GitHub Pages (2 minutes)

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under **Source**, select **GitHub Actions**
5. That's it! GitHub will start deploying automatically

## Step 5: Wait for Deployment (1-2 minutes)

1. Go to the **Actions** tab in your repository
2. You'll see a workflow running called "Deploy to GitHub Pages"
3. Wait for the green checkmark ✅
4. Your site is now live!

## Step 6: Visit Your Website! 🎉

Your website will be available at:

```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

For example:
- Username: `johndoe`
- Repo: `perfume-finder`
- URL: `https://johndoe.github.io/perfume-finder/`

## ⚠️ Important Notes

### Frontend Only on GitHub Pages
GitHub Pages only hosts the **frontend** (the visual part). The backend API features won't work yet.

**To get full functionality:**
- See [BACKEND_DEPLOYMENT.md](BACKEND_DEPLOYMENT.md) for backend hosting options
- Recommended: Use Render.com (free) for the backend

### Making Updates

Whenever you make changes to your code:

```powershell
git add .
git commit -m "Description of changes"
git push
```

GitHub will automatically rebuild and redeploy your site!

## 🆘 Troubleshooting

### "Permission denied" when pushing
- Make sure you're logged into GitHub
- Use a personal access token instead of password
- Or use GitHub Desktop app

### Site shows 404 error
- Wait a few minutes after deployment
- Check that base path matches your repo name
- Verify GitHub Pages is enabled in Settings

### Blank page or errors
- Open browser console (F12) to see errors
- Check that base path is correct in `vite.config.js`
- Make sure deployment completed successfully

### Deployment failed
- Check the Actions tab for error details
- Ensure `package.json` and `package-lock.json` exist in frontend folder
- Try running `npm install` and `npm run build` locally first

## 📚 Next Steps

1. ✅ **Customize**: Update colors, add your own perfumes
2. ✅ **Backend**: Deploy backend for full functionality
3. ✅ **Domain**: Add a custom domain (optional)
4. ✅ **Share**: Share your website with friends!

## 🎯 Full Feature Setup

For the complete experience with search and recommendations:

1. **Deploy Backend** (see [BACKEND_DEPLOYMENT.md](BACKEND_DEPLOYMENT.md))
   - Recommended: Render.com (free)
   - Takes ~5 minutes

2. **Connect Frontend to Backend**
   - Update API URL in frontend code
   - Redeploy

3. **Enjoy Full Features!**
   - Search by notes
   - Get recommendations
   - Browse entire perfume database

## 💡 Tips

- **Test locally first**: Run `npm run build` in frontend folder to test the build
- **Check Actions tab**: Monitor deployments and see any errors
- **Use branches**: Create feature branches for experiments
- **Read the docs**: See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed info

---

**Need help?** Open an issue on GitHub or check the troubleshooting guides!

**Happy deploying! 🚀**
