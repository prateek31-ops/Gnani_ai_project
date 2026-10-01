# 🚀 Deployment Guide: Audio Notes Platform

This guide walks you through exactly how to deploy your application to the internet for free using **Render** (for the backend) and **Vercel** (for the frontend). 

Since your codebase is already pushed to GitHub and completely prepared for production, you do not need to write any code. Just follow these clicks!

---

## Part 1: Deploy the Backend on Render
*We deploy the backend first so we can get its live URL to give to the frontend.*

1. Go to [Render.com](https://render.com) and log in with your GitHub account.
2. Click the **"New +"** button at the top right and select **"Web Service"**.
3. Choose **"Build and deploy from a Git repository"** and click Next.
4. Connect the repository: `prateek31-ops/Gnani_ai_project`.
5. Fill out the configuration exactly like this:
   * **Name:** `audio-notes-backend` (or whatever you prefer)
   * **Root Directory:** `backend`
   * **Environment:** `Python 3`
   * **Build Command:** `pip install -r requirements.txt`
   * **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Scroll down to **Environment Variables** and click "Add Environment Variable". Add these three variables:
   * **Key:** `GNANI_API_KEY` | **Value:** `your-gnani-api-key-here`
   * **Key:** `GROQ_API_KEY` | **Value:** `your-groq-api-key-here`
   * **Key:** `MOCK_SERVICES` | **Value:** `false`
7. Scroll to the bottom and click **Create Web Service**.
8. Render will now build your server (this takes about 2-3 minutes). Once it says "Live", copy the URL at the top of the page (e.g., `https://audio-notes-backend.onrender.com`). You will need this for the frontend!

---

## Part 2: Deploy the Frontend on Vercel
*Now we deploy the frontend and tell it to talk to the Render backend.*

1. Go to [Vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** in the top right and select **"Project"**.
3. Find your `prateek31-ops/Gnani_ai_project` repository in the list and click **Import**.
4. **CRITICAL STEP:** In the "Root Directory" section, click **Edit** and select the `frontend` folder. Click Save.
5. Open the **Environment Variables** section and add one variable:
   * **Name:** `NEXT_PUBLIC_API_URL`
   * **Value:** `https://audio-notes-backend.onrender.com/api` *(Paste the exact URL you copied from Render, and **make sure to add `/api` at the very end of it!**)*
6. Click **Deploy**.
7. Vercel will now build your website (this takes about 1-2 minutes).

🎉 **You're Done!** 
Click on the Vercel link it provides you. Your application is now live on the internet, securely processing audio via your production Python backend!
