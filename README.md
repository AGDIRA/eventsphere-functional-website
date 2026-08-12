# EventSphere — Premium Event Operations Platform

EventSphere is a high-performance, glassmorphic SaaS landing page and interactive event operations web application designed for high-stakes corporate summits, VIP galas, and tech conferences.

## 📄 Application Pages

1. **`index.html`** — Main Landing Page & Analytics Telemetry Dashboard Preview
2. **`vip-pass.html`** — Standalone VIP Pass & Credential Generator Engine
3. **`guest-registry.html`** — Standalone Guest Registry & Live Check-in Console
4. **`cost-estimator.html`** — Standalone Interactive Event Cost Estimator
5. **`invitation.html`** — Standalone Bulk Invitation Dispatch Console & Delivery Telemetry Feed

---

## 🚀 Features Built-In

1. **Sticky Navigation Bar**: Blur-on-scroll glass navbar, EventSphere SVG orbit logo, mobile drawer.
2. **Hero Section**: Headline, subheadline, CTAs, floating glassmorphic dashboard illustration, interactive particle canvas.
3. **Feature Modules Grid**: Glassmorphic feature cards linking directly to dedicated modules (VIP Pass Generator, Guest Registry, Cost Estimator, Schedule Planner, Invitation Dispatcher).
4. **Platform Workflow Timeline**: 5 connected horizontal steps with animated progress lines.
5. **Dashboard Preview Section**: Interactive app preview with Chart.js analytics graphs (Line chart for check-in velocity, Doughnut chart for ticket sales distribution), active metrics, and timeframe toggles.
6. **Statistics Section**: 4 KPI counter cards with scroll-triggered counting animations.
7. **VIP Pass Generator Page (`vip-pass.html`)**: Dynamic credential generator with access level selection, lanyard badge preview, live QR code generation, URL pre-fill support, and print-ready styles.
8. **Guest Registry Page (`guest-registry.html`)**: Attendee management table, real-time search/filter, check-in status toggle, guest add/edit modal, pass generator shortcuts, and CSV/Excel export.
9. **Event Cost Estimator Page (`cost-estimator.html`)**: Budget calculation engine with slider inputs, expense breakdown, and analytics modal.
10. **Bulk Invitation Dispatcher Page (`invitation.html`)**: Client-side automated email dispatch engine with EmailJS live SDK integration, simulated dispatch mode, multi-recipient parser, CSV/TXT file import, live ticket preview, batch pause/resume control, real-time status console feed, and CSV audit log export.
11. **Footer**: Rich footer with site map, tech architecture badges, social links, and live UTC clock.

---

## 🛠 Tech Stack

- **HTML5**: Semantic layout
- **Tailwind CSS v3 (CDN)**: Utility-first styling with custom glassmorphism theme extension
- **Vanilla JavaScript (ES6+)**: Interactive UI, modals, tab switching, counter animations, particle matrix engine
- **Chart.js v4 (CDN)**: Dashboard preview graphs & telemetry charts
- **EmailJS SDK v3 (CDN)**: Bulk invitation dispatch engine with REST API fallback
- **Google Fonts**: Syne (headings) + Plus Jakarta Sans (body text)
- **Lucide Icons (CDN)**: Modern line outline icons

---

## 💻 Local Testing & Running

Open `index.html` directly in any web browser, or launch a simple static HTTP server:
```bash
npx serve .
```
Navigate to `http://localhost:3000` in your web browser.

---

## 🌐 GitHub Pages Deployment

1. Initialize git and push to your GitHub repository:
```bash
git add .
git commit -m "Update EventSphere pages and invitation dispatcher"
git push origin main
```
2. Go to **Settings > Pages** in your GitHub repository.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch` and choose `main` / `/ (root)`.
4. Click **Save**. Your site will be live on GitHub Pages!

