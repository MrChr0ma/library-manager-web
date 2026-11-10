const AuthorModel = require('../models/AuthorModel');
const BookModel = require('../models/BookModel');

class AuthorController {
  getAuthors(query) {
    const search = query.search || '';
    const authors = search ? AuthorModel.searchAuthorsByName(search) : AuthorModel.getAuthors();
    return authors.map(author => ({
      ...author,
      bookCount: BookModel.getBooksByAuthorId(author.id).length,
    }));
  }

  getAuthor(query, body, params) {
    const id = parseInt(params.id, 10);
    const author = AuthorModel.getAuthorById(id);
    if (!author) return false;
    return {
      ...author,
      books: BookModel.getBooksByAuthorId(id),
    };
  }

  postAuthor(query, body) {
    if (!body || !body.name) return false;
    return AuthorModel.createAuthor(body.name);
  }

  putAuthor(query, body, params) {
    const id = parseInt(params.id, 10);
    return AuthorModel.editAuthor(id, body || {});
  }

  routes = [
    { url: '/api/author',     method: 'GET',  handler: this.getAuthors },
    { url: '/api/author',     method: 'POST', handler: this.postAuthor },
    { url: '/api/author/:id', method: 'GET',  handler: this.getAuthor },
    { url: '/api/author/:id', method: 'PUT',  handler: this.putAuthor },
  ];
}

module.exports = new AuthorController();
