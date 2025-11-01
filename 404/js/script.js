/*!
 * Portfolio Nathan - Page Plan du site
 * Copyright (C) 2025 Nathan
 * Licensed under the GNU General Public License v3.0
 * You should have received a copy of the GNU GPL along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */
console.log("%c© 2025 - Nathan The Coder", "background: #282c34; color: #98c379; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cPlan du site - Nathan The Coder", "background: #282c34; color: #61afef; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cPlan du site de Nathan : navigation claire vers toutes les pages de mon portfolio.","background: #282c34; color: #61dafb; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%chttps://nathan-the-coder.netlify.app/plan", "background: #282c34; color: #e06c75; padding: .5em 1em; border-radius: 5px; font-weight: bold;");

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