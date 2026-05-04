## 🚀 Présentation

Cette application est une **Todo List full-stack** permettant de gérer des tâches quotidiennes avec une interface simple, réactive et une API sécurisée.

Le projet est structuré en deux parties : un **frontend en Vue.js** et un **backend en Node.js / Express**, connecté à une base de données MongoDB.

---

## ⚙️ Backend

Le backend est développé avec **Node.js** et **Express**, et utilise **MongoDB** via Mongoose.

Il gère :

- Authentification des utilisateurs (JWT)
- CRUD complet des todos
- Sécurisation des données par utilisateur
- API REST structurée

Les données sont stockées sous forme de documents avec une relation utilisateur via `user_id`.

---

## 🎨 Frontend

Le frontend est développé avec **Vue.js**.

Il permet :

- Création, modification et suppression de tâches
- Toggle du statut "completed"
- Affichage dynamique et réactif des todos
- Synchronisation avec l’API backend en temps réel

## Lancer le projet

Suivez les instructions des **readme** suivant

- [Backend](./backend/README.md)
- [Frontend](./frontend/README.md)

## The interface

### Todos

![Todos](./img/tasks.png)

### Login

![Login](./img/login.png)

### Register

![Register](./img/register.png)

### Profile

![Profile](./img/profile.png)
