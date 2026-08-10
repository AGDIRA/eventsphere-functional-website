// Guest Registry Controller for EventSphere
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Initial Sample Guests Data
  const defaultGuests = [
    {
      id: 'GST-1001',
      name: 'Alexander Vance',
      email: 'alex.vance@techcorp.io',
      phone: '+1 (555) 234-5678',
      company: 'TechCorp Industries',
      designation: 'VP of Engineering',
      department: 'Technology',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      eventName: 'Global Tech Summit 2026',
      regDate: '2026-08-01',
      checkInDate: '2026-08-07',
      foodPref: 'Vegetarian',
      emergencyPerson: 'Sarah Vance',
      emergencyPhone: '+1 (555) 234-5679',
      notes: 'VIP Speaker',
      status: 'Checked In'
    },
    {
      id: 'GST-1002',
      name: 'Sophia Kim',
      email: 'sophia.kim@innovate.org',
      phone: '+1 (555) 876-5432',
      company: 'Innovate Global',
      designation: 'Chief Product Officer',
      department: 'Product Management',
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      eventName: 'Global Tech Summit 2026',
      regDate: '2026-08-02',
      checkInDate: '',
      foodPref: 'Vegan',
      emergencyPerson: 'David Kim',
      emergencyPhone: '+1 (555) 876-5433',
      notes: 'Keynote Panelist',
      status: 'Pending'
    },
    {
      id: 'GST-1003',
      name: 'Marcus Chen',
      email: 'marcus.chen@nexus.net',
      phone: '+1 (555) 345-6789',
      company: 'Nexus Systems',
      designation: 'Director of AI Ops',
      department: 'Research & Dev',
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      eventName: 'Global Tech Summit 2026',
      regDate: '2026-08-03',
      checkInDate: '2026-08-07',
      foodPref: 'None',
      emergencyPerson: 'Lin Chen',
      emergencyPhone: '+1 (555) 345-6790',
      notes: 'Workshop Lead',
      status: 'Checked In'
    },
    {
      id: 'GST-1004',
      name: 'Elena Rodriguez',
      email: 'elena.rodriguez@summit.co',
      phone: '+1 (555) 987-6543',
      company: 'Summit Venture Capital',
      designation: 'Managing Partner',
      department: 'Executive',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      eventName: 'Global Tech Summit 2026',
      regDate: '2026-08-04',
      checkInDate: '',
      foodPref: 'Gluten-Free',
      emergencyPerson: 'Carlos Rodriguez',
      emergencyPhone: '+1 (555) 987-6544',
      notes: 'VIP Guest',
      status: 'Pending'
    },
    {
      id: 'GST-1005',
      name: 'David Wright',
      email: 'david.wright@apex.io',
      phone: '+1 (555) 456-7890',
      company: 'Apex Cloud Solutions',
      designation: 'Head of Infrastructure',
      department: 'Cloud Services',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      eventName: 'Global Tech Summit 2026',
      regDate: '2026-08-05',
      checkInDate: '2026-08-07',
      foodPref: 'Halal',
      emergencyPerson: 'Rachel Wright',
      emergencyPhone: '+1 (555) 456-7891',
      notes: 'Delegate',
      status: 'Checked In'
    }
  ];

  // Load guests from localStorage or use defaults
  let guests = JSON.parse(localStorage.getItem('eventsphere_guests')) || defaultGuests;
  let currentFilter = 'Total';
  let searchQuery = '';

  // Elements
  const tableBody = document.getElementById('guestTableBody');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const downloadBtn = document.getElementById('downloadBtn');
  const addGuestBtn = document.getElementById('addGuestBtn');

  // Stats Counters
  const statTotal = document.getElementById('statTotal');
  const statCheckedIn = document.getElementById('statCheckedIn');
  const statPending = document.getElementById('statPending');
  const cardTotal = document.getElementById('cardTotal');
  const cardCheckedIn = document.getElementById('cardCheckedIn');
  const cardPending = document.getElementById('cardPending');

  // Modal Elements
  const guestModal = document.getElementById('guestModal');
  const guestForm = document.getElementById('guestForm');
  const modalTitle = document.getElementById('modalTitle');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  // Form Fields
  const guestIdInput = document.getElementById('guestId');
  const gName = document.getElementById('gName');
  const gEmail = document.getElementById('gEmail');
  const gPhone = document.getElementById('gPhone');
  const gCompany = document.getElementById('gCompany');
  const gDesignation = document.getElementById('gDesignation');
  const gDepartment = document.getElementById('gDepartment');
  const gCity = document.getElementById('gCity');
  const gState = document.getElementById('gState');
  const gCountry = document.getElementById('gCountry');
  const gEventName = document.getElementById('gEventName');
  const gRegDate = document.getElementById('gRegDate');
  const gCheckInDate = document.getElementById('gCheckInDate');
  const gFoodPref = document.getElementById('gFoodPref');
  const gEmergencyPerson = document.getElementById('gEmergencyPerson');
  const gEmergencyPhone = document.getElementById('gEmergencyPhone');
  const gNotes = document.getElementById('gNotes');
  const gStatus = document.getElementById('gStatus');

  // Helper: Save to localStorage
  function saveGuests() {
    localStorage.setItem('eventsphere_guests', JSON.stringify(guests));
  }

  // Toast Helper
  function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl text-sm font-medium transition-all duration-300 transform translate-y-4 opacity-0 border ${
      type === 'success' ? 'bg-slate-900 text-white border-emerald-500/30' : 'bg-slate-900 text-rose-200 border-rose-500/30'
    }`;
    toast.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.remove('translate-y-4', 'opacity-0'), 10);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Render Table & Update Stats
  function renderTable() {
    // Calculate Stats
    const totalCount = guests.length;
    const checkedInCount = guests.filter(g => g.status === 'Checked In').length;
    const pendingCount = guests.filter(g => g.status === 'Pending').length;

    if (statTotal) statTotal.textContent = totalCount;
    if (statCheckedIn) statCheckedIn.textContent = checkedInCount;
    if (statPending) statPending.textContent = pendingCount;

    // Filter & Search Logic
    let filtered = guests.filter(g => {
      if (currentFilter === 'Checked-In') return g.status === 'Checked In';
      if (currentFilter === 'Pending') return g.status === 'Pending';
      return true;
    });

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(g =>
        g.name.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        (g.company && g.company.toLowerCase().includes(q)) ||
        (g.designation && g.designation.toLowerCase().includes(q))
      );
    }

    if (!tableBody) return;

    if (filtered.length === 0) {
      tableBody.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    tableBody.innerHTML = filtered.map(g => {
      const isChecked = g.status === 'Checked In';
      const badgeClass = isChecked
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-amber-50 text-amber-700 border-amber-200';

      return `
        <tr class="hover:bg-slate-50/80 transition">
          <td class="px-6 py-4 font-bold text-slate-900">${g.name}</td>
          <td class="px-6 py-4 text-slate-600">${g.email}</td>
          <td class="px-6 py-4 text-slate-600">${g.phone || '-'}</td>
          <td class="px-6 py-4 text-slate-600">${g.company || '-'}</td>
          <td class="px-6 py-4 text-slate-600">${g.designation || '-'}</td>
          <td class="px-6 py-4 text-slate-600">${g.department || '-'}</td>
          <td class="px-6 py-4 text-slate-500 font-mono text-xs">${g.regDate || '-'}</td>
          <td class="px-6 py-4 text-slate-500 font-mono text-xs">${g.checkInDate || '-'}</td>
          <td class="px-6 py-4 text-center">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeClass}">
              <span class="w-1.5 h-1.5 rounded-full ${isChecked ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
              ${g.status}
            </span>
          </td>
          <td class="px-6 py-4 text-right space-x-2 whitespace-nowrap">
            <button onclick="window.toggleCheckIn('${g.id}')" class="px-3 py-1 rounded-lg text-xs font-bold ${isChecked ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'} transition">
              ${isChecked ? 'Undo Check-In' : 'Check-In'}
            </button>
            <button onclick="window.generatePass('${g.id}')" class="px-3 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-600 hover:bg-purple-100 transition">
              Pass 🎟
            </button>
            <button onclick="window.editGuest('${g.id}')" class="px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
              Edit
            </button>
            <button onclick="window.deleteGuest('${g.id}')" class="px-3 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 transition">
              Delete
            </button>
          </td>
        </tr>
      `;
    }).join('');

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // Filter Cards Click Handlers
  window.setFilter = function(filterType) {
    currentFilter = filterType;

    [cardTotal, cardCheckedIn, cardPending].forEach(c => {
      if (c) {
        c.className = c.className.replace('bg-gradient-to-r from-blue-600 to-violet-600 text-white', 'bg-white text-slate-900')
                                 .replace('active', 'inactive');
      }
    });

    if (filterType === 'Total' && cardTotal) {
      cardTotal.className = 'stat-card active bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3 transition hover:shadow-md cursor-pointer';
    } else if (filterType === 'Checked-In' && cardCheckedIn) {
      cardCheckedIn.className = 'stat-card active bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3 transition hover:shadow-md cursor-pointer';
    } else if (filterType === 'Pending' && cardPending) {
      cardPending.className = 'stat-card active bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3 transition hover:shadow-md cursor-pointer';
    }

    renderTable();
  };

  // Toggle Check-In
  window.toggleCheckIn = function(id) {
    const g = guests.find(item => item.id === id);
    if (g) {
      if (g.status === 'Checked In') {
        g.status = 'Pending';
        g.checkInDate = '';
        showToast(`Guest ${g.name} status set to Pending`, 'success');
      } else {
        g.status = 'Checked In';
        g.checkInDate = new Date().toISOString().split('T')[0];
        showToast(`Guest ${g.name} checked in successfully!`, 'success');
      }
      saveGuests();
      renderTable();
    }
  };

  // Delete Guest
  window.deleteGuest = function(id) {
    if (confirm('Are you sure you want to delete this guest from the register?')) {
      guests = guests.filter(g => g.id !== id);
      saveGuests();
      renderTable();
      showToast('Guest record removed.', 'success');
    }
  };

  // Generate VIP Pass for Guest
  window.generatePass = function(id) {
    const g = guests.find(item => item.id === id);
    if (!g) return;
    const params = new URLSearchParams({
      name: g.name || '',
      designation: g.designation || '',
      company: g.company || '',
      tier: g.notes?.includes('VIP') ? 'VIP' : 'Standard'
    });
    window.location.href = `vip-pass.html?${params.toString()}`;
  };

  // Edit Guest Modal Trigger
  window.editGuest = function(id) {
    const g = guests.find(item => item.id === id);
    if (!g) return;

    modalTitle.textContent = 'Edit Guest Details';
    guestIdInput.value = g.id;
    gName.value = g.name || '';
    gEmail.value = g.email || '';
    gPhone.value = g.phone || '';
    gCompany.value = g.company || '';
    gDesignation.value = g.designation || '';
    gDepartment.value = g.department || '';
    gCity.value = g.city || '';
    gState.value = g.state || '';
    gCountry.value = g.country || '';
    gEventName.value = g.eventName || 'Global Tech Summit 2026';
    gRegDate.value = g.regDate || '';
    gCheckInDate.value = g.checkInDate || '';
    gFoodPref.value = g.foodPref || 'None';
    gEmergencyPerson.value = g.emergencyPerson || '';
    gEmergencyPhone.value = g.emergencyPhone || '';
    gNotes.value = g.notes || '';
    gStatus.value = g.status || 'Pending';

    openGuestModal();
  };

  // Modal Open/Close Controls
  function openGuestModal() {
    guestModal.classList.remove('hidden');
    guestModal.classList.add('flex');
    setTimeout(() => {
      guestModal.classList.remove('opacity-0');
      guestModal.firstElementChild.classList.remove('scale-95');
    }, 10);
  }

  function closeGuestModal() {
    guestModal.classList.add('opacity-0');
    guestModal.firstElementChild.classList.add('scale-95');
    setTimeout(() => {
      guestModal.classList.add('hidden');
      guestModal.classList.remove('flex');
      guestForm.reset();
      guestIdInput.value = '';
    }, 300);
  }

  addGuestBtn?.addEventListener('click', () => {
    modalTitle.textContent = 'Add New Guest';
    guestForm.reset();
    guestIdInput.value = '';
    gRegDate.value = new Date().toISOString().split('T')[0];
    openGuestModal();
  });

  closeModalBtn?.addEventListener('click', closeGuestModal);
  cancelBtn?.addEventListener('click', closeGuestModal);

  // Submit Add / Edit Form
  guestForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = guestIdInput.value;
    const isEdit = Boolean(id);

    const newGuest = {
      id: isEdit ? id : `GST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: gName.value.trim(),
      email: gEmail.value.trim(),
      phone: gPhone.value.trim(),
      company: gCompany.value.trim(),
      designation: gDesignation.value.trim(),
      department: gDepartment.value.trim(),
      city: gCity.value.trim(),
      state: gState.value.trim(),
      country: gCountry.value.trim(),
      eventName: gEventName.value.trim() || 'Global Tech Summit 2026',
      regDate: gRegDate.value || new Date().toISOString().split('T')[0],
      checkInDate: gCheckInDate.value || '',
      foodPref: gFoodPref.value,
      emergencyPerson: gEmergencyPerson.value.trim(),
      emergencyPhone: gEmergencyPhone.value.trim(),
      notes: gNotes.value.trim(),
      status: gStatus.value
    };

    if (isEdit) {
      const idx = guests.findIndex(g => g.id === id);
      if (idx !== -1) guests[idx] = newGuest;
      showToast('Guest updated successfully!', 'success');
    } else {
      guests.unshift(newGuest);
      showToast('New guest registered!', 'success');
    }

    saveGuests();
    renderTable();
    closeGuestModal();
  });

  // Search Input Listener
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderTable();
  });

  // Download Register CSV/Excel
  downloadBtn?.addEventListener('click', () => {
    if (guests.length === 0) {
      showToast('No guests available to export.', 'warning');
      return;
    }

    if (typeof XLSX !== 'undefined') {
      const ws = XLSX.utils.json_to_sheet(guests);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Guest Register");
      XLSX.writeFile(wb, `EventSphere_Guest_Register_${Date.now()}.xlsx`);
    } else {
      const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Designation', 'Reg Date', 'Status'];
      const rows = guests.map(g => [
        `"${g.id}"`, `"${g.name}"`, `"${g.email}"`, `"${g.phone}"`, `"${g.company}"`, `"${g.designation}"`, `"${g.regDate}"`, `"${g.status}"`
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `eventsphere_guest_register_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    showToast('Guest register exported successfully!', 'success');
  });

  // Initial Render
  renderTable();
});
