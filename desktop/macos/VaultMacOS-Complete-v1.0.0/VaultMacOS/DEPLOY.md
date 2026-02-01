# VAULT macOS - Deployment Guide

Complete guide for deploying the VAULT macOS application to production.

---

## 📋 Table of Contents

1. [Deployment Options](#deployment-options)
2. [Free Tier Setup](#free-tier-setup)
3. [Backend Deployment](#backend-deployment)
4. [Email Configuration](#email-configuration)
5. [App Distribution](#app-distribution)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Deployment Options

### Option 1: Complete Free Tier Stack (Recommended)

**Total Cost: $0/month**

| Component | Service | Free Tier | Purpose |
|-----------|---------|-----------|---------|
| **Relay Server** | Render.com | 750 hours/month | WebSocket + REST API |
| **Email** | Resend | 3,000 emails/month | Verification emails |
| **Database** | Local SQLite | Unlimited | Encrypted local storage |
| **Distribution** | GitHub Releases | Unlimited | App download hosting |
| **CI/CD** | GitHub Actions | 2,000 min/month | Automated builds |

### Option 2: Low-Cost Production Stack

**Total Cost: ~$7/month**

- Render.com: $7/month (starter plan, always on)
- Resend: Free tier (sufficient for most users)
- All other components same as Option 1

---

## Free Tier Setup

### 1. Resend Email Service

**Steps:**

1. Visit https://resend.com/signup
2. Sign up with your email (no credit card required)
3. Verify your email address
4. Go to Dashboard → Domains
5. Add domain `b2g-vault` (or your domain)
6. Follow DNS configuration instructions
7. Create API Key:
   - Go to Dashboard → API Keys
   - Click "Create API Key"
   - Name: "VAULT Production"
   - Permission: "Sending access"
   - Copy the key (starts with `re_`)
8. Configure sender email:
   - Add `noreply@b2g-vault` in verified senders
   - Or use `noreply@resend.dev` for testing

**Free Tier Limits:**
- ✅ 3,000 emails per month
- ✅ 100 emails per day
- ✅ No credit card required
- ✅ Full API access

**Config in App:**
```xml
<key>ResendAPIKey</key>
<string>re_YOUR_API_KEY_HERE</string>
<key>SenderEmail</key>
<string>noreply@b2g-vault</string>
```

### 2. Render.com Relay Server

**Steps:**

1. Visit https://render.com/register
2. Sign up with GitHub account
3. Create new Web Service:
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repository (vault relay server code)
   - Name: `vault-relay`
   - Environment: Go
   - Build Command: `go build -o server main.go`
   - Start Command: `./server`
4. Configure environment variables:
   ```
   PORT=443
   ALLOWED_ORIGINS=*
   LOG_LEVEL=info
   ```
5. Deploy:
   - Click "Create Web Service"
   - Wait for deployment (~2 minutes)
   - Note the URL: `https://vault-relay.onrender.com`

**Free Tier Limits:**
- ✅ 750 hours per month
- ✅ Auto-sleep after 15 min inactivity
- ✅ 100 GB bandwidth/month
- ✅ WebSocket support

**⚠️ Note:** Free tier services spin down after inactivity. First connection may take 30 seconds to wake up.

**Config in App:**
```xml
<key>RelayServerWebSocket</key>
<string>wss://vault-relay.onrender.com/v1/stream</string>
<key>RelayServerAPI</key>
<string>https://vault-relay.onrender.com/v1</string>
```

---

## Backend Deployment

### Relay Server Setup

The relay server is a lightweight Go application that handles WebSocket connections and message routing without storing any message content.

**Repository Structure:**
```
vault-relay/
├── main.go
├── go.mod
├── handlers/
│   ├── websocket.go
│   └── api.go
├── models/
│   └── message.go
└── README.md
```

**Simple Relay Server (Go):**

Create `main.go`:

```go
package main

import (
    "log"
    "net/http"
    "github.com/gorilla/websocket"
    "github.com/gorilla/mux"
)

var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}

var clients = make(map[*websocket.Conn]string)
var broadcast = make(chan Message)

type Message struct {
    Recipient string `json:"recipient"`
    Payload   []byte `json:"payload"`
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println(err)
        return
    }
    defer conn.Close()

    userId := r.URL.Query().Get("userId")
    clients[conn] = userId

    log.Printf("Client connected: %s", userId)

    for {
        var msg Message
        err := conn.ReadJSON(&msg)
        if err != nil {
            log.Printf("Error: %v", err)
            delete(clients, conn)
            break
        }
        broadcast <- msg
    }
}

func handleMessages() {
    for {
        msg := <-broadcast
        for conn, userId := range clients {
            if userId == msg.Recipient {
                err := conn.WriteJSON(msg)
                if err != nil {
                    log.Printf("Error: %v", err)
                    conn.Close()
                    delete(clients, conn)
                }
            }
        }
    }
}

func main() {
    r := mux.NewRouter()
    r.HandleFunc("/v1/stream", handleWebSocket)
    r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusOK)
        w.Write([]byte("OK"))
    })

    go handleMessages()

    port := ":443"
    log.Printf("Server starting on %s", port)
    log.Fatal(http.ListenAndServe(port, r))
}
```

**Deploy to Render:**

1. Push code to GitHub
2. Connect to Render
3. Auto-deploy enabled
4. Done! URL: https://vault-relay.onrender.com

### Alternative: Deploy to Railway.app (Also Free)

Railway offers similar free tier:
- 500 hours/month
- $5 free credits
- Easy deployment

**Steps:**
1. Visit https://railway.app
2. Sign in with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select vault-relay repository
5. Deploy automatically

---

## Email Configuration

### Resend API Integration

**Testing Email Sending:**

```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "noreply@b2g-vault",
    "to": ["user@example.com"],
    "subject": "Test Email",
    "html": "<h1>Test</h1>"
  }'
```

**Expected Response:**
```json
{
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}
```

### Domain Setup (Optional but Recommended)

For production, set up your own domain:

1. **Purchase Domain** (optional):
   - Namecheap: ~$10/year for `.com`
   - Cloudflare: At-cost pricing (~$8-10/year)

2. **Configure DNS** in Resend:
   - Add TXT, CNAME records provided by Resend
   - Wait for verification (~24 hours max)

3. **Update Config**:
   ```xml
   <key>SenderEmail</key>
   <string>noreply@yourdomain.com</string>
   ```

### Email Templates

Located in `VaultMacOS/Services/EmailService.swift`:

- Verification email
- Password reset (future)
- Device linked notification (future)

Customize HTML templates as needed.

---

## App Distribution

### Method 1: GitHub Releases (Free)

**Setup:**

1. Create GitHub repository
2. Tag releases:
   ```bash
   git tag -a v1.0.0 -m "Release 1.0.0"
   git push origin v1.0.0
   ```

3. Create release on GitHub
4. Upload assets:
   - `VAULT-v1.0.0.dmg` (installer)
   - `VAULT-v1.0.0-Portable.zip` (no install)
   - `Source.zip`
   - `checksums.txt`

**Generate Checksums:**
```bash
shasum -a 256 VAULT-v1.0.0.dmg > checksums.txt
shasum -a 256 VAULT-v1.0.0-Portable.zip >> checksums.txt
```

### Method 2: Direct Download (Your Website)

Host files on:
- GitHub Pages (free)
- Netlify (free tier)
- Vercel (free tier)

**Landing Page Example:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>VAULT - Secure Messaging</title>
</head>
<body>
    <h1>VAULT Messenger</h1>
    <p>Military-grade secure messaging for macOS</p>
    <a href="https://github.com/yourusername/vault/releases/download/v1.0.0/VAULT-v1.0.0.dmg">
        Download for macOS (Universal)
    </a>
    <p>SHA256: abc123...</p>
</body>
</html>
```

### Method 3: Mac App Store (Paid)

**Requirements:**
- Apple Developer Account ($99/year)
- App review (1-2 weeks)
- Compliance with App Store guidelines

**Steps:**
1. Enroll in Apple Developer Program
2. Create App Store Connect listing
3. Submit for review
4. Wait for approval
5. Publish

**Pros:**
- Automatic updates
- Trusted distribution
- Better discovery

**Cons:**
- Annual fee
- Review process
- 30% commission (if selling)

---

## Monitoring & Maintenance

### Relay Server Monitoring

**Render Dashboard:**
- View logs: Dashboard → vault-relay → Logs
- Monitor uptime
- Check bandwidth usage

**Health Check Endpoint:**
```bash
curl https://vault-relay.onrender.com/health
# Should return: OK
```

**Set Up Alerts:**
1. Use UptimeRobot (free):
   - Monitor: https://vault-relay.onrender.com/health
   - Check interval: 5 minutes
   - Alert when down

2. Email notifications on failures

### Email Monitoring

**Resend Dashboard:**
- View sent emails
- Check delivery rates
- Monitor bounces
- Track API usage

**Monthly Limits:**
- Free tier: 3,000 emails/month
- If exceeding, upgrade to paid plan ($20/month for 50k emails)

### App Updates

**GitHub Actions Auto-Build:**

Create `.github/workflows/build.yml`:

```yaml
name: Build macOS App

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build
        run: |
          xcodebuild archive -scheme VaultMacOS -archivePath build/VaultMacOS.xcarchive
      - name: Create DMG
        run: |
          ./Scripts/create-dmg.sh
      - name: Upload Release
        uses: softprops/action-gh-release@v1
        with:
          files: build/*.dmg
```

**Manual Updates:**
1. Increment version in `Info.plist`
2. Build release
3. Create DMG
4. Upload to GitHub releases
5. Update website download links

### Security Updates

**Monthly Tasks:**
- Check for Swift package updates
- Review security advisories
- Update dependencies:
  ```bash
  swift package update
  ```

**Quarterly Tasks:**
- Security audit
- Penetration testing
- Code review

---

## Cost Optimization

### Keeping It Free

**Tips:**
1. Use Render free tier (750 hours = 31 days with sleep)
2. Keep Resend under 3,000 emails/month
3. Use GitHub for everything else
4. Optimize relay server to use minimal resources

**If You Exceed Free Limits:**

**Relay Server:**
- Render Starter: $7/month (always on, no sleep)
- Alternative: Railway ($5 credit/month free)
- Self-host on VPS: DigitalOcean $4/month

**Email:**
- Resend Pro: $20/month (50,000 emails)
- Alternative: Amazon SES ($0.10 per 1000 emails)
- SMTP2GO: Free 1,000/month

### Scaling Considerations

**When to Upgrade:**
- Users > 100: Consider paid relay server
- Emails > 3,000/month: Upgrade Resend
- High traffic: Add CDN (Cloudflare free)

---

## Troubleshooting

### Relay Server Issues

**Problem:** Server not responding
**Solution:**
1. Check Render dashboard for errors
2. View logs for crash messages
3. Restart service from dashboard
4. Check free tier hours not exceeded

**Problem:** WebSocket connections failing
**Solution:**
1. Verify wss:// URL (not ws://)
2. Check firewall settings
3. Test with: `wscat -c wss://vault-relay.onrender.com/v1/stream`

### Email Issues

**Problem:** Emails not sending
**Solution:**
1. Verify API key in Config.plist
2. Check Resend dashboard for errors
3. Verify sender domain
4. Check daily limit (100 emails/day)

**Problem:** Emails in spam
**Solution:**
1. Set up SPF, DKIM records (in Resend dashboard)
2. Use verified domain
3. Avoid spam trigger words
4. Include unsubscribe link

---

## Backup & Recovery

### Database Backup

**Local SQLite Backup:**

Users' databases are stored in:
```
~/Library/Application Support/VAULT/vault.db
```

**Automated Backup Script:**

```swift
func backupDatabase() {
    let fileManager = FileManager.default
    let appSupport = fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
    let dbPath = appSupport.appendingPathComponent("VAULT/vault.db")
    let backupPath = appSupport.appendingPathComponent("VAULT/backups/vault_\(Date().timeIntervalSince1970).db")
    
    try? fileManager.copyItem(at: dbPath, to: backupPath)
}
```

### Configuration Backup

Keep secure copies of:
- `Config.plist` (without API keys in git)
- Resend API keys
- Database encryption keys
- Code signing certificates

---

## Support

### User Support Channels

1. **GitHub Issues**: Bug reports and feature requests
2. **Email**: dev@vault-messaging.com
3. **Documentation**: https://docs.vault-messaging.com
4. **Community**: Discord/Slack channel

### Developer Resources

- API Documentation: https://api.vault-messaging.com
- SDK Reference: https://sdk.vault-messaging.com
- Example Code: GitHub repository

---

## Legal & Compliance

### Privacy Policy

**Required Elements:**
- What data is collected (email, encrypted messages)
- How it's stored (locally encrypted)
- Third parties (Resend for emails)
- User rights (data deletion)
- Contact information

### Terms of Service

**Key Points:**
- Acceptable use policy
- Age requirements (13+ or 18+)
- Liability limitations
- Service availability

### GDPR Compliance (if EU users)

- Right to access data
- Right to deletion
- Data portability
- Cookie consent

---

## Roadmap & Future

### Phase 2 Features (v1.1)

- Group voice/video calls
- File transfer >100MB
- Custom stickers
- Message search improvements

### Scaling Plan

**At 1,000 Users:**
- Upgrade to Render Starter ($7/month)
- Consider CDN for media
- Add caching layer

**At 10,000 Users:**
- Dedicated server ($20-50/month)
- Load balancer
- Database optimization
- Professional monitoring (Datadog, New Relic)

---

## Conclusion

With this setup, you can deploy VAULT macOS completely free:

✅ **Total Cost: $0/month**
- Resend: 3,000 emails/month (free)
- Render: 750 hours/month (free)
- GitHub: Unlimited (free)
- Distribution: GitHub Releases (free)

**Recommended First Steps:**
1. Deploy relay server to Render
2. Configure Resend API
3. Update Config.plist in app
4. Build and test locally
5. Create release and upload to GitHub

**Questions?** Open an issue on GitHub or email dev@vault-messaging.com

---

**VAULT** - Deploy with confidence. Message with privacy.
