const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();

// CORS povolen
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Statická složka
app.use(express.static('public'));

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app).listen(443, () => {
  console.log("Server běží na HTTPS na portu 443");
});
