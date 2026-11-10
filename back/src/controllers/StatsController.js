const BookModel = require('../models/BookModel');
const AuthorModel = require('../models/AuthorModel');

class StatsController {
  getStats() {
    return {
      bookCount: BookModel.countBooks(),
      authorCount: AuthorModel.countAuthors(),
      borrowedCount: BookModel.countBorrowedBooks(),
    };
  }

  routes = [
    { url: '/api/stats', method: 'GET', handler: this.getStats },
  ];
}

module.exports = new StatsController();
