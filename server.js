
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
const VALID_USER = 'AVControl';
const VALID_PASS = '123';

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

// ✅ Logout endpoint – NECHRÁNĚNÝ
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
a{display:inline-block;margin-top:16px;padding:10px 20px;font-size:16px;text-decoration:none;border:1px solid #ccc}
</style>
</head>
<body>
<h1>You have been logged out</h1>
/Back to home</a>
</body>
</html>`);
});

// ✅ Chráněný endpoint s tlačítkem Logout
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
.actions{margin-top:24px}
button{padding:10px 20px;font-size:16px;cursor:pointer}
a{display:inline-block;margin-top:12px;padding:10px 20px;font-size:16px;text-decoration:none;border:1px solid #ccc}
form{display:inline-block}
</style>
</head>
<body>
<h1>SUCCESS</h1>
<div class="actions">
  <!-- Formulář pro GET na /logout -->
  /logout
    <button type="submit">Logout</button>
  </form>
  <!-- Alternativně odkaz -->
  /logoutLogout</a>
</div>
</body>
</html>`);
});

// Health check pro Render
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
