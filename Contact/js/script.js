/*! 
 * Portfolio Nathan - Page Contact
 * Copyright (C) 2025 Nathan
 * Licensed under the GNU General Public License v3.0
 */
console.log("%c© 2025 - Nathan The Coder", "background: #282c34; color: #98c379; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cContact - Nathan The Coder", "background: #282c34; color: #61afef; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cContacte Nathan pour poser tes questions, envoyer des suggestions ou simplement dire bonjour.","background: #282c34; color: #61dafb; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%chttps://nathan-the-coder.netlify.app/contact", "background: #282c34; color: #e06c75; padding: .5em 1em; border-radius: 5px; font-weight: bold;");

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

// === Formulaire contact ===
document.addEventListener("DOMContentLoaded", () => {
  afficherDerniereMaj();

  const form = document.getElementById('contactForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !message) {
      alert("Le nom et le message sont obligatoires !");
      return;
    }

    try {
      const res = await fetch("/.netlify/functions/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Message envoyé avec succès !");
        form.reset();
      } else {
        console.error(data.error);
        alert("Erreur lors de l'envoi du message.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi du message.");
    }
  });

  // === Menu toggle ===
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.floating-menu');

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    if (menu.classList.contains('open')) {
      setTimeout(() => menu.classList.remove('open'), 5000);
    }
  });
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