# 🚗 PMR Nantes - Application de Cartographie pour Personnes à Mobilité Réduite

Une application web moderne pour localiser les places de stationnement PMR (Personnes à Mobilité Réduite) à Nantes et sa métropole. Construite avec React et Vite, elle fournit un accès facile aux données d'accessibilité grâce aux APIs d'IGN et de Nantes Métropole.

## 🎯 Fonctionnalités

- **🗺️ Carte Interactive** : Visualisation en temps réel des places PMR sur une carte Leaflet
- **🔍 Recherche d'Adresses** : Trouvez facilement votre destination
- **📍 Calcul d'Itinéraires** : Obtenez la distance et la durée estimée
- **♿ Localisation PMR** : Identifiez toutes les places accessibles à proximité
- **📊 Informations Détaillées** : Nombre de places, durée de stationnement, type de place
- **📱 Responsive Design** : Fonctionne sur tous les appareils (desktop, tablette, mobile)

## 🏗️ Architecture

```
src/
├── components/          # Composants React
│   ├── Map.jsx         # Composant principal de la carte
│   ├── SearchBar.jsx   # Barre de recherche
│   ├── RoutingPanel.jsx # Panneau de routage
│   └── PMRMarkerPopup.jsx # Popup pour les marqueurs PMR
├── services/           # Services API
│   ├── pmrService.js   # Service pour les places PMR
│   └── routingService.js # Service de routage et géocodage
├── hooks/              # Custom React hooks
│   └── usePMRLocations.js # Hook pour gérer les localisations
├── constants/          # Constantes de l'application
│   └── labels.js       # Labels et textes
├── config/             # Configuration
│   └── appConfig.js    # Configuration globale
├── styles/             # Fichiers CSS
│   ├── map.css
│   ├── searchBar.css
│   ├── routingPanel.css
│   └── pmrMarker.css
├── App.jsx            # Composant principal
├── main.jsx           # Point d'entrée
└── index.css          # Styles globaux
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (v16+)
- npm ou yarn

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```
L'application sera disponible à `http://localhost:5173`

### Build Production
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 📚 Technologies Utilisées

- **React 19** : Framework UI moderne
- **Vite** : Bundler ultra-rapide
- **Leaflet** : Bibliothèque de cartographie
- **React-Leaflet** : Intégration React/Leaflet
- **Axios** : Client HTTP pour les requêtes API
- **CSS3** : Styles modernes et animations

## 🔌 APIs Intégrées

### Nantes Métropole
- **Dataset PMR** : https://data.nantesmetropole.fr/explore/dataset/244400404_emplacements-pmr-nantes-metropole/

### IGN (Institut Géographique National)
- **Géocodage** : Conversion adresses ↔ coordonnées
- **Routage** : Calcul d'itinéraires optimisés

## 📋 Structuration et Bonnes Pratiques React/JavaScript

### Structure des Composants
- **Composants fonctionnels** : Utilisation exclusive de fonctions avec hooks
- **Séparation des responsabilités** : Un composant = une responsabilité
- **Props destructurées** : Meilleure lisibilité
- **JSDoc** : Documentation des fonctions

### Gestion d'État
- **useState** : État local des composants
- **useEffect** : Effets secondaires et chargement de données
- **Custom Hooks** : Logique réutilisable

### Services
- **Séparation API** : Services dédiés pour chaque source de données
- **Gestion d'erreurs** : Try/catch et retours d'erreur clairs
- **Formatage des données** : Normalisation des réponses API

### Styles
- **CSS Modules** : Importation CSS avec scope
- **Variables CSS** : Thème cohérent
- **Animations** : Transitions fluides
- **Responsive** : Breakpoints pour mobiles

## 🎨 Schéma de Couleurs

- **Bleu** (#4a90e2) : Couleur principale
- **Rouge** (#ff6b6b) : Places PMR
- **Turquoise** (#4ecdc4) : Point de départ
- **Vert clair** (#95e1d3) : Point d'arrivée

## 🔄 Flux de l'Application

1. L'utilisateur ouvre l'application
2. Les places PMR se chargent depuis l'API Nantes Métropole
3. L'utilisateur recherche une adresse (départ)
4. L'utilisateur recherche une destination
5. Un itinéraire est calculé
6. Les places PMR à proximité sont affichées
7. L'utilisateur peut sélectionner une place PMR ou ajuster l'itinéraire

## 📱 Points de Rupture Responsive

- **Desktop** : Full layout avec panneau latéral
- **Tablette** (< 768px) : Layout adapté
- **Mobile** (< 480px) : Layout empilé

## 🐛 Dépannage

### La carte n'apparaît pas
- Vérifier que Leaflet est correctement importé
- Vérifier la hauteur du conteneur

### Les places PMR ne s'affichent pas
- Vérifier la connexion à l'API Nantes Métropole
- Vérifier la console pour les erreurs réseau

### Erreurs CORS
- Les APIs utilisées autorisent les requêtes cross-origin
- Sinon, utiliser un proxy CORS

## 📝 Licence

MIT
