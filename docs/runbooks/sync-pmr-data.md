# Runbook: synchroniser les donnees PMR

## Objectif

Rafraichir la base MySQL avec les donnees PMR Nantes Metropole.

## Pre-requis

- Backend demarre
- MySQL accessible
- Variables `DB_*` configurees

## Procedure

1. Verifier que le backend repond :

```bash
curl http://localhost:3001/
```

2. Lancer la synchronisation :

```bash
cd backend
node scripts/sync-once.js
```

3. Verifier les donnees :

```bash
curl http://localhost:3001/api/emplacements?limit=5
```

## Symptomes courants

| Symptome | Cause probable | Action |
|---|---|---|
| `Timeout en attente du backend` | Backend arrete | Relancer `npm run dev` |
| `Erreur lors de la synchronisation` | API Nantes Metropole indisponible | Rejouer plus tard |
| `Connexion MySQL refusee` | `DB_*` incorrectes | Corriger le `.env` |

## Retour arriere

- La synchronisation est idempotente grace a `ON DUPLICATE KEY UPDATE`.
- Rejouer le runbook ne duplique pas les enregistrements existants.

