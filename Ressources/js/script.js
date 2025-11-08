/*!
 * Portfolio Nathan - Page Ressources
 * Copyright (C) 2025 Nathan
 * Licensed under the GNU General Public License v3.0
 */
console.log("%c© 2025 - Nathan The Coder", "background: #282c34; color: #98c379; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cRessources - Nathan The Coder", "background: #282c34; color: #61afef; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cRessources utiles pour le développement web : outils, sites, extensions et APIs recommandés par Nathan.","background: #282c34; color: #61dafb; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%chttps://nathan-the-coder.netlify.app/ressources", "background: #282c34; color: #e06c75; padding: .5em 1em; border-radius: 5px; font-weight: bold;");

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://hscsixqyszamzayemyra.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzY3NpeHF5c3phbXpheWVteXJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NTc5ODAsImV4cCI6MjA3NzQzMzk4MH0.1wsFzRo2kqT_98mmpFUntHYrrR3EPjc6HoXKnc_8Rr4'
const supabase = createClient(supabaseUrl, supabaseKey)

async function afficherDerniereMaj() {
  const { data, error } = await supabase
    .from('site_info')
    .select('dernier_maj')
    .eq('id', 1)
    .single()

  const el = document.getElementById('last-update')

  if (error) {
    console.error('Erreur Supabase:', error)
    if (el) el.innerHTML = "<strong>Last update :</strong> erreur"
    return
  }

  const date = new Date(data.dernier_maj)
  const jour = String(date.getDate()).padStart(2, '0')
  const mois = String(date.getMonth() + 1).padStart(2, '0')
  const annee = date.getFullYear()
  const dateFormatee = `${jour}/${mois}/${annee}`

  if (el) el.innerHTML = `<strong>Last update :</strong> ${dateFormatee}`

  console.log(
    `%cMade with 🕑 and 💖 by Nathan J. – Last update : ${dateFormatee}`,
    "background: #282c34; color: #c678dd; padding: .5em 1em; border-radius: 5px; font-weight: bold;"
  )
}

document.addEventListener("DOMContentLoaded", afficherDerniereMaj)

// === Récupération et affichage des projets ===
async function fetchRessources() {
  const { data, error } = await supabase
    .from('ressources')
    .select('*')
    .order('created_at', { ascending: false });

  const container = document.getElementById('ressources-container');

  if (error) {
    console.error('Erreur Supabase:', error);
    container.innerHTML = '<article class="glass-card"><h2>Erreur</h2><p>Une erreur est survenue lors du chargement des données.</p></article>';
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = `<article class="glass-card"><h2>Aucun article...</h2><p>Aucun article a été trouvé.</p></article>`;
    return;
  }

  // 🕐 Date du jour en LOCAL, sans l’heure
  const today = new Date();
  today.setHours(0, 0, 0, 0); // on remet à minuit

  // 🧩 Filtrage : articles dont la date (locale) <= aujourd’hui
  const filtered = data.filter(ressources => {
    const articleDate = new Date(ressources.created_at);
    articleDate.setHours(0, 0, 0, 0);
    return articleDate <= today;
  });

  container.innerHTML = '';

  filtered.forEach(ressources => {
    const card = document.createElement('article');
    const date = new Date(ressources.created_at).toLocaleDateString('fr-FR');
    card.className = 'glass-card';
    card.style.cursor = 'pointer';
    card.innerHTML = `
      <h2>${ressources.title}</h2>
      <p>${ressources.short_description}</p>
    `;
    card.addEventListener('click', () => openModal(ressources));
    container.appendChild(card);
  });
}

// === Modal ===
const modal = document.getElementById('ressources-modal')
const modalTitle = document.getElementById('modal-title')
const modalDescription = document.getElementById('modal-description')
const modalLink = document.getElementById('modal-link')
const modalClose = modal.querySelector('.close')

modalClose.onclick = () => modal.style.display = 'none'
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') modal.style.display = 'none'
})

async function openModal(ressources) {
  modalTitle.textContent = ressources.title
  modalDescription.innerHTML = ressources.full_description
  if(ressources.link){
    modalLink.href = ressources.link
    modalLink.style.display = 'inline-block'
  } else {
    modalLink.style.display = 'none'
  }
  modal.style.display = 'flex'
}

const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.floating-menu');

toggle.addEventListener('click', () => {
  menu.classList.toggle('open');

  // Si le menu vient de s'ouvrir, lancer le timer pour le fermer
  if (menu.classList.contains('open')) {
    setTimeout(() => {
      menu.classList.remove('open');
    }, 5000); // 5000ms = 5 secondes
  }
});

// === Lancement ===
document.addEventListener('DOMContentLoaded', fetchRessources)
setInterval(fetchRessources, 5000)