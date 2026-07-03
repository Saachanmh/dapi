# ADR 0001: rendre l'URL du backend configurable cote frontend

## Statut

Acceptee

## Contexte

Le frontend pointait vers une URL backend codee en dur. Cela compliquait le lancement local, les tests manuels et les changements d'environnement.

## Decision

Le frontend lit maintenant `VITE_API_BASE_URL` et utilise une URL par defaut de production si la variable n'est pas renseignee.

## Consequences

- Le frontend peut viser `http://localhost:3001/api` en local sans modification du code.
- Le build de production conserve un fallback stable.
- Les environnements doivent documenter explicitement leur URL API.

## Alternatives considerees

- Garder l'URL codee en dur.
- Injecter l'URL uniquement via un proxy.
- Utiliser un fichier de configuration distinct par environnement.

