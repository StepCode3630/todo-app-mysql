# Backend — Guide d’utilisation

API REST **Node.js / Express** pour l’application Todo, avec **MongoDB** (Mongoose) et **Redis** (cache).

## Installation

```sh
cd backend
npm install
```

## Configuration

```sh
cp .env.example .env
```

Variables principales :

| Variable     | Description |
| ------------ | ----------- |
| `DB_URL`     | URI MongoDB (`app_backend` sur `db_todoapp`) |
| `REDIS_URL`  | URI Redis (mot de passe dans l’URL) |
| `PORT`       | Port HTTP (défaut : 3000) |

Exemple :

```env
DB_URL=mongodb://app_backend:app_backend_pwd@localhost:27017/db_todoapp?authSource=db_todoapp
REDIS_URL=redis://:admin_pwd@localhost:6379
```

## Lancement

```sh
npm run dev
```

Démarrez au préalable MongoDB et Redis via `docker compose up -d` à la racine du projet.

## Base de données

- Modèles : `User`, `Todo` (relation `user_id` → `ObjectId`)
- Recherche : index texte sur `Todo.text`, requête `$text` dans `GET /api/todo/search`
- Cache : liste des todos par utilisateur dans Redis (`todos:<userId>`)
