# 🐳 Configuration Docker pour l'application Dapi PMR

## Structure de la stack

L'application est composée de 4 services Docker :
- `db` : Base de données MySQL 8.0 (réseau interne uniquement)
- `backend` : API Node.js/Express
- `frontend` : Application React servie par Nginx
- `sync-data` : Service one-shot pour synchroniser les données initiales depuis l'API Nantes Métropole

## Prérequis

- Docker Desktop (Windows/macOS) ou Docker Engine + Docker Compose (Linux)
- WAMP/XAMPP **arrêté** si vous utilisiez MySQL localement (port 3306 en conflit)

## Installation et démarrage

### 1. Configuration des variables d'environnement

Copiez le fichier d'exemple et configurez-le :
```bash
cp .env.example .env
```

Modifiez les mots de passe dans le fichier `.env` si nécessaire.

### 2. Démarrer toute la stack

```bash
docker-compose up -d --build
```

Les services se lancent dans l'ordre :
1. Base de données MySQL (healthcheck activé)
2. Backend (attend que la DB soit prête)
3. Synchronisation des données (run once)
4. Frontend (attend que le backend soit prêt)

### 3. Accéder à l'application

- Frontend : http://localhost:5173
- Backend API : http://localhost:3001

## Commandes utiles

### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
docker-compose logs -f db
```

### Vérifier l'état des services
```bash
docker-compose ps
```

### Arrêter la stack
```bash
docker-compose down
```

### Arrêter et supprimer les volumes (supprime les données !)
```bash
docker-compose down -v
```

### Redémarrer un service
```bash
docker-compose restart backend
```

### Forcer la synchronisation des données
```bash
docker-compose run --rm sync-data
```

## Réseaux Docker

- `app-network` : Réseau pour la communication frontend <-> backend
- `db-network` : Réseau **interne** pour la base de données (aucun accès depuis l'extérieur)

## Healthchecks

Chaque service a un healthcheck configuré :
- `db` : Vérifie la connexion MySQL
- `backend` : Vérifie l'API sur le port 3001
- `frontend` : Vérifie Nginx sur le port 80

Voir l'état des healthchecks avec :
```bash
docker-compose ps
```

## Développement vs Production

Cette configuration est prête pour la production :
- Dockerfiles multistage pour optimiser la taille des images
- Volumes persistents pour la base de données
- Nginx pour servir le frontend
- Healthchecks et restart policies

Pour le développement local (sans Docker), référez-vous au `README.md` principal.
