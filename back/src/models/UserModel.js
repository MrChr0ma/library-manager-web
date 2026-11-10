const Database = require('../core/Database');

class UserModel {
  getUserByLogin(login) {
    if (!login) {
      return false;
    }
    const users = Database.getFile('users') || [];
    return users.find(user => user && user.login === login) || false;
  }

  checkUser(login, password) {
    const user = this.getUserByLogin(login);
    if (user && user.password === password) {
      return user;
    }
    return false;
  }
}

module.exports = new UserModel();
