const UserModel = require('../models/UserModel');
const Auth = require('../core/Auth');

class AuthController {
  postLogin(query, body) {
    const user = UserModel.checkUser(body && body.login, body && body.password);
    if (!user) {
      return { success: false };
    }
    return {
      success: true,
      token: Auth.createToken(user.id),
      user: { id: user.id, login: user.login },
    };
  }

  postLogout(query, body, params, token) {
    Auth.revokeToken(token);
    return { success: true };
  }

  routes = [
    { url: '/api/auth/login',  method: 'POST', handler: this.postLogin,  public: true },
    { url: '/api/auth/logout', method: 'POST', handler: this.postLogout },
  ];
}

module.exports = new AuthController();
