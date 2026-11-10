const Database = require('../core/Database');

class BookModel {
  getBooks() {
    const books = Database.getFile('books');
    return (books || []).filter(book => book);
  }

  getBookById(id) {
    return Database.get('books', id);
  }

  searchBooksByName(name) {
    const books = this.getBooks();
    if (!name) {
      return books;
    }
    const needle = String(name).toLowerCase();
    return books.filter(book => book.title.toLowerCase().includes(needle));
  }

  getBooksByAuthorId(authorId) {
    const id = parseInt(authorId, 10);
    return this.getBooks().filter(book => book.authorId === id);
  }

  createBook(title, authorId, state) {
    const books = Database.getFile('books') || [];
    const id = books.length;
    const book = {
      id,
      title: String(title || ''),
      authorId: parseInt(authorId, 10),
      state: state === 'emprunté' ? 'emprunté' : 'en stock',
    };
    Database.edit('books', id, book);
    return book;
  }

  editBook(id, data) {
    const book = this.getBookById(id);
    if (!book) {
      return false;
    }
    const updated = { ...book, id };
    if (data.title !== undefined) updated.title = String(data.title);
    if (data.authorId !== undefined) updated.authorId = parseInt(data.authorId, 10);
    if (data.state !== undefined) updated.state = data.state === 'emprunté' ? 'emprunté' : 'en stock';
    Database.edit('books', id, updated);
    return updated;
  }

  countBooks() {
    return this.getBooks().length;
  }

  countBorrowedBooks() {
    return this.getBooks().filter(book => book.state === 'emprunté').length;
  }
}

module.exports = new BookModel();
