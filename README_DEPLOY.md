# 🚀 Deployment Guide: Maketh Vision (Static Version)

Since your Next.js build failed on Netlify, this **Static Version** allows you to deploy your site instantly by simply dragging and dropping your files.

## 📁 Files to Include in your ZIP
To deploy successfully, you should create a ZIP file containing **ONLY** these files from your root directory:

1.  `index.html` (The main structure)
2.  `style.css` (The cinematic design)
3.  `app.js` (The Supabase logic I just created)

> [!IMPORTANT]
> **Do NOT include** the `src`, `package.json`, or `next.config.js` in this specific ZIP if you want to use the Netlify "Drop" feature. Including those triggers a build process that might fail again.

## 🛠️ Step-by-Step Deployment

1.  **Select Files:** Highlight `index.html`, `style.css`, and `app.js` in your folder.
2.  **Create ZIP:** Right-click and choose **Compress to ZIP file**.
3.  **Deploy to Netlify:**
    *   Go to [Netlify Drop](https://app.netlify.com/drop).
    *   Drag your new ZIP file into the browser window.
4.  **Done!** Your site will be live instantly at a new URL.

## 🔐 Environment Variables
The `app.js` I created already includes your Supabase keys (URL and Anon Key). Since this is a public client-side app, these keys are intended to be public (Supabase handles security via Row Level Security in the database).

## 🧪 Testing Locally
You can test this version right now by opening `index.html` in your browser. Everything should work:
- Sign In / Sign Up
- Browsing Stories
- Uploading new Stories (Thumbnail + File)
- Searching

---
*Created by Antigravity for Joshua Amuthanilavan*
