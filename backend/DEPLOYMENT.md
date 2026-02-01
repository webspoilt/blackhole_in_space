# Deployment Guide

This guide covers deploying VAULT on various platforms.

## Quick Deploy Options

### 1. Vercel (Recommended for Homepage)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/webspoilt/vault)

**Steps:**
1. Push code to GitHub (already done!)
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Set root directory to `homepage`
5. Click Deploy

### 2. Netlify (Alternative)

```bash
# From homepage directory
cd homepage
npm install
npm run build
# Upload .next/static to Netlify
```

### 3. Docker (Self-Hosted)

```bash
docker-compose up -d
```

Access:
- Web: https://localhost:3000
- API: https://localhost:8080

---

## Building APK (Android)

### Prerequisites
- Node.js 20+
- Android Studio (for SDK)
- Java 17

### Option A: Capacitor (Recommended)

```bash
# From web directory
cd web
npm install
npm install @capacitor/core @capacitor/android

# Initialize Capacitor
npx cap init VAULT com.vault.messaging

# Add Android platform
npx cap add android

# Build web app
npm run build

# Sync to Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Build APK: Build > Build Bundle(s) / APK(s) > Build APK
```

### Option B: PWA (Progressive Web App)

The web app is PWA-ready! Users can install it directly from browser.

---

## iOS Build

### Prerequisites
- macOS with Xcode
- Apple Developer Account ($99/year)

```bash
cd web
npm install @capacitor/ios
npx cap add ios
npx cap sync ios
npx cap open ios
# Build in Xcode
```

---

## Free Hosting Options

| Service | Type | Cost | Best For |
|---------|------|------|----------|
| **Vercel** | Frontend | Free | Next.js homepage |
| **Netlify** | Frontend | Free | Static sites |
| **Railway** | Backend | Free tier | Go server |
| **Render** | Full-stack | Free tier | Docker |
| **Fly.io** | Containers | Free tier | Go server |

---

## Environment Variables

Create `.env.local` in homepage:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_WS_URL=wss://your-ws-domain.com
```

---

## Testing Locally

```bash
# Homepage (Next.js)
cd homepage
npm install
npm run dev
# Open http://localhost:3000

# Web client (Vite)
cd web
npm install
npm run dev
# Open http://localhost:5173
```
