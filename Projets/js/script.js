/*!
 * Portfolio Nathan - Page Tutos
 * Copyright (C) 2025 Nathan
 * Licensed under the GNU General Public License v3.0
 */
console.log("%c© 2025 - Nathan The Coder", "background: #282c34; color: #98c379; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cTutos - Nathan The Coder", "background: #282c34; color: #61afef; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cTuto de Nathan : découvre des tutoriels complets et détaillés de Nathan, incluant des extraits de code et des conseils pratiques.","background: #282c34; color: #61dafb; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%chttps://nathan-the-coder.netlify.app/tuto", "background: #282c34; color: #e06c75; padding: .5em 1em; border-radius: 5px; font-weight: bold;");

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

// === Récupération et affichage des articles du tutos ===
async function fetchTuto() {
  const { data, error } = await supabase
    .from('tutos')
    .select('*')
    .order('created_at', { ascending: false });

  const container = document.getElementById('tutos-container');

  if (error) {
    console.error('Erreur Supabase:', error);
    container.innerHTML = '<article class="glass-card"><h2>Erreur</h2><p>Une erreur est survenue lors du chargement des données.</p></article>';
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = `<article class="glass-card"><h2>Aucun tuto...</h2><p>Aucun tuto a été trouvé.</p></article>`;
    return;
  }

  // 🕐 Date du jour en LOCAL, sans l’heure
  const today = new Date();
  today.setHours(0, 0, 0, 0); // on remet à minuit

  // 🧩 Filtrage : articles dont la date (locale) <= aujourd’hui
  const filtered = data.filter(tutos => {
    const articleDate = new Date(tutos.created_at);
    articleDate.setHours(0, 0, 0, 0);
    return articleDate <= today;
  });

  container.innerHTML = '';

  filtered.forEach(tutos => {
    const card = document.createElement('article');
    const date = new Date(tutos.created_at).toLocaleDateString('fr-FR');
    card.className = 'glass-card';
    card.style.cursor = 'pointer';
    card.innerHTML = `
      <h2>${tutos.title}<span class="type">${tutos.type}</span>
</h2>
      <span class="date">${date}</span>
      <p>${tutos.short_description}</p>
    `;
    card.addEventListener('click', () => openModal(tutos));
    container.appendChild(card);
  });
}

// === Modal ===
const modal = document.getElementById('tutos-modal')
const modalTitle = document.getElementById('modal-title')
const modalDescription = document.getElementById('modal-description')
const modalDate = document.getElementById('modal-date')
const modalType = document.getElementById('modal-type')
const modalClose = modal.querySelector('.close')

modalClose.onclick = () => modal.style.display = 'none'
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') modal.style.display = 'none'
})

async function openModal(tutos) {
  modalTitle.innerHTML = `${tutos.title} <span id="modal-type">${tutos.type}</span>`;
  modalDate.textContent = new Date(tutos.created_at).toLocaleDateString('fr-FR')
// Fonction pour échapper les caractères HTML
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[tag]));
}

function formatCodeBlocks(text) {
  // Remplace les [code]...[/code] par des <pre><code>...</code></pre>
  return text.replace(/\[code\]([\s\S]*?)\[\/code\]/g, (match, p1) => {
    // Échapper le contenu du code, pour pas que le HTML à l'intérieur s'affiche
    const safeCode = p1
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    return `<pre><code>${safeCode}</code></pre>`;
  });
}
modalDescription.innerHTML = formatCodeBlocks(tutos.full_description);

  modal.style.display = 'flex'
}

// === Lancement ===
document.addEventListener('DOMContentLoaded', fetchTuto)
setInterval(fetchTuto, 5000)
