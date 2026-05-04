# Backend — Guide d’utilisation

Ce backend fait partie d’une application **Todo full-stack** utilisant une architecture API REST.

---

## ⚙️ Installation du projet

Place-toi dans le dossier `backend` :

```sh
cd backend
```

Installe les dépendances

```sh
npm i
```

## 🔐 Configuration de l’environnement

Avant de lancer le serveur, crée ton fichier .env :

```sh
cp .env.example .env
```

Puis configurer les variables nécessaires

```sh
DB_URL="mongodb://user:password@localhost:27017/db_todoapp"
Port=3000
```

La base de de donnée utilisé est **MongoDB**

## 🗄️ Base de données

Le projet utilise MongoDB avec Mongoose.

Fonctionnalités :

- stockage des utilisateurs et todos sous forme de documents
- relations via ObjectId (user_id)
- requêtes optimisées via Mongoose ODM
