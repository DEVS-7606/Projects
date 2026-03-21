# Deployment Guide

## Overview

```
Frontend + Backend (Vercel) → Database (Supabase)
```

Cost on free tiers: $0/month.

---

## 1. Build

```bash
npm install
npm run build   # Frontend → dist/
```

---

## 2. Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Vercel will auto-detect `vercel.json` and:

- Build your React frontend → served from `dist/`
- Deploy your Express backend → served as a serverless function at `/api`

---

## 3. Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

| Variable                    | Value                              |
| --------------------------- | ---------------------------------- |
| `VITE_API_BASE_URL`         | `/api`                             |
| `SUPABASE_URL`              | `https://your-project.supabase.co` |
| `SUPABASE_ANON_KEY`         | `your_anon_key`                    |
| `SUPABASE_SERVICE_ROLE_KEY` | `your_service_role_key`            |
| `FRONTEND_URL`              | `https://your-app.vercel.app`      |

Then redeploy (Deployments → Redeploy, disable build cache).

Verify:

```bash
curl https://your-app.vercel.app/api/health
# Expected: { "status": "ok", ... }
```

---

## Pre-Deploy Checklist

- [ ] All env vars set in Vercel dashboard
- [ ] `npm run typecheck:all` passes
- [ ] `npm run lint` passes
- [ ] No hardcoded secrets in code
- [ ] `FRONTEND_URL` matches your actual Vercel domain (CORS)
- [ ] Health endpoint responds after deploy
- [ ] Signup flow tested end-to-end

---

## Future Deploys

Vercel auto-deploys on every git push to `main`. No manual steps needed.

---

## Troubleshooting

| Problem                   | Fix                                                                |
| ------------------------- | ------------------------------------------------------------------ |
| CORS errors               | `FRONTEND_URL` in Vercel env must match your Vercel domain exactly |
| 404 on API calls          | Check `VITE_API_BASE_URL` is set to `/api`                         |
| Serverless function error | Check Vercel function logs in the dashboard under Deployments      |
| Vercel shows stale data   | Redeploy with build cache disabled                                 |
