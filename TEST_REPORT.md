# Testrapport

## Sammanfattning

Kraven i [README.md](README.md) har testats på två nivåer. Logiken har körts utan webbläsare, och gränssnittet har testats manuellt i webbläsaren.

- **API (K1–K4):** en separat serverinstans startades med en tom, tillfällig databas (`PORT=3101 DB_FILE=<tillfällig fil> node server/index.js`). Anrop gjordes med `curl` mot `/api/users`, och databasinnehållet lästes direkt ur SQLite-filen.
- **Validering (K5–K8, K13):** valideringskonfigurationen i `src/validation.js` kördes med Node.js på olika indata, och resultatet (`success` och felmeddelanden) lästes av.
- **Lösenordsgenerering (K9, K10):** `PasswordGenerator` från modulen anropades i Node.js med samma argument som knapparna använder.
- **Gränssnitt (K11, K12 samt visning av K1, K2, K4, K13):** testades manuellt i webbläsaren med `npm run dev`, genom att utföra stegen i kolumnen Indata och jämföra med Förväntat utfall.

För att upprepa testen: starta `npm run dev`, följ stegen i kolumnen Indata och jämför med Förväntat utfall.

## Testfall

| Testfall | Krav | Indata | Förväntat utfall | Faktiskt utfall |
| --- | --- | --- | --- | --- |
| Lista användare, tom databas | K1 | `GET /api/users` | `[]` | `[]` (OK) |
| Skapa användare | K2 | `POST /api/users` med name `Anna`, email `anna@example.com`, password `Secret123` | Status 201 och användaren (utan lösenord) returneras; användaren syns i listan | `{"id":1,"name":"Anna","email":"anna@example.com"}`, finns i `GET /api/users` (OK) |
| Lösenord sparas som hash | K3 | Läs raden för användaren ovan direkt ur SQLite och verifiera med `SecureHasher.verifyPassword` | `password_hash` och `password_salt` är fyllda, `password_algorithm` är `PBKDF2-SHA256`, klartexten `Secret123` finns inte i raden; rätt lösenord verifieras, fel lösenord avvisas | Som förväntat; `verifyPassword('Secret123')` gav `true` och `verifyPassword('nope')` gav `false` (OK) |
| Lösenord saknas i API-anrop | K2 | `POST /api/users` med name och email men utan password | Status 400 och ingen användare skapas | `{"error":"Password is required"}` med status 400, listan oförändrad (OK) |
| Ta bort användare | K4 | `DELETE /api/users/1` | Status 204; användaren finns inte längre i listan | 204 och `[]` (OK) |
| Ta bort användare i gränssnittet | K4 | Klicka på papperskorgen på en rad | Raden försvinner direkt och kommer inte tillbaka efter omladdning | OK (manuellt test i webbläsaren) |
| Tabell visar användare i gränssnittet | K1 | Skapa en användare och ladda om sidan | Användaren visas i tabellen; tomma rader fyller ut till minst fem rader | OK (manuellt test i webbläsaren) |
| Tomt namn | K5 | name tomt, övriga fält giltiga | Fel: `Name is required.` | `Name is required.` när alla fält var tomma (OK) |
| Tom e-postadress | K6 | email tom | Fel: `Email address is required.` | `Email address is required.` när alla fält var tomma (OK) |
| Ogiltig e-postadress | K6 | email `a@b` | Fel: `Enter a valid email address.` | `Enter a valid email address.` (OK) |
| Tomt lösenord | K7 | password tomt | Fel: `Password is required.` | `Password is required.` när alla fält var tomma (OK) |
| För kort lösenord | K7 | password `Abcdefg` | Fel: `Password must be at least 8 characters.` | Felet gavs (OK) |
| Lösenord utan versal | K7 | password `abcdefgh1` | Fel: `Password must contain an uppercase letter.` | Felet gavs (OK) |
| Lösenord utan gemen | K7 | password `ABCDEFGH1` | Fel: `Password must contain a lowercase letter.` | Felet gavs (OK) |
| Lösenord som matchar | K7, K8 | name `Ann`, email `a@b.com`, password och bekräftelse `Abcdefg1` | Ingen validering misslyckas | `success: true`, inga fel (OK) |
| Bekräftelse saknas | K8 | confirmPassword tomt | Fel: `Please confirm the password.` | Felet gavs när alla fält var tomma (OK) |
| Bekräftelse matchar inte | K8 | password `Abcdefg1`, bekräftelse `Abcdefg2` | Fel: `Passwords do not match.` | Felet gavs (OK) |
| Felmeddelanden visas vid fälten | K13 | Klicka Create med tomt formulär | Röd kant och felmeddelande under varje fält; ingen användare skapas | OK (manuellt test i webbläsaren) |
| Generera lösenord | K9 | `generate(8)` | Ett slumpmässigt lösenord på 8 tecken, bokstäver och siffror | `q4Z4P3vY` (OK). Knappen och att fälten fylls i: OK (manuellt test i webbläsaren) |
| Generera starkt lösenord | K10 | `generate(18, { pattern: true, groupSize: 6 })` | 18 tecken i tre grupper åtskilda av `-` | `uap7EY-0pYhz8-D47txP` (OK). Knappen och att fälten fylls i: OK (manuellt test i webbläsaren) |
| Visa och dölj lösenord | K11 | Klicka på ögonknappen | Lösenord och bekräftelse växlar mellan prickar och text; ikonen byter utseende | OK (manuellt test i webbläsaren) |
| Töm formuläret | K12 | Fyll i fälten, orsaka fel, klicka Clear | Alla fält och felmeddelanden töms | OK (manuellt test i webbläsaren) |

## Kända begränsningar

- Valideringen körs bara i webbläsaren. API:et godtar vilken indata som helst om det anropas direkt.
- Det slumpmässiga lösenordet ("Generate password") garanterar inte att kraven i K7 uppfylls. Det kan sakna versal eller gemen och då stoppas av valideringen.
