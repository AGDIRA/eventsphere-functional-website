# EventSphere — Premium Event Operations Platform

EventSphere is a high-performance, glassmorphic SaaS landing page and interactive event operations web application designed for high-stakes corporate summits, VIP galas, and tech conferences.

## 🚀 Features Built-In

1. **Sticky Navigation Bar**: Blur-on-scroll glass navbar, EventSphere SVG orbit logo, mobile drawer.
2. **Hero Section**: Headline, subheadline, 2 CTAs, floating glassmorphic dashboard illustration, background particle canvas.
3. **Feature Modules Grid**: 5 glassmorphic feature cards with interactive modal previews (VIP Pass Generator, Guest Registry, Event Cost Estimator, Schedule Planner, Invitation Sender).
4. **Platform Workflow Timeline**: 5 connected horizontal steps with animated progress lines.
5. **Dashboard Preview Section**: Interactive app preview with Chart.js analytics graphs (Line chart for check-in velocity, Doughnut chart for ticket sales distribution), active metrics, and 24h/7d/30d timeframe toggles.
6. **Statistics Section**: 4 KPI counter cards with scroll-triggered counting animations (250+ Guests, 18 Events, 500+ Invitations, $85K Estimated Revenue).
7. **Why EventSphere Section**: 4 key advantage cards (Lightning Fast, Responsive, Secure, GitHub Pages Ready).
8. **CTA Banner**: High-impact gradient callout banner.
9. **Invitation Sender Section**: EmailJS invitation form with field validation, live response feedback toasts, real-time ticket preview, and credentials fallback demo mode.
10. **Footer**: Rich footer with site map, tech badges, social links, and live UTC clock.

---

## 🛠 Tech Stack

- **HTML5**: Semantic layout
- **Tailwind CSS v3 (CDN)**: Utility-first styling with custom theme extension
- **Vanilla JavaScript (ES6+)**: Interactive UI, modals, tab switching, counter animations, particle matrix
- **Chart.js v4 (CDN)**: Dashboard preview graphs (Line & Doughnut charts)
- **EmailJS SDK v3 (CDN)**: Invitation sender form with live demo mode fallback
- **Google Fonts**: Syne (headings) + Plus Jakarta Sans (body text)
- **Lucide Icons (CDN)**: Crisp, modern outline icons

---

## 💻 Local Testing & Running

1. Open `index.html` directly in any web browser, or launch a simple static HTTP server:
```bash
npx serve .
```
2. Navigate to `http://localhost:3000` in your web browser.

---

## 🌐 GitHub Pages Deployment

1. Initialize git and push to your GitHub repository:
```bash
git init
git add .
git commit -m "Initial EventSphere release"
git branch -M main
git remote add origin https://github.com/<your-username>/eventsphere.git
git push -u origin main
```
2. Go to **Settings > Pages** in your GitHub repository.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch` and choose `main` / `/ (root)`.
4. Click **Save**. Your site will be live at `https://<your-username>.github.io/eventsphere/`!
