/*!
 * Portfolio Nathan - Page Changelog
 * Copyright (C) 2025 Nathan
 * Licensed under the GNU General Public License v3.0
 * You should have received a copy of the GNU GPL along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */
console.log("%c© 2025 - Nathan The Coder", "background: #282c34; color: #98c379; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cChangelog - Nathan The Coder", "background: #282c34; color: #61afef; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cChangelog de Nathan : découvre toutes les mises à jour et nouveautés de mon portfolio et projets web.","background: #282c34; color: #61dafb; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%chttps://nathan-the-coder.netlify.app/changelog", "background: #282c34; color: #e06c75; padding: .5em 1em; border-radius: 5px; font-weight: bold;");

// === Dernière mise à jour ===
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

document.addEventListener("DOMContentLoaded", afficherDerniereMaj)

async function fetchChangelog() {
  try {
    const res = await fetch("/.netlify/functions/get-changelog"); 
    if (!res.ok) throw new Error("Erreur fetch changelog");

    const data = await res.json();
    const container = document.getElementById('changelog-section');
    container.innerHTML = '';

    if (!data || data.length === 0) {
      container.innerHTML = `<article class="glass-card"><h2>Aucun changelog...</h2></article>`;
      return;
    }

    data.forEach(entry => {
      const dateStr = entry.date ? new Date(entry.date).toLocaleDateString('fr-FR') : 'À venir';
      const article = document.createElement('article');
      article.className = 'glass-card';
      article.innerHTML = `<h2>${dateStr}</h2><p>${entry.description.replace(/\n/g, '<br>')}</p>`;
      container.appendChild(article);
    });
  } catch (err) {
    console.error("Erreur fetch changelog:", err);
  }
}

fetchChangelog()
setInterval(fetchChangelog, 5000)

// === Easter Egg Confetti ===
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'c') {
        launchEpicConfetti();
    }
});

function launchEpicConfetti() {
    const confettiCount = 200; // beaucoup de confettis
    const colors = ['#c3e88d', '#a48aec', '#61afef', '#ffcb6b', '#ec4185', '#f07178', '#89ddff'];

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = Math.random() * 12 + 8 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.top = '-30px';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0%';
        confetti.style.opacity = 0.9;
        confetti.style.zIndex = 9999;
        confetti.style.pointerEvents = 'none';
        confetti.style.boxShadow = `0 0 10px ${confetti.style.backgroundColor}`; // effet glow

        document.body.appendChild(confetti);

        const speedY = 2 + Math.random() * 5;
        const speedX = Math.random() * 4 - 2;
        const rotateSpeed = Math.random() * 12 - 6;
        const bounce = Math.random() * 0.5 + 0.5;
        confetti._rotate = Math.random() * 360;

        const fall = setInterval(() => {
            let top = parseFloat(confetti.style.top);
            let left = parseFloat(confetti.style.left);
            confetti._rotate += rotateSpeed;

            confetti.style.top = top + speedY + 'px';
            confetti.style.left = left + speedX + 'px';
            confetti.style.transform = `rotate(${confetti._rotate}deg)`;

            // Rebond léger quand touche le bas
            if (top > window.innerHeight - 5) {
                confetti.style.top = window.innerHeight - 5 - bounce;
                confetti.style.opacity = 0;
            }

            if (top > window.innerHeight) {
                confetti.remove();
                clearInterval(fall);
            }
        }, 16);
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

  function pingBot() {
    fetch("https://ton-bot.onrender.com/ping") // remplace par l'URL de ton bot Render
      .then(() => console.log("Bot pinged!"))
      .catch(err => console.error("Erreur ping bot :", err));
  }

  // Ping toutes les 5 minutes
  setInterval(pingBot, 5 * 60 * 1000);

  // Ping immédiat au chargement de la page
  pingBot();
