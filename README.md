# Dual-mode: TC10 Authorization None vs Username & Password

- **Authorization=None** → žádný `Authorization` header, server vloží `window.__AUTO_OK__=false` a zobrazí formulář.
- **Authorization=Username & Password** → TC10 při navigaci na App URL pošle `Authorization: Basic`, server ověří proti `BASIC_USER`/`BASIC_PASS` a vloží `window.__AUTO_OK__=true` (nebo `false`).

Pozn.: Server nikdy neposílá 401 challenge — rozlišení režimu je čistě podle přítomnosti hlavičky.

Env proměnné (`BASIC_USER` / `BASIC_PASS`) jsou jediné autoritativní údaje pro ověření (musí odpovídat nastavení na TC10 při auto režimu).

HTTPS řeší Render.com automaticky (TLS certifikáty, přesměrování HTTP→HTTPS) citeturn1search7turn1search10.

Dokumentace nastavení AV Controls a režimů autorizace na TC10 viz Poly docs citeturn2search25.
