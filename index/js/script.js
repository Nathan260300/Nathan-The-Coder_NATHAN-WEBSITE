/*!
 * Portfolio Nathan - Page Accueil
 * Copyright (C) 2025 Nathan
 * Licensed under the GNU General Public License v3.0
 * You should have received a copy of the GNU GPL along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */
console.log("%c© 2025 - Nathan The Coder", "background: #282c34; color: #98c379; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cAccueil - Nathan The Coder", "background: #282c34; color: #61afef; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cPortfolio de Nathan, collégien et développeur passionné. Découvrez mes projets web, mon blog et mes compétences !","background: #282c34; color: #61dafb; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%chttps://nathan-the-coder.netlify.app", "background: #282c34; color: #e06c75; padding: .5em 1em; border-radius: 5px; font-weight: bold;");

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

  function pingBot() {
    fetch("https://ton-bot.onrender.com/ping") // remplace par l'URL de ton bot Render
      .then(() => console.log("Bot pinged!"))
      .catch(err => console.error("Erreur ping bot :", err));
  }

  // Ping toutes les 5 minutes
  setInterval(pingBot, 5 * 60 * 1000);

  // Ping immédiat au chargement de la page
  pingBot();