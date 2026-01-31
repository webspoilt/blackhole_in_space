# 🚀 Quick Start Guide - Deploy VAULT in 10 Minutes

This guide will get your VAULT secure messaging platform live in **10 minutes or less**.

---

## ⚡ Prerequisites (2 minutes)

You'll need:
1. ✅ GitHub account (free)
2. ✅ Render.com account (free)
3. ✅ Resend.com account (free)
4. ✅ Domain name (optional, ~$10/year)

---

## 📝 Step 1: Get Email API Key (2 minutes)

### Option A: Resend (Recommended)

1. Go to https://resend.com
2. Click "Sign Up" (free, no credit card)
3. Verify your email
4. Click "API Keys" in dashboard
5. Click "Create API Key"
6. Name it "vault-production"
7. Copy the key (starts with `re_`)

**Free Tier**: 3,000 emails/month

### Option B: Brevo

1. Go to https://brevo.com
2. Sign up for free account
3. Go to "SMTP & API"
4. Create API key
5. Copy the key

**Free Tier**: 300 emails/day

**✅ You now have your email API key!**

---

## 🔐 Step 2: Generate Security Secret (1 minute)

### On Mac/Linux:

```bash
openssl rand -base64 32
```

### On Windows (PowerShell):

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Online (if needed):

Go to https://generate-random.org/api-key-generator
- Select "256-bit"
- Copy the key

**✅ Save this secret - you'll need it for deployment!**

---

## 📦 Step 3: Push Code to GitHub (2 minutes)

### If you already have the code locally:

```bash
cd vault-secure-messaging

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial VAULT deployment"

# Create repository on GitHub (via web interface)
# Then link it:
git remote add origin https://github.com/YOUR-USERNAME/vault.git

# Push
git push -u origin main
```

### If starting fresh:

1. Go to https://github.com/new
2. Name it: `vault-secure-messaging`
3. Make it public or private
4. Don't initialize with README
5. Copy the commands shown and run them locally

**✅ Your code is now on GitHub!**

---

## 🌐 Step 4: Deploy on Render (3 minutes)

### 4.1 Connect GitHub

1. Go to https://dashboard.render.com
2. Click "Sign Up" or "Log In"
3. Choose "Sign in with GitHub"
4. Authorize Render

### 4.2 Create Web Service

1. Click "New +" → "Web Service"
2. Click "Connect Repository"
3. Find your `vault-secure-messaging` repo
4. Click "Connect"

### 4.3 Configure Service

Render will detect `render.yaml` automatically!

**Verify these settings**:
- **Name**: `vault-secure-messaging`
- **Runtime**: Node
- **Build Command**: Auto-detected from render.yaml
- **Start Command**: Auto-detected from render.yaml
- **Plan**: Free

### 4.4 Add Environment Variables

Click "Advanced" and add these:

```
RESEND_API_KEY = re_your_actual_api_key_from_step_1
JWT_SECRET = your_generated_secret_from_step_2
```

Optional (customize if needed):
```
EMAIL_FROM = noreply@b2g-vault.com
FRONTEND_URL = https://vault-secure-messaging.onrender.com
```

### 4.5 Deploy!

1. Click "Create Web Service"
2. Wait for build (3-5 minutes)
3. Watch the logs for "🔒 VAULT Relay Server running"

**✅ Your app is now live!**

---

## 🎉 Step 5: Test Your App (1 minute)

1. Copy your Render URL: `https://vault-secure-messaging.onrender.com`
2. Open it in your browser
3. Enter your email
4. Click "Send Magic Link"
5. Check your email
6. Click the magic link
7. You're in! Start messaging! 🎊

---

## 🌍 Step 6: Add Custom Domain (Optional, 2 minutes)

### If you have b2g-vault.com (or any domain):

**In Render Dashboard**:
1. Go to your service
2. Click "Settings"
3. Scroll to "Custom Domain"
4. Click "Add Custom Domain"
5. Enter: `b2g-vault.com`
6. Click "Save"

**In Your Domain Registrar** (GoDaddy, Namecheap, Cloudflare):

Add DNS record:
```
Type: CNAME
Name: @
Value: vault-secure-messaging.onrender.com
TTL: Automatic
```

For www subdomain:
```
Type: CNAME
Name: www
Value: vault-secure-messaging.onrender.com
TTL: Automatic
```

**Wait 5 minutes - 2 hours for DNS to propagate**

**✅ Your app is now at https://b2g-vault.com**

SSL certificate is automatic!

---

## ✅ Verify Everything Works

### Test Checklist:

- [ ] Can load the login page
- [ ] Can enter email and request magic link
- [ ] Receive email with magic link
- [ ] Click link and get authenticated
- [ ] Can see the chat interface
- [ ] Can add a contact
- [ ] Can start a conversation
- [ ] Can send a message
- [ ] Can see typing indicators
- [ ] Can access settings
- [ ] Can export backup

### If Something Doesn't Work:

**Check Render Logs**:
1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab
4. Look for errors

**Common Issues**:

**Email not sending?**
- Check RESEND_API_KEY is correct
- Check you haven't exceeded free tier
- Verify email service is active

**Build failed?**
- Check Node.js version (should be 20+)
- Check all dependencies are in package.json
- Try redeploying

**WebSocket not connecting?**
- Check FRONTEND_URL matches your domain
- Check CORS settings
- Try hard refresh (Ctrl+Shift+R)

---

## 🎯 Post-Deployment Tasks

### 1. Configure Email Domain (Recommended)

For better email deliverability:

1. **In Resend Dashboard**:
   - Go to "Domains"
   - Click "Add Domain"
   - Enter `b2g-vault.com`
   - Follow DNS setup instructions

2. **Add DNS Records**:
   - SPF record
   - DKIM record
   - DMARC record

This prevents emails going to spam!

### 2. Set Up Monitoring

**Free Options**:

**Uptime Robot** (https://uptimerobot.com):
- Monitor: `https://b2g-vault.com/health`
- Interval: 5 minutes
- Get alerts if down

**Render Built-in**:
- Automatic health checks
- Email alerts on failures
- Performance metrics

### 3. Add Analytics (Optional)

**Privacy-Friendly Options**:

**Plausible** (self-hosted):
```html
<!-- Add to client/index.html -->
<script defer data-domain="b2g-vault.com" src="https://plausible.io/js/script.js"></script>
```

**PostHog** (free tier):
- Sign up at https://posthog.com
- Add tracking code
- Respects user privacy

### 4. Regular Backups

Users have client-side encrypted backups, but also:

**Backup Environment Variables**:
```bash
# Save these somewhere safe
RESEND_API_KEY=...
JWT_SECRET=...
```

**Backup GitHub Repository**:
- Already backed up on GitHub!
- Consider private backup too

---

## 📊 Monitoring Your App

### Check These Regularly:

**Render Dashboard**:
- CPU usage
- Memory usage
- Response time
- Error rate

**Resend Dashboard**:
- Emails sent today
- Remaining quota
- Delivery rate

**Health Endpoint**:
```bash
curl https://b2g-vault.com/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": 1234567890,
  "connections": 5,
  "queuedMessages": 2
}
```

---

## 🎓 What You've Deployed

### Features Live on Your Server:

✅ End-to-end encrypted messaging
✅ Magic link authentication
✅ Real-time WebSocket communication
✅ Multi-device support
✅ Contact management
✅ Message expiration
✅ Encrypted backups
✅ Device management
✅ Settings persistence
✅ Beautiful responsive UI

### Security Features Active:

✅ AES-256-GCM encryption
✅ Ed25519 identity keys
✅ X25519 key exchange
✅ Zero server storage
✅ TLS 1.3 encryption
✅ CORS protection
✅ Rate limiting
✅ Security headers

---

## 💰 Cost Breakdown

Your current costs:

| Service | Cost |
|---------|------|
| Render.com Free Tier | $0/month |
| Resend Free Tier | $0/month |
| Domain (optional) | ~$1/month |
| **Total** | **$0-1/month** |

### Free Tier Limits:

**Render**:
- 750 hours/month (always-on with one service)
- Sleeps after 15 min inactivity
- Automatic SSL
- 100GB bandwidth/month

**Resend**:
- 3,000 emails/month
- 100 emails/day
- All features included

### When to Upgrade:

**Upgrade Render ($7/month) if**:
- Want no sleep (instant response)
- Need more than 750 hours
- Need better performance

**Upgrade Resend ($20/month) if**:
- Need 50,000 emails/month
- Need higher daily limit
- Need advanced features

---

## 🚀 Share Your App!

Your secure messaging platform is live!

**Share it**:
- Direct link: https://b2g-vault.com
- QR code (generate at qr-code-generator.com)
- Social media
- Email signature

**Tell friends**:
> "I just deployed my own secure messaging platform with military-grade encryption! Try it at https://b2g-vault.com"

---

## 🎊 Congratulations!

You now have:

✅ Your own secure messaging platform
✅ End-to-end encrypted communications
✅ Zero server storage (privacy-first)
✅ Multi-device support
✅ Professional UI/UX
✅ Free hosting (or ~$1/month)
✅ Automatic SSL
✅ Production-ready infrastructure

**Time taken**: ~10 minutes
**Cost**: $0/month (free tier)
**Security**: Military-grade
**Privacy**: Maximum
**Cool factor**: 💯

---

## 📚 Next Steps

### Learn More:
- Read `README.md` for full documentation
- Read `DEPLOYMENT.md` for advanced deployment
- Read `PROJECT_SUMMARY.md` for technical details

### Enhance Your App:
- Add custom branding
- Implement group messaging
- Add file attachments
- Create mobile apps

### Get Help:
- GitHub Issues: Report bugs
- Email: Support questions
- Community: Join discussions

---

## 🐛 Troubleshooting

### Quick Fixes:

**App won't load?**
```bash
# Check Render status
# Visit: https://status.render.com

# Check your service health
curl https://your-app.onrender.com/health
```

**Emails not sending?**
- Verify API key is correct
- Check Resend dashboard for errors
- Verify you haven't hit daily limit

**Can't log in?**
- Check email spam folder
- Verify magic link hasn't expired (15 min)
- Try requesting new link

**WebSocket errors?**
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Check browser console for errors

---

## 🎯 Success Metrics

After deployment, track:

- **Users**: How many people signed up?
- **Messages**: Total messages sent
- **Uptime**: % time app is available
- **Response Time**: How fast is it?
- **Email Delivery**: % emails delivered

Use Render dashboard + Resend dashboard to monitor.

---

## 🏆 You Did It!

**From zero to deployed secure messaging platform in 10 minutes!**

Now you have:
- Professional-grade infrastructure
- Military-grade security
- $0/month operating costs
- Complete control of your data
- Open-source foundation
- Scalable architecture

**Share your success**:
- Tweet about it: #SelfHosted #Privacy #E2E
- Blog about your experience
- Star the project on GitHub
- Contribute improvements

---

**VAULT - Your Secure Messaging Platform is Live! 🚀🔒**

Made with ❤️ and deployed with ⚡

Need help? Check README.md or open an issue on GitHub.

**Welcome to secure, private communication!**
