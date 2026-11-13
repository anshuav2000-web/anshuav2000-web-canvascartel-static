# Canvas Cartel — Advanced Creative Agency Website

Premium creative/digital marketing agency website. Built with React + Vite + TypeScript + Tailwind CSS + shadcn-ui + Framer Motion.

## Project Overview

This is a fully redesigned, animated, advance-level UI/UX website for Canvas Cartel, a creative design and marketing studio based in Mumbai, India.

### What's New

**Design System**
- Custom design tokens with premium color palette (HSL-based)
- Advanced CSS utilities: glassmorphism, gradient borders, gradient text, animation keyframes
- Custom scrollbar, selection color, font display swap
- Hover effects: `hover-lift`, `hover-scale`, `cursor-spot`
- Scroll reveal animations with cubic-bezier easing

**Animated Experience**
- Hero section with floating gradient orbs, geometric shapes, grid overlay
- Gradient orb animations with multiple layers
- Floating geometric shapes with rotation
- Animated scroll indicator with gradient trail
- Staggered entrance animations on all sections
- Active link indicators with gradient underline
- Scroll-triggered navbar shadow and blur effects
- Gradient button variant with animated hover shadow

**Upgraded Components**

| Component | Upgrades |
|-----------|----------|
| **HeroSection** | Animated background orbs, floating shapes, grid overlay, gradient sparkles, enhanced typography, gradient CTA buttons |
| **Navbar** | Scroll-triggered transparency/blur, active link indicator with gradient underline, logo text label, mobile menu highlights |
| **Footer** | Decorative background, interactive social icons, hover arrows on links, enhanced contact blocks |
| **ServicesPreview** | Gradient card hover, enhanced icon containers, gradient Explore button, background decorations |
| **AboutPreview** | Enhanced values cards, glass effects on badge, floating shapes in visual panel |
| **CTASection** | Gradient border, hover lift effect, gradient CTA button, decorative background elements |
| **Button** | New `gradient` variant with multi-color gradient + hover shadow |

## Available Scripts

```sh
npm run dev          # Start dev server on port 8080
npm run build        # Production build
npm run lint         # Run ESLint
npm run preview      # Preview production build locally
npm run deploy       # Build for deployment
npm run docker:build # Build Docker image
npm run docker:run   # Run Docker container locally
```

## 🐳 Coolify Deployment

### Prerequisites
- Coolify account
- Docker installed (for local testing)
- Domain name (optional but recommended)

### Deploy Steps

1. **Push code to GitHub**
   ```sh
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <YOUR_GIT_REPO>
   git push -u origin main
   ```

2. **In Coolify:**
   - Create a new **Preset** type: **Docker**
   - Connect your GitHub repository
   - Add environment variables:
     ```
     NODE_ENV=production
     ```
   - Set the Dockerfile path: `Dockerfile`
   - Set the build context: `/`

3. **Deploy:**
   - Click "Deploy" in Coolify
   - Wait for the build to complete

4. **Configure Domain:**
   - Add your custom domain in Coolify
   - Configure DNS A record to point to Coolify's load balancer
   - SSL certificate auto-provisioned via Let's Encrypt

### Docker Configuration
The `Dockerfile` includes a multi-stage build:
- **Builder stage**: `node:20-alpine` — installs dependencies and builds the app
- **Production stage**: `nginx:alpine` — serves the built app with optimized nginx config

The `nginx.conf` includes:
- SPA routing (`try_files $uri $uri/ /index.html`)
- Gzip compression for all text-based assets
- Long-term caching for static assets (`Cache-Control: public, immutable`)
- Optimized favicon and sitemap caching

## ⚡ Tech Stack

- **Framework**: React 18 + Vite 5
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3 + shadcn-ui (Radix UI)
- **Animations**: Framer Motion 12
- **State**: React Hook Form + Zod + @hookform/resolvers
- **Backend**: Supabase (Auth, Database, Storage)
- **Automation**: n8n webhooks
- **Icons**: Lucide React
- **Deployment**: Docker + Nginx
- **Environment**: Node 20+
