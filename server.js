const express = require('express');
const cors = require('cors');
const app = express();

// Povolit CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Pomocná funkce pro dekódování Basic Auth
function parseBasicAuth(header) {
  if (!header || !header.startsWith('Basic ')) return null;
  const base64 = header.substring(6);
  try {
    const decoded = Buffer.from(base64, 'base64').toString('utf8');
    const idx = decoded.indexOf(':');
    if (idx === -1) return null;
    return { user: decoded.substring(0, idx), pass: decoded.substring(idx + 1) };
  } catch (e) {
    return null;
  }
}

// Přihlašovací údaje
const VALID_USER = process.env.BASIC_USER || 'AVControl';
const VALID_PASS = process.env.BASIC_PASS || '123';

// Middleware pro Basic Auth
function requireAuth(req, res, next) {
  const auth = parseBasicAuth(req.headers['authorization']);
  if (auth && auth.user === VALID_USER && auth.pass === VALID_PASS) {
    return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="AV Control"');
  res.status(401).send(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>ACCESS DENIED</title>
<style>
body{font-family:Arial,sans-serif;text-align:center;margin-top:50px}
h1{font-size:3em;color:#c00}
</style>
</head>
<body>
<h1>ACCESS DENIED</h1>
</body>
</html>`);
}

// Endpoint pro odhlášení po 10 sekundách
app.get('/logout', (req, res) => {
  res.set({
    'WWW-Authenticate': 'Basic realm="Restricted"',
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  res.status(401).send(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Logged out</title>
<style>
body{font-family:Arial,sans-serif;text-align:center;margin-top:50px}
h1{font-size:2em;color:#c00}
</style>
</head>
<body>
<h1>ACCESS SUCCESSFUL - RESTART APP</h1>
</body>
</html>`);
});

// Chráněný endpoint s odpočítáváním 10 sekund
app.get('/', requireAuth, (req, res) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  res.status(200).send(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>SUCCESS</title>
<style>
body{font-family:Arial,sans-serif;text-align:center;margin-top:50px}
h1{font-size:3em;color:green}
.countdown{font-size:2em;color:#333;margin-top:20px}
</style>
<script>
let seconds = 10;
function updateCountdown() {
  document.getElementById('countdown').textContent = seconds;
  if (seconds === 0) {
    window.location.href = '/logout';
  } else {
    seconds--;
    setTimeout(updateCountdown, 1000);
  }
}
window.onload = updateCountdown;
</script>
</head>
<body>
<h1>SUCCESS</h1>
<div class="countdown">Redirecting in <span id="countdown">10</span> seconds...</div>
</body>
</html>`);
});

// Health check pro Render
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
