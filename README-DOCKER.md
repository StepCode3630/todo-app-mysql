# Services Docker

L’application s’appuie sur **MongoDB** (données) et **Redis Stack** (cache applicatif).

## Variables d’environnement

Copiez le fichier d’exemple à la racine :

```sh
cp .env.example .env
```

Docker Compose charge automatiquement ce fichier.

## Démarrage / arrêt

```sh
docker compose up -d
docker compose down
```

Pour réinitialiser les volumes (dont l’initialisation MongoDB avec `mongo-init.js`) :

```sh
docker compose down -v
docker compose up -d
```

## Identifiants par défaut

| Service | Variable(s) | Valeur par défaut |
| ------- | ----------- | ----------------- |
| MongoDB root | `MONGO_ROOT_USERNAME`, `MONGO_ROOT_PASSWORD` | `admin_user` / `admin_pwd` |
| MongoDB app | `MONGO_APP_BACKEND_*` | `app_backend` / `app_backend_pwd` |
| MongoDB admin | `MONGO_ADMIN_APP_*` | `admin_app` / `admin_app_pwd` |
| MongoDB backup | `MONGO_BACKUP_*` | `backup_user` / `backup_user_pwd` |
| Redis | `REDIS_PASSWORD` | `admin_pwd` |

Les utilisateurs applicatifs sont créés par `data/mongo/docker-entrypoint-initdb.d/mongo-init.js` au premier démarrage du conteneur `mongo`.

Voir [README.md](./README.md) pour les permissions détaillées et les commandes de sauvegarde.
