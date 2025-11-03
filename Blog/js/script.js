/*!
 * Portfolio Nathan - Page Blog
 * Copyright (C) 2025 Nathan
 * Licensed under the GNU General Public License v3.0
 */
console.log("%c© 2025 - Nathan The Coder", "background: #282c34; color: #98c379; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cBlog - Nathan The Coder", "background: #282c34; color: #61afef; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cBlog de Nathan : découvre mes articles, astuces web et réflexions sur le développement et la création numérique.","background: #282c34; color: #61dafb; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%chttps://nathan-the-coder.netlify.app/blog", "background: #282c34; color: #e06c75; padding: .5em 1em; border-radius: 5px; font-weight: bold;");

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

// === Récupération et affichage des articles du blog ===
async function fetchBlog() {
  // On récupère la date actuelle de l'utilisateur (locale)
  const now = new Date()

  // On crée une version "YYYY-MM-DD" (juste la date)
  const today = now.toISOString().split('T')[0] // ex: "2025-11-03"

  const { data, error } = await supabase
    .from('blog')
    .select('*')
    .lte('created_at', today) // 👈 filtre sur la date uniquement
    .order('created_at', { ascending: false })

  const container = document.getElementById('blog-container')

  if (error) {
    console.error('Erreur Supabase:', error)
    container.innerHTML = '<article class="glass-card"><h2>Erreur</h2><p>Une erreur est survenue lors du chargement des données.</p>'
    return
  }

  if (!data || data.length === 0) {
    container.innerHTML = `<article class="glass-card"><h2>Aucun article...</h2><p>Aucun article a été trouvé.</p></article>`
    return
  }

  container.innerHTML = ''

  data.forEach(blog => {
    const card = document.createElement('article')
    const date = new Date(blog.created_at).toLocaleDateString('fr-FR')
    card.className = 'glass-card'
    card.style.cursor = 'pointer'
    card.innerHTML = `
      <h2>${blog.title}</h2>
      <span class="date">${date}</span>
      <p>${blog.short_description ? blog.short_description.slice(0, 100) + '…' : ''}</p>
    `
    card.addEventListener('click', () => openModal(blog))
    container.appendChild(card)
  })
}

// === Modal ===
const modal = document.getElementById('blog-modal')
const modalTitle = document.getElementById('modal-title')
const modalDescription = document.getElementById('modal-description')
const modalDate = document.getElementById('modal-date')
const modalImg1 = document.getElementById('modal-img1')
const modalImg2 = document.getElementById('modal-img2')
const modalClose = modal.querySelector('.close')

modalClose.onclick = () => modal.style.display = 'none'
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') modal.style.display = 'none'
})

async function openModal(blog) {
  modalTitle.textContent = blog.title
  modalDate.textContent = new Date(blog.created_at).toLocaleDateString('fr-FR')
  modalDescription.innerHTML = blog.full_description

  modalImg1.src = blog.image1_path 
  modalImg2.src = blog.image2_path
  modal.style.display = 'flex'
}

// === Lancement ===
document.addEventListener('DOMContentLoaded', fetchBlog)
setInterval(fetchBlog, 5000)
