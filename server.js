const express = require('express');
const cors = require('cors');
const app = express();

// Povolit CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.urlencoded({ extended: true }));

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

// Middleware pro Basic Auth (pro TC10)
function checkBasicAuth(req) {
  const auth = parseBasicAuth(req.headers['authorization']);
  return auth && auth.user === VALID_USER && auth.pass === VALID_PASS;
}

// Úvodní stránka s formulářem

app.get('/', (req, res) => {
  const auth = parseBasicAuth(req.headers['authorization']);
  if (auth && auth.user === VALID_USER && auth.pass === VALID_PASS) {
    return sendSuccessPage(res);
  }

  // Pokud není validní Basic Auth → zobrazíme formulář
  res.send(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>HP Poly AV Control Access</title>
<style>
body{font-family:Arial,sans-serif;text-align:center;margin-top:50px}
h1{font-size:2em;color:#333}
form{margin-top:20px}
input{padding:10px;font-size:16px;margin:5px}
button{padding:10px 20px;font-size:16px;cursor:pointer}
</style>
</head>
<body>
<h1>HP Poly AV Control Access</h1>
/login
<input type="text" name="username" placeholder="Username" required><br>
<input type="password" name="password" placeholder="Password" required><br>
<button type="submit">Login</button>
</form>
</body>
</html>`);
});


// Zpracování formuláře
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === VALID_USER && password === VALID_PASS) {
    return sendSuccessPage(res);
  } else {
    return sendAccessDenied(res);
  }
});

// Funkce pro zobrazení SUCCESS a automatické odhlášení po 10s
function sendSuccessPage(res) {
  res.send(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>SUCCESS</title>
<style>
body{font-family:Arial,sans-serif;text-align:center;margin-top:50px}
h1{font-size:3em;color:green}
p{font-size:1.5em;margin-top:20px}
</style>
<script>
let countdown = 10;
function updateCountdown() {
  document.getElementById('count').textContent = countdown;
  if (countdown === 0) {
    window.location.href = '/logout';
  } else {
    countdown--;
    setTimeout(updateCountdown, 1000);
  }
}
window.onload = updateCountdown;
</script>
</head>
<body>
<h1>SUCCESS</h1>
<p>Logging out in <span id="count">10</span> seconds...</p>
</body>
</html>`);
}

// Funkce pro zobrazení ACCESS DENIED
function sendAccessDenied(res) {
  res.send(`<!DOCTYPE html>
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

// Logout endpoint
app.get('/logout', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Restart</title>
<style>
body{font-family:Arial,sans-serif;text-align:center;margin-top:50px}
h1{font-size:2em;color:#333}
</style>
</head>
<body>
<h1>ACCESS SUCCESSFUL - RESTART APP</h1>
<p><a href="/">Return to Home</a></p>
</body>
</html>`);
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
