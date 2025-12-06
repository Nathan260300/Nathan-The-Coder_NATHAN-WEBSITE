/*!
 * Portfolio Nathan - Page Projets
 * Copyright (C) 2025 Nathan
 * Licensed under the GNU General Public License v3.0
 */
console.log("%c© 2025 - Nathan The Coder", "background: #282c34; color: #98c379; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cProjets - Nathan The Coder", "background: #282c34; color: #61afef; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cProjets de Nathan : découvre mes créations web, dashboards et sites animés.","background: #282c34; color: #61dafb; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%chttps://nathan-the-coder.netlify.app/projets", "background: #282c34; color: #e06c75; padding: .5em 1em; border-radius: 5px; font-weight: bold;");

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

async function fetchProjects() {
  try {
    const res = await fetch("/.netlify/functions/get-projects");
    const data = await res.json();

    const container = document.getElementById("projects-container");

    if (!data || data.length === 0) {
      container.innerHTML = `<article class="glass-card"><h2>Aucun projet...</h2><p>Aucun projet trouvé.</p></article>`;
      return;
    }

    container.innerHTML = "";

    data.forEach(project => {
      const card = document.createElement("article");
      card.className = "glass-card";
      card.style.cursor = "pointer";
      card.innerHTML = `
        <h2>${project.title}</h2>
        <p>${project.short_description}</p>
      `;
      card.addEventListener("click", () => openModal(project));
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Erreur fetch:", err);
  }
}

const modal = document.getElementById('project-modal')
const modalTitle = document.getElementById('modal-title')
const modalDescription = document.getElementById('modal-description')
const modalLink = document.getElementById('modal-link')
const modalImg1 = document.getElementById('modal-img1')
const modalImg2 = document.getElementById('modal-img2')
const modalClose = modal.querySelector('.close')

modalClose.onclick = () => modal.style.display = 'none'

document.addEventListener('keydown', e => {
  if(e.key === 'Escape') modal.style.display = 'none'
})

function openModal(project) {
  modalTitle.textContent = project.title
  modalDescription.innerHTML = project.full_description
  if(project.link){
    modalLink.href = project.link
    modalLink.style.display = 'inline-block'
  } else {
    modalLink.style.display = 'none'
  }
  modalImg1.src = project.image1_path 
  modalImg2.src = project.image2_path
  modal.style.display = 'flex'
}

// === Lancement ===
document.addEventListener('DOMContentLoaded', fetchProjects)
setInterval(fetchProjects, 5000)

// Menu toggle
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.floating-menu');

toggle.addEventListener('click', () => {
  menu.classList.toggle('open');
  if (menu.classList.contains('open')) {
    setTimeout(() => menu.classList.remove('open'), 5000);
  }
});                                    

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
