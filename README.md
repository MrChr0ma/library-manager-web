🇫🇷 [Version française](README.fr.md)

# Library Manager Web

A small web app to manage a library's catalogue: books, authors and loans. It has a Node.js/Express REST backend that stores its data in JSON files, and a front end in plain HTML/CSS/JavaScript.

I built it for the Web Programming course of the EPITA Cybersecurity Bachelor (year 1, 2025-2026).

## Features

- Login and logout, with a token sent to the API
- Dashboard with key figures: number of books, number of authors, number of borrowed books
- Search books by title and authors by name
- Create a book or an author
- Book page: view and edit the title, author and status (*en stock* / *emprunté*)
- Author page: view and edit the author, and list their books

## Requirements

- Node.js 18 or later
- npm

## Installation and usage

```bash
git clone https://github.com/MrChr0ma/library-manager-web.git
cd library-manager-web/back
npm install
npm start          # or: npm run watch (auto-reload with nodemon)
```

Then open <http://localhost:7542>.

The server must be started from the `back/` folder, because it reads `data/` and `../front` with relative paths.

**Demo account:** login `admin`, password `password` (stored in `back/data/users.json`). Use it for local testing only.

## API

Every route except login needs the token returned by `/api/auth/login`.

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Log in, returns a token (public route) |
| POST | `/api/auth/logout` | Revoke the token |
| GET | `/api/stats` | Dashboard figures |
| GET / POST | `/api/book` | List or create books |
| GET / PUT | `/api/book/:id` | Get or update a book |
| GET / POST | `/api/author` | List or create authors |
| GET / PUT | `/api/author/:id` | Get or update an author |

## Project structure

```
back/
├── index.js                 # starts the server on port 7542
├── data/                    # JSON "database" (books, authors, users)
└── src/
    ├── core/                # ServerHttp (routing), Database (JSON files), Auth (tokens)
    ├── controllers/         # Auth, Book, Author, Stats
    └── models/              # Book, Author, User
front/
├── index.html
└── public/                  # css, html templates, js pages
```

`front/public/js/lib.js` is the front-end library provided by the course.

## Status

The features required by the assignment are done. This is a learning project and is not hardened for production:

### TODO
- [ ] Hash the passwords. They are currently stored and compared in plain text in `users.json`.
- [ ] Keep tokens somewhere other than in memory, since they are lost when the server restarts.
- [ ] Add a way to delete books and authors (there is no `DELETE` route).
- [ ] Validate request bodies on the server side.
