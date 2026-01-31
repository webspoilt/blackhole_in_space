# Deployment Guide for VAULT

This guide covers deploying VAULT to various platforms.

## Table of Contents

1. [Render.com (Recommended)](#rendercom-deployment)
2. [Docker](#docker-deployment)
3. [Kubernetes](#kubernetes-deployment)
4. [Domain Setup](#domain-setup)
5. [SSL/TLS Configuration](#ssltls-configuration)

---

## Render.com Deployment

### Prerequisites

- GitHub account
- Render.com account (free)
- Resend.com API key (free tier: 3,000 emails/month)

### Step-by-Step Guide

#### 1. Get Email Service API Key

**Option A: Resend (Recommended)**

1. Go to https://resend.com
2. Sign up for free account
3. Navigate to API Keys
4. Create new API key
5. Copy the key (starts with `re_`)

**Option B: Brevo**

1. Go to https://brevo.com
2. Sign up for free account
3. Navigate to SMTP & API
4. Create API key
5. Copy the key

#### 2. Prepare Repository

```bash
# Clone or create your repository
git clone https://github.com/yourusername/vault.git
cd vault

# Commit all files
git add .
git commit -m "Initial deployment setup"
git push origin main
```

#### 3. Deploy on Render

1. **Login to Render**
   - Go to https://dashboard.render.com
   - Sign in with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the vault repository

3. **Configure Service**
   - **Name**: `vault-secure-messaging`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: Node
   - **Build Command**: 
     ```bash
     npm install && cd client && npm install && npm run build && cd ../server && npm install
     ```
   - **Start Command**:
     ```bash
     cd server && node server.js
     ```

4. **Set Environment Variables**

   Click "Advanced" and add these environment variables:

   ```
   NODE_ENV=production
   PORT=3000
   FRONTEND_URL=https://b2g-vault.com
   RESEND_API_KEY=<your_resend_api_key>
   EMAIL_FROM=noreply@b2g-vault.com
   EMAIL_SERVICE=resend
   JWT_SECRET=<generate_with_openssl_rand_-base64_32>
   ALLOWED_ORIGINS=https://b2g-vault.com
   MAGIC_LINK_EXPIRY=900000
   MAX_MESSAGE_TTL=86400000
   ```

   To generate JWT_SECRET:
   ```bash
   openssl rand -base64 32
   ```

5. **Configure Plan**
   - Select "Free" plan (750 hours/month)
   - Auto-deploy: Yes

6. **Create Service**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)

#### 4. Verify Deployment

1. Once deployed, you'll get a URL like: `https://vault-secure-messaging.onrender.com`
2. Visit the URL to test your app
3. Try logging in with your email

#### 5. Configure Custom Domain

1. **In Render Dashboard**:
   - Go to your service
   - Click "Settings" → "Custom Domain"
   - Click "Add Custom Domain"
   - Enter: `b2g-vault.com`

2. **Update DNS Records**:

   Go to your domain registrar (e.g., Cloudflare, GoDaddy, Namecheap):

   ```
   Type: CNAME
   Name: @
   Value: vault-secure-messaging.onrender.com
   TTL: Auto or 3600
   ```

   For www subdomain:
   ```
   Type: CNAME
   Name: www
   Value: vault-secure-messaging.onrender.com
   TTL: Auto or 3600
   ```

3. **Wait for DNS Propagation** (5 minutes - 48 hours)

4. **Verify SSL**:
   - Render automatically provisions SSL certificates
   - Visit `https://b2g-vault.com` to verify

---

## Docker Deployment

### Prerequisites

- Docker installed
- Docker Compose installed

### Local Docker Development

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Production Docker Deployment

1. **Build Image**:

```bash
docker build -t vault-app:latest .
```

2. **Run Container**:

```bash
docker run -d \
  --name vault \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e FRONTEND_URL=https://b2g-vault.com \
  -e RESEND_API_KEY=your_key \
  -e EMAIL_FROM=noreply@b2g-vault.com \
  -e EMAIL_SERVICE=resend \
  -e JWT_SECRET=your_secret \
  -e ALLOWED_ORIGINS=https://b2g-vault.com \
  --restart unless-stopped \
  vault-app:latest
```

3. **With Docker Compose**:

```yaml
version: '3.8'

services:
  vault:
    image: vault-app:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - FRONTEND_URL=https://b2g-vault.com
      - RESEND_API_KEY=${RESEND_API_KEY}
      - EMAIL_FROM=noreply@b2g-vault.com
      - EMAIL_SERVICE=resend
      - JWT_SECRET=${JWT_SECRET}
      - ALLOWED_ORIGINS=https://b2g-vault.com
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health')"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Deploy to Docker Host

```bash
# Save image
docker save vault-app:latest | gzip > vault-app.tar.gz

# Transfer to server
scp vault-app.tar.gz user@server:/tmp/

# On server
ssh user@server
docker load < /tmp/vault-app.tar.gz
docker run -d ... (see above)
```

---

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (Minikube, GKE, EKS, AKS)
- kubectl configured

### Deployment Files

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vault-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: vault
  template:
    metadata:
      labels:
        app: vault
    spec:
      containers:
      - name: vault
        image: your-registry/vault-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: RESEND_API_KEY
          valueFrom:
            secretKeyRef:
              name: vault-secrets
              key: resend-api-key
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: vault-secrets
              key: jwt-secret
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: vault-service
spec:
  selector:
    app: vault
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

Create secrets:

```bash
kubectl create secret generic vault-secrets \
  --from-literal=resend-api-key=YOUR_KEY \
  --from-literal=jwt-secret=YOUR_SECRET
```

Deploy:

```bash
kubectl apply -f k8s/deployment.yaml
```

---

## Domain Setup

### Cloudflare (Recommended)

1. **Add Domain to Cloudflare**:
   - Sign up at https://cloudflare.com
   - Add `b2g-vault.com`
   - Update nameservers at registrar

2. **DNS Configuration**:
   ```
   Type: CNAME
   Name: @
   Value: vault-secure-messaging.onrender.com
   Proxy: Yes (orange cloud)
   ```

3. **SSL/TLS Settings**:
   - Go to SSL/TLS → Overview
   - Set to "Full (strict)"

4. **Security Settings**:
   - Enable "Always Use HTTPS"
   - Enable "Automatic HTTPS Rewrites"
   - Set minimum TLS version to 1.2

### Other DNS Providers

Similar steps for GoDaddy, Namecheap, etc.:

1. Add CNAME record
2. Point to Render URL
3. Wait for propagation
4. Verify SSL

---

## SSL/TLS Configuration

### Render (Automatic)

Render automatically provisions Let's Encrypt SSL certificates for:
- Default `.onrender.com` domain
- Custom domains

No manual configuration needed!

### Manual SSL (Nginx Proxy)

If self-hosting with Nginx:

```nginx
server {
    listen 443 ssl http2;
    server_name b2g-vault.com;

    ssl_certificate /etc/letsencrypt/live/b2g-vault.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/b2g-vault.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## Monitoring

### Health Check Endpoint

VAULT provides a health check endpoint:

```
GET /health

Response:
{
  "status": "ok",
  "timestamp": 1234567890,
  "connections": 42,
  "queuedMessages": 5
}
```

### Render Monitoring

Render provides:
- Automatic health checks
- Performance metrics
- Log streaming
- Alert notifications

---

## Troubleshooting

### Common Issues

**1. Email not sending**
- Verify API key is correct
- Check email service quota
- Verify domain in email provider

**2. WebSocket connection fails**
- Check CORS settings
- Verify WebSocket support on host
- Check firewall rules

**3. Build fails**
- Clear npm cache
- Check Node.js version (20+)
- Verify all dependencies in package.json

**4. Database errors**
- IndexedDB is browser-based (no server DB)
- Clear browser data if corrupted
- Check browser compatibility

---

## Scaling

### Horizontal Scaling (Render)

Render Free tier: 1 instance
Upgrade to paid plans for:
- Multiple instances
- Auto-scaling
- Better performance

### Load Balancing

For high traffic, use:
- Cloudflare (free tier includes DDoS protection)
- AWS CloudFront
- Render's built-in load balancing (paid)

---

## Backup & Recovery

### Data Backup

VAULT stores data client-side:
- Users can export encrypted backups
- No server-side data to backup
- Configuration backed up in git

### Disaster Recovery

1. Keep `.env` file secure backup
2. Document DNS settings
3. Keep deployment credentials safe
4. Maintain git repository

---

## Cost Breakdown (Free Tier)

| Service | Free Tier | Cost if Exceeding |
|---------|-----------|-------------------|
| Render | 750 hours/month | $7/month for 730h |
| Resend | 3,000 emails/month | $20/month for 50k |
| Cloudflare | Unlimited | $0 (always free) |
| Domain | N/A | $10-15/year |

**Total monthly cost (free tier): $0**
**Total with domain: ~$1/month**

---

## Support

- GitHub Issues: https://github.com/yourusername/vault/issues
- Documentation: https://docs.b2g-vault.com
- Email: support@b2g-vault.com

---

**Happy Deploying! 🚀**
