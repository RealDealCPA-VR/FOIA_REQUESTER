# Deployment Guide - FOIA AI Automation

Complete guide for deploying your FOIA AI Automation application to production.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest and fastest way to deploy Next.js applications.

#### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Neon database (free tier available)
- OpenAI API key

#### Step-by-Step Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: FOIA AI Automation"
   git branch -M main
   git remote add origin https://github.com/yourusername/foia-ai-automation.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   
   In Vercel project settings, add these environment variables:
   
   ```env
   DATABASE_URL=postgresql://user:password@host.neon.tech/foia_automation?sslmode=require
   OPENAI_API_KEY=sk-proj-your-key-here
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   FOIA_API_SECRET=your-secure-random-token-here
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live! 🎉

5. **Set Up Database**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Link to your project
   vercel link
   
   # Pull environment variables
   vercel env pull
   
   # Push database schema
   npm run db:push
   ```

#### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. SSL certificate is automatically provisioned

### Option 2: Railway

Railway offers simple deployment with built-in PostgreSQL.

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway automatically creates `DATABASE_URL`

4. **Add Environment Variables**
   ```env
   OPENAI_API_KEY=sk-proj-your-key-here
   NEXT_PUBLIC_APP_URL=https://your-app.railway.app
   FOIA_API_SECRET=your-secure-token
   ```

5. **Deploy**
   - Railway automatically builds and deploys
   - Get your public URL from the deployment

### Option 3: Self-Hosted (VPS/Cloud)

For full control, deploy to your own server.

#### Requirements
- Ubuntu 22.04 LTS (or similar)
- Node.js 18+
- PostgreSQL 14+
- Nginx (for reverse proxy)
- SSL certificate (Let's Encrypt)

#### Installation Steps

1. **Set Up Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PostgreSQL
   sudo apt install -y postgresql postgresql-contrib
   
   # Install Nginx
   sudo apt install -y nginx
   
   # Install PM2 (process manager)
   sudo npm install -g pm2
   ```

2. **Set Up Database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE foia_automation;
   CREATE USER foia_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE foia_automation TO foia_user;
   \q
   ```

3. **Clone and Build**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/foia-ai-automation.git
   cd foia-ai-automation
   npm install
   
   # Create .env file
   nano .env
   # Add your environment variables
   
   # Build application
   npm run build
   
   # Push database schema
   npm run db:push
   ```

4. **Configure PM2**
   ```bash
   # Start application
   pm2 start npm --name "foia-app" -- start
   
   # Save PM2 configuration
   pm2 save
   
   # Set up PM2 to start on boot
   pm2 startup
   ```

5. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/foia-app
   ```
   
   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/foia-app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Set Up SSL with Let's Encrypt**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## 🔒 Security Checklist

### Before Going Live

- [ ] Change all default passwords
- [ ] Use strong, unique API secret tokens
- [ ] Enable HTTPS/SSL
- [ ] Set up environment variables securely
- [ ] Configure CORS if needed
- [ ] Set up rate limiting
- [ ] Enable database backups
- [ ] Configure monitoring and alerts
- [ ] Review and test all API endpoints
- [ ] Set up error logging (Sentry, LogRocket, etc.)

### Environment Variables Security

**Never commit these to Git:**
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `FOIA_API_SECRET`

**Use environment variable management:**
- Vercel: Built-in environment variables
- Railway: Built-in secrets management
- Self-hosted: Use `.env` files with proper permissions

```bash
# Set proper permissions on .env file
chmod 600 .env
```

## 📊 Database Setup

### Neon (Recommended for Vercel)

1. **Create Neon Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up for free

2. **Create Project**
   - Click "New Project"
   - Choose region closest to your users
   - Copy connection string

3. **Configure Connection**
   - Add to environment variables
   - Include `?sslmode=require` in connection string

4. **Push Schema**
   ```bash
   npm run db:push
   ```

### Supabase (Alternative)

1. Create project at [supabase.com](https://supabase.com)
2. Get connection string from Settings → Database
3. Use in `DATABASE_URL`

### Self-Hosted PostgreSQL

1. Install PostgreSQL
2. Create database and user
3. Configure connection string
4. Set up regular backups

## 🔄 CI/CD Pipeline

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📈 Monitoring & Analytics

### Recommended Tools

1. **Vercel Analytics** (Built-in)
   - Automatic performance monitoring
   - Real-time analytics
   - No configuration needed

2. **Sentry** (Error Tracking)
   ```bash
   npm install @sentry/nextjs
   ```

3. **PostHog** (Product Analytics)
   ```bash
   npm install posthog-js
   ```

4. **Uptime Monitoring**
   - UptimeRobot (free)
   - Pingdom
   - StatusCake

## 🔧 Performance Optimization

### Before Deployment

1. **Enable Next.js Optimizations**
   - Image optimization (automatic)
   - Font optimization (automatic)
   - Script optimization

2. **Database Optimization**
   - Add indexes to frequently queried fields
   - Enable connection pooling
   - Configure query caching

3. **API Optimization**
   - Implement rate limiting
   - Add response caching
   - Optimize database queries

### Production Configuration

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['your-domain.com'],
  },
  // Enable compression
  compress: true,
  // Production optimizations
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
```

## 🚨 Troubleshooting

### Build Failures

**Error: "Cannot find module"**
- Run `npm install` to ensure all dependencies are installed
- Check `package.json` for missing dependencies

**Error: "Database connection failed"**
- Verify `DATABASE_URL` is set correctly
- Check database is accessible from deployment environment
- Ensure SSL mode is configured if required

### Runtime Errors

**Error: "OPENAI_API_KEY is not set"**
- Add environment variable in deployment platform
- Redeploy after adding variables

**Error: "Database query failed"**
- Run `npm run db:push` to ensure schema is up to date
- Check database connection and credentials

## 📞 Support & Maintenance

### Regular Maintenance Tasks

- [ ] Monitor error logs weekly
- [ ] Review database performance monthly
- [ ] Update dependencies monthly
- [ ] Backup database weekly
- [ ] Review security alerts
- [ ] Monitor API usage and costs

### Scaling Considerations

**When to scale:**
- Response times > 2 seconds
- Database CPU > 80%
- API rate limits being hit
- Storage approaching limits

**How to scale:**
- Upgrade database plan
- Add read replicas
- Implement caching (Redis)
- Use CDN for static assets
- Consider serverless functions for API routes

---

**Your FOIA AI Automation app is ready for production! 🚀**

For questions or issues, refer to the main README.md or create an issue on GitHub.