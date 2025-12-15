# HP Poly AV Control Access (HTML5 + Node/Express)

Tento balíček obsahuje jednoduchou HTML5 aplikaci a Node/Express server, které společně zajišťují:

- Úvodní stránku **HP Poly AV Control Access** s formulářem `username`/`password` a tlačítkem **SEND**.
- Automatickou autentizaci přes **Basic Auth** (Poly **TC10** dokáže posílat hlavičku `Authorization: Basic ...`).
- Podporu **CORS** (konfigurovatelný seznam povolených originů).
- **HTTPS** je zajištěno automaticky na Render.com (SSL/TLS terminace na proxy vrstvě platformy).
- Po úspěšné autentizaci se zobrazí **SUCCESS**, proběhne **10 s** odpočítávání s blikajícím textem *ACCESS SUCCESSFUL - RESTARTING APP* a stránka se restartuje.
- Po neúspěšné autentizaci se zobrazí **ACCESS DENIED**, **10 s** odpočítávání s *ACCESS UNSUCCESSFUL - RESTARTING APP* a stránka se restartuje.

## Struktura projektu

```
hp-poly-av-control/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server.js
├── package.json
├── render.yaml
├── .env.example
└── README.md
```

## Jak to funguje

- **Automatická autentizace**: při načtení stránky skript volá `GET /auth/auto`. Pokud TC10 vloží `Authorization: Basic ...` (z nastavení AV Control), server ji ověří a stránka rovnou zobrazí stav **SUCCESS** a odpočítávání.
- **Ruční přihlášení**: zadáte `username` a `password`, kliknete **SEND**. Aplikace odešle `POST /login` s hlavičkou `Authorization: Basic ...` a současně s JSON tělem (fallback). Server ověří přihlašovací údaje proti hodnotám v prostředí.
- **Odhlášení / restart**: po 10 s se stránka znovu načte (bez stavové paměti). Pokud je na TC10 nastavena automatická autorizace, další načtení znovu proběhne automaticky.

## Konfigurace (env)

Vytvořte `.env` podle `.env.example`:

```
BASIC_USER=admin
BASIC_PASS=changeme
ALLOWED_ORIGINS=*
PORT=10000
```

> **Poznámka k CORS:** `ALLOWED_ORIGINS` může být `*` nebo čárkou oddělený seznam přesných originů (např. `https://example.com,https://panel.local`). Hlavička `Authorization` je povolená.

## Nasazení na Render.com

1. Vytvořte nový **Web Service** z propojeného GitHub repozitáře.
2. Render automaticky zajistí **TLS certifikáty** a přesměruje **HTTP → HTTPS**; v aplikaci tedy stačí poslouchat na HTTP (`app.listen`).
3. V části **Environment** nastavte `BASIC_USER`, `BASIC_PASS`, případně `ALLOWED_ORIGINS`.
4. Volitelně použijte `render.yaml` pro deklarativní nastavení služby.

## Příprava GitHub repozitáře

- Commitujte celý obsah složky.
- Přidejte tajné hodnoty (`BASIC_PASS`) až v Render Dashboardu, ne do repozitáře.

## Nastavení Poly TC10 (AV Control)

- Na TC10 otevřete webové rozhraní **System Settings → Enable A/V Controls** a jako **Provider** zvolte **Custom**.
- Do **App URL** zadejte URL služby nasazené na Render (např. `https://hp-poly-av-control.onrender.com`).
- V **Authorization** zvolte **Username & Password** a zadejte stejné hodnoty jako `BASIC_USER`/`BASIC_PASS` na serveru.
- **Restrict to Same Origin** ponechte podle potřeby (pokud načítáte pouze jednu aplikaci z jednoho serveru, doporučeno **Enabled**).

## Lokální spuštění

```bash
npm install
npm run dev
# http://localhost:10000
```

## Bezpečnostní poznámky

- Ověření přihlašovacích údajů probíhá **na serveru**; klient nikdy neuděluje přístup bez ověření.
- Neuchovávají se cookies ani relace; každé načtení provádí nové ověření.
- Na produkci změňte `BASIC_PASS` a nepoužívejte `*` v `ALLOWED_ORIGINS`, pokud provádíte cross-origin požadavky s povolováním původu.

## Licence

MIT
