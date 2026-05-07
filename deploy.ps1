# Maketh Vision - Automated Deploy Script
# This script will push your code to GitHub to trigger the Netlify deploy.

Write-Host "🚀 Starting Maketh Vision Deployment..." -ForegroundColor Cyan

# 1. Ensure we are in the right directory
Set-Location "d:\maketh vision"

# 2. Check if git is initialized
if (!(Test-Path .git)) {
    Write-Host "📦 Initializing Git..."
    git init
    git branch -M main
}

# 3. Add remote if not exists
$remote = git remote get-url origin 2>$null
if (!$remote) {
    Write-Host "🔗 Linking to GitHub (amuthanilavanp-amu/mekathvision)..."
    git remote add origin https://github.com/amuthanilavanp-amu/mekathvision.git
}

# 4. Pull latest changes to avoid conflicts (optional)
# git pull origin main --rebase

# 5. Add and commit all files
Write-Host "💾 Committing changes..."
git add .
git commit -m "Maketh Vision v2.0 - Production Build [Automated]"

# 6. Push to GitHub
Write-Host "☁️ Pushing to GitHub..."
git push -u origin main --force

Write-Host "`n✅ Done! Check your Netlify dashboard at https://app.netlify.com/projects/lambent-druid-d71534/deploys" -ForegroundColor Green
Write-Host "The site will be live at: https://lambent-druid-d71534.netlify.app" -ForegroundColor Cyan
pause
