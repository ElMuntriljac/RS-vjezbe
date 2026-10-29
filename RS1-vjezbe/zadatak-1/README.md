# AutoAtlas — katalog automobila

## Nadogradnja za zadatak 2

Objavljeni frontend: https://rs-vjezbe-wsgv.onrender.com

Vue sada dohvaća popis preko `GET https://rs-vjezbe1-api.onrender.com/api/automobili`, detalje preko `GET /api/automobili/:id` i šalje ogledni upit preko `POST /api/upiti`. Filtriranje ostaje na klijentu. Ugrađena je obrada učitavanja, grešaka i odgovora nakon slanja. Adresa API-ja može se promijeniti build varijablom `VITE_API_URL` (primjer u `.env.example`); zadana je javna adresa navedenog API-ja.

Donji opis statičkog JSON dohvata dokumentira izvornu verziju zadatka 1 (commit `cc65cbd`). Datoteka `public/automobili.json` ostaje sačuvana, ali je nadograđeni frontend više ne koristi. Frontend je i dalje statička aplikacija posluživana iz `dist/index.html`; JSON podatke sada daje zaseban Express Web Service.

Prvi zadatak iz Raspodijeljenih sustava. Jednostavna frontend aplikacija izrađena tehnologijama Vue 3 i Vite, bez zasebnog backenda.

## Funkcionalnosti

- Dohvat oglednih automobila iz `public/automobili.json` HTTP zahtjevom.
- Pretraživanje po marki i modelu, filtriranje po marki i gorivu.
- Sortiranje po cijeni i godištu te pregled detalja automobila.
- Prikaz učitavanja, greške s ponovnim pokušajem i praznih rezultata.
- Prilagodba mobilnim uređajima. SVG ilustracije su autorske stilizacije, ne fotografije modela.

## Lokalno pokretanje (Git Bash)

Potreban je Node.js 22.12 ili noviji i npm. Python nije potreban.

```bash
cd "/c/Raspodjeljeni sustavi/RS-vjezbe/RS1-vjezbe/zadatak-1"
npm ci
npm run dev
```

## Produkcijska verzija

```bash
npm run build
npm run preview
```

Vite stvara direktorij `dist` s `index.html`, `automobili.json` i izgrađenim JS/CSS datotekama. `dist` i `node_modules` nisu dio repozitorija. Stranicu treba posluživati HTTP poslužiteljem; otvaranje HTML-a dvoklikom nije predviđeno.

## Arhitektura klijent–poslužitelj

Preglednik je klijent. Render Static Site je poslužitelj statičkih datoteka. Preglednik preko HTTPS-a dohvaća `index.html`, JavaScript i CSS, a Vue zatim šalje GET zahtjev za `automobili.json`. Filtriranje i sortiranje odvijaju se na klijentu. JSON je statički sadržaj, a ne zaseban dinamički API.

## Ručni deploy na Render

U Render sučelju odabrati **New → Static Site** i povezati GitHub repozitorij `ElMuntriljac/RS-vjezbe`.

| Postavka | Vrijednost |
| --- | --- |
| Branch | `main` |
| Root Directory | `RS1-vjezbe/zadatak-1` |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist` |

Odabrati dostupno ime servisa, primjerice `rs-vjezbe-autoatlas`, i pokrenuti deploy. Render automatski izdaje TLS certifikat za dodijeljenu `https://…onrender.com` adresu. Nije potrebno ručno spremati privatni ključ certifikata u repozitorij. Ako se zahtijeva dokaz, spremiti snimku objavljene stranice s HTTPS adresom.

Nema Vue Routera pa dodatna rewrite pravila nisu potrebna. Za buduće ručne objave može se isključiti Auto-Deploy u Render postavkama.

Službene upute: https://render.com/docs/deploy-vue-js i https://vite.dev/guide/static-deploy#render

## Predaja

Poveznica na direktorij zadatka: https://github.com/ElMuntriljac/RS-vjezbe/tree/main/RS1-vjezbe/zadatak-1

URL objavljene aplikacije dopisati ovdje nakon uspješnog deploya. Aplikacija u ovoj fazi još nije objavljena.
