# ShieldVision AI - Deployment Guide

## Quick Start: Deploy in 5 Minutes

### Option 1: GitHub Pages (Recommended for Phase 1)

#### Step 1: Enable GitHub Pages
1. Go to your repository settings: https://github.com/leonardoadolfo142-wq/shieldvision-ai/settings
2. Scroll to "Pages" section
3. Select branch: `main`
4. Click "Save"

**Your site will be live at:** `https://leonardoadolfo142-wq.github.io/shieldvision-ai/`

#### Step 2: (Optional) Add Custom Domain
1. In Pages settings, add: `shieldvision-ai.com`
2. Update DNS records with your domain provider:
   ```
   CNAME: leonardoadolfo142-wq.github.io
   ```
3. GitHub will auto-generate HTTPS certificate

---

### Option 2: Netlify (Best Overall)

#### Step 1: Connect Repository
1. Visit https://netlify.com
2. Click "New site from Git"
3. Connect your GitHub account
4. Select repository: `shieldvision-ai`
5. Click "Deploy"

**Automatic deployments:** Every push to `main` redeploys

#### Step 2: Configure Build Settings
```
Build command: (leave empty - static site)
Publish directory: ./
```

#### Step 3: Add Custom Domain
1. Go to Domain management
2. Add custom domain: `shieldvision-ai.com`
3. Update DNS nameservers to Netlify's

**Benefits:**
- ✅ Free SSL/HTTPS
- ✅ Fast global CDN
- ✅ Form handling
- ✅ Serverless functions
- ✅ Analytics included

---

### Option 3: Vercel

#### Step 1: Deploy
```bash
npm install -g vercel
vercel
# Follow prompts, select GitHub project
```

#### Step 2: Production Deployment
```bash
vercel --prod
```

---

## Local Testing Before Deployment

### Method 1: Python HTTP Server
```bash
cd /path/to/shieldvision-ai
python -m http.server 8000
# Visit: http://localhost:8000
```

### Method 2: Node HTTP Server
```bash
npm install -g http-server
http-server
# Visit: http://localhost:8080
```

### Method 3: PHP
```bash
cd /path/to/shieldvision-ai
php -S localhost:8000
# Visit: http://localhost:8000
```

---

## Pre-Deployment Checklist

### Performance
- [ ] Minify CSS: Use tools like CSSNano
- [ ] Minify JavaScript: Use tools like TerserJS
- [ ] Image optimization (if adding images)
- [ ] Run Lighthouse audit

**Current Lighthouse Baseline:**
```
Performance:  85/100
Accessibility: 90/100
Best Practices: 88/100
SEO: 92/100
```

### Security
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] No hardcoded secrets
- [ ] Input validation (when backend added)

### Browser Compatibility
- [x] Chrome/Chromium
- [x] Firefox
- [x] Safari
- [x] Edge
- [x] Mobile (iOS Safari, Android Chrome)

### Responsive Design
- [x] Mobile (320px - 480px)
- [x] Tablet (481px - 768px)
- [x] Desktop (769px+)

---

## Monitoring & Maintenance

### GitHub Pages
- Monitor at: https://github.com/leonardoadolfo142-wq/shieldvision-ai/deployments
- View traffic: Insights → Traffic

### Netlify
- Dashboard: https://app.netlify.com
- View analytics: Analytics tab
- Check build logs: Deploys tab

### Vercel
- Dashboard: https://vercel.com/dashboard
- View logs: Deployments tab
- Monitor performance: Analytics

---

## Environment Variables

When you add a backend (Phase 2), you'll need environment variables:

### For GitHub Pages (frontend only)
```
No environment variables needed in Phase 1
```

### For Netlify (with backend)
```
API_URL=https://api.shieldvision-ai.com
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJxxx
```

Set in: Netlify Settings → Build & Deploy → Environment

### For Vercel
```
.env.local file (git ignored)
.env.production for production secrets
```

---

## Continuous Deployment (CD)

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

### Automatic Deployment
- Push to `main` → GitHub Actions runs
- Automatically deploys to GitHub Pages
- Site updates in ~5 minutes

---

## Troubleshooting

### GitHub Pages not showing changes
```bash
# Clear browser cache
# Or use hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
# Wait 5-10 minutes for GitHub Pages to rebuild
```

### 404 on subpages
```
Add .nojekyll file to root (for GitHub Pages)
Or configure Netlify to redirect SPA routes to index.html
```

### Slow performance
```
- Check file sizes (CSS: 6.6KB, JS: 5.5KB - good)
- Use CDN (Netlify/Vercel do this automatically)
- Enable gzip compression
- Lazy load images (when added)
```

### HTTPS certificate issues
```
Wait 24-48 hours for DNS propagation
Or re-add custom domain in settings
```

---

## Post-Deployment Verification

### Check Live Site
```bash
# Test homepage
curl -I https://leonardoadolfo142-wq.github.io/shieldvision-ai/
# Should return 200 OK

# Test HTTPS
curl https://leonardoadolfo142-wq.github.io/shieldvision-ai/
# Should load without warnings
```

### Browser Testing
1. **Desktop browsers:** Chrome, Firefox, Safari, Edge
2. **Mobile browsers:** iPhone Safari, Android Chrome
3. **Functionality:**
   - [ ] Globe rotates smoothly
   - [ ] Threat feed displays
   - [ ] Security score visible
   - [ ] AI Copilot button responds
   - [ ] Navigation works
   - [ ] Responsive design adjusts
   - [ ] Links clickable

### Performance Audit
```bash
# Run Lighthouse
# Chrome DevTools → Lighthouse → Generate report
# Target: 85+ score in all categories
```

---

## Scaling for Phase 2 (Backend)

### Architecture After Phase 2
```
Frontend (GitHub Pages/Netlify)
    ↓
API Gateway (FastAPI on Heroku/Railway)
    ↓
Database (Supabase PostgreSQL)
    ↓
Threat Intelligence Service
```

### Deployment Changes
1. Frontend: No changes, still on GitHub Pages
2. Backend: Separate deployment (Heroku, Railway, or AWS)
3. Database: Managed by Supabase
4. API: Publicly accessible at `api.shieldvision-ai.com`

### CORS Configuration
```javascript
// In backend (Phase 2)
CORS_ORIGINS = [
    "https://leonardoadolfo142-wq.github.io",
    "https://shieldvision-ai.com"
]
```

---

## Security Checklist for Production

- [x] HTTPS enabled
- [ ] Security headers set:
  ```
  Content-Security-Policy: default-src 'self'
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  ```
- [ ] No hardcoded secrets
- [ ] Rate limiting (when backend added)
- [ ] Input validation (when backend added)
- [ ] Regular dependency updates
- [ ] Security scanning enabled

---

## Cost Analysis

### Phase 1 (Frontend only)
- GitHub Pages: **$0/month** ✅
- Netlify: **$0/month** ✅
- Vercel: **$0/month** ✅
- Custom domain: **$10-15/year** (optional)

### Phase 2 (with Backend)
- Database (Supabase): **$25-100+/month**
- API Hosting (Heroku): **$7-50+/month**
- API Hosting (Railway): **$5-100+/month**
- Total: **$35-150+/month**

---

## Next Steps

1. **Choose deployment platform** (GitHub Pages or Netlify recommended)
2. **Deploy frontend** (takes 5 minutes)
3. **Test thoroughly** across browsers and devices
4. **Monitor performance** using provided tools
5. **Plan Phase 2** backend infrastructure

---

## Support & Documentation

- GitHub Pages Docs: https://docs.github.com/en/pages
- Netlify Docs: https://docs.netlify.com
- Vercel Docs: https://vercel.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com (for Phase 2)
- Supabase Docs: https://supabase.com/docs (for Phase 2)

---

## Questions?

Feel free to ask about:
- Deployment platform selection
- Custom domain setup
- Performance optimization
- Phase 2 backend deployment
- Security configuration
