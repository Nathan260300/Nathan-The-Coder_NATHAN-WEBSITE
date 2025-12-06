/*!
 * Portfolio Nathan - Page 404
 * Copyright (C) 2025 Nathan
 * Licensed under the GNU General Public License v3.0
 * You should have received a copy of the GNU GPL along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */
console.log("%c© 2025 - Nathan The Coder", "background: #282c34; color: #98c379; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%c404 - Nathan The Coder", "background: #282c34; color: #61afef; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%c404 Not Found : Tu t'es trompé de page !","background: #282c34; color: #61dafb; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%chttps://nathan-the-coder.netlify.app/?", "background: #282c34; color: #e06c75; padding: .5em 1em; border-radius: 5px; font-weight: bold;");

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

document.addEventListener("DOMContentLoaded", afficherDerniereMaj)

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
