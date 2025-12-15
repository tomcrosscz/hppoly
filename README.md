# HP Poly AV Control Access – Variant A

Tato varianta řeší **automatickou autentizaci** už při doručení úvodní stránky:
server na `/` zkontroluje hlavičku `Authorization: Basic …` a vloží do HTML flag `window.__AUTO_OK__`.
UI podle něj okamžitě zobrazí **SUCCESS** nebo ponechá formulář pro ruční přihlášení.

- **HTTPS** řeší Render.com automaticky (TLS terminace na proxy, aplikace naslouchá na HTTP).
- **CORS** je povolen s whitelist politikou (`ALLOWED_ORIGINS`).
- **Ruční login** (`/login`) stále funguje pomocí tlačítka **SEND**.

## Nasazení
1. GitHub repo → Render **Web Service**.
2. Nastavte env: `BASIC_USER`, `BASIC_PASS`, `ALLOWED_ORIGINS`.
3. Na TC10 nastavte v AV Controls **Authorization: Username & Password** se stejnými údaji.

## Poznámky
- Volba **Restrict to Same Origin** na TC10 je vhodná, pokud vše běží z jedné domény.
- Přihlašovací údaje nikdy neukládáme do cookies; každé načtení dělá nové ověření.
