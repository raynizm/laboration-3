# Test Report

## Summary

The requirements K1–K13 in [README.md](README.md) were tested in two ways, so that someone else can repeat them.

**Scripted checks (no browser).** These cover the API, the validation rules and the password generation:

- **API (K1–K4):** a separate server instance was started with an empty, temporary database (`PORT=3101 DB_FILE=<temporary file> node server/index.js`). Requests were sent with `curl` to `/api/users`, and the database row was read directly from the SQLite file. The stored password record was checked with `SecureHasher.verifyPassword` from the laboration-2 module.
- **Validation (K5–K8, K13):** the validation configuration in `src/validation.js` was run in Node.js on different inputs, and `isValid` and the error messages were read from the result.
- **Password generation (K9, K10):** `PasswordGenerator` from the laboration-2 module was called in Node.js with the same arguments the buttons use.

**Manual tests in the browser (K1, K2, K4, K9–K13).** The app was started with `npm run dev` (http://localhost:5173), and the steps in the *Input* column were carried out by hand and compared with the *Expected outcome* column.

The deployed instance at https://laboration-3-68dy.onrender.com/ was only checked for loading (the start page and `GET /api/users` both returned status 200). The test cases above were not repeated against it.

**Hardest to test.** The user interface needs a real browser, so those cases are manual and not automated. Password generation is random, so the tests check the format (length, character types, dash groups) and not exact values.

## Test Results

**Your test results:**

| Test case | Requirement | Input | Expected outcome | Actual outcome |
| --------- | ----------- | ----- | ---------------- | -------------- |
| List users, empty database | K1 | `GET /api/users` | `[]` | ✅ `[]` |
| Show users in the interface | K1 | Create a user and reload the page. | The user is shown in the table; empty placeholder rows fill the table to at least five rows. | ✅ As expected. |
| Create a user | K2 | `POST /api/users` with name `Anna`, email `anna@example.com`, password `Secret123`. | Status 201 and the user (without password) is returned; the user appears in the list. | ✅ `{"id":1,"name":"Anna","email":"anna@example.com"}`, and the user is in `GET /api/users`. |
| Create a user without password | K2 | `POST /api/users` with name and email but no password. | Status 400 and no user is created. | ✅ `{"error":"Password is required"}` with status 400; the list was unchanged. |
| Password is stored as a hash | K3 | Read the row for the user above directly from SQLite and check it with `SecureHasher.verifyPassword`. | `password_hash` and `password_salt` are filled in, `password_algorithm` is `PBKDF2-SHA256`, the plaintext `Secret123` is not in the row; the right password verifies and a wrong one is rejected. | ✅ As expected; `verifyPassword('Secret123')` returned `true` and `verifyPassword('nope')` returned `false`. |
| Delete a user | K4 | `DELETE /api/users/1` | Status 204; the user is gone from the list. | ✅ 204 and `[]`. |
| Delete a user in the interface | K4 | Click the trash can on a row. | The row disappears immediately and does not come back after a reload. | ✅ As expected. |
| Empty name | K5 | Name left empty, other fields valid. | Error: `Name is required.` | ✅ `Name is required.` (checked with all fields empty). |
| Empty email address | K6 | Email left empty. | Error: `Email address is required.` | ✅ `Email address is required.` (checked with all fields empty). |
| Invalid email address | K6 | Email `a@b` | Error: `Enter a valid email address.` | ✅ `Enter a valid email address.` |
| Empty password | K7 | Password left empty. | Error: `Password is required.` | ✅ `Password is required.` (checked with all fields empty). |
| Password too short | K7 | Password `Abcdefg` | Error: `Password must be at least 8 characters.` | ✅ As expected. |
| Password without uppercase letter | K7 | Password `abcdefgh1` | Error: `Password must contain an uppercase letter.` | ✅ As expected. |
| Password without lowercase letter | K7 | Password `ABCDEFGH1` | Error: `Password must contain a lowercase letter.` | ✅ As expected. |
| Valid input | K7, K8 | Name `Ann`, email `a@b.com`, password and confirmation `Abcdefg1`. | Validation succeeds with no errors. | ✅ `isValid: true`, no errors. |
| Confirmation missing | K8 | Confirm password left empty. | Error: `Please confirm the password.` | ✅ As expected (checked with all fields empty). |
| Confirmation does not match | K8 | Password `Abcdefg1`, confirmation `Abcdefg2`. | Error: `Passwords do not match.` | ✅ As expected. |
| Generate a password | K9 | `generate(8)` in Node.js, and clicking "Generate password" in the browser. | A random password of 8 letters and digits, filled into both password fields. | ✅ `q4Z4P3vY`; the button fills both fields. |
| Generate a strong password | K10 | `generate(18, { pattern: true, groupSize: 6 })` in Node.js, and clicking "Generate strong password" in the browser. | 18 characters in three groups separated by `-`, filled into both password fields. | ✅ `uap7EY-0pYhz8-D47txP`; the button fills both fields. |
| Show and hide the password | K11 | Click the eye button. | Password and confirmation switch between dots and text; the icon changes. | ✅ As expected. |
| Clear the form | K12 | Fill in the fields, cause errors, click "Clear". | All fields and error messages are cleared. | ✅ As expected. |
| Error messages next to the fields | K13 | Click "Create" with an empty form. | A red border and an error message under each field; no user is created. | ✅ As expected. |

## Known Issues in Third-Party Modules

The other student's module (`form-validation`) validated correctly in every test above. These flaws affected how it could be installed and imported. They do not change the test results, and no issue has been filed in the module's repository yet.

- **Package name clash.** Its `package.json` is named `laboration-2`, the same as my own module, so the two clash when installed. Handled by installing it under an alias (`form-validation`).
- **No entry point.** `package.json` has no `main` or `exports`, so the module cannot be imported by its package name. Handled by importing the files directly, for example `form-validation/src/Rule.js`.
- **No install instructions.** Its README only describes cloning the repository, not using it as a dependency.
- **Wrong repository links.** `repository`, `bugs` and `homepage` in `package.json` point to `Fielifia/1dv610-laboration-2` instead of `Fielifia/form-validation`.
