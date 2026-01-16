// Base items reference
const ITEM_REFERENCE = {
  "routeur": 60,
  "switch": 40,
  "caméra": 70,
  "nas": 200,
  "disque dur": 80,
  "ssd": 100,
  "pc": 600,
  "alimentation": 50,
  "câble": 5,
  "ondulateur": 150,
  "bornes wifi": 120
};

// Format en € FR
function formatCurrency(n){ return (Math.round(n*100)/100).toLocaleString("fr-FR",{style:"currency",currency:"EUR"}); }

// Parse textarea
function parseItemsText(text){
  const lines = text.split(/\n/).map(l=>l.trim()).filter(Boolean);
  const items = [];
  for(let ln of lines){
    if(ln.includes(";")){
      const [name, priceStr, qtyStr]=ln.split(";").map(s=>s.trim());
      const price=parseFloat(priceStr.replace(/[^0-9.,-]/g,"").replace(",",".")||0);
      const qty=parseInt(qtyStr)||1;
      items.push({name,price,qty});
      continue;
    }
    if(ln.includes("-")){
      const [name, priceStr]=ln.split("-").map(s=>s.trim());
      const price=parseFloat(priceStr.replace(/[^0-9.,-]/g,"").replace(",",".")||0);
      items.push({name,price,qty:1});
      continue;
    }
    const numberMatch=ln.match(/([0-9]+(?:[.,][0-9]+)?)/);
    if(numberMatch){
      const price=parseFloat(numberMatch[1].replace(",",".")||0);
      const name=ln.replace(numberMatch[0],"").replace(/[()\-:\/]/g,"").trim()||"Matériel";
      items.push({name,price,qty:1});
      continue;
    }
    const key=ln.toLowerCase();
    const refKey=Object.keys(ITEM_REFERENCE).find(k=>key.includes(k));
    const price=refKey? ITEM_REFERENCE[refKey]:0;
    items.push({name:ln,price,qty:1});
  }
  return items;
}

// Calculer devis
const calcBtn=document.getElementById("calcBtn");
if(calcBtn){
  calcBtn.addEventListener("click",()=>{
    const text=document.getElementById("itemsInput").value;
    const items=parseItemsText(text);
    let total=0;
    let html="<ul>";
    for(let item of items){
      const subtotal=item.price*item.qty;
      total+=subtotal;
      html+=`<li>${item.name} x ${item.qty} = ${formatCurrency(subtotal)}</li>`;
    }
    html+="</ul>";
    html+=`<strong>Total: ${formatCurrency(total)}</strong>`;
    document.getElementById("result").innerHTML=html;
  });
}
