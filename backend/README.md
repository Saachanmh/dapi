# Backend Dapi PMR

Backend Node.js/Express avec base de données MySQL pour l'application PMR Nantes.

## Installation

1. Se rendre dans le dossier backend :
```bash
cd backend
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement dans `.env` :
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=dapi_pmr
PORT=3001
```

## Initialisation de la base de données

Assurez-vous que MySQL est en cours d'exécution, puis exécutez :

```bash
node scripts/initDB.js
```

## Synchronisation des données

Pour récupérer les données depuis l'API Nantes Métropole et les enregistrer dans la base de données :

```bash
# Démarrez d'abord le serveur
npm run dev

# Puis, envoyez une requête POST à http://localhost:3001/api/sync
# Ou utilisez curl :
curl -X POST http://localhost:3001/api/sync
```

## Démarrage du serveur

```bash
# Mode développement (rechargement automatique)
npm run dev

# Mode production
npm start
```

## API Endpoints

- `GET /api/emplacements` : Récupère tous les emplacements PMR
- `GET /api/emplacements/:id` : Récupère un emplacement par son ID
- `GET /api/communes` : Récupère toutes les communes
- `POST /api/sync` : Synchronise les données depuis l'API Nantes Métropole
