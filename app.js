const STOCK_FILE = 'stock.json';

async function loadStock() {
  const response = await fetch(STOCK_FILE);
  if (!response.ok) throw new Error('Impossible de charger le stock');
  return response.json();
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function normalize(text) {
  return (text || '').toString().trim().toLowerCase();
}

function stockBadge(quantity) {
  if (quantity <= 2) {
    return '<span class="badge low">Stock faible</span>';
  }
  return '<span class="badge ok">Stock OK</span>';
}

function goToBox(id) {
  if (!id) return;
  window.location.href = `box.html?id=${encodeURIComponent(id)}`;
}

async function initHomePage() {
  const listEl = document.getElementById('boxList');
  const statsEl = document.getElementById('stats');
  const filterInput = document.getElementById('filterInput');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');

  if (!listEl || !statsEl) return;

  const data = await loadStock();

  const renderStats = () => {
    const totalBoxes = data.length;
    const totalUnits = data.reduce((sum, box) => sum + (box.quantity || 0), 0);
    const lowStock = data.filter(box => (box.quantity || 0) <= 2).length;
    const zones = new Set(data.map(box => box.location)).size;

    statsEl.innerHTML = `
      <div class="stat-box"><strong>${totalBoxes}</strong> boîtes référencées</div>
      <div class="stat-box"><strong>${totalUnits}</strong> unités en stock</div>
      <div class="stat-box"><strong>${lowStock}</strong> boîtes en stock faible</div>
      <div class="stat-box"><strong>${zones}</strong> zones de rangement</div>
    `;
  };

  const renderList = (items) => {
    if (!items.length) {
      listEl.innerHTML = '<div class="empty">Aucune boîte trouvée.</div>';
      return;
    }

    listEl.innerHTML = items.map(box => `
      <div class="box-item">
        <h3>${box.id} — ${box.name}</h3>
        <p><strong>Lieu :</strong> ${box.location}</p>
        <p><strong>Contenu :</strong> ${box.content}</p>
        <p><strong>Quantité :</strong> ${box.quantity}</p>
        ${stockBadge(box.quantity)}
        <div style="margin-top:12px">
          <button onclick="goToBox('${box.id.replace(/'/g, "&#39;")}')">Ouvrir</button>
        </div>
      </div>
    `).join('');
  };

  renderStats();
  renderList(data);

  filterInput?.addEventListener('input', () => {
    const term = normalize(filterInput.value);
    const filtered = data.filter(box =>
      [box.id, box.name, box.location, box.content].some(value => normalize(value).includes(term))
    );
    renderList(filtered);
  });

  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    goToBox(searchInput.value.trim());
  });
}

async function initBoxPage() {
  const detailEl = document.getElementById('boxDetail');
  if (!detailEl) return;

  const scannedId = getQueryParam('id');
  const data = await loadStock();
  const box = data.find(item => normalize(item.id) === normalize(scannedId));

  if (!scannedId) {
    detailEl.innerHTML = `
      <h2>Aucun identifiant reçu</h2>
      <p>Ajoute <code>?id=BX-001</code> dans l’URL ou scanne un code-barres configuré avec cette adresse.</p>
    `;
    return;
  }

  if (!box) {
    detailEl.innerHTML = `
      <h2>Boîte introuvable</h2>
      <p>Aucune boîte ne correspond à l’identifiant <code>${scannedId}</code>.</p>
      <p>Vérifie le code-barres ou le fichier <code>stock.json</code>.</p>
    `;
    return;
  }

  detailEl.innerHTML = `
    <h2>${box.id} — ${box.name}</h2>
    <p>${box.description || 'Aucune description.'}</p>
    ${stockBadge(box.quantity)}

    <div class="detail-grid">
      <div>
        <h3>Emplacement</h3>
        <p>${box.location}</p>
      </div>
      <div>
        <h3>Contenu</h3>
        <p>${box.content}</p>
      </div>
      <div>
        <h3>Quantité</h3>
        <p>${box.quantity}</p>
      </div>
      <div>
        <h3>Dernière mise à jour</h3>
        <p>${box.updatedAt || 'Non renseignée'}</p>
      </div>
    </div>
  `;
}

initHomePage().catch(console.error);
initBoxPage().catch(console.error);
