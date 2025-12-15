// server.js (Variant A + HTTP 401 challenge)
// Cíl: zajistit, aby TC10 při primárním načtení stránky automaticky přidal Authorization: Basic
// Pokud Authorization chybí, vracíme 401 + WWW-Authenticate: Basic (challenge),
// webview TC10 by měl následně přidat hlavičku při opakovaném requestu.

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');

const app = express();

const BASIC_USER = process.env.BASIC_USER || 'admin';
const BASIC_PASS = process.env.BASIC_PASS || 'changeme';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '*')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "script-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", 'data:'],
    },
  },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed by CORS: ' + origin));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

function validateBasicAuthHeader(req) {
  const auth = req.headers['authorization'] || '';
  if (!auth.startsWith('Basic ')) return false;
  try {
    const decoded = Buffer.from(auth.replace('Basic ', ''), 'base64').toString('utf8');
    const [user, pass] = decoded.split(':');
    return user === BASIC_USER && pass === BASIC_PASS;
  } catch (e) {
    return false;
  }
}

// Logger pro ladění TC10 chování
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} origin=${req.headers.origin||'-'} auth=${req.headers.authorization? 'yes':'no'}`);
  next();
});

// Ruční login (formulář)
app.post('/login', (req, res) => {
  let ok = validateBasicAuthHeader(req);
  if (!ok) {
    const { username, password } = req.body || {};
    ok = username === BASIC_USER && password === BASIC_PASS;
  }
  return res.json({ ok });
});

// Úvodní stránka: pokud není Authorization, pošleme 401 challenge
app.get('/', (req, res) => {
  const hasAuth = !!(req.headers['authorization']);
  const ok = validateBasicAuthHeader(req);
  if (!hasAuth) {
    res.set('WWW-Authenticate', 'Basic realm="Poly AV Control"');
    return res.status(401).send('Authorization required');
  }
  // Máme Authorization, buď správná, nebo špatná → vložíme flag a zobrazíme stránku
  const indexPath = path.join(__dirname, 'public', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  html = html.replace('</head>', `<script>window.__AUTO_OK__=${ok ? 'true' : 'false'};</script></head>`);
  res.send(html);
});

// Statika
app.use(express.static('public'));

// Fallback
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`HP Poly AV Control (Variant A + challenge) běží na portu ${PORT}`);
});
