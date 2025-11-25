// Demo offers data
const demoOffers = [
  {
    id: 'survey-01',
    title: 'Market Research Survey',
    provider: 'MarketInsights',
    payout: '$5',
    image: 'https://via.placeholder.com/300x200?text=Survey',
    categories: ['Survey', 'Quick'],
    description: 'Share your opinions about consumer products',
    requirements: '18+, valid email',
    url: '#',
    tags: ['survey', 'quick', 'opinions']
  },
  {
    id: 'offer-02',
    title: 'Mobile App Install',
    provider: 'AppHub',
    payout: '$2-$8',
    image: 'https://via.placeholder.com/300x200?text=App',
    categories: ['Offerwall', 'App'],
    description: 'Install and try new mobile applications',
    requirements: 'Android or iOS device',
    url: '#',
    tags: ['app', 'download', 'offerwall']
  },
  {
    id: 'video-03',
    title: 'Watch Ads & Videos',
    provider: 'VideoRewards',
    payout: '$0.50-$2',
    image: 'https://via.placeholder.com/300x200?text=Video',
    categories: ['Video', 'Passive'],
    description: 'Earn money watching sponsored content',
    requirements: 'None',
    url: '#',
    tags: ['video', 'passive', 'ads']
  },
  {
    id: 'refer-04',
    title: 'Referral Bonus',
    provider: 'Curse of Midas',
    payout: '10%',
    image: 'https://via.placeholder.com/300x200?text=Referral',
    categories: ['Referral', 'Passive'],
    description: 'Earn commission from referred friends',
    requirements: 'Active account',
    url: '#',
    tags: ['referral', 'passive', 'affiliate']
  }
];

async function loadOffers() {
  try {
    // Try to fetch from server first
    const res = await fetch('/data/offers.json');
    if (res.ok) return await res.json();
  } catch (err) {
    console.log('Using demo data:', err.message);
  }
  // Fallback to demo data
  return demoOffers;
}

function createCard(offer) {
  const card = document.createElement('article');
  card.className = 'offer-card';
  card.innerHTML = `
    <div class="offer-category">${offer.categories[0]}</div>
    <div class="offer-header">
      <h3 class="offer-title">${offer.title}</h3>
      <span class="offer-reward">${offer.payout}</span>
    </div>
    <p class="offer-description">${offer.description}</p>
    <div class="offer-meta">
      <div class="offer-meta-item">
        <i class="fas fa-building"></i>
        <span>${offer.provider}</span>
      </div>
      <div class="offer-meta-item">
        <i class="fas fa-clock"></i>
        <span>${offer.categories.includes('Quick') ? '5-15 min' : 'Varies'}</span>
      </div>
    </div>
    <a href="offer.html?id=${encodeURIComponent(offer.id)}" class="offer-btn">View Offer</a>
  `;
  return card;
}

function renderOffers(list, container) {
  container.innerHTML = '';
  if (!list.length) {
    container.innerHTML = '<p class="muted">No offers match your search or filters.</p>';
    return;
  }
  const frag = document.createDocumentFragment();
  list.forEach(o => frag.appendChild(createCard(o)));
  container.appendChild(frag);
}

function applyFilters(offers, query, category) {
  const q = (query || '').trim().toLowerCase();
  return offers.filter(o => {
    if (category && category !== 'all' && !o.categories.includes(category)) return false;
    if (!q) return true;
    return (
      o.title.toLowerCase().includes(q) ||
      (o.description || '').toLowerCase().includes(q) ||
      (o.tags || []).join(' ').toLowerCase().includes(q)
    );
  });
}

async function initOffersPage() {
  const offers = await loadOffers();
  const container = document.getElementById('offersGrid');
  const search = document.getElementById('offerSearch');
  const category = document.getElementById('offerCategory');

  // Populate categories
  const categories = new Set();
  offers.forEach(o => (o.categories || []).forEach(c => categories.add(c)));
  category.innerHTML = '<option value="all">All Categories</option>' + [...categories].map(c => `<option value="${c}">${c}</option>`).join('');

  // initial render
  renderOffers(offers, container);

  // events
  let last = 0;
  search.addEventListener('input', () => {
    // simple debounce
    const now = Date.now();
    if (now - last < 120) return; last = now;
    const results = applyFilters(offers, search.value, category.value);
    renderOffers(results, container);
  });

  category.addEventListener('change', () => {
    const results = applyFilters(offers, search.value, category.value);
    renderOffers(results, container);
  });
}

async function initOfferDetail() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const offers = await loadOffers();
  const offer = offers.find(o => o.id === id);
  const container = document.getElementById('offerDetail');
  if (!offer) {
    container.innerHTML = '<p style="color: var(--text-secondary);">Offer not found.</p>';
    return;
  }
  container.innerHTML = `
    <div class="offer-detail-header">
      <div class="offer-detail-icon">
        <i class="${offer.categories.includes('Survey') ? 'fas fa-clipboard' : offer.categories.includes('App') ? 'fas fa-mobile-alt' : offer.categories.includes('Video') ? 'fas fa-play-circle' : 'fas fa-gift'}"></i>
      </div>
      <div>
        <h1 class="offer-detail-title">${offer.title}</h1>
        <div class="offer-detail-reward">${offer.payout}</div>
      </div>
    </div>
    <p class="offer-detail-description">${offer.description}</p>
    <div class="offer-detail-specs">
      <div class="spec-item">
        <div class="spec-label">Provider</div>
        <div class="spec-value">${offer.provider}</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">Category</div>
        <div class="spec-value">${offer.categories.join(', ')}</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">Requirements</div>
        <div class="spec-value">${offer.requirements}</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">Time</div>
        <div class="spec-value">${offer.categories.includes('Quick') ? '5-15 min' : 'Varies'}</div>
      </div>
    </div>
    <div class="offer-detail-actions">
      <a class="offer-detail-btn" target="_blank" rel="noopener noreferrer" href="${offer.url}">Open Offer</a>
      <a href="offers.html" class="btn-secondary">Back to Offers</a>
    </div>
    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 24px;">
      <strong>Note:</strong> This site is in Early Access. Offers are listed for demonstration purposes. Please follow provider terms and conditions. We are not responsible for third-party content.
    </p>
  `;
}

// Auto-init depending on page
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('offersGrid')) initOffersPage();
  if (document.getElementById('offerDetail')) initOfferDetail();
});
