// server.js
// HP Poly AV Control – Node.js/Express server with Basic Auth validation, CORS, and static hosting
// HTTPS is provided automatically by Render's proxy (no HTTPS server needed here).

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

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
    // Allow requests with no origin (e.g., from embedded browsers like TC10) or matching allowed list
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

// --- API routes ---
app.get('/auth/auto', (req, res) => {
  const ok = validateBasicAuthHeader(req);
  return res.json({ ok });
});

app.post('/login', (req, res) => {
  // Prefer Authorization header; otherwise accept JSON body {username, password}
  let ok = validateBasicAuthHeader(req);
  if (!ok) {
    const { username, password } = req.body || {};
    ok = username === BASIC_USER && password === BASIC_PASS;
  }
  return res.json({ ok });
});

// Serve static assets
app.use(express.static('public'));
// Fallback to index.html
app.get('*', (req, res) => res.sendFile(__dirname + '/public/index.html'));

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`HP Poly AV Control server running on port ${PORT}`);
});
