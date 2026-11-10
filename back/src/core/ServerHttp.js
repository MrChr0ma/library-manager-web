const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const Auth = require('./Auth');
const BookController = require('../controllers/BookController');
const AuthorController = require('../controllers/AuthorController');
const StatsController = require('../controllers/StatsController');
const AuthController = require('../controllers/AuthController');

class ServerHttp {
  // Expression pour les routes commençant par /api/
  apiRegExp = /^\/api(\/.*|$)/;
  // Expression pour les routes renvoyant le favicon ou dans le dossier public du front
  staticRegExp = /^\/(public|favicon\.png|favicon\.ico)(\/.*|$)/;
  // emplacement du dossier front
  publicFrontFolder = '../front';
  // valeur non renseignée du port
  serverPort = 0;
  controllers = [
    AuthController,
    StatsController,
    BookController,
    AuthorController,
  ];

  /**
   * Fonction servant à lancer le serveur express
   */
  launchServer(port) {
    this.serverPort = port;
    this.daemon = express();
    this.daemon.use(bodyParser.json({ limit: '500mb' }));
    this.daemon.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
    this.daemon.use(this.defineAccess);
    this.daemon.all(this.apiRegExp, this.onApi.bind(this));
    this.daemon.all(this.staticRegExp, this.onStatic.bind(this));
    this.daemon.all(/.*/, this.onRoot.bind(this));
    this.daemon.listen(port, this.onServerStarted.bind(this));
  }

  /**
   * Le server est lancé
   */
  onServerStarted() {
    console.log('SERVER STARTED ON PORT ' + this.serverPort);
  }

  /**
   * Definitions des CORS
   * Permet d'éviter que le navigateur refuse la connexion
   */
  defineAccess(req, res, next) {
    const origin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    if (req.method === 'OPTIONS') {
      res.status(200);
      return res.send();
    }
    next();
  }

  onStatic(req, res) {
    const url = path.resolve(this.publicFrontFolder + req.originalUrl);
    fs.access(url, fs.F_OK, err => {
      if (!err) {
        res.sendFile(url);
      } else {
        res.status(404).end();
      }
    });
  }

  onRoot(req, res) {
    res.sendFile(path.resolve(this.publicFrontFolder + '/index.html'));
  }

  getToken(req) {
    const auth = req.headers['authorization'] || '';
    if (auth.startsWith('Bearer ')) {
      return auth.substring(7);
    }
    return null;
  }

  matchUrl(pattern, url) {
    const patternParts = pattern.split('/').filter(Boolean);
    const urlParts = url.split('/').filter(Boolean);
    if (patternParts.length !== urlParts.length) {
      return null;
    }
    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].substring(1)] = urlParts[i];
      } else if (patternParts[i] !== urlParts[i]) {
        return null;
      }
    }
    return params;
  }

  findRoute(url, method) {
    for (const controller of this.controllers) {
      for (const route of controller.routes) {
        if (route.method !== method) continue;
        const params = this.matchUrl(route.url, url);
        if (params) {
          return { controller, route, params };
        }
      }
    }
    return null;
  }

  async onApi(req, res) {
    const url = req._parsedUrl.pathname.replace(/\/$/, '');
    const method = req.method;
    const body = req.body || {};
    const query = req.query ? { ...req.query } : {};
    const token = this.getToken(req);

    const match = this.findRoute(url, method);
    if (!match) {
      return this.json(res, { error: 'not_found' }, 404);
    }

    if (!match.route.public && !Auth.verifyToken(token)) {
      return this.json(res, { error: 'unauthorized' }, 401);
    }

    try {
      const result = await match.route.handler.call(
        match.controller, query, body, match.params, token
      );
      const status = result === false ? 404 : 200;
      return this.json(res, { data: result }, status);
    } catch (err) {
      console.error(err);
      return this.json(res, { error: 'internal_server_error' }, 500);
    }
  }

  json(res, obj, code = 200) {
    res.status(code);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(obj));
  }
}

module.exports = new ServerHttp();
