# AV Control Basic Auth App

Tato aplikace slouží k ověření funkčnosti přístupu z Poly TC10 / Studio X.

## Funkce
- Basic Auth (uživatel: AVControl, heslo: 123)
- Po úspěšné autentizaci zobrazí stránku SUCCESS
- Automaticky odpočítá 10 sekund a poté provede odhlášení (ACCESS SUCCESSFUL - RESTART APP)
- Pokud autentizace selže, zobrazí ACCESS DENIED
- Podpora CORS
- HTTPS zajistí Render.com

## Nasazení na Render.com
1. Nahrajte obsah tohoto balíčku do GitHub repozitáře.
2. Na Render.com vytvořte novou Web Service:
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
3. Nastavte env proměnné (pokud chcete změnit login/heslo):
   - BASIC_USER
   - BASIC_PASS
4. Po deploy otevřete URL služby. Přihlaste se pomocí Basic Auth.

## Testování
- Přístup na `/` vyžaduje Basic Auth.
- Po přihlášení se zobrazí SUCCESS + odpočítávání.
- Po 10 sekundách se stránka automaticky přesměruje na `/logout` a zobrazí ACCESS SUCCESSFUL - RESTART APP.
