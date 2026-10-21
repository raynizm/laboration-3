# Reflektion: Laboration 3 – Skriv en applikation med din modul

## 1. Meningsfulla namn

De vanligaste namnen för fel och händelser brukar bli `err` och `e`. Hos mig har det blivit en vana att förkorta namn eftersom det går fortare att skriva och ger kortare rader. Problemet är att namnen blir för generiska och inte beskriver vad variabeln är eller gör. Clean Code kallar det att namnen inte avslöjar sin avsikt.

Några saker som rättades i koden:

- Namngivning i refaktoreringen: `inputClass` blev `inputClassName`, händelsevariabeln `e` blev `event`, och de magiska talen fick namn i `src/passwordGeneration.js` (`SIMPLE_PASSWORD_LENGTH`, `STRONG_PASSWORD_LENGTH`, `STRONG_PASSWORD_GROUP_SIZE`) och `src/components/UsersTable.jsx` (`MIN_ROWS`, `COLUMN_COUNT`, `PLACEHOLDER_ROW_HEIGHT`).
- Namn som avslöjar avsikt: `useUsers` returnerar `addUser`/`removeUser`, `validateUser` returnerar `{ isValid, errors }`, och vi har `fillPassword` och `handleClear`. Knappen döptes om från Cancel till Clear och `handleCancel` följde med. `username` blev `name` genom hela koden.
- Kvarvarande svagheter: `form` är ett allmänt namn, `addUser` returnerar en boolean som heter `created` i anropet (det är inte självklart vad `true` betyder utan JSDoc), och databaskolumnerna är snake_case (`password_hash`) medan JavaScript är camelCase (`passwordRecord`).
- Aliaset `form-validation` valdes för att den andra modulens paketnamn (`laboration-2`) krockade med mitt eget.

## 2. Funktioner

Det är ett klassiskt problem att funktioner gör mer än vad de borde, eller mer än vad namnet säger. Det händer ofta när man är mitt uppe i kodskrivandet och prioriterar att få funktionen att fungera framför att strukturera koden. Då måste man lägga tid på att gå tillbaka och refaktorisera för att koden ska bli lättare att följa. Vårt tankesätt skiljer sig från dag till dag, och det jag tänkte när jag skrev koden kan jag ha glömt nästa gång jag öppnar den. Det händer mig väldigt ofta, och med små, enkla funktioner går det ändå att tyda vad skaparen tänkte.

Några exempel i repot:

- Största exemplet: `src/App.jsx` var en komponent på 256 rader som skötte tillstånd, API-anrop, validering och layout. Den är nu 29 rader och sätter bara ihop `CreateUserForm`, `UsersTable` och `useUsers`. Största filen efter refaktoreringen är `CreateUserForm.jsx` med 104 rader.
- Små funktioner med ett ansvar: `request()` i `src/api/usersApi.js` (gemensam felkontroll för `fetchUsers`/`createUser`/`deleteUser`), `fillPassword`, `handleClear`, samt `UserRow` och `PlaceholderRows` i `UsersTable.jsx`.
- Flaggargument: de två knapparna för lösenord blev två funktioner (`generateSimplePassword`, `generateStrongPassword`) i stället för en funktion med en boolean-flagga.
- `handleSubmit` i `CreateUserForm.jsx` gör fortfarande tre saker (validera, anropa `onCreate`, tömma formuläret) och är det som ligger närmast att bryta mot "gör en sak". I modulen validerar `generate()` i `password-generator.js` längden, bygger teckenpoolen och loopar, men har hjälpfunktioner (`validateLength`, `randomIndex`) utbrutna.

## 3. Kommentarer

Kommentarer är ett kraftfullt men ibland underskattat verktyg. Ibland räcker inte namngivningen eller enkla funktioner för att förklara avsikten, och då är en kommentar eller JSDoc det bästa alternativet. Vissa kommentarer tycker jag är lite redundanta eftersom namnen redan beskriver koden, men jag lät dem vara kvar för tydlighetens skull. Repot är litet och enkelt, så jag har inte behövt kommentera allt, men det finns några exempel:

- Appens kod har få kommentarer och använder JSDoc främst där intentionen inte syns i namnen: `useUsers` ("Failed requests set `error` instead of throwing into the components"), `validateUser` (vad `errors` innehåller) och `insertUser` (att `passwordRecord` är det `SecureHasher.hashWithSalt()` returnerar).
- Förklarande kommentarer som faktiskt tillför något: `// Express recognises error handlers by their four parameters.` i `server/index.js`, och `// Serves the built frontend (npm run build) in production.`
- Kommentarer som togs bort: en `eslint-disable`-rad (onödig och fel verktyg, projektet använder oxlint) samt kommentaren om omsamplingen när slingan ströks.
- Modulen har mycket JSDoc (`@file`, `@typedef`, `@param` på alla funktioner). Jag tycker att en del av den är redundant, men lät den vara.

## 4. Formatering

Jag formaterade koden med Prettier (`--no-semi --single-quote`), men jag körde det för hand. Det finns ingen `.prettierrc` i repot, så inget verktyg ser till att stilen hålls. Det är en brist, men den är lätt att fixa.

Filerna är små, ingen är längre än ungefär 104 rader, och de läses uppifrån och ned som en tidningsartikel. `App.jsx` visar först hur sidan är uppbyggd och låter komponenterna sköta detaljerna. Sådant som hör ihop ligger nära varandra. I `database.js` kommer schemat först och sedan `listUsers`, `insertUser` och `deleteUser`. `UserRow` och `PlaceholderRows` ligger i samma fil som `UsersTable`, eftersom det är där de används.

Det som inte stämmer är stilen mellan projekten. Min modul använder semikolon, men appen och den andra studentens modul gör det inte. I ett riktigt team hade vi behövt en gemensam konfiguration.

## 5. Objekt och datastrukturer

För det mesta använder appen vanliga datastrukturer. Formuläret är `{ name, email, password, confirmPassword }`, felen är `{ fält: [meddelanden] }` och en användare är `{ id, name, email }`. Funktionerna i `usersApi.js` och `database.js` jobbar bara med sådan data.

`SecureHasher` är ett riktigt objekt. Man använder det utan att veta hur det fungerar inuti, och det ger tillbaka en datastruktur, `{ hash, salt, algorithm, iterations }`, som `insertUser` sparar.

Den andra modulen är blandad. Dess objekt som `ValidationError` och `Field` har publika fält som man läser direkt, till exempel `error.field.identifier`. Jag ville inte att det skulle spridas i hela appen. Därför läser bara `src/validation.js` de fälten och ger resten av appen ett enkelt `{ isValid, errors }`. Då följer jag Demeters lag, eftersom komponenterna aldrig behöver gräva i modulens objekt. Nackdelen är att `validation.js` ändå beror på hur modulen är uppbyggd inuti.

## 6. Felhantering

Innan refaktoreringen brydde sig appen inte alls om att ett `fetch`-anrop kunde misslyckas. Nu kastar `request()` i `usersApi.js` ett fel om svaret inte är ok. `useUsers` fångar felet och visar ett meddelande, till exempel "Could not create user". Om det går fel när man skapar en användare behåller formuläret det man skrivit.

På servern finns en felhanterare i `server/index.js`. Ett trasigt JSON-anrop ger 400 i stället för 500, och riktiga serverfel loggas utan att detaljerna skickas till klienten. `POST` svarar 400 om lösenordet saknas.

Fel i formuläret ser jag inte som undantag, för det är normalt att någon skriver fel. Därför returnerar `validateUser` felen som data, ett per fält.

Det finns saker jag inte är nöjd med. `addUser` returnerar `true` eller `false` i stället för att kasta ett fel, och det avråder Clean Code från. `catch {}` i `useUsers` slänger bort det ursprungliga felet. Servern validerar dessutom inte namn och e-post, vilket jag har skrivit som en känd begränsning i `TEST_REPORT.md`.

## 7. Gränser

Appen har tre ställen där min kod möter kod jag inte kontrollerar, och varje ställe har en egen fil:

- `src/passwordGeneration.js` döljer min egen modul.
- `src/validation.js` döljer den andra studentens modul.
- `server/database.js` döljer `node:sqlite`.

Om någon av dem ändras behöver jag bara ändra en fil. På samma sätt samlar `src/api/usersApi.js` alla anrop mot servern, så komponenterna känner inte till några URL:er. Modulerna är vanliga beroenden i `package.json` och inte inkopierad kod.

Två saker kunde vara bättre. `SecureHasher` används direkt i `usersRouter.js` utan något eget lager emellan. Den andra modulen saknar också `main` och `exports`, så `validation.js` måste importera från `form-validation/src/Rule.js`. Det går sönder om de byter mappstruktur. Jag skrev inga egna "learning tests", men testfallen i `TEST_REPORT.md` gjorde ungefär samma sak, eftersom de visade hur valideringen och generatorn beter sig.

## 8. Enhetstester

Jag har inga automatiska tester för appen i repot. Jag testade för hand och med några engångsskript: curl mot API:et, valideringsreglerna i Node och en jsdom-körning av hela komponentträdet. Skripten låg utanför repot och resultaten finns i `TEST_REPORT.md`.

Testerna var ändå värda det. jsdom-körningen efter refaktoreringen hittade en riktig bugg. Platshållarraderna i `UsersTable.jsx` använde indexet som `key` och kunde få samma nyckel som ett användar-id, så tabellen visade dubbla rader.

Enligt FIRST var skripten snabba och visade själva om de lyckades. Men andra kunde inte köra om dem, eftersom jag inte checkade in dem, och då fungerar de inte som riktiga enhetstester. Om jag gjorde om det skulle jag börja med `validateUser` och `request()`. De är små och behöver ingen databas.

Min modul har 21 tester som körs med `npm test`, utan testramverk. Där finns mina riktiga enhetstester.

## 9. Klasser

I appen finns inga egna klasser, eftersom jag använder funktionskomponenter och hooks. Principen om ett enda ansvar syns ändå i hur jag delade upp koden. `CreateUserForm` sköter formulärets tillstånd och inskick. `TextField` och `PasswordField` visar ett fält. `UsersTable` visar listan, `useUsers` håller användarna och pratar med API:et, och på servern har `database.js`, `usersRouter.js` och `index.js` var sin uppgift.

`CreateUserForm` har hög sammanhållning. Dess tre tillståndsvariabler, `form`, `errors` och `passwordVisible`, används av nästan alla funktioner i den. `PasswordField` äger ingen logik själv utan får sina hanterare via props.

I min modul har `PasswordGenerator`, `SecureHasher` och `StrengthAnalyzer` var sitt ansvar. Appen använder två av dem. Den andra modulens `Rule`-klasser har subklasser som `RequiredRule` och `EmailRule`, så man kan lägga till nya regler utan att ändra `Validation`. Det är öppen/stängd-principen, och det gjorde det enkelt för mig, eftersom jag bara behövde sätta ihop färdiga regler.

## 10. System

Appen är uppdelad i lager där varje lager bara pratar med nästa: komponent, `useUsers`, `usersApi.js`, HTTP, `usersRouter.js` och till sist `database.js`. Objekten som `new PasswordGenerator()` och `new SecureHasher()` skapas en gång högst upp i filen och används sedan. Inställningar som `PORT` och `DB_FILE` kommer från miljövariabler, så samma kod fungerar både lokalt och på Render.

I utvecklingsläge skickar Vite `/api` vidare till Express. I produktion serverar Express den byggda frontenden, så allt ligger på samma adress och jag behöver ingen CORS. `npm run dev` startar båda delarna med `concurrently`. Som i figur 1 är det fyra separata projekt: appen, min modul, den andra modulen och modulens tester. Modulerna hämtas via `git+https`-URL:er, och `.npmrc` gör att `npm install` fungerar för andra.

Det som är sämst är `database.js`. Den öppnar databasen direkt när filen importeras. Det gör den svår att testa med en annan databas, och jag använde inte beroendeinjektion.

## 11. Din modul i en ny roll

*Vilka förändringar gjorde du i din modul, och vad i återkopplingen från Workshop 2 påverkade dem?
Fanns det förbättringar du avstod från, eller fick lösa på annat sätt, för att inte bryta
bakåtkompatibiliteten för den som använder modulen?*

Svar:

Denna del har jag inte arbetat med då jag inte deltog i Workshop 2 vilket resulterade i att jag inte gjorde några ändringar i min modul.

## 12. Att använda någon annans modul

*Hur var det att använda en annan students modul? Vad i dess gränssnitt och dokumentation gjorde
den lätt eller svår att använda – och vad lärde det dig om din egen modul?*

Svar:

Själva gränssnittet var lätt att använda. Man skapar ett `Field`, lägger på regler med `addRule` och kör `Validation.validate(data)`. Jag kunde skriva egna felmeddelanden direkt i konstruktorn, till exempel `new RequiredRule('Name is required.')`, och jag fick alla fel på en gång. Formulärets nycklar passade rakt av som fältnamn, och `MatchingFieldsRule('password')` fick hela formuläret som data. Det fungerade också som dokumentationen sa: ett tomt fält ger bara felet från `RequiredRule`.

Det svåra var allt runt omkring. Paketnamnet `laboration-2` var samma som mitt eget, så jag fick ge den ett alias. `package.json` saknar `main` och `exports`, så jag var tvungen att importera från `form-validation/src/Rule.js`. README säger bara hur man klonar, och länkarna i `package.json` pekar på ett annat repo. Det står också i `TEST_REPORT.md`.

Det fick mig att tänka på min egen modul. Min `package.json` har `exports`, så den går att importera med paketnamnet, men min README visar en lokal sökväg och säger inget om hur man installerar den som beroende. En modul är inte lätt att använda förrän installationen och importen fungerar utan att man behöver läsa källkoden.

## 13. AI-samarbete

*Beskriv kort vilka delar av inlämningen du tagit fram tillsammans med AI-assistenter (t.ex.
ChatGPT, GitHub Copilot, Claude), och hur. Har du inte använt AI-assistenter, skriv det.*

Svar:

I arbetet med appen använde jag Claude Code som en granskare. Jag bad den peka ut funktioner och variabelnamn som inte följer Clean Code. Jag frågade också om det var enklast att spara data i en JSON-fil eller att sätta upp en databas, och fick förslaget att använda SQLite. Claude kontrollerade även att jag följde bokens anvisningar och råd.

AI fungerar bra om man ger den en roll att spela. När jag bad den kontrollera mitt arbete och ge feedback gick det åt mindre tid till refaktorisering och felsökning, och jag fick fler lärdomar och aha-upplevelser på vägen :)

*Skilde sig ditt AI-samarbete när du skrev en applikation åt användare, jämfört med när du skrev
en modul åt andra programmerare i laboration 2? Var det till exempel till mer eller mindre hjälp
vid kravarbetet, gränssnittet, integrationen av modulerna eller förbättringen av din modul?*

Svar:

I laboration 2 använde jag AI för att få förslag på idéer och krav som jag använde som grund for modulen. I den här laborationen fungerade den mer som en granskare som rättade mig när jag inte följde Clean Code.
