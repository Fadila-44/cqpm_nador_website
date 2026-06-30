# CQPM Nador — Site Institutionnel

Site web multilingue (FR / AR / EN) du **Centre de Qualification Professionnelle Maritime de Nador**, avec back-office d'administration intégré.

## Stack technique

- **Frontend** : React + Vite, React Router, TanStack Query, Tailwind CSS
- **Backend** : Laravel (API REST)
- **Base de données** : MySQL
- **i18n** : Support FR / AR (RTL) / EN

## Structure du projet:
├── src/
│   ├── components/      # Pages et sections publiques (Hero, Avis, Agenda, etc.)
│   ├── admin/           # Back-office (Dashboard, CMS, Gestion des avis/contacts)
│   ├── data/            # Données statiques (avis, events, site)
│   ├── services/        # Appels API (frontend public)
│   ├── hooks/           # Hooks personnalisés (scroll reveal, etc.)
│   ├── context/         # Contexte global du contenu
│   ├── i18n.js          # Traductions FR/AR/EN
│   └── App.jsx          # Point d'entrée des routes
├── backend/             # API Laravel (app, routes, database, config)
├── public/              # Assets statiques (images, vidéos)
└── docker-compose.yml
## Installation

### Frontend
```bash
npm install
npm run dev            # serveur de dev (site public)
npm run dev:admin       # serveur de dev (back-office admin)
npm run build:all        # build complet (front + admin)
```

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

## Fonctionnalités principales

- Pages institutionnelles multilingues (présentation, missions, infrastructure, gallerie...)
- Programmes académiques (Niveau Qualification / Spécialisation par Apprentissage)
- Avis & Résultats avec filtres par statut (badges colorés)
- Agenda / Événements
- Formulaires (inscription, réclamation, contact)
- Back-office complet : CMS, gestion des avis, contacts, formulaires, médias

## Variables d'environnement

Voir `.env.example` (frontend) et `backend/.env.example` (backend Laravel) pour la configuration nécessaire avant de lancer le projet. **Ne jamais committer les fichiers `.env`.**

## Auteur

Projet réalisé par Fadila — ENSIASD, Université Ibn Zohr, Taroudant.