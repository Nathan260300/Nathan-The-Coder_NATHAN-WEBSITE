# Portfolio Nathan The Coder — Setup

## Structure
```
/
├── index.html     ← unique fichier HTML (routing via ?p=page)
├── style.css      ← tous les styles
├── app.js         ← router + Supabase + toutes les pages
├── assets/        ← favicon, images
└── _redirects     ← Netlify SPA routing
```

## 1. Config Supabase
Dans `app.js`, ligne 8-9, remplace les valeurs :
```js
const SUPABASE_URL      = 'https://VOTRE_URL.supabase.co';
const SUPABASE_ANON_KEY = 'VOTRE_CLE_ANON';
```

## 2. Tables Supabase à créer

### `projects`
| Colonne           | Type      |
|-------------------|-----------|
| id                | uuid (PK) |
| title             | text      |
| short_description | text      |
| full_description  | text      |
| link              | text      |
| image1_path       | text      |
| image2_path       | text      |
| created_at        | timestamptz |

### `blog`
| Colonne           | Type      |
|-------------------|-----------|
| id                | uuid (PK) |
| title             | text      |
| short_description | text      |
| full_description  | text      |
| image1_path       | text      |
| image2_path       | text      |
| created_at        | timestamptz |

### `tutos`
Même structure que `blog`.

### `ressources`
| Colonne     | Type      |
|-------------|-----------|
| id          | uuid (PK) |
| title       | text      |
| description | text      |
| category    | text      |
| link        | text      |
| created_at  | timestamptz |

### `changelog`
| Colonne     | Type      |
|-------------|-----------|
| id          | uuid (PK) |
| title       | text      |
| description | text      |
| version     | text      |
| type        | text      | ← 'feature', 'fix', ou 'update'
| created_at  | timestamptz |

### `contact_messages`
| Colonne     | Type      |
|-------------|-----------|
| id          | uuid (PK) |
| name        | text      |
| discord_id  | text      |
| message     | text      |
| created_at  | timestamptz |

### `settings` (optionnel, pour footer)
| Colonne | Type |
|---------|------|
| key     | text |
| value   | text |

Insère une ligne : `key = 'last_update'`, `value = '2025-01-01'`

## 3. Row Level Security (RLS)
- `projects`, `blog`, `tutos`, `ressources`, `changelog`, `settings` → **SELECT public** (lecture libre)
- `contact_messages` → **INSERT public** (écriture libre), SELECT restreint à toi

## 4. Déploiement Netlify
- Push sur GitHub
- Netlify détecte automatiquement `_redirects`
- Plus besoin de Netlify Functions !

## Routing
| URL              | Page      |
|------------------|-----------|
| `/?p=home`       | Accueil   |
| `/?p=projets`    | Projets   |
| `/?p=blog`       | Blog      |
| `/?p=tuto`       | Tutoriels |
| `/?p=ressources` | Ressources|
| `/?p=contact`    | Contact   |
| `/?p=changelog`  | Changelog |
| `/?p=moi`        | À propos  |
