const BookModel = require('../models/BookModel');
const AuthorModel = require('../models/AuthorModel');

class BookController {
  enrich(book) {
    if (!book) return book;
    return { ...book, author: AuthorModel.getAuthorById(book.authorId) || null };
  }

  getBooks(query) {
    const search = query.search || '';
    const books = search ? BookModel.searchBooksByName(search) : BookModel.getBooks();
    return books.map(book => this.enrich(book));
  }

  getBook(query, body, params) {
    const id = parseInt(params.id, 10);
    const book = BookModel.getBookById(id);
    return book ? this.enrich(book) : false;
  }

  postBook(query, body) {
    if (!body || !body.title) return false;
    const book = BookModel.createBook(body.title, body.authorId, body.state);
    return this.enrich(book);
  }

  putBook(query, body, params) {
    const id = parseInt(params.id, 10);
    const updated = BookModel.editBook(id, body || {});
    return updated ? this.enrich(updated) : false;
  }

  routes = [
    { url: '/api/book',     method: 'GET',  handler: this.getBooks },
    { url: '/api/book',     method: 'POST', handler: this.postBook },
    { url: '/api/book/:id', method: 'GET',  handler: this.getBook },
    { url: '/api/book/:id', method: 'PUT',  handler: this.putBook },
  ];
}

module.exports = new BookController();
