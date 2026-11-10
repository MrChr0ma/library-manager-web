Import([], function () {
  const TOKEN_KEY = 'auth_token';

  class Api {
    static getToken() {
      return localStorage.getItem(TOKEN_KEY);
    }
    static setToken(token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    static clearToken() {
      localStorage.removeItem(TOKEN_KEY);
    }

    static async request(path, method, body) {
      const headers = { 'Content-Type': 'application/json' };
      const token = Api.getToken();
      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
      }
      const options = { method: method || 'GET', headers };
      if (body !== undefined) {
        options.body = JSON.stringify(body);
      }

      let response;
      try {
        response = await fetch('/api' + path, options);
      } catch (err) {
        return { error: 'network_error' };
      }

      if (response.status === 401 && path !== '/auth/login') {
        Api.clearToken();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return { error: 'unauthorized' };
      }

      try {
        return await response.json();
      } catch (err) {
        return {};
      }
    }

    static login(login, password) {
      return Api.request('/auth/login', 'POST', { login, password });
    }
    static async logout() {
      await Api.request('/auth/logout', 'POST');
      Api.clearToken();
    }

    static getStats() {
      return Api.request('/stats');
    }

    static getBooks(search) {
      const q = search ? '?search=' + encodeURIComponent(search) : '';
      return Api.request('/book' + q);
    }
    static getBook(id) {
      return Api.request('/book/' + id);
    }
    static createBook(data) {
      return Api.request('/book', 'POST', data);
    }
    static editBook(id, data) {
      return Api.request('/book/' + id, 'PUT', data);
    }

    static getAuthors(search) {
      const q = search ? '?search=' + encodeURIComponent(search) : '';
      return Api.request('/author' + q);
    }
    static getAuthor(id) {
      return Api.request('/author/' + id);
    }
    static createAuthor(data) {
      return Api.request('/author', 'POST', data);
    }
    static editAuthor(id, data) {
      return Api.request('/author/' + id, 'PUT', data);
    }
  }

  return Api;
});
