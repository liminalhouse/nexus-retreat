# Vercel Deployment Guide

This guide explains how to deploy both the frontend and studio to Vercel.

## Project Structure

This is a monorepo with two deployable applications:
- `frontend/` - Next.js application
- `studio/` - Sanity Studio

## Deployment Strategy

Deploy as **two separate Vercel projects** pointing to the same GitHub repository but with different root directories.

---

## Project 1: Frontend

### Vercel Project Settings

When importing the project in Vercel:

- **Root Directory**: `frontend`
- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `npm run build` (or leave as default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (or leave as default)

### Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=f7s2mq2m
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-09-25
NEXT_PUBLIC_SANITY_STUDIO_URL=https://your-studio-url.vercel.app
SANITY_API_READ_TOKEN=<your-read-token>
SITE_PASSWORD=<your-password>
```

**Important:**
- Update `NEXT_PUBLIC_SANITY_STUDIO_URL` with your actual studio URL after deploying the studio
- Keep `SANITY_API_READ_TOKEN` and `SITE_PASSWORD` secure
- These should be added to **Production**, **Preview**, and **Development** environments

---

## Project 2: Studio

### Vercel Project Settings

When importing the project in Vercel:

- **Root Directory**: `studio`
- **Framework Preset**: Other
- **Build Command**: `npm run build` (or leave as default)
- **Output Directory**: `dist`
- **Install Command**: `npm install` (or leave as default)

### Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```env
SANITY_STUDIO_PROJECT_ID=f7s2mq2m
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_PREVIEW_URL=https://your-frontend-url.vercel.app
```

**Optional:**
```env
SANITY_STUDIO_STUDIO_HOST=<your-custom-domain>
```

**Important:**
- Update `SANITY_STUDIO_PREVIEW_URL` with your actual frontend URL after deploying
- These should be added to **Production**, **Preview**, and **Development** environments

---

## Deployment Steps

### Step 1: Deploy Frontend

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your `nexus-retreat` repository
4. Configure with the settings above (Root Directory: `frontend`)
5. Add environment variables
6. Click "Deploy"
7. **Save the deployment URL** - you'll need it for the studio

### Step 2: Deploy Studio

1. Go back to Vercel Dashboard
2. Click "Add New Project" again
3. Import the **same** `nexus-retreat` repository
4. Configure with the settings above (Root Directory: `studio`)
5. Add environment variables (including the frontend URL from Step 1)
6. Click "Deploy"
7. **Save the deployment URL** - you'll need it for the frontend

### Step 3: Update Cross-References

1. **Update Frontend** environment variables:
   - Set `NEXT_PUBLIC_SANITY_STUDIO_URL` to the studio URL from Step 2
   - Redeploy if needed

2. **Update Studio** environment variables:
   - Verify `SANITY_STUDIO_PREVIEW_URL` points to the frontend URL
   - Redeploy if needed

---

## Branch Strategy

- **Production**: `main` branch deploys to production URLs
- **Preview**: All other branches (including `feature/*`) create preview deployments
- Each push to a branch creates a unique preview URL
- Preview deployments won't affect your live site

---

## Testing Preview Deployments

1. Push your feature branch to GitHub
2. Both projects will automatically create preview deployments
3. Check the Vercel dashboard for preview URLs
4. Test both frontend and studio preview URLs
5. Only merge to `main` when ready to go live

---

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify the correct Node.js version (check `package.json` for engines field)

### Studio Can't Connect to Frontend

- Verify `SANITY_STUDIO_PREVIEW_URL` is set correctly
- Check CORS settings in Sanity project settings

### Frontend Can't Load Content

- Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are correct
- Check that `SANITY_API_READ_TOKEN` has read permissions
- Verify the token is not expired

---

## Security Notes

- Never commit `.env.local` or `.env` files to git
- Use Vercel's environment variable encryption
- Rotate API tokens regularly
- Use different tokens for production and preview environments if possible
