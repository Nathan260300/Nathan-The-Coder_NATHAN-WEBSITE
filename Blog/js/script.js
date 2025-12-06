/*!
 * Portfolio Nathan - Page Blog
 * Copyright (C) 2025 Nathan
 * Licensed under the GNU General Public License v3.0
 */
console.log("%c© 2025 - Nathan The Coder", "background: #282c34; color: #98c379; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cBlog - Nathan The Coder", "background: #282c34; color: #61afef; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cBlog de Nathan : découvre mes articles, astuces web et réflexions sur le développement et la création numérique.","background: #282c34; color: #61dafb; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%chttps://nathan-the-coder.netlify.app/blog", "background: #282c34; color: #e06c75; padding: .5em 1em; border-radius: 5px; font-weight: bold;");

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

async function fetchBlog() {
  try {
    const res = await fetch("/.netlify/functions/get-blog");
    const data = await res.json();

    const container = document.getElementById('blog-container');
    if (!data || data.length === 0) {
      container.innerHTML = `<article class="glass-card"><h2>Aucun article...</h2><p>Aucun article a été trouvé.</p></article>`;
      return;
    }

    const today = new Date(); today.setHours(0,0,0,0);

    container.innerHTML = '';
    data.filter(blog => {
      const articleDate = new Date(blog.created_at); articleDate.setHours(0,0,0,0);
      return articleDate <= today;
    }).forEach(blog => {
      const card = document.createElement('article');
      const date = new Date(blog.created_at).toLocaleDateString('fr-FR');
      card.className = 'glass-card';
      card.style.cursor = 'pointer';
      card.innerHTML = `<h2>${blog.title}</h2><span class="date">${date}</span><p>${blog.short_description}</p>`;
      card.addEventListener('click', () => openModal(blog));
      container.appendChild(card);
    });
  } catch(err) {
    console.error('Erreur fetch:', err);
  }
}

// === Modal ===
const modal = document.getElementById('blog-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalDate = document.getElementById('modal-date');
const modalImg1 = document.getElementById('modal-img1');
const modalImg2 = document.getElementById('modal-img2');
const modalClose = modal.querySelector('.close');

modalClose.onclick = () => modal.style.display = 'none';
document.addEventListener('keydown', e => { if(e.key==='Escape') modal.style.display='none'; });

function openModal(blog) {
  modalTitle.textContent = blog.title;
  modalDate.textContent = new Date(blog.created_at).toLocaleDateString('fr-FR');
  modalDescription.innerHTML = blog.full_description;
  modalImg1.src = blog.image1_path;
  modalImg2.src = blog.image2_path;
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
document.addEventListener('DOMContentLoaded', fetchBlog);
setInterval(fetchBlog, 5000);

  function pingBot() {
    fetch("https://ton-bot.onrender.com/ping") // remplace par l'URL de ton bot Render
      .then(() => console.log("Bot pinged!"))
      .catch(err => console.error("Erreur ping bot :", err));
  }

  // Ping toutes les 5 minutes
  setInterval(pingBot, 5 * 60 * 1000);

  // Ping immédiat au chargement de la page
  pingBot();