// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Reveal on scroll
const els = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add("visible");
  });
}, { threshold: 0.12 });
els.forEach(el => io.observe(el));

// Active nav link
const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav-link")];

const setActive = () => {
  const y = window.scrollY + 140;
  let current = sections[0]?.id;

  for (const s of sections) {
    if (s.offsetTop <= y) current = s.id;
  }

  navLinks.forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
  });
};
window.addEventListener("scroll", setActive, { passive: true });
setActive();

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const sideNav = document.getElementById("sideNav");
const backdrop = document.getElementById("backdrop");

function openMenu() {
  sideNav.classList.add("open");
  backdrop.classList.add("show");
  menuBtn.setAttribute("aria-expanded", "true");
}
function closeMenu() {
  sideNav.classList.remove("open");
  backdrop.classList.remove("show");
  menuBtn.setAttribute("aria-expanded", "false");
}

menuBtn?.addEventListener("click", () => {
  if (sideNav.classList.contains("open")) closeMenu();
  else openMenu();
});
backdrop?.addEventListener("click", closeMenu);
navLinks.forEach(a => a.addEventListener("click", () => {
  // close on mobile after click
  if (window.matchMedia("(max-width: 760px)").matches) closeMenu();
}));

// "Form" opens a mailto with prefilled content
const mailtoBtn = document.getElementById("mailtoBtn");
mailtoBtn?.addEventListener("click", () => {
  const name = encodeURIComponent(document.getElementById("name").value || "");
  const city = encodeURIComponent(document.getElementById("city").value || "");
  const type = encodeURIComponent(document.getElementById("type").value || "Demande");
  const msg = encodeURIComponent(document.getElementById("msg").value || "");

  const subject = `Demande LDA Hardware — ${type}`;
  const body =
`Bonjour,
Nom : ${decodeURIComponent(name) || "[ton nom]"}
Ville : ${decodeURIComponent(city) || "[ta ville]"} (10 km max Embreville)
Type : ${decodeURIComponent(type)}

Message :
${decodeURIComponent(msg) || "Explique ici ton problème / ton projet (config, symptômes, budget si montage)"} 

Merci !`;

  const href = `mailto:lorenzodelaunay@icloud.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
});
