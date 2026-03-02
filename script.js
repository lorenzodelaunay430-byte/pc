import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_PUBLIC_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

const searchInput = document.getElementById('searchInput')
const boxDetails = document.getElementById('boxDetails')

searchInput.addEventListener('input', async () => {
  const code = searchInput.value.trim()
  if (code.length === 0) {
    boxDetails.innerHTML = ''
    return
  }
  
  let { data, error } = await supabase
    .from('boites')
    .select('*')
    .eq('code_boite', code)
    .single()
    
  if (error || !data) {
    boxDetails.innerHTML = '<p>Boîte non trouvée</p>'
  } else {
    boxDetails.innerHTML = `
      <p><b>Code :</b> ${data.code_boite}</p>
      <p><b>Statut :</b> <input id="statut" value="${data.statut || ''}"></p>
      <p><b>Localisation :</b> <input id="localisation" value="${data.localisation || ''}"></p>
      <p><b>Défaut :</b> <input id="defaut" value="${data.defaut || ''}"></p>
      <p><b>Technicien :</b> <input id="technicien" value="${data.technicien || ''}"></p>
      <p><b>Date entrée :</b> <input type="date" id="date_entree" value="${data.date_entree ? data.date_entree.substring(0,10) : ''}"></p>
      <button id="saveBtn">Sauvegarder</button>
    `
    
    document.getElementById('saveBtn').onclick = async () => {
      const statut = document.getElementById('statut').value
      const localisation = document.getElementById('localisation').value
      const defaut = document.getElementById('defaut').value
      const technicien = document.getElementById('technicien').value
      const date_entree = document.getElementById('date_entree').value
      
      const { error } = await supabase
        .from('boites')
        .update({ statut, localisation, defaut, technicien, date_entree })
        .eq('code_boite', code)
      
      if (error) {
        alert('Erreur lors de la sauvegarde')
      } else {
        alert('Données sauvegardées avec succès')
      }
    }
  }
})
