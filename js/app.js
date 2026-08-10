// Core Interactive Application Controller for EventSphere
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 1. Navbar Blur & Scroll Shadows
  const navbar = document.getElementById('main-navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('glass-nav', 'shadow-md', 'py-3');
      navbar?.classList.remove('py-5', 'bg-transparent');
    } else {
      navbar?.classList.remove('glass-nav', 'shadow-md', 'py-3');
      navbar?.classList.add('py-5', 'bg-transparent');
    }
  });

  // Highlight active nav link based on current page URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('header nav a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const isCurrentPage = (currentPath === '' || currentPath === 'index.html') 
      ? (href === 'index.html' || href === '#hero' || href === '#') 
      : href.includes(currentPath);

    if (isCurrentPage) {
      link.classList.add('nav-active');
      link.classList.remove('text-slate-700', 'hover:bg-white');
    } else {
      link.classList.remove('nav-active');
    }
  });

  // Mobile Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('translate-x-full');
    });
  }
  if (closeDrawerBtn && mobileDrawer) {
    closeDrawerBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('translate-x-full');
    });
  }

  // 2. Animated KPI Counter (Section 6)
  const counterElements = document.querySelectorAll('.stat-counter');
  let countersAnimated = false;

  function animateCounters() {
    counterElements.forEach(el => {
      const target = parseFloat(el.getAttribute('data-target'));
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2000;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = `${prefix}${Math.floor(current)}${suffix}`;
      }, stepTime);
    });
  }

  const statsSection = document.getElementById('stats-section');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  }

  // 3. Interactive Feature Card Demos (Section 3 & Modals)
  const modalBackdrop = document.getElementById('demo-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const closeModalBtn = document.getElementById('close-modal-btn');

  window.openFeatureDemo = function(featureKey) {
    if (!modalBackdrop || !modalTitle || !modalBody) return;

    let content = '';
    let title = '';

    switch(featureKey) {
      case 'vip-pass':
        title = '🎟 VIP Pass Generator Engine';
        content = `
          <div class="p-4 bg-slate-900 rounded-2xl text-white space-y-4">
            <div class="flex justify-between items-center pb-3 border-b border-slate-800">
              <span class="text-xs font-mono text-purple-400">TICKET #EVT-2026-889</span>
              <span class="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">PASS VALID</span>
            </div>
            <div class="text-center py-4">
              <h4 class="text-xl font-bold font-syne text-white">Global Tech Summit 2026</h4>
              <p class="text-sm text-slate-400">All-Access Keynote + Executive Lounge</p>
            </div>
            <div class="flex justify-around bg-slate-800/80 p-3 rounded-xl text-center text-xs">
              <div>
                <span class="block text-slate-400">Holder</span>
                <span class="font-bold text-white">Dr. Aris Vance</span>
              </div>
              <div>
                <span class="block text-slate-400">Access Zone</span>
                <span class="font-bold text-purple-300">Stage Alpha</span>
              </div>
              <div>
                <span class="block text-slate-400">NFC Badge</span>
                <span class="font-bold text-teal-300">ACTIVE</span>
              </div>
            </div>
            <button onclick="window.showToast('VIP Pass downloaded to local PDF format!', 'success')" class="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold shadow-lg hover:opacity-90 transition">Download Digital VIP Wallet Pass</button>
          </div>
        `;
        break;
      case 'cost-estimator':
        title = '💰 Instant Event Budget Estimator';
        content = `
          <div class="space-y-4 text-slate-800">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Expected Guests</label>
                <input type="number" id="calc-guests" value="250" oninput="recalculateBudget()" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Catering Tier</label>
                <select id="calc-catering" onchange="recalculateBudget()" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                  <option value="40">Standard ($40/guest)</option>
                  <option value="85" selected>Premium Gourmet ($85/guest)</option>
                  <option value="150">VIP Executive Gala ($150/guest)</option>
                </select>
              </div>
            </div>
            <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-sm">
              <div class="flex justify-between text-slate-600"><span>Venue & AV Setup:</span><span class="font-semibold text-slate-900">$12,500</span></div>
              <div class="flex justify-between text-slate-600"><span>Catering Subtotal:</span><span id="calc-catering-sub" class="font-semibold text-slate-900">$21,250</span></div>
              <div class="flex justify-between text-slate-600"><span>Security & Staffing:</span><span class="font-semibold text-slate-900">$4,800</span></div>
              <hr class="my-2 border-slate-200">
              <div class="flex justify-between text-base font-bold text-blue-600"><span>Estimated Budget:</span><span id="calc-total">$38,550</span></div>
            </div>
          </div>
        `;
        break;
      case 'schedule-planner':
        title = '🎬 Dynamic Schedule Planner';
        content = `
          <div class="space-y-3">
            <div class="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <span class="px-2.5 py-1 text-xs font-bold bg-blue-600 text-white rounded-md">09:00 AM</span>
              <div>
                <h5 class="text-sm font-bold text-slate-900">Opening Keynote: Future of Event Tech</h5>
                <p class="text-xs text-slate-500">Main Auditorium • Keynote Speaker: Sarah Connor</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-xl">
              <span class="px-2.5 py-1 text-xs font-bold bg-purple-600 text-white rounded-md">11:30 AM</span>
              <div>
                <h5 class="text-sm font-bold text-slate-900">VIP Networking & Executive Lunch</h5>
                <p class="text-xs text-slate-500">Roof Garden Terrace • Catered Lounge</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span class="px-2.5 py-1 text-xs font-bold bg-emerald-600 text-white rounded-md">02:30 PM</span>
              <div>
                <h5 class="text-sm font-bold text-slate-900">Interactive Panel: AI Operations</h5>
                <p class="text-xs text-slate-500">Stage B • 4 Speakers</p>
              </div>
            </div>
          </div>
        `;
        break;
      default:
        title = 'EventSphere Feature';
        content = '<p class="text-sm text-slate-600">Module fully active and linked.</p>';
    }

    modalTitle.innerHTML = title;
    modalBody.innerHTML = content;
    modalBackdrop.classList.remove('hidden');
    modalBackdrop.classList.add('flex');
  };

  window.recalculateBudget = function() {
    const guests = parseInt(document.getElementById('calc-guests')?.value || 0);
    const cateringPerGuest = parseInt(document.getElementById('calc-catering')?.value || 0);

    const cateringTotal = guests * cateringPerGuest;
    const venue = 12500;
    const staff = 4800;
    const grandTotal = cateringTotal + venue + staff;

    const subEl = document.getElementById('calc-catering-sub');
    const totalEl = document.getElementById('calc-total');
    if (subEl) subEl.textContent = `$${cateringTotal.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `$${grandTotal.toLocaleString()}`;
  };

  if (closeModalBtn && modalBackdrop) {
    closeModalBtn.addEventListener('click', () => {
      modalBackdrop.classList.add('hidden');
      modalBackdrop.classList.remove('flex');
    });
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.add('hidden');
        modalBackdrop.classList.remove('flex');
      }
    });
  }

  // 4. Live Footer Clock
  const clockEl = document.getElementById('live-clock');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    clockEl.textContent = now.toUTCString().replace('GMT', 'UTC');
  }
  updateClock();
  setInterval(updateClock, 1000);
});
