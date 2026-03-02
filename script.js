import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://aecifmxziwddaqihjjey.supabase.co'
  const supabaseKey = 'sb_publishable_Kq-2FsEdgffq0bMt-zfXZg_TbiOJcdP'
const supabase = createClient(supabaseUrl, supabaseKey)

async function insertAllCodes() {
  // Génère les 47 codes
  const codes = []
  for (let i = 1; i <= 47; i++) {
    codes.push({ code_boite: `BX-${i.toString().padStart(3, '0')}` })
  }

  // Insère chaque code si non existant
  for (const item of codes) {
    // Vérifie si le code existe déjà
    const { data: exists } = await supabase
      .from('boites')
      .select('code_boite')
      .eq('code_boite', item.code_boite)
      .single()

    if (!exists) {
      await supabase.from('boites').insert(item)
      console.log(`Ajouté : ${item.code_boite}`)
    } else {
      console.log(`Existe déjà : ${item.code_boite}`)
    }
  }
}

// Appelle la fonction au chargement du site (ou clique d’un bouton)
insertAllCodes()
