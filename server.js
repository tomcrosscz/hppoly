// server.js (Dual-mode + boot.js, no inline scripts)
// Režim 1: Authorization=None -> ruční login
// Režim 2: Authorization=Username & Password -> auto-auth
// Vložený flag se doručuje přes /boot.js (dynamický JS), nikoliv inline <script>

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
      "script-src": ["'self'"], // bez inline skriptů
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

// Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} origin=${req.headers.origin||'-'} auth=${req.headers.authorization? 'yes':'no'}`);
  next();
});

// Ruční login
app.post('/login', (req, res) => {
  let ok = validateBasicAuthHeader(req);
  if (!ok) {
    const { username, password } = req.body || {};
    ok = username === BASIC_USER && password === BASIC_PASS;
  }
  res.set('Cache-Control', 'no-store');
  return res.json({ ok });
});

// Dynamický boot skript – doručí __AUTO_OK__ bez inline JS
app.get('/boot.js', (req, res) => {
  const ok = validateBasicAuthHeader(req);
  const js = `window.__AUTO_OK__=${ok ? 'true' : 'false'};`;
  res.set('Content-Type', 'application/javascript');
  res.set('Cache-Control', 'no-store');
  res.send(js);
});

// Úvodní stránka: žádný 401 challenge, žádný inline script
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  res.set('Cache-Control', 'no-store');
  res.sendFile(indexPath);
});

// Statika (no-store)
app.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
app.use(express.static('public'));

// Fallback
app.get('*', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`HP Poly AV Control (Dual-mode + boot.js) běží na portu ${PORT}`);
});
