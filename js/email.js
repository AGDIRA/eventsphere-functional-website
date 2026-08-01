// EmailJS SDK & Invitation Sender Handler for EventSphere
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('invitation-form');
  const toastContainer = document.getElementById('toast-container');
  const previewName = document.getElementById('preview-guest-name');
  const previewEmail = document.getElementById('preview-guest-email');
  const previewTier = document.getElementById('preview-pass-tier');

  // Real-time Live Preview Updates
  const inputName = document.getElementById('guest-name');
  const inputEmail = document.getElementById('guest-email');
  const selectTier = document.getElementById('pass-tier');

  if (inputName && previewName) {
    inputName.addEventListener('input', (e) => {
      previewName.textContent = e.target.value.trim() || 'Alex Vance';
    });
  }

  if (inputEmail && previewEmail) {
    inputEmail.addEventListener('input', (e) => {
      previewEmail.textContent = e.target.value.trim() || 'alex.vance@techcorp.io';
    });
  }

  if (selectTier && previewTier) {
    selectTier.addEventListener('change', (e) => {
      previewTier.textContent = e.target.options[e.target.selectedIndex].text || 'VIP All-Access';
    });
  }

  // Toast System
  window.showToast = function(message, type = 'success') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl text-sm font-medium transition-all duration-300 transform translate-y-4 opacity-0 border ${
      type === 'success' 
        ? 'bg-slate-900 text-white border-emerald-500/30' 
        : type === 'warning'
        ? 'bg-slate-900 text-amber-200 border-amber-500/30'
        : 'bg-slate-900 text-rose-200 border-rose-500/30'
    }`;

    const icon = type === 'success' 
      ? '<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
      : '<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>';

    toast.innerHTML = `${icon}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  };

  // Form Submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = inputName ? inputName.value.trim() : '';
      const email = inputEmail ? inputEmail.value.trim() : '';
      const serviceId = document.getElementById('emailjs-service-id')?.value.trim();
      const templateId = document.getElementById('emailjs-template-id')?.value.trim();
      const publicKey = document.getElementById('emailjs-public-key')?.value.trim();

      if (!name || !email) {
        window.showToast('Please fill in all required fields.', 'warning');
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Invitation';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg> Dispatching Invitation...
        `;
      }

      // Check if real EmailJS credentials are provided
      if (typeof emailjs !== 'undefined' && serviceId && templateId && publicKey) {
        try {
          emailjs.init(publicKey);
          await emailjs.send(serviceId, templateId, {
            to_name: name,
            to_email: email,
            pass_tier: selectTier ? selectTier.value : 'VIP Pass',
            message: document.getElementById('custom-message')?.value || 'You are cordially invited.'
          });
          window.showToast(`VIP Invitation successfully dispatched to ${email}!`, 'success');
          form.reset();
        } catch (error) {
          console.error('EmailJS Error:', error);
          window.showToast('EmailJS dispatch failed. Switched to Simulation mode.', 'warning');
        }
      } else {
        // Simulation Mode fallback
        setTimeout(() => {
          window.showToast(`[DEMO MODE] VIP Pass generated & sent to ${email}`, 'success');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
        }, 1200);
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
});
