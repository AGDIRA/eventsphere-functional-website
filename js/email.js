// Module 5: Bulk Invitation Sender & Dispatch Console Controller for EventSphere
document.addEventListener('DOMContentLoaded', () => {
  // Initialize EmailJS SDK – replace the empty string with your actual public key
  emailjs.init({ publicKey: 'GMRXKs3IuQbvLP-of' });
  // Elements Selection
  const bulkForm = document.getElementById('bulk-invitation-form');
  const toastContainer = document.getElementById('toast-container');

  // Input Fields
  const inputTitle = document.getElementById('event-title');
  const inputDate = document.getElementById('event-date');
  const inputVenue = document.getElementById('event-venue');
  const selectTier = document.getElementById('pass-tier');
  const inputRecipients = document.getElementById('recipient-emails');
  const inputMessage = document.getElementById('custom-message');
  
  // Preset & File buttons
  const btnPresetSample = document.getElementById('btn-preset-sample');
  const btnPresetLarge = document.getElementById('btn-preset-large');
  const btnClearEmails = document.getElementById('btn-clear-emails');
  const fileImportCsv = document.getElementById('file-import-csv');
  const recipientCountBadge = document.getElementById('recipient-count-badge');

  // Mode & Credentials
  const modeRadios = document.getElementsByName('dispatch-mode');
  const emailjsCredsBox = document.getElementById('emailjs-credentials-box');
  const labelSimMode = document.getElementById('label-sim-mode');
  const labelEmailjsMode = document.getElementById('label-emailjs-mode');

  // Live Ticket Preview Elements
  const previewTitle = document.getElementById('preview-event-title');
  const previewDate = document.getElementById('preview-event-date');
  const previewVenue = document.getElementById('preview-event-venue');
  const previewTier = document.getElementById('preview-pass-tier');
  const previewMessage = document.getElementById('preview-message-body');
  const previewPrimaryEmail = document.getElementById('preview-primary-email');
  const previewCount = document.getElementById('preview-recipient-count');

  // Dispatch Action Buttons
  const btnDispatchBulk = document.getElementById('btn-dispatch-bulk');
  const btnPauseDispatch = document.getElementById('btn-pause-dispatch');

  // Console Telemetry & Progress
  const progressBar = document.getElementById('dispatch-progress-bar');
  const progressStatusText = document.getElementById('progress-status-text');
  const progressPercentageText = document.getElementById('progress-percentage-text');
  
  const statTotalSent = document.getElementById('stat-total-sent');
  const statSuccessSent = document.getElementById('stat-success-sent');
  const statFailedSent = document.getElementById('stat-failed-sent');
  const statRateSent = document.getElementById('stat-rate-sent');

  // Console Log Feed Elements
  const consoleFeedList = document.getElementById('console-feed-list');
  const consoleEmptyState = document.getElementById('console-empty-state');
  const filterBtns = document.querySelectorAll('.log-filter-btn');
  const countFilterAll = document.getElementById('count-filter-all');
  const countFilterSuccess = document.getElementById('count-filter-success');
  const countFilterFailed = document.getElementById('count-filter-failed');
  const countFilterPending = document.getElementById('count-filter-pending');

  const btnExportCsv = document.getElementById('btn-export-csv');
  const btnRetryFailed = document.getElementById('btn-retry-failed');
  const btnClearConsole = document.getElementById('btn-clear-console');

  // State
  let dispatchLogs = [];
  let isDispatching = false;
  let isPaused = false;
  let currentFilter = 'all';

  // Sample Presets Data
  const SAMPLE_VIP_EMAILS = [
    'alex.vance@techcorp.io',
    'sophia.kim@innovate.org',
    'marcus.chen@nexus.net',
    'elena.rodriguez@summit.co',
    'david.wright@apex.io'
  ];

  const DELEGATE_EMAILS = [
    'sarah.connor@cyberdyne.com',
    'james.holden@rocinante.org',
    'naomi.nagata@belt-tech.net',
    'amos.burton@terminal.io',
    'alex.kamal@martian-summit.com',
    'chrisjen.avasarala@un-gov.org',
    'clarissa.mao@hyperion.co',
    'joseph.miller@star-ops.net',
    'camina.drummer@tycho.io',
    'praxidike.meng@ganymede-labs.org'
  ];

  // Helper: Toast System
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
      : type === 'warning'
      ? '<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>'
      : '<svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';

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

  // Email Parser Utility
  function parseEmailList(rawText) {
    if (!rawText) return { valid: [], invalid: [], total: 0 };
    
    // Split by comma, semicolon, space, or newline
    const tokens = rawText
      .split(/[\n,;\s]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = [];
    const invalid = [];

    tokens.forEach(token => {
      if (emailRegex.test(token)) {
        if (!valid.includes(token)) {
          valid.push(token);
        }
      } else {
        if (!invalid.includes(token)) {
          invalid.push(token);
        }
      }
    });

    return { valid, invalid, total: valid.length };
  }

  // Update Live Ticket & Recipient Counts
  function updateLiveTicketPreview() {
    if (inputTitle && previewTitle) {
      previewTitle.textContent = inputTitle.value.trim() || 'Global Tech Summit 2026';
    }
    if (inputDate && previewDate) {
      previewDate.textContent = inputDate.value.trim() || 'Oct 24, 2026 • 09:00 AM PST';
    }
    if (inputVenue && previewVenue) {
      previewVenue.textContent = inputVenue.value.trim() || 'Grand Ballroom, Cyber City Convention Center, SF';
    }
    if (selectTier && previewTier) {
      previewTier.textContent = selectTier.value || 'VIP All-Access Pass';
    }
    if (inputMessage && previewMessage) {
      const msg = inputMessage.value.trim();
      previewMessage.textContent = msg ? `"${msg}"` : '"We are thrilled to welcome you as a distinguished guest..."';
    }

    // Parse emails for preview
    const parsed = parseEmailList(inputRecipients ? inputRecipients.value : '');
    
    if (recipientCountBadge) {
      if (parsed.total === 0 && parsed.invalid.length === 0) {
        recipientCountBadge.textContent = '0 emails detected';
        recipientCountBadge.className = 'px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600';
      } else if (parsed.invalid.length > 0) {
        recipientCountBadge.textContent = `${parsed.total} valid • ${parsed.invalid.length} invalid`;
        recipientCountBadge.className = 'px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800';
      } else {
        recipientCountBadge.textContent = `${parsed.total} valid email${parsed.total === 1 ? '' : 's'} ready`;
        recipientCountBadge.className = 'px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800';
      }
    }

    if (previewPrimaryEmail) {
      previewPrimaryEmail.textContent = parsed.valid[0] || 'alex.vance@techcorp.io';
    }
    if (previewCount) {
      previewCount.textContent = parsed.total > 0 ? `${parsed.total} Recipient${parsed.total === 1 ? '' : 's'} Selected` : '1 Recipient Selected';
    }
  }

  // Bind Input Listeners for Live Ticket Sync
  [inputTitle, inputDate, inputVenue, selectTier, inputRecipients, inputMessage].forEach(el => {
    if (el) {
      el.addEventListener('input', updateLiveTicketPreview);
      el.addEventListener('change', updateLiveTicketPreview);
    }
  });

  // Initial Sync
  updateLiveTicketPreview();

  // Quick Preset Actions
  btnPresetSample?.addEventListener('click', () => {
    inputRecipients.value = SAMPLE_VIP_EMAILS.join(', ');
    updateLiveTicketPreview();
    window.showToast('Loaded 5 Sample VIP emails into recipient field', 'success');
  });

  btnPresetLarge?.addEventListener('click', () => {
    inputRecipients.value = DELEGATE_EMAILS.join(', ');
    updateLiveTicketPreview();
    window.showToast('Loaded 10 Delegate emails into recipient field', 'success');
  });

  btnClearEmails?.addEventListener('click', () => {
    inputRecipients.value = '';
    updateLiveTicketPreview();
  });

  // File Import (CSV/TXT) Reader
  fileImportCsv?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const parsed = parseEmailList(content);
      if (parsed.valid.length > 0) {
        const existing = parseEmailList(inputRecipients.value).valid;
        const merged = Array.from(new Set([...existing, ...parsed.valid]));
        inputRecipients.value = merged.join(', ');
        updateLiveTicketPreview();
        window.showToast(`Imported ${parsed.valid.length} valid email(s) from file "${file.name}"`, 'success');
      } else {
        window.showToast(`No valid email addresses found in file "${file.name}".`, 'warning');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  // Dispatch Mode Switcher styling sync
  function updateModeRadioStyle() {
    const selectedMode = Array.from(modeRadios).find(r => r.checked)?.value || 'simulated';
    if (selectedMode === 'emailjs') {
      emailjsCredsBox?.classList.remove('hidden');
      labelEmailjsMode?.classList.add('bg-blue-600', 'text-white');
      labelSimMode?.classList.remove('bg-blue-600', 'text-white');
      labelSimMode?.classList.add('text-slate-600');
    } else {
      emailjsCredsBox?.classList.add('hidden');
      labelSimMode?.classList.add('bg-blue-600', 'text-white');
      labelEmailjsMode?.classList.remove('bg-blue-600', 'text-white');
      labelEmailjsMode?.classList.add('text-slate-600');
    }
  }

  modeRadios.forEach(radio => {
    radio.addEventListener('change', updateModeRadioStyle);
  });
  updateModeRadioStyle();

  // Console Telemetry Counters Sync
  function updateTelemetryStats() {
    const total = dispatchLogs.length;
    const success = dispatchLogs.filter(l => l.status === 'delivered').length;
    const failed = dispatchLogs.filter(l => l.status === 'failed').length;
    const pending = dispatchLogs.filter(l => l.status === 'pending' || l.status === 'sending').length;

    if (statTotalSent) statTotalSent.textContent = total;
    if (statSuccessSent) statSuccessSent.textContent = success;
    if (statFailedSent) statFailedSent.textContent = failed;
    
    if (statRateSent) {
      const rate = total > 0 ? Math.round((success / (success + failed || 1)) * 100) : 100;
      statRateSent.textContent = `${rate}%`;
    }

    if (countFilterAll) countFilterAll.textContent = total;
    if (countFilterSuccess) countFilterSuccess.textContent = success;
    if (countFilterFailed) countFilterFailed.textContent = failed;
    if (countFilterPending) countFilterPending.textContent = pending;

    if (typeof window.updateDispatchTelemetryCharts === 'function') {
      window.updateDispatchTelemetryCharts(success, pending, failed);
    }
  }

  // Render Console Log Feed List
  function renderConsoleLogs() {
    if (!consoleFeedList) return;

    const filtered = dispatchLogs.filter(log => {
      if (currentFilter === 'all') return true;
      if (currentFilter === 'success') return log.status === 'delivered';
      if (currentFilter === 'failed') return log.status === 'failed';
      if (currentFilter === 'pending') return log.status === 'pending' || log.status === 'sending';
      return true;
    });

    if (dispatchLogs.length === 0) {
      if (consoleEmptyState) consoleEmptyState.style.display = 'block';
      consoleFeedList.innerHTML = '';
      consoleFeedList.appendChild(consoleEmptyState);
      return;
    }

    if (consoleEmptyState) consoleEmptyState.style.display = 'none';

    consoleFeedList.innerHTML = filtered.map(log => {
      let badgeClass = '';
      let badgeIcon = '';
      let badgeText = '';

      if (log.status === 'delivered') {
        badgeClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        badgeIcon = '<svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
        badgeText = 'DELIVERED';
      } else if (log.status === 'failed') {
        badgeClass = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
        badgeIcon = '<svg class="w-3.5 h-3.5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
        badgeText = 'FAILED';
      } else if (log.status === 'sending') {
        badgeClass = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        badgeIcon = '<svg class="w-3.5 h-3.5 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
        badgeText = 'SENDING...';
      } else {
        badgeClass = 'bg-slate-800 text-slate-400 border-slate-700';
        badgeIcon = '<svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="2"/><path d="M12 6v6l4 2" stroke-width="2"/></svg>';
        badgeText = 'PENDING';
      }

      return `
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono gap-2 transition hover:border-slate-700">
          <div class="flex items-center gap-3 min-w-0">
            <span class="px-2.5 py-1 rounded-md text-[10px] font-bold border flex items-center gap-1.5 shrink-0 ${badgeClass}">
              ${badgeIcon} ${badgeText}
            </span>
            <div class="truncate">
              <span class="font-bold text-white block truncate">${log.email}</span>
              <span class="text-[10px] text-slate-400">Ref: <span class="text-blue-400 font-bold">${log.refCode}</span> • ${log.details}</span>
            </div>
          </div>
          
          <div class="flex items-center gap-3 text-slate-500 text-[11px] shrink-0 self-end sm:self-center">
            <span>${log.timestamp}</span>
            ${log.status === 'failed' ? `<button onclick="window.retrySingleEmail('${log.email}')" class="text-amber-400 hover:underline font-sans text-[11px]">Retry</button>` : ''}
          </div>
        </div>
      `;
    }).join('');

    updateTelemetryStats();
  }

  // Filter Buttons Click
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.className = 'log-filter-btn px-3 py-1.5 rounded-lg font-medium transition text-slate-400 hover:text-white');
      btn.className = 'log-filter-btn px-3 py-1.5 rounded-lg font-medium transition bg-blue-600 text-white';
      currentFilter = btn.getAttribute('data-filter') || 'all';
      renderConsoleLogs();
    });
  });

  // Pause / Resume Dispatch Toggle
  btnPauseDispatch?.addEventListener('click', () => {
    if (!isDispatching) return;
    isPaused = !isPaused;
    if (isPaused) {
      btnPauseDispatch.innerHTML = '<svg class="w-4 h-4 text-emerald-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg> <span>Resume Batch</span>';
      if (progressStatusText) progressStatusText.innerHTML = '<span class="text-amber-400 font-bold flex items-center gap-1.5"><i data-lucide="pause" class="w-3.5 h-3.5"></i> Batch Dispatch Paused</span>';
      window.showToast('Bulk dispatch paused by operator.', 'warning');
    } else {
      btnPauseDispatch.innerHTML = '<svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6"/></svg> <span>Pause Batch</span>';
      if (progressStatusText) progressStatusText.innerHTML = '<span class="text-blue-400 font-bold flex items-center gap-1.5"><i data-lucide="play" class="w-3.5 h-3.5 animate-spin"></i> Resuming Batch Dispatch...</span>';
    }
  });

  // Single Recipient Retry Helper
  window.retrySingleEmail = function(targetEmail) {
    const existingLog = dispatchLogs.find(l => l.email === targetEmail);
    if (existingLog) {
      existingLog.status = 'pending';
      existingLog.details = 'Queued for retry...';
      renderConsoleLogs();
      executeSingleDispatch(targetEmail, existingLog);
    }
  };

  // Execute Dispatch for One Recipient
  async function executeSingleDispatch(email, logEntry) {
    const selectedMode = Array.from(modeRadios).find(r => r.checked)?.value || 'simulated';
    const serviceId  = document.getElementById('emailjs-service-id')?.value.trim();
    const templateId = document.getElementById('emailjs-template-id')?.value.trim();
    const publicKey  = document.getElementById('emailjs-public-key')?.value.trim();

    logEntry.status  = 'sending';
    logEntry.details = 'Dispatching message headers...';
    renderConsoleLogs();

    if (selectedMode === 'emailjs' && serviceId && templateId && publicKey) {
      // ── EmailJS: Direct REST API (no SDK) ──
      try {
        const templateParams = {
          email:   email,                                                    // {{email}}   → To Email field in template
          name:    email.split('@')[0].replace(/[._-]/g, ' '),               // {{name}}    → recipient name
          message: 'You are cordially invited!\n\n' +
                   `Event  : ${inputTitle  ? inputTitle.value  : 'Global Tech Summit 2026'}\n` +
                   `Date   : ${inputDate   ? inputDate.value   : 'Oct 24, 2026'}\n` +
                   `Venue  : ${inputVenue  ? inputVenue.value  : 'Grand Ballroom'}\n` +
                   `Pass   : ${selectTier  ? selectTier.value  : 'VIP All-Access Pass'}\n\n` +
                   (inputMessage ? inputMessage.value : 'We look forward to seeing you there.'),
          time:    new Date().toLocaleString()
        };

        console.log('[EventSphere] Sending via EmailJS REST API →', email, templateParams);

        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            service_id:      serviceId,
            template_id:     templateId,
            user_id:         publicKey,
            template_params: templateParams
          })
        });

        if (response.ok) {
          logEntry.status  = 'delivered';
          logEntry.details = '200 OK — Delivered via EmailJS';
          console.log('[EventSphere] ✅ Delivered to', email);
        } else {
          const errText = await response.text();
          logEntry.status  = 'failed';
          logEntry.details = `EmailJS error (${response.status}): ${errText}`;
          console.error('[EventSphere] ❌ Failed for', email, '→', errText);
        }

      } catch (err) {
        logEntry.status  = 'failed';
        logEntry.details = `Network error: ${err.message}`;
        console.error('[EventSphere] Network error →', err);
      }

    } else {
      // ── Simulated Mode ──
      const delay = Math.floor(Math.random() * 400) + 400;
      await new Promise(res => setTimeout(res, delay));
      const isSuccess = Math.random() > 0.05;
      if (isSuccess) {
        logEntry.status  = 'delivered';
        logEntry.details = `200 OK — Simulated dispatch (${delay}ms latency)`;
      } else {
        logEntry.status  = 'failed';
        logEntry.details = `503 Error — Simulated mailbox bounce (${delay}ms latency)`;
      }
    }

    logEntry.timestamp = new Date().toLocaleTimeString();
    renderConsoleLogs();
  }


  // Primary Form Submission - Dispatch Bulk Invitations
  if (bulkForm) {
    bulkForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (isDispatching) return;

      const rawEmails = inputRecipients ? inputRecipients.value : '';
      const parsed = parseEmailList(rawEmails);

      if (parsed.valid.length === 0) {
        window.showToast('Please enter at least one valid recipient email address.', 'warning');
        inputRecipients?.focus();
        return;
      }

      if (parsed.invalid.length > 0) {
        window.showToast(`Warning: ${parsed.invalid.length} invalid email(s) were excluded from dispatch.`, 'warning');
      }

      const emailsToDispatch = parsed.valid;
      isDispatching = true;
      isPaused = false;

      // Toggle Button States
      if (btnDispatchBulk) {
        btnDispatchBulk.disabled = true;
        btnDispatchBulk.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg> Batch Dispatching Active...
        `;
      }

      if (btnPauseDispatch) {
        btnPauseDispatch.disabled = false;
        btnPauseDispatch.classList.remove('bg-slate-200', 'text-slate-400', 'cursor-not-allowed');
        btnPauseDispatch.classList.add('bg-amber-500', 'hover:bg-amber-600', 'text-white', 'shadow-md');
      }

      // Initialize Console Log Entries
      const newLogBatch = emailsToDispatch.map((email, idx) => ({
        id: `LOG-${Date.now()}-${idx}`,
        email,
        status: 'pending',
        timestamp: new Date().toLocaleTimeString(),
        refCode: `#INV-${Math.floor(10000 + Math.random() * 90000)}-VIP`,
        details: 'Queued in delivery queue...'
      }));

      dispatchLogs = [...newLogBatch, ...dispatchLogs];
      renderConsoleLogs();

      // Scroll console into view
      document.getElementById('live-console-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      window.showToast(`Started bulk invitation dispatch for ${emailsToDispatch.length} recipient(s)...`, 'success');

      let completedCount = 0;
      const totalBatch = emailsToDispatch.length;

      for (let i = 0; i < newLogBatch.length; i++) {
        // Handle Operator Pause
        while (isPaused) {
          await new Promise(res => setTimeout(res, 250));
        }

        const logEntry = newLogBatch[i];

        if (progressStatusText) {
          progressStatusText.innerHTML = `<span class="text-blue-400 font-bold flex items-center gap-2"><i data-lucide="send" class="w-3.5 h-3.5 animate-pulse"></i> Dispatching ${i + 1} of ${totalBatch}: ${logEntry.email}</span>`;
        }

        await executeSingleDispatch(logEntry.email, logEntry);

        completedCount++;
        const percent = Math.round((completedCount / totalBatch) * 100);

        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressPercentageText) progressPercentageText.textContent = `${percent}% Completed (${completedCount} / ${totalBatch})`;
      }

      // Batch Finish
      isDispatching = false;
      isPaused = false;

      if (btnDispatchBulk) {
        btnDispatchBulk.disabled = false;
        btnDispatchBulk.innerHTML = `
          <i data-lucide="send" class="w-4 h-4"></i>
          <span>Dispatch Bulk Invitations</span>
        `;
      }

      if (btnPauseDispatch) {
        btnPauseDispatch.disabled = true;
        btnPauseDispatch.classList.add('bg-slate-200', 'text-slate-400', 'cursor-not-allowed');
        btnPauseDispatch.classList.remove('bg-amber-500', 'hover:bg-amber-600', 'text-white', 'shadow-md');
        btnPauseDispatch.innerHTML = '<i data-lucide="pause-circle" class="w-4 h-4"></i> <span>Pause Batch</span>';
      }

      if (progressStatusText) {
        progressStatusText.innerHTML = '<span class="text-emerald-400 font-bold flex items-center gap-1.5"><i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Batch Dispatch Completed Successfully</span>';
      }

      const deliveredCount = newLogBatch.filter(l => l.status === 'delivered').length;
      const failedCount = newLogBatch.filter(l => l.status === 'failed').length;

      window.showToast(`Batch dispatch finished! ${deliveredCount} delivered, ${failedCount} failed.`, deliveredCount > 0 ? 'success' : 'warning');
      
      // Re-initialize Lucide Icons
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  }

  // Export CSV Audit Log
  btnExportCsv?.addEventListener('click', () => {
    if (dispatchLogs.length === 0) {
      window.showToast('No dispatch logs available to export.', 'warning');
      return;
    }

    const headers = ['Timestamp', 'Recipient Email', 'Status', 'Reference ID', 'Delivery Details'];
    const rows = dispatchLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.email}"`,
      `"${l.status.toUpperCase()}"`,
      `"${l.refCode}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eventsphere_invitation_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.showToast('Dispatch audit log exported to CSV file.', 'success');
  });

  // Retry Failed Dispatches
  btnRetryFailed?.addEventListener('click', async () => {
    const failedLogs = dispatchLogs.filter(l => l.status === 'failed');
    if (failedLogs.length === 0) {
      window.showToast('No failed dispatches found to retry.', 'info');
      return;
    }

    window.showToast(`Retrying ${failedLogs.length} failed dispatch(es)...`, 'warning');

    for (let logEntry of failedLogs) {
      await executeSingleDispatch(logEntry.email, logEntry);
    }

    window.showToast('Retry process finished.', 'success');
  });

  // Clear Console Log Feed
  btnClearConsole?.addEventListener('click', () => {
    dispatchLogs = [];
    renderConsoleLogs();
    if (progressBar) progressBar.style.width = '0%';
    if (progressPercentageText) progressPercentageText.textContent = '0% Completed (0 / 0)';
    if (progressStatusText) progressStatusText.innerHTML = '<i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400"></i> Dispatch Status: Ready';
    window.showToast('Console log feed cleared.', 'info');
  });
});
