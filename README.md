# laboration-3

## Vision

En enkel webbapplikation för att registrera och administrera användarkonton. Den som administrerar användare fyller i namn, e-postadress och lösenord, får hjälp att skapa ett säkert lösenord och ser direkt vilka användare som finns registrerade. Applikationen bygger på min modul för lösenordsgenerering (laboration 2) och en annan students valideringsmodul.

## Krav

| ID | Krav |
| --- | --- |
| K1 | Applikationen visar alla registrerade användare (ID, namn och e-postadress) i en tabell som hämtas från databasen. |
| K2 | En användare kan skapas genom att ange namn, e-postadress och lösenord, och sparas i en SQLite-databas. |
| K3 | Lösenord sparas aldrig i klartext, utan som saltad hash (PBKDF2-SHA256) framtagen med modulen laboration-2. |
| K4 | En användare kan tas bort från tabellen, och tas då även bort ur databasen. |
| K5 | Namn är obligatoriskt. |
| K6 | E-postadress är obligatorisk och måste ha ett giltigt format. |
| K7 | Lösenord är obligatoriskt, minst 8 tecken och innehåller minst en versal och en gemen. |
| K8 | Bekräfta lösenord är obligatoriskt och måste matcha lösenordet. |
| K9 | Användaren kan få ett slumpmässigt lösenord genererat (knappen "Generate password"). |
| K10 | Användaren kan få ett starkt lösenord genererat, indelat i grupper med bindestreck (knappen "Generate strong password"). |
| K11 | Lösenordet kan visas och döljas med en ögonknapp. |
| K12 | Formuläret kan tömmas med knappen "Clear", inklusive eventuella felmeddelanden. |
| K13 | Vid ogiltig indata visas ett felmeddelande vid respektive fält och ingen användare skapas. |

## Moduler

| Modul | Används till | Repo |
| --- | --- | --- |
| Min modul från laboration 2 (`laboration-2`) | Generering av lösenord (`PasswordGenerator`, K9 och K10) och hashning av lösenord på servern (`SecureHasher`, K3) | https://github.com/raynizm/laboration-2 |
| Annan students modul (`form-validation`) | Validering av formuläret, krav K5–K8 och K13 | https://github.com/Fielifia/form-validation |

Modulerna installeras som beroenden direkt från GitHub och ligger inte i applikationens källkod. Den andra modulens `package.json` heter också `laboration-2`, så den installeras under aliaset `form-validation`.

## Köra applikationen lokalt

Kräver Node.js 22.13 eller senare (utvecklad med Node.js 26) eftersom databasen använder Node.js inbyggda `node:sqlite`.

```bash
git clone https://github.com/raynizm/laboration-3.git
cd laboration-3
npm install
npm run dev
```

`npm run dev` startar både gränssnittet (http://localhost:5173) och API:et (http://localhost:3001). Databasen skapas som filen `users.db` första gången API:et startar. Filen `.npmrc` tillåter npm att installera modulerna från GitHub.

Övriga kommandon: `npm run build` (bygger för produktion), `npm run lint` och `npm run server` (startar bara API:et; `PORT` och `DB_FILE` styr port och databasfil).

## Projektstruktur

```text
server/
├── index.js          Startar Express och kopplar ihop routern och felhanteringen
├── usersRouter.js    API-rutter för /api/users
└── database.js       SQLite: schema och frågor

src/
├── App.jsx           Sidans layout
├── api/usersApi.js   Anrop mot API:et
├── hooks/useUsers.js Användarlistan och dess felstatus
├── components/       Formulär, fält, tabell och ikoner
├── passwordGeneration.js  Kopplingen till laboration-2-modulen
└── validation.js     Kopplingen till form-validation-modulen
```

## Tillgängliggörande

Applikationen är driftsatt på Render och nås på https://laboration-3-68dy.onrender.com/. Den byggs från detta GitHub-repo med `npm install --include=dev && npm run build` och startas med `npm start`.

## Test

Testfall och resultat finns i [TEST_REPORT.md](TEST_REPORT.md).
