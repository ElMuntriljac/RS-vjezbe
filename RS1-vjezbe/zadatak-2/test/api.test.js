import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'
import { createApp } from '../src/app.js'

const server = createApp({ frontendOrigin: 'https://frontend.example' }).listen(0, '127.0.0.1')
await once(server, 'listening')
const base = `http://127.0.0.1:${server.address().port}`
after(() => new Promise(resolve => server.close(resolve)))

test('health i CORS za konfigurirani frontend', async () => {
  const res = await fetch(`${base}/api/health`, { headers: { Origin: 'https://frontend.example' } })
  assert.equal(res.status, 200)
  assert.equal(res.headers.get('access-control-allow-origin'), 'https://frontend.example')
  assert.deepEqual(await res.json(), { status: 'ok' })
})
test('popis, kombinacija filtara i prazan rezultat', async () => {
  assert.equal((await (await fetch(`${base}/api/automobili`)).json()).length, 6)
  const popis = await (await fetch(`${base}/api/automobili?marka=bmw&gorivo=dizel&q=320`)).json()
  assert.equal(popis.length, 1)
  assert.equal(popis[0].id, 2)
  assert.deepEqual(await (await fetch(`${base}/api/automobili?q=nepostojeci`)).json(), [])
  assert.equal((await fetch(`${base}/api/automobili?q=a&q=b`)).status, 400)
})
test('detalji i nepostojeći resursi', async () => {
  assert.equal((await (await fetch(`${base}/api/automobili/1`)).json()).model, 'Golf 8')
  assert.equal((await fetch(`${base}/api/automobili/999`)).status, 404)
  assert.equal((await fetch(`${base}/nepoznato`)).status, 404)
})
test('POST prihvaća valjan upit i odbija nevaljane zahtjeve', async () => {
  const posalji = body => fetch(`${base}/api/upiti`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const body = { automobilId: 1, ime: 'Test', email: 'test@example.com', poruka: 'Zanima me automobil.' }
  const res = await posalji(body)
  assert.equal(res.status, 201)
  assert.ok((await res.json()).id)
  assert.equal((await posalji({ ...body, email: 'nevaljano' })).status, 400)
  assert.equal((await posalji({ ...body, automobilId: 999 })).status, 400)
  assert.equal((await fetch(`${base}/api/upiti`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })).status, 400)
  assert.equal((await fetch(`${base}/api/upiti`, { method: 'POST', body: 'tekst' })).status, 415)
})
