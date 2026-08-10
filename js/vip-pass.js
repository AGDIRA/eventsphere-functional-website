document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('vip-form');
    const modal = document.getElementById('pass-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const closeModalActionBtn = document.getElementById('close-modal-btn');
    
    // Display elements in the modal
    const displayName = document.getElementById('display-name');
    const displayRole = document.getElementById('display-role');
    const displayCompany = document.getElementById('display-company');
    const displayId = document.getElementById('display-id');
    const displayDate = document.getElementById('display-date');
    const displayQr = document.getElementById('display-qr');

    // Check URL parameters for pre-filled guest data from Guest Registry
    const urlParams = new URLSearchParams(window.location.search);
    const paramName = urlParams.get('name');
    const paramDesignation = urlParams.get('designation');
    const paramCompany = urlParams.get('company');
    const paramTier = urlParams.get('tier');

    if (paramName && form) {
        document.getElementById('fullName').value = paramName;
        if (paramDesignation) document.getElementById('designation').value = paramDesignation;
        if (paramCompany) document.getElementById('company').value = paramCompany;
        if (paramTier) document.getElementById('accessTier').value = paramTier;

        // Auto trigger badge generation
        setTimeout(() => {
            form.dispatchEvent(new Event('submit'));
        }, 100);
    }

    // Format date to DD MMM YYYY
    function formatDate(date) {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options).replace(/ /g, ' ');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const fullName = document.getElementById('fullName').value.trim();
        const designation = document.getElementById('designation').value.trim();
        const company = document.getElementById('company').value.trim();
        const accessTier = document.getElementById('accessTier').value;

        // Generate Random ID (e.g., EVT-2026-3749)
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const passId = `EVT-2026-${randomNum}`;

        // Get Current Date
        const currentDate = formatDate(new Date());

        // Update Modal UI
        displayName.textContent = fullName || 'GUEST';
        displayRole.textContent = designation || 'ATTENDEE';
        displayCompany.textContent = company || '';
        displayId.textContent = passId;
        displayDate.textContent = currentDate;
        
        // Generate QR code data
        const qrData = encodeURIComponent(`Name:${fullName}|ID:${passId}|Tier:${accessTier}`);
        displayQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=09090b&bgcolor=ffffff&data=${qrData}`;

        // Update Tier icon in pass
        const tierBadge = document.querySelector('.tier-badge');
        const tierMap = {
            'VIP':        { icon: 'star',          label: 'VIP ALL-ACCESS' },
            'Speaker':    { icon: 'mic',           label: 'SPEAKER' },
            'Sponsor':    { icon: 'gem',           label: 'SPONSOR' },
            'Exhibitor':  { icon: 'store',         label: 'EXHIBITOR' },
            'Media':      { icon: 'camera',        label: 'MEDIA & PRESS' },
            'Staff':      { icon: 'badge-help',    label: 'STAFF' },
            'Standard':   { icon: 'user',          label: 'STANDARD' },
            'Government': { icon: 'landmark',      label: 'GOVERNMENT' },
            'Partner':    { icon: 'handshake',     label: 'PARTNER' },
            'Investor':   { icon: 'trending-up',   label: 'INVESTOR' },
            'Student':    { icon: 'graduation-cap', label: 'DELEGATE' },
        };
        const tier = tierMap[accessTier] || { icon: 'user', label: accessTier.toUpperCase() };
        tierBadge.innerHTML = `<i data-lucide="${tier.icon}"></i> ${tier.label}`;
        
        // Re-initialize lucide icons for the new HTML
        lucide.createIcons();

        // Show Modal
        modal.classList.add('active');
    });

    // Close Modal Event Listeners
    const closeModal = () => {
        modal.classList.remove('active');
    };

    closeModalBtn.addEventListener('click', closeModal);
    closeModalActionBtn.addEventListener('click', closeModal);
});
