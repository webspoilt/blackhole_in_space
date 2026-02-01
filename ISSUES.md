# 🐛 Open Issues & Contributions Welcome

This document lists issues and enhancements for contributors. Pick one and submit a PR!

---

## 🔴 High Priority (Bugs)

### Issue #1: Icon Sizes Need Actual Resizing
**Labels:** `bug`, `good first issue`  
**Difficulty:** Easy

The PWA icons in `homepage/public/` are all copies of the same file. They need to be properly resized to their specified dimensions (32x32, 96x96, 180x180, 192x192, 512x512).

**Files:** `homepage/public/vault-icon-*.png`

---

### Issue #2: Dev Script Uses Unix Pipe (`tee`) on Windows
**Labels:** `bug`, `windows`  
**Difficulty:** Easy

The `dev` script in `homepage/package.json` uses `tee` which doesn't work on Windows.

```json
"dev": "next dev -p 3000 2>&1 | tee dev.log"
```

**Fix:** Remove the pipe or use cross-platform logging.

---

### Issue #3: Start Script Uses Bun - Should Support Node.js
**Labels:** `bug`, `compatibility`  
**Difficulty:** Easy

The `start` script requires Bun runtime which not everyone has installed.

```json
"start": "NODE_ENV=production bun .next/standalone/server.js"
```

**Fix:** Provide Node.js alternative or document Bun requirement.

---

## 🟡 Medium Priority (Enhancements)

### Issue #4: Create Helm Chart Templates
**Labels:** `enhancement`, `kubernetes`, `help wanted`  
**Difficulty:** Medium

The `/helm` directory has `Chart.yaml` and `values.yaml` but is missing the actual templates:
- `templates/deployment.yaml`
- `templates/service.yaml`
- `templates/configmap.yaml`
- `templates/ingress.yaml`

---

### Issue #5: Implement SAML/LDAP Authentication Backend
**Labels:** `enhancement`, `security`, `backend`  
**Difficulty:** Hard

The deployment guide mentions SAML 2.0 and LDAP integration, but the Go backend doesn't have this implemented yet.

**Files:** `backend/server/`

---

### Issue #6: Add Service Worker for Offline PWA
**Labels:** `enhancement`, `pwa`  
**Difficulty:** Medium

The `manifest.json` is configured but there's no service worker for offline functionality.

**Needed:**
- `homepage/public/service-worker.js`
- Cache strategy for static assets
- Offline fallback page

---

### Issue #7: Mobile App Icon Sizes for iOS/Android
**Labels:** `enhancement`, `mobile`  
**Difficulty:** Easy

Generate proper icon sizes for mobile apps:
- **iOS:** 20, 29, 40, 60, 76, 83.5, 1024 (all @1x, @2x, @3x)
- **Android:** mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi

**Files:** `mobile/ios/Assets/`, `mobile/android/app/src/main/res/`

---

### Issue #8: Convert PNG Logo to SVG
**Labels:** `enhancement`, `design`  
**Difficulty:** Easy

Create an SVG version of the VAULT logo for better scalability and smaller file size.

**Files:** `branding/vault-logo.svg`

---

### Issue #9: Add Docker Compose for Local Development
**Labels:** `enhancement`, `docker`  
**Difficulty:** Medium

Create a `docker-compose.dev.yml` for easy local development with:
- PostgreSQL
- Redis
- Backend services
- Hot reload for frontend

---

### Issue #10: Implement E2E Tests with Playwright
**Labels:** `enhancement`, `testing`  
**Difficulty:** Medium

Add end-to-end tests for critical user flows:
- Homepage navigation
- Download page functionality
- Contact form submission

---

## 🟢 Low Priority (Nice to Have)

### Issue #11: Dark/Light Mode Toggle
**Labels:** `enhancement`, `ui`  
**Difficulty:** Easy

Add theme toggle button in Navbar for light mode support.

---

### Issue #12: Add Changelog Generation
**Labels:** `enhancement`, `docs`  
**Difficulty:** Easy

Set up automatic changelog generation from commit messages.

---

### Issue #13: Add GitHub Actions CI/CD
**Labels:** `enhancement`, `devops`  
**Difficulty:** Medium

Create `.github/workflows/` for:
- Build and test on PR
- Deploy to Vercel on merge to main
- Container image builds

---

### Issue #14: Internationalization (i18n)
**Labels:** `enhancement`, `i18n`  
**Difficulty:** Hard

Add multi-language support using `next-intl` (already installed).

---

### Issue #15: Accessibility Audit
**Labels:** `enhancement`, `a11y`  
**Difficulty:** Medium

Run accessibility audit and fix:
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast

---

## 🏷️ Label Definitions

| Label | Description |
|-------|-------------|
| `bug` | Something isn't working |
| `good first issue` | Good for newcomers |
| `help wanted` | Extra attention is needed |
| `enhancement` | New feature or request |
| `security` | Security-related |
| `backend` | Go/Rust backend code |
| `windows` | Windows compatibility |

---

## 📝 How to Contribute

1. Fork the repository
2. Create a branch: `git checkout -b fix/issue-number`
3. Make your changes
4. Run tests: `npm run lint`
5. Submit a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.
