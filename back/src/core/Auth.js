class Auth {
  tokens = {};

  createToken(userId) {
    const token = Date.now().toString(36) +
                  Math.random().toString(36).substring(2) +
                  Math.random().toString(36).substring(2);
    this.tokens[token] = userId;
    return token;
  }

  verifyToken(token) {
    if (!token) return false;
    return this.tokens[token] !== undefined;
  }

  revokeToken(token) {
    if (token && this.tokens[token] !== undefined) {
      delete this.tokens[token];
    }
  }
}

module.exports = new Auth();
