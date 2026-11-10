const Database = require('../core/Database');

class AuthorModel {
  getAuthors() {
    const authors = Database.getFile('authors');
    return (authors || []).filter(author => author);
  }

  getAuthorById(id) {
    return Database.get('authors', id);
  }

  searchAuthorsByName(name) {
    const authors = this.getAuthors();
    if (!name) {
      return authors;
    }
    const needle = String(name).toLowerCase();
    return authors.filter(author => author.name.toLowerCase().includes(needle));
  }

  createAuthor(name) {
    const authors = Database.getFile('authors') || [];
    const id = authors.length;
    const author = { id, name: String(name || '') };
    Database.edit('authors', id, author);
    return author;
  }

  editAuthor(id, data) {
    const author = this.getAuthorById(id);
    if (!author) {
      return false;
    }
    const updated = { ...author, id };
    if (data.name !== undefined) updated.name = String(data.name);
    Database.edit('authors', id, updated);
    return updated;
  }

  countAuthors() {
    return this.getAuthors().length;
  }
}

module.exports = new AuthorModel();
