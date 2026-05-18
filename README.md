# Todo App — P_DB_165

Application de gestion de tâches full-stack : **Vue 3** (frontend), **Node.js / Express** (API REST), **MongoDB** (persistance via Mongoose) et **Redis** (cache applicatif des listes de todos).

---

## Description du projet

Chaque utilisateur authentifié (JWT) dispose de ses propres todos. L’API permet le CRUD complet, la recherche full-text sur le libellé des tâches, et la gestion du profil utilisateur. Les appels `GET /api/todo` sont mis en cache dans Redis (TTL 60 s) et invalidés à chaque création, modification ou suppression.

---

## Technologies utilisées

| Couche      | Technologie                          |
| ----------- | ------------------------------------ |
| Frontend    | Vue, TypeScript   |
| Backend     | Node.js, Express, Mongoose           |
| Base de données | MongoDB                        |
| Cache       | Redis Stack                      |
| Conteneurs  | Docker Compose                       |

---

## Démarrage en local

### Prérequis

- Node.js 20+
- Docker et Docker Compose
- npm

### 1. Services Docker (MongoDB + Redis)

À la racine du dépôt :

```sh
cp .env.example .env
docker compose up -d
```

Les utilisateurs MongoDB sont créés automatiquement au **premier** démarrage du conteneur `mongo` (script `data/mongo/docker-entrypoint-initdb.d/mongo-init.js`). Si le volume `mongo_data` existe déjà sans ces utilisateurs, supprimez-le puis relancez :

```sh
docker compose down -v
docker compose up -d
```

### 2. Backend

```sh
cd backend
cp .env.example .env
npm install
npm run dev
```

Le serveur écoute par défaut sur le port **3000**.

### 3. Frontend

```sh
cd frontend
npm install
npm run dev
```

Consultez aussi [backend/README.md](./backend/README.md) et [frontend/README.md](./frontend/README.md).

---

## Permissions MongoDB (point 2.1 du CdC)

Le fichier `data/mongo/docker-entrypoint-initdb.d/mongo-init.js` s’exécute à l’initialisation du conteneur. La première instruction bascule sur la base applicative :

```js
db = db.getSiblingDB('db_todoapp');
```

Trois utilisateurs sont créés :

### 1. `app_backend` (base `db_todoapp`)

| Rôle        | Base          | Droits principaux                                      |
| ----------- | ------------- | ------------------------------------------------------ |
| `readWrite` | `db_todoapp`  | CRUD sur les collections et documents                  |
| `dbAdmin`   | `db_todoapp`  | Création de collections, gestion des index             |

Utilisé par l’application Node.js (`DB_URL` dans `backend/.env`).

**Connexion :**

```
mongodb://app_backend:app_backend_pwd@localhost:27017/db_todoapp?authSource=db_todoapp
```

### 2. `admin_app` (base `db_todoapp`)

| Rôle         | Base          | Droits principaux                                      |
| ------------ | ------------- | ------------------------------------------------------ |
| `dbAdmin`    | `db_todoapp`  | Index, statistiques, schémas de la base applicative    |
| `userAdmin`  | `db_todoapp`  | Création d’utilisateurs limitée à `db_todoapp`         |

Réservé à l’administration de la base (maintenance, pas l’API courante).

### 3. `backup_user` (base `admin`)

| Rôle     | Base    | Droits principaux                                                |
| -------- | ------- | ---------------------------------------------------------------- |
| `backup` | `admin` | Lecture globale optimisée pour `mongodump` / `mongoexport`       |

Aucun droit d’écriture. Authentification via `authSource=admin`.

Les mots de passe par défaut sont définis dans `.env.example` et dans `mongo-init.js` (à personnaliser en production).

---

## Sauvegarde de la base (point 2.2 du CdC)

### Commande recommandée (compacte)

Sauvegarde compressée de la seule base applicative dans un fichier unique :

```sh
mongodump \
  --uri="mongodb://backup_user:backup_user_pwd@localhost:27017/db_todoapp?authSource=admin" \
  --gzip \
  --archive=./data/mongo/backup/db_todoapp-$(date +%Y%m%d).gz
```

Sous Windows PowerShell, adaptez la date :

```powershell
mongodump --uri="mongodb://backup_user:backup_user_pwd@localhost:27017/db_todoapp?authSource=admin" --gzip --archive=./data/mongo/backup/db_todoapp-backup.gz
```

### Explication détaillée

| Option / élément | Rôle |
| ---------------- | ---- |
| `mongodump`        | Outil officiel MongoDB pour exporter des données BSON |
| `--uri`            | Connexion avec `backup_user` (lecture seule, rôle `backup`) |
| `authSource=admin` | L’utilisateur de sauvegarde est enregistré dans la base `admin` |
| `/db_todoapp`      | Limite l’export à la base de l’application (pas tout le cluster) |
| `--gzip`           | Compresse le flux BSON → **taille minimale** sur disque |
| `--archive=fichier.gz` | Produit **un seul fichier** au lieu d’un dossier `dump/` (plus simple à archiver et transférer) |

**Pourquoi cette combinaison prend le moins de place :** export ciblé d’une seule base (pas de données système inutiles), compression gzip intégrée, et format archive monolithique sans métadonnées de répertoire redondantes.

### Restauration

```sh
mongorestore \
  --uri="mongodb://backup_user:backup_user_pwd@localhost:27017/?authSource=admin" \
  --gzip \
  --archive=./data/mongo/backup/db_todoapp-backup.gz \
  --drop
```

`--drop` supprime les collections existantes avant import (à utiliser avec prudence).

### Alternative : export JSON (mongoexport)

Utile pour un fichier lisible, généralement **plus volumineux** que `mongodump --gzip` :

```sh
mongoexport \
  --uri="mongodb://backup_user:backup_user_pwd@localhost:27017/db_todoapp?authSource=admin" \
  --collection=todos \
  --out=./data/mongo/backup/todos.json
```

---

## Cache Redis

- **Clé :** `todos:<userId>`
- **Endpoint mis en cache :** `GET /api/todo`
- **TTL :** 60 secondes (`EX: 60`)
- **Invalidation :** à chaque `POST`, `PATCH` ou `DELETE` sur `/api/todo`

Configuration mémoire : `redis-stack.conf` (`maxmemory`, politique `allkeys-lru`).

---

## Recherche MongoDB

Les todos possèdent un index texte sur le champ `text`. La route `GET /api/todo/search?q=...` utilise l’opérateur `$text` de MongoDB, filtré par `user_id` pour isoler les données par utilisateur.

---

## Usage de l’intelligence artificielle

Des outils d’IA (dont l’assistant Cursor) ont été utilisés comme **aide à la rédaction** : structure du README, rappel des rôles MongoDB officiels, et vérification de cohérence avec le cahier des charges. Le code métier (Mongoose, contrôleurs, cache Redis, script `mongo-init.js`) a été implémenté et relu manuellement ; les choix d’architecture (index texte, clés Redis, rôles `readWrite` / `dbAdmin` / `backup`) correspondent aux exigences du module I165.

---

## Conclusion

Le projet migre l’ancienne stack MySQL vers **MongoDB + Mongoose**, ajoute un **cache Redis** sur la lecture des todos, et applique une **séparation des privilèges** MongoDB via Docker. Pour la livraison ETML : dépôt privé `165-todo-app`, commits atomiques en Conventional Commits, et release GitHub associée.

---

## Captures d’interface

### Todos

![Todos](./img/tasks.png)

### Login

![Login](./img/login.png)

### Register

![Register](./img/register.png)

### Profile

![Profile](./img/profile.png)
