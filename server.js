// server.js (Variant A)
// HP Poly AV Control – Node.js/Express server
// Varianta A: automatická autentizace se určí už při doručení úvodní stránky
// HTTPS zajišťuje Render.com na proxy vrstvě (není potřeba vlastní HTTPS server).

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');

const app = express();

// --- Config via environment variables ---
const BASIC_USER = process.env.BASIC_USER || 'admin';
const BASIC_PASS = process.env.BASIC_PASS || 'changeme';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '*')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

// --- Security & middleware ---
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

// --- CORS setup ---
const corsOptions = {
  origin: function (origin, callback) {
    // Povolit požadavky bez Origin (např. embedded webview TC10) nebo z whitelistu
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

// --- Helper: validate Basic Auth from header ---
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

// --- API pro ruční login (formulář + SEND) ---
app.post('/login', (req, res) => {
  let ok = validateBasicAuthHeader(req);
  if (!ok) {
    const { username, password } = req.body || {};
    ok = username === BASIC_USER && password === BASIC_PASS;
  }
  return res.json({ ok });
});

// --- Úvodní stránka s injekcí __AUTO_OK__ podle Authorization při navigaci ---
app.get('/', (req, res) => {
  const ok = validateBasicAuthHeader(req);
  const indexPath = path.join(__dirname, 'public', 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  html = html.replace('</head>', `<script>window.__AUTO_OK__=${ok ? 'true' : 'false'};</script></head>`);
  res.send(html);
});

// Statické soubory
app.use(express.static('public'));

// Fallback pro další cesty → index bez injekce (stačí pro SPA routování, auto flag je jen na '/')
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Start serveru
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`HP Poly AV Control (Variant A) běží na portu ${PORT}`);
});
