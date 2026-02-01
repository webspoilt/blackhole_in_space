# 🔐 VAULT - Secure Messaging Platform

The official homepage for VAULT - a military-grade encrypted messaging platform built for government and enterprise use.

## 🚀 Quick Start

```bash
# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the homepage.

## ✨ Technology Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - Accessible UI components
- **Framer Motion** - Smooth animations
- **Inter Font** - Premium typography

## 🔒 Security Features

- **Zero-Knowledge Encryption** - End-to-end encryption with Signal Protocol
- **Perfect Forward Secrecy** - Each message uses unique keys
- **Zero Server Storage** - Messages relayed, never stored
- **Post-Quantum Ready** - ML-KEM-768 integration
- **Self-Hosted Option** - Deploy on your own infrastructure

## 📁 Structure

```
src/
├── app/           # Next.js App Router pages
│   ├── demo/      # Encryption demo
│   ├── features/  # Feature showcase
│   ├── bounty/    # Bug bounty program
│   ├── download/  # Platform downloads
│   └── security/  # Security articles
├── components/    # React components
│   ├── ui/        # shadcn/ui components
│   └── 3d/        # Three.js components
├── hooks/         # Custom React hooks
│   ├── use3DTilt.ts
│   └── useScrollReveal.ts
└── lib/           # Utilities
```

## 🎨 Design System

- **Colors**: Navy (#0a0f1a), Amber (#fbbf24), Blue (#3b82f6)
- **Font**: Inter via Google Fonts
- **Cards**: Glassmorphism with backdrop blur
- **Animations**: 2D canvas particles, scroll reveals, 3D tilt

## 🔧 Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-api.com
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

Or deploy to Vercel:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/webspoilt/vault-messaging)

---

Created by **zeroday** 🔐
