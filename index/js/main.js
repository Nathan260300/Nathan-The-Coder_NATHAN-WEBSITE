/*!
 * Portfolio Nathan - dashboard et site
 * Copyright (C) 2025 Nathan
 * Licensed under the GNU General Public License v3.0
 * You should have received a copy of the GNU GPL along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */
// === Contenus complets colorés ===
const terminalCodes = {
  html: `<span class="tag">&lt;section</span> class="presentation"&gt;
  <span class="tag">&lt;article</span> class="metiers"&gt;
    <span class="tag">&lt;h2&gt;</span><span class="value">Développeur</span><span class="tag">&lt;/h2&gt;</span>
    <span class="text">Web et projets personnels</span>

    <span class="tag">&lt;h2&gt;</span><span class="value">Collégien passionné</span><span class="tag">&lt;/h2&gt;</span>
    <span class="text">HTML, CSS, JS, Supabase, Netlify, petits projets de classe et personnels</span>
  <span class="tag">&lt;/article&gt;</span>

  <span class="tag">&lt;article</span> class="developpeur"&gt;
    <span class="tag">&lt;h2&gt;</span>Mon setup<span class="tag">&lt;/h2&gt;</span>
    <span class="tag">&lt;dl&gt;</span>
      <span class="tag">&lt;dt&gt;</span>IDE<span class="tag">&lt;/dt&gt;</span>
      <span class="tag">&lt;dd&gt;</span>Visual Studio Code<span class="tag">&lt;/dd&gt;</span>

      <span class="tag">&lt;dt&gt;</span>Environnements<span class="tag">&lt;/dt&gt;</span>
      <span class="tag">&lt;dd&gt;</span>Netlify, Supabase<span class="tag">&lt;/dd&gt;</span>

      <span class="tag">&lt;dt&gt;</span>Outils<span class="tag">&lt;/dt&gt;</span>
      <span class="tag">&lt;dd&gt;</span>Git<span class="tag">&lt;/dd&gt;</span>

      <span class="tag">&lt;dt&gt;</span>OS<span class="tag">&lt;/dt&gt;</span>
      <span class="tag">&lt;dd&gt;</span>Windows, Linux Mint<span class="tag">&lt;/dd&gt;</span>
    <span class="tag">&lt;/dl&gt;</span>

    <span class="tag">&lt;h3&gt;</span>Compétences supplémentaires<span class="tag">&lt;/h3&gt;</span>
    <span class="text">Monteur de vidéos, utiliser l'IA et internet correctement, cybersécurité</span>
  <span class="tag">&lt;/article&gt;</span>

  <span class="tag">&lt;article</span> class="humain"&gt;
    <span class="tag">&lt;h3&gt;</span>Hobbies<span class="tag">&lt;/h3&gt;</span>
    <span class="text">Écoute de musiques, Coding & création web, Jeux vidéo</span>

    <span class="tag">&lt;h4&gt;</span>Carburant<span class="tag">&lt;/h4&gt;</span>
    <span class="text">Eau, Coca-Cola</span>
  <span class="tag">&lt;/article&gt;</span>
<span class="tag">&lt;/section&gt;</span>`,

  css: `<span class="selector">.metiers</span> {
  <span class="property">developpeur</span>: "<span class="value">Web et projets personnels</span>";
  <span class="property">collegien</span>: "<span class="value">HTML, CSS, JS, Supabase, Netlify, petits projets de classe et personnels</span>";
}

<span class="selector">.developpeur</span> {
  <span class="property">ide</span>: "<span class="value">Visual Studio Code</span>";
  <span class="property">environnements</span>: "<span class="value">Netlify, Supabase</span>";
  <span class="property">outils</span>: <span class="value">Git</span>;
  <span class="property">os</span>: "<span class="value">Windows, Linux Mint</span>";
}

<span class="selector">.competences</span> {
  <span class="property">supplementaires</span>: "<span class="value">Monteur de vidéos, utiliser l'IA et internet correctement, cybersécurité</span>";
}

<span class="selector">.hobbies</span> {
  <span class="property">ecoute</span>: "<span class="value">musiques</span>";
  <span class="property">coding</span>: "<span class="value">création web</span>";
  <span class="property">jeux</span>: "<span class="value">jeux vidéo</span>";
}

<span class="selector">.carburant</span> {
  <span class="property">boissons</span>: "<span class="value">Eau, Coca-Cola</span>";
}`,

  js: `<span class="comment">// Présentation</span>
<span class="keyword">const</span> metiers = {
  <span class="property">developpeur</span>: '<span class="value">Web et projets personnels</span>',
  <span class="property">Collégien passionné</span>: {
    <span class="property">langages</span>: ['<span class="value">HTML</span>', '<span class="value">CSS</span>', '<span class="value">JS</span>'],
    <span class="property">services</span>: ['<span class="value">Supabase</span>', '<span class="value">Netlify</span>'],
    <span class="property">projets</span>: '<span class="value">projets scolaires et personnels</span>'
  }
};

<span class="keyword">class</span> Developpeur {
  <span class="keyword">workflow</span>() {
    <span class="keyword">return</span> {
      ide: '<span class="value">Visual Studio Code</span>',
      environnements: ['<span class="value">Netlify</span>', '<span class="value">Supabase</span>'],
      outils: ['<span class="value">Git</span>'],
      os: ['<span class="value">Windows</span>', '<span class="value">Linux Mint</span>'],
    };
  }

  <span class="keyword">bonus</span>() {
    <span class="keyword">return</span> ['<span class="value">Monteur de vidéos</span>', '<span class="value">Utiliser l\'IA et internet correctement</span>', '<span class="value">Cybersécurité</span>'];
  }
}

<span class="keyword">function</span> humain() {
  <span class="keyword">const</span> hobbies = {
    musiques: ['<span class="value">Écoute de musiques</span>'],
    coding: ['<span class="value">Coding</span>', '<span class="value">Création web</span>'],
    jeux: ['<span class="value">Jeux vidéo</span>']
  };
  <span class="keyword">const</span> carburant = ['<span class="value">Eau</span>','<span class="value">Coca-Cola</span>'];
  <span class="keyword">return</span> { hobbies, carburant };
}`,

  md: `<span class="comment"># Présentation</span>
<span class="comment">## Metiers</span>

<span class="comment">### Développeur</span>
<span class="text">Web et projets personnels</span>

<span class="comment">### Collégien passionné</span>
<span class="text">HTML, CSS, JS, Supabase, Netlify, petits projets de classe et personnels</span>

<span class="comment">## Mon setup</span>
<span class="text">- **IDE:** Visual Studio Code</span>
<span class="text">- **Environnements:** Netlify, Supabase</span>
<span class="text">- **Outils:** Git</span>
<span class="text">- **OS:** Windows, Linux Mint</span>

<span class="comment">### Compétences supplémentaires</span>
<span class="text">Monteur de vidéos, utiliser l'IA et internet correctement, cybersécurité</span>

<span class="comment">## Humain</span>
<span class="comment">### Hobbies</span>
<span class="text">- Écoute de musiques</span>
<span class="text">- Coding & création web</span>
<span class="text">- Jeux vidéo</span>

<span class="comment">#### Carburant</span>
<span class="text">- Eau</span>
<span class="text">- Coca‑Cola</span>`
};

// === Choix aléatoire ===
const types = Object.keys(terminalCodes);
const randomType = types[Math.floor(Math.random() * types.length)];

// === Injection dans le terminal ===
document.getElementById("folder-name").textContent = `nathan@code: ~/${randomType}`;
document.getElementById("code-line").innerHTML = terminalCodes[randomType];