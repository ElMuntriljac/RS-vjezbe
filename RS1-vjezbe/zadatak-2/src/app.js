import express from 'express'
import cors from 'cors'
import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'

const automobili = JSON.parse(readFileSync(new URL('../data/automobili.json', import.meta.url), 'utf8'))
const normaliziraj = value => value.toLocaleLowerCase('hr').trim()

export function createApp({ frontendOrigin = process.env.FRONTEND_ORIGIN } = {}) {
  const app = express()
  // Samo ogledna pohrana: briše se restartom i nije zajednička više instanci.
  const upiti = []
  app.disable('x-powered-by')
  app.use(cors({ origin: frontendOrigin || '*' }))
  app.use(express.json({ limit: '10kb' }))

  app.get('/', (req, res) => res.json({ naziv: 'AutoAtlas REST API', verzija: '1.0.0', endpointi: ['GET /api/health', 'GET /api/automobili', 'GET /api/automobili/:id', 'POST /api/upiti'] }))
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

  app.get('/api/automobili', (req, res) => {
    const { q = '', marka = '', gorivo = '' } = req.query
    if (![q, marka, gorivo].every(value => typeof value === 'string')) {
      return res.status(400).json({ greska: 'Parametri q, marka i gorivo moraju biti tekst.' })
    }
    const rezultati = automobili.filter(auto =>
      normaliziraj(`${auto.marka} ${auto.model}`).includes(normaliziraj(q)) &&
      (!marka || normaliziraj(auto.marka) === normaliziraj(marka)) &&
      (!gorivo || normaliziraj(auto.gorivo) === normaliziraj(gorivo)))
    res.json(rezultati)
  })

  app.get('/api/automobili/:id', (req, res) => {
    const auto = automobili.find(auto => String(auto.id) === req.params.id)
    if (!auto) return res.status(404).json({ greska: 'Automobil nije pronađen.' })
    res.json(auto)
  })

  app.post('/api/upiti', (req, res) => {
    if (!req.is('application/json')) return res.status(415).json({ greska: 'Potreban je Content-Type: application/json.' })
    const { automobilId, ime, email, poruka } = req.body || {}
    if (!Number.isInteger(automobilId) || !automobili.some(auto => auto.id === automobilId)) {
      return res.status(400).json({ greska: 'Odaberi postojeći automobil (automobilId kao cijeli broj).' })
    }
    if (typeof ime !== 'string' || !ime.trim() || ime.length > 100 ||
        typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        typeof poruka !== 'string' || !poruka.trim() || poruka.length > 2000) {
      return res.status(400).json({ greska: 'Unesi ime (1–100 znakova), valjan email i poruku (1–2000 znakova).' })
    }
    if (upiti.length >= 1000) return res.status(503).json({ greska: 'Ogledna pohrana je puna. Pokušaj nakon ponovnog pokretanja servisa.' })
    const upit = { id: randomUUID(), automobilId, ime: ime.trim(), email: email.trim(), poruka: poruka.trim(), stvoren: new Date().toISOString() }
    upiti.push(upit)
    res.status(201).json({ id: upit.id, automobilId, stvoren: upit.stvoren, poruka: 'Upit je zaprimljen u oglednu pohranu.' })
  })

  app.use((req, res) => res.status(404).json({ greska: 'Endpoint nije pronađen.' }))
  app.use((error, req, res, next) => {
    if (error.type === 'entity.parse.failed') return res.status(400).json({ greska: 'Neispravan JSON.' })
    if (error.type === 'entity.too.large') return res.status(413).json({ greska: 'Tijelo zahtjeva je preveliko.' })
    console.error(error)
    res.status(500).json({ greska: 'Pogreška poslužitelja.' })
  })
  return app
}
