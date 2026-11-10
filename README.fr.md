🇬🇧 [English version](README.md)

# Library Manager Web

Une petite application web de gestion d'une bibliothèque : livres, auteurs et emprunts. Elle a un backend REST en Node.js/Express qui stocke ses données dans des fichiers JSON, et un front en HTML/CSS/JavaScript sans framework.

Je l'ai réalisée pour le cours de Programmation Web du Bachelor Cybersécurité de l'EPITA (1re année, 2025-2026).

## Fonctionnalités

- Connexion et déconnexion, avec un jeton envoyé à l'API
- Tableau de bord avec les chiffres clés : nombre de livres, nombre d'auteurs, nombre de livres empruntés
- Recherche de livres par titre et d'auteurs par nom
- Création d'un livre ou d'un auteur
- Fiche livre : consultation et modification du titre, de l'auteur et de l'état (*en stock* / *emprunté*)
- Fiche auteur : consultation et modification de l'auteur, avec la liste de ses livres

## Prérequis

- Node.js 18 ou plus récent
- npm

## Installation et lancement

```bash
git clone https://github.com/MrChr0ma/library-manager-web.git
cd library-manager-web/back
npm install
npm start          # ou : npm run watch (rechargement automatique avec nodemon)
```

Ouvre ensuite <http://localhost:7542>.

Il faut lancer le serveur depuis le dossier `back/`, parce qu'il lit `data/` et `../front` avec des chemins relatifs.

**Compte de démo :** identifiant `admin`, mot de passe `password` (stocké dans `back/data/users.json`). À utiliser uniquement pour tester en local.

## API

Toutes les routes sauf la connexion demandent le jeton renvoyé par `/api/auth/login`.

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Connexion, renvoie un jeton (route publique) |
| POST | `/api/auth/logout` | Révoque le jeton |
| GET | `/api/stats` | Chiffres du tableau de bord |
| GET / POST | `/api/book` | Liste ou crée des livres |
| GET / PUT | `/api/book/:id` | Lit ou modifie un livre |
| GET / POST | `/api/author` | Liste ou crée des auteurs |
| GET / PUT | `/api/author/:id` | Lit ou modifie un auteur |

## Structure du projet

```
back/
├── index.js                 # lance le serveur sur le port 7542
├── data/                    # « base de données » JSON (livres, auteurs, utilisateurs)
└── src/
    ├── core/                # ServerHttp (routage), Database (fichiers JSON), Auth (jetons)
    ├── controllers/         # Auth, Book, Author, Stats
    └── models/              # Book, Author, User
front/
├── index.html
└── public/                  # css, gabarits html, pages js
```

`front/public/js/lib.js` est la librairie front fournie par le cours.

## État d'avancement

Les fonctionnalités demandées dans le sujet sont faites. C'est un projet d'apprentissage, il n'est pas sécurisé pour de la production :

### TODO
- [ ] Hacher les mots de passe. Ils sont pour l'instant stockés et comparés en clair dans `users.json`.
- [ ] Conserver les jetons ailleurs qu'en mémoire, puisqu'ils sont perdus au redémarrage du serveur.
- [ ] Permettre de supprimer des livres et des auteurs (il n'y a pas de route `DELETE`).
- [ ] Valider les données reçues côté serveur.
