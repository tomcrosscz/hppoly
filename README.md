# Dual-mode + boot.js (bez inline skriptů)

- **Authorization=None** → `/boot.js` nastaví `window.__AUTO_OK__=false`, UI zobrazí formulář.
- **Authorization=Username & Password** → `/boot.js` nastaví `window.__AUTO_OK__=true|false` podle ověření proti `BASIC_USER`/`BASIC_PASS`.
- Žádné inline skripty → kompatibilní s přísnějšími CSP/sandbox režimy embedded webview.
- `Cache-Control: no-store` → minimalizace vlivu cache po restartu UI.

HTTPS a TLS zajišťuje Render.com automaticky (SSL terminace na proxy) citeturn1search7turn1search10.

Docs k AV Controls a režimu autorizace na TC10 viz Poly docs citeturn2search25.
