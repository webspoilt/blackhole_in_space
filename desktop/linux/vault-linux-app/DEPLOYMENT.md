# VAULT Messenger - Deployment Guide

## Server Deployment Options (All FREE)

### Option 1: Render.com (Recommended)

**Free Tier**: 750 hours/month, Auto-sleep after 15 min idle

#### Steps:

1. **Fork Repository**
   ```bash
   # Fork https://github.com/webspoilt/vault to your GitHub
   ```

2. **Create Account**
   - Go to https://render.com
   - Sign up with GitHub (no credit card)

3. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the forked vault repository
   - Root Directory: `web/server`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=8080
   DATABASE_URL=<auto-provided by Render>
   JWT_SECRET=<generate strong random string>
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Copy the URL: `https://your-app.onrender.com`

6. **Update Client Config**
   Edit `config.js`:
   ```javascript
   SERVER: {
     WS_URL: 'wss://your-app.onrender.com/v1/stream',
     API_URL: 'https://your-app.onrender.com/v1'
   }
   ```

---

### Option 2: Railway.app

**Free Tier**: $5 credit/month (enough for 24/7 operation)

#### Steps:

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Deploy**
   ```bash
   cd vault/web/server
   railway init
   railway up
   ```

4. **Get URL**
   ```bash
   railway domain
   ```

5. **Set Environment Variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=your-secret-here
   ```

---

### Option 3: Fly.io

**Free Tier**: 3 VMs, 160GB bandwidth/month

#### Steps:

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Sign Up**
   ```bash
   fly auth signup
   ```

3. **Launch App**
   ```bash
   cd vault/web/server
   fly launch
   ```

4. **Follow Prompts**
   - App name: vault-messenger-<your-name>
   - Region: Choose closest to you
   - PostgreSQL: No (we use SQLite)
   - Redis: No

5. **Deploy**
   ```bash
   fly deploy
   ```

6. **Get URL**
   ```bash
   fly status
   ```

---

### Option 4: Self-Host (VPS)

**Cost**: $5-10/month (DigitalOcean, Linode, Vultr)

#### Requirements:
- Ubuntu 22.04 LTS
- 1GB RAM minimum
- 10GB storage
- Domain name (optional)

#### Steps:

1. **SSH into Server**
   ```bash
   ssh root@your-server-ip
   ```

2. **Install Dependencies**
   ```bash
   # Update system
   apt update && apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt install -y nodejs
   
   # Install PM2
   npm install -g pm2
   
   # Install Nginx
   apt install -y nginx
   ```

3. **Clone Repository**
   ```bash
   cd /opt
   git clone https://github.com/webspoilt/vault.git
   cd vault/web/server
   npm install --production
   ```

4. **Configure Environment**
   ```bash
   nano .env
   ```
   
   Add:
   ```
   NODE_ENV=production
   PORT=8080
   JWT_SECRET=your-random-secret-here
   DATABASE_PATH=/var/lib/vault/database.db
   ```

5. **Start with PM2**
   ```bash
   pm2 start npm --name vault-server -- start
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx**
   ```bash
   nano /etc/nginx/sites-available/vault
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       location /v1/stream {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "Upgrade";
           proxy_set_header Host $host;
       }
   }
   ```
   
   Enable site:
   ```bash
   ln -s /etc/nginx/sites-available/vault /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

7. **Setup SSL (Let's Encrypt)**
   ```bash
   apt install -y certbot python3-certbot-nginx
   certbot --nginx -d your-domain.com
   ```

8. **Configure Firewall**
   ```bash
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw enable
   ```

---

## Email Service Configuration

### Resend (Recommended - FREE)

**Free Tier**: 100 emails/day, 3,000/month

1. Sign up: https://resend.com
2. Get API key from dashboard
3. No domain verification needed for testing
4. For production, verify your domain

Edit `config.js`:
```javascript
EMAIL: {
  PROVIDER: 'resend',
  API_KEY: 're_123abc...',
  FROM: 'noreply@b2g-vault'
}
```

### Alternative: SMTP (Gmail)

1. Enable 2FA on Gmail
2. Generate App Password
3. Edit `config.js`:

```javascript
EMAIL: {
  PROVIDER: 'smtp',
  HOST: 'smtp.gmail.com',
  PORT: 587,
  SECURE: false,
  USER: 'your-email@gmail.com',
  PASS: 'your-app-password',
  FROM: 'your-email@gmail.com'
}
```

---

## Database Setup

### SQLite (Default - Recommended for < 10k users)

No setup required! Database created automatically.

Location: `~/.config/vault-messenger/vault-messenger.db`

### PostgreSQL (For Production Scale)

1. **Create Database**
   ```bash
   sudo -u postgres createdb vault_production
   sudo -u postgres createuser vault_user
   ```

2. **Update Connection**
   ```javascript
   DATABASE: {
     TYPE: 'postgres',
     HOST: 'localhost',
     PORT: 5432,
     NAME: 'vault_production',
     USER: 'vault_user',
     PASSWORD: 'secure-password'
   }
   ```

---

## Monitoring & Logging

### PM2 Monitoring

```bash
# View logs
pm2 logs vault-server

# Monitor resources
pm2 monit

# Restart
pm2 restart vault-server
```

### Application Logs

Location: `~/.config/vault-messenger/logs/`

```bash
# View logs
tail -f ~/.config/vault-messenger/logs/app.log
```

---

## Security Hardening

### 1. Firewall Configuration

```bash
# Allow only SSH, HTTP, HTTPS
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 2. Fail2Ban

```bash
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

### 3. Automatic Updates

```bash
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```

### 4. TLS Configuration

Use Mozilla SSL Configuration Generator:
https://ssl-config.mozilla.org/

### 5. Rate Limiting

Add to Nginx config:
```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /v1/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://localhost:8080;
}
```

---

## Scaling

### Horizontal Scaling

Use load balancer (Nginx, HAProxy) with multiple app instances:

```bash
# Start multiple instances
pm2 start npm --name vault-1 -i 1 -- start -- --port 8081
pm2 start npm --name vault-2 -i 1 -- start -- --port 8082
pm2 start npm --name vault-3 -i 1 -- start -- --port 8083
```

Nginx upstream:
```nginx
upstream vault_cluster {
    least_conn;
    server localhost:8081;
    server localhost:8082;
    server localhost:8083;
}
```

### Database Scaling

- Use PostgreSQL with read replicas
- Implement connection pooling
- Add Redis for caching
- Use CDN for static assets

---

## Backup & Recovery

### Database Backup

```bash
# SQLite
cp ~/.config/vault-messenger/vault-messenger.db /backup/vault-$(date +%Y%m%d).db

# PostgreSQL
pg_dump vault_production > /backup/vault-$(date +%Y%m%d).sql
```

### Automated Backups

```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * cp ~/.config/vault-messenger/vault-messenger.db /backup/vault-$(date +\%Y\%m\%d).db
```

---

## Update Procedure

### Server Update

```bash
cd /opt/vault/web/server
git pull origin main
npm install --production
pm2 restart vault-server
```

### Client Update

1. Download latest release
2. Install over existing version
3. User data is preserved

---

## Support

- **GitHub Issues**: https://github.com/webspoilt/vault/issues
- **Email**: dev@vault-messaging.com
- **Documentation**: https://docs.vault-messaging.com

---

**VAULT Messenger** - Secure, Private, Encrypted

Last Updated: February 2026
