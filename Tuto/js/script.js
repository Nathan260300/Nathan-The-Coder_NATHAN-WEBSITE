/*!
 * Portfolio Nathan - Page Tutos
 * Copyright (C) 2025 Nathan
 * Licensed under the GNU General Public License v3.0
 */
console.log("%c© 2025 - Nathan The Coder", "background: #282c34; color: #98c379; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cTutos - Nathan The Coder", "background: #282c34; color: #61afef; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cTuto de Nathan : découvre des tutoriels complets et détaillés de Nathan, incluant des extraits de code et des conseils pratiques.","background: #282c34; color: #61dafb; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%chttps://nathan-the-coder.netlify.app/tuto", "background: #282c34; color: #e06c75; padding: .5em 1em; border-radius: 5px; font-weight: bold;");

async function afficherDerniereMaj() {
  try {
    const res = await fetch("/.netlify/functions/get-last-update");
    const data = await res.json();

    const el = document.getElementById("last-update");

    if (!data.dernier_maj) {
      if (el) el.innerHTML = "<strong>Last update :</strong> erreur";
      return;
    }

    const date = new Date(data.dernier_maj);
    const jour = String(date.getDate()).padStart(2, "0");
    const mois = String(date.getMonth() + 1).padStart(2, "0");
    const annee = date.getFullYear();
    const dateFormatee = `${jour}/${mois}/${annee}`;

    if (el) el.innerHTML = `<strong>Last update :</strong> ${dateFormatee}`;

    console.log(
      `%cMade with 🕑 and 💖 by Nathan J. – Last update : ${dateFormatee}`,
      "background: #282c34; color: #c678dd; padding: .5em 1em; border-radius: 5px; font-weight: bold;"
    );
  } catch (err) {
    console.error("Erreur fetch :", err);
  }
}

document.addEventListener("DOMContentLoaded", afficherDerniereMaj);

async function fetchTuto() {
  try {
    const res = await fetch("/.netlify/functions/get-tutos");
    const data = await res.json();

    const container = document.getElementById('tutos-container');
    if (!data || data.length === 0) {
      container.innerHTML = `<article class="glass-card"><h2>Aucun tuto...</h2><p>Aucun tuto a été trouvé.</p></article>`;
      return;
    }

    const today = new Date(); today.setHours(0,0,0,0);

    container.innerHTML = '';
    data.filter(tuto => {
      const articleDate = new Date(tuto.created_at); articleDate.setHours(0,0,0,0);
      return articleDate <= today;
    }).forEach(tuto => {
      const card = document.createElement('article');
      const date = new Date(tuto.created_at).toLocaleDateString('fr-FR');
      card.className = 'glass-card';
      card.style.cursor = 'pointer';
      card.innerHTML = `
        <h2>${tuto.title} <span class="type">${tuto.type}</span></h2>
        <span class="date">${date}</span>
        <p>${tuto.short_description}</p>
      `;
      card.addEventListener('click', () => openModal(tuto));
      container.appendChild(card);
    });
  } catch(err) {
    console.error('Erreur fetch:', err);
  }
}

// === Modal ===
const modal = document.getElementById('tutos-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalDate = document.getElementById('modal-date');
const modalClose = modal.querySelector('.close');

modalClose.onclick = () => modal.style.display = 'none';
document.addEventListener('keydown', e => { if(e.key==='Escape') modal.style.display='none'; });

function openModal(tuto) {
  modalTitle.innerHTML = `${tuto.title} <span class="type">${tuto.type}</span>`;
  modalDate.textContent = new Date(tuto.created_at).toLocaleDateString('fr-FR');

  // Formatage [code]...[/code] en <code>
  function formatCodeBlocks(text) {
    return text.replace(/\[code\]([\s\S]*?)\[\/code\]/g, (match, p1) => {
      const safeCode = p1
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      return `<code>${safeCode}</code>`;
    });
  }

  modalDescription.innerHTML = formatCodeBlocks(tuto.full_description);
  modal.style.display = 'flex';
}

// Menu flottant
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.floating-menu');
toggle.addEventListener('click', () => {
  menu.classList.toggle('open');
  if(menu.classList.contains('open')) setTimeout(()=>menu.classList.remove('open'),5000);
});

// === Lancement ===
document.addEventListener('DOMContentLoaded', fetchTuto);
setInterval(fetchTuto, 5000);

function pingBot() {
  fetch("https://nathan-the-coder-bot-discord.onrender.com/ping") 
    .then(() => console.log(
      `%cBot Discord Ping !`,
      "background: #282c34; color: #e06c75; padding: .5em 1em; border-radius: 5px; font-weight: bold;"
    ))
    .catch(err => console.error("Erreur ping bot :", err));
}

setInterval(pingBot, 5 * 60 * 1000);
pingBot();
