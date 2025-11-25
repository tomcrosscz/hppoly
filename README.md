# HP Poly AV Control Access App

## Funkce
- HTML5 úvodní stránka s textem **HP Poly AV Control Access** a formulářem pro username a password.
- Podpora automatické autentizace přes Basic Auth (TC10).
- Po úspěšné autentizaci zobrazí **SUCCESS**, odpočítá 10 sekund a automaticky odhlásí.
- Po odhlášení zobrazí **ACCESS SUCCESSFUL - RESTART APP**.
- Pokud autentizace selže, zobrazí **ACCESS DENIED**.
- Podpora CORS.
- HTTPS zajistí Render.com.

## Nasazení na Render.com
1. Nahrajte obsah tohoto balíčku do nového GitHub repozitáře.
2. Na Render.com vytvořte **Web Service**:
   - Build Command: `npm install`
   - Start Command: `npm start`
3. Nastavte env proměnné (pokud chcete změnit login/heslo):
   - BASIC_USER
   - BASIC_PASS
4. Po deploy otevřete URL služby.
