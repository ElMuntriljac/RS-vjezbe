# Zadatak 2 — AutoAtlas REST API

Zaseban Express.js REST poslužitelj. Vue frontend ostaje u `../zadatak-1` i zasad koristi svoje statičke podatke. Povezivanje frontenda s ovim API-jem i deploy oba servisa slijede kasnije.

## Lokalno pokretanje (Git Bash)

Potreban je Node.js 22.12 ili noviji.

```bash
cd "/c/Raspodjeljeni sustavi/RS-vjezbe/RS1-vjezbe/zadatak-2"
npm ci
npm start
```

API je na `http://localhost:3000`. Za provjere: `npm test`. Za razvoj s automatskim restartom: `npm run dev`.

## Endpointi

| Metoda | Putanja | Odgovor |
| --- | --- | --- |
| GET | `/` | Informacije o API-ju |
| GET | `/api/health` | Status servisa (200) |
| GET | `/api/automobili` | JSON popis automobila (200) |
| GET | `/api/automobili?marka=BMW&gorivo=Dizel&q=320` | Filtrirani popis; prazan rezultat je `[]` |
| GET | `/api/automobili/:id` | Automobil (200) ili greška (404) |
| POST | `/api/upiti` | Zaprimljen upit (201) ili greška ulaza (400) |

POST zahtijeva `Content-Type: application/json` i polja `automobilId` (cijeli broj), `ime`, `email`, `poruka`. Primjer je u `primjeri/upit.json`. Neispravan JSON vraća 400, preveliko tijelo 413, a pogrešan tip sadržaja 415. Nepostojeće putanje vraćaju 404.

Automobili se čitaju iz vlastite `data/automobili.json`, bez ovisnosti o direktoriju zadatka 1. Upiti su ogledno spremljeni u memoriju procesa, ne šalju email i brišu se pri restartu. Nema baze ni autentifikacije. Koristiti izmišljene podatke pri demonstraciji.

## curl — lokalni zahtjevi

Pokrenuti iz direktorija `zadatak-2` u drugom Git Bash terminalu dok server radi:

```bash
API_URL="http://localhost:3000"
curl -i "$API_URL/api/health"
curl -i "$API_URL/api/automobili"
curl -i "$API_URL/api/automobili?marka=BMW&gorivo=Dizel"
curl -i "$API_URL/api/automobili/1"
curl -i "$API_URL/api/automobili/999"
curl -i -X POST "$API_URL/api/upiti" -H "Content-Type: application/json" --data-binary @primjeri/upit.json
```

Nakon deploya zamijeniti `API_URL` stvarnom HTTPS adresom API servisa i ponoviti zahtjeve. Opcija `-i` prikazuje status i zaglavlja.

## Postman

Uvesti datoteku `primjeri/AutoAtlas.postman_collection.json` preko **Import**. Kolekcija ima varijablu `baseUrl` postavljenu na `http://localhost:3000`. Slati zahtjeve gumbom **Send** i provjeriti JSON i HTTP status. Nakon deploya zamijeniti `baseUrl` adresom Render API-ja i ponoviti zahtjeve. Pri POST zahtjevu koristiti **Body → raw → JSON** ako se zahtjev izrađuje ručno.

## Priprema za Render Web Service

U Renderu kasnije odabrati **New → Web Service**, povezati repozitorij `ElMuntriljac/RS-vjezbe` i postaviti:

| Polje | Vrijednost |
| --- | --- |
| Branch | `main` |
| Root Directory | `RS1-vjezbe/zadatak-2` |
| Runtime | Node |
| Build Command | `npm ci` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

Port se preuzima iz Renderove varijable `PORT`, uz lokalni zadani 3000. Server sluša na `0.0.0.0`. `FRONTEND_ORIGIN` je opcionalna varijabla: nakon objave frontenda postaviti njegov origin bez završne kose crte, npr. `https://ime-frontenda.onrender.com`. Bez nje CORS dopušta sve origine radi lokalne demonstracije. CORS upravlja pristupom iz preglednika, nije autentifikacija.

Službene upute: https://render.com/docs/deploy-node-express-app

## Preostalo nakon lokalne izrade

- Git commit/push nakon korisnikova odobrenja.
- Deploy API-ja kao Web Service i Vue aplikacije kao Static Site.
- Zahtjevi curlom i Postmanom prema stvarnom Render URL-u.
- Nadogradnja Vue aplikacije: dohvat popisa i detalja te slanje upita na objavljeni API, uz obradu učitavanja i grešaka.
- Upis stvarnih URL-ova i dokaza testiranja nakon deploya.

API još nije objavljen na Renderu; primjeri zahtjeva nisu dokaz testiranja objavljenog servisa.
