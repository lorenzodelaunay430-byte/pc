import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://aecifmxziwddaqihjjey.supabase.co'
const supabaseKey = 'sb_publishable_Kq-2FsEdgffq0bMt-zfXZg_TbiOJcdP'
const supabase = createClient(supabaseUrl, supabaseKey)

const boxesGrid = document.getElementById('boxesGrid')
const searchInput = document.getElementById('searchInput')
const messageDiv = document.getElementById('message')

// Fonction pour extraire le code réel du scan
function extractBoxCode(scan) {
  // Majuscules et suppression des espaces
  const clean = scan.toUpperCase().replace(/\s/g,'')
  // Cherche BX001 à BX047 ou BX-001 à BX-047
  const match = clean.match(/BX-?0?([1-9]|[1-3][0-9]|4[0-7])/)
  if(match) {
    return 'BX-' + match[1].padStart(3,'0') // format standard BX-XXX
  }
  return null // rien trouvé
}

// Affiche les boîtes, filtrées si code fourni
async function displayBoxes(filterCode='') {
  let query = supabase.from('boite').select('*')
  if(filterCode) query = query.eq('code_boite', filterCode)
  const { data, error } = await query
  boxesGrid.innerHTML = ''
  if(error || !data.length) {
    boxesGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:red">Boîte non trouvée</p>'
    return
  }
  data.forEach(box => {
    const boxDiv = document.createElement('div')
    boxDiv.className = 'box'
    boxDiv.innerHTML = `
      <h3>${box.code_boite}</h3>
      <p>Localisation:</p>
      <select class="locSelect">
        <option value="">--</option>
        <option value="Stock">Stock</option>
        <option value="Atelier H">Atelier H</option>
      </select>
      <p>Statut:</p>
      <select class="statutSelect">
        <option value="">--</option>
        <option value="En stock">En stock</option>
        <option value="Non disponible">Non disponible</option>
      </select>
      <p>Défaut:</p>
      <input class="defautInput" type="text" placeholder="Défaut">
      <button>Sauvegarder</button>
    `
    // Remplir avec valeurs existantes
    boxDiv.querySelector('.locSelect').value = box.localisation || ''
    boxDiv.querySelector('.statutSelect').value = box.statut || ''
    boxDiv.querySelector('.defautInput').value = box.defaut || ''

    boxDiv.querySelector('button').onclick = async () => {
      const localisation = boxDiv.querySelector('.locSelect').value
      const statut = boxDiv.querySelector('.statutSelect').value
      const defaut = boxDiv.querySelector('.defautInput').value
      const { error } = await supabase.from('boite').update({ localisation, statut, defaut }).eq('code_boite', box.code_boite)
      if(error) {
        messageDiv.style.color = 'red'
        messageDiv.textContent = 'Erreur lors de la sauvegarde'
      } else {
        messageDiv.style.color = 'green'
        messageDiv.textContent = 'Sauvegardé avec succès'
      }
      setTimeout(()=>{messageDiv.textContent=''},2000)
    }

    boxesGrid.appendChild(boxDiv)
  })
}

// Détection directe du scan via Enter
searchInput.addEventListener('keypress', (e) => {
  if(e.key === 'Enter') {
    const code = extractBoxCode(searchInput.value)
    searchInput.value = '' // vide pour le prochain scan
    if(code) {
      displayBoxes(code)
    } else {
      boxesGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:red">Boîte non trouvée</p>'
    }
  }
})

// Optionnel : filtrage en tapant manuellement
searchInput.addEventListener('input', () => {
  const code = extractBoxCode(searchInput.value)
  if(code) displayBoxes(code)
})

// Affiche toutes les boîtes au départ
displayBoxes()
