async function loadOffers() {
  try {
    const res = await fetch('/offers.json');
    if (!res.ok) throw new Error('Could not load offers.json');
    const offers = await res.json();
    return offers;
  } catch (err) {
    console.error(err);
    return [];
  }
}

function createCard(offer) {
  const card = document.createElement('article');
  card.className = 'offer-card';
  card.innerHTML = `
    <a class="offer-link" href="offer.html?id=${encodeURIComponent(offer.id)}" aria-label="Open ${offer.title}">
      <div class="offer-thumb"><img src="${offer.image}" alt="${offer.title}"></div>
      <div class="offer-body">
        <h3 class="offer-title">${offer.title}</h3>
        <p class="offer-provider">${offer.provider} · <span class="offer-payout">${offer.payout}</span></p>
        <p class="offer-cats">${offer.categories.join(' · ')}</p>
      </div>
    </a>
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
    container.innerHTML = '<p class="muted">Offer not found.</p>';
    return;
  }
  container.innerHTML = `
    <div class="detail-card">
      <div class="detail-thumb"><img src="${offer.image}" alt="${offer.title}"></div>
      <div class="detail-body">
        <h1>${offer.title}</h1>
        <p class="muted">Provider: ${offer.provider} · Categories: ${offer.categories.join(', ')}</p>
        <p class="offer-desc">${offer.description}</p>
        <p><strong>Requirements:</strong> ${offer.requirements}</p>
        <p><strong>Payout:</strong> ${offer.payout}</p>
        <a class="btn-primary" target="_blank" rel="noopener noreferrer" href="${offer.url}">Open Offer</a>
        <p class="muted small">Note: This site is in Early Access. Offers are listed for demonstration; follow provider terms. We are not responsible for third-party content.</p>
      </div>
    </div>
  `;
}

// Auto-init depending on page
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('offersGrid')) initOffersPage();
  if (document.getElementById('offerDetail')) initOfferDetail();
});
