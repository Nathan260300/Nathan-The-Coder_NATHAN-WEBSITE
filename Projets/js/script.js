/*!
 * Portfolio Nathan - Page Projets
 * Copyright (C) 2025 Nathan
 * Licensed under the GNU General Public License v3.0
 */
console.log("%c© 2025 - Nathan The Coder", "background: #282c34; color: #98c379; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cProjets - Nathan The Coder", "background: #282c34; color: #61afef; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cProjets de Nathan : découvre mes créations web, dashboards et sites animés.","background: #282c34; color: #61dafb; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%chttps://nathan-the-coder.netlify.app/projets", "background: #282c34; color: #e06c75; padding: .5em 1em; border-radius: 5px; font-weight: bold;");

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
async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  const container = document.getElementById('projects-container')

  if (error) {
    console.error('Erreur Supabase:', error)
    container.innerHTML = '<article class="glass-card"><h2>Erreur</h2><p>Une erreur est survenue lors du chargement des données.</p>'
    return
  }

  if (!data || data.length === 0) {
    container.innerHTML = `<article class="glass-card"><h2>Aucun projet...</h2><p>Aucun projet a été trouvé.</p></article>`
    return
  }

  container.innerHTML = ''

  data.forEach(project => {
    const card = document.createElement('article')
    card.className = 'glass-card'
    card.style.cursor = 'pointer'
    card.innerHTML = `
      <h2>${project.title}</h2>
      <p>${project.short_description}</p>
    `
    card.addEventListener('click', () => openModal(project))
    container.appendChild(card)
  })
}

// Récupère le modal et ses éléments
const modal = document.getElementById('project-modal')
const modalTitle = document.getElementById('modal-title')
const modalDescription = document.getElementById('modal-description')
const modalLink = document.getElementById('modal-link')
const modalImg1 = document.getElementById('modal-img1')
const modalImg2 = document.getElementById('modal-img2')
const modalClose = modal.querySelector('.close')

// Fermer le modal au clic sur la croix
modalClose.onclick = () => modal.style.display = 'none'

// Fermer le modal avec la touche Échap
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') modal.style.display = 'none'
})

async function openModal(project) {
  modalTitle.textContent = project.title
  modalDescription.innerHTML = project.full_description
  if(project.link){
    modalLink.href = project.link
    modalLink.style.display = 'inline-block'
  } else {
    modalLink.style.display = 'none'
  }

  // Récupère les images depuis Supabase
  modalImg1.src = project.image1_path 
  modalImg2.src = project.image2_path

  modal.style.display = 'flex'
}

// === Lancement ===
document.addEventListener('DOMContentLoaded', fetchProjects)
setInterval(fetchProjects, 5000)