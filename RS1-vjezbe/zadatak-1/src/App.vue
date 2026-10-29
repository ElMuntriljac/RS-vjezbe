<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const automobili = ref([])
const ucitavanje = ref(true)
const greska = ref('')
const pretraga = ref('')
const marka = ref('')
const gorivo = ref('')
const redoslijed = ref('zadano')
const odabrani = ref(null)
const dijalog = ref(null)
watch(odabrani, async (auto) => {
  await nextTick()
  if (auto) dijalog.value.showModal()
  else dijalog.value.close()
})
const formatBroja = new Intl.NumberFormat('hr-HR')
const novac = new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const marke = computed(() => [...new Set(automobili.value.map(auto => auto.marka))].sort())
const goriva = computed(() => [...new Set(automobili.value.map(auto => auto.gorivo))].sort())
const rezultati = computed(() => {
  const pojam = pretraga.value.trim().toLocaleLowerCase('hr')
  const popis = automobili.value.filter(auto =>
    `${auto.marka} ${auto.model}`.toLocaleLowerCase('hr').includes(pojam) &&
    (!marka.value || auto.marka === marka.value) && (!gorivo.value || auto.gorivo === gorivo.value))
  if (redoslijed.value === 'jeftinije') popis.sort((a, b) => a.cijena - b.cijena)
  if (redoslijed.value === 'skuplje') popis.sort((a, b) => b.cijena - a.cijena)
  if (redoslijed.value === 'novije') popis.sort((a, b) => b.godina - a.godina)
  return popis
})
function resetiraj() {
  pretraga.value = ''; marka.value = ''; gorivo.value = ''; redoslijed.value = 'zadano'
}
async function ucitaj() {
  ucitavanje.value = true
  greska.value = ''
  try {
    // Preglednik (klijent) traži JSON datoteku od statičkog poslužitelja.
    const odgovor = await fetch(`${import.meta.env.BASE_URL}automobili.json`)
    if (!odgovor.ok) throw new Error(`HTTP ${odgovor.status}`)
    automobili.value = await odgovor.json()
  } catch {
    greska.value = 'Katalog trenutačno nije dostupan. Pokušaj ponovno.'
  } finally { ucitavanje.value = false }
}
onMounted(ucitaj)
</script>

<template>
  <header class="header">
    <a class="logo" href="./" aria-label="AutoAtlas početna"><span class="logo-icon">A</span>Auto<span>Atlas</span><span class="logo-dot">.</span></a>
    <a class="nav-link" href="#katalog">Katalog automobila <span>↗</span></a>
  </header>
  <main>
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow"><span></span> PRONAĐI SVOJ SLJEDEĆI AUTOMOBIL</p>
        <h1>Dobar izbor počinje<br />dobrim <em>pregledom.</em></h1>
        <p class="intro">Od gradskih favorita do otvorene ceste. Istraži modele, usporedi osnovne podatke i pronađi automobil po svojoj mjeri.</p>
        <a class="hero-link" href="#katalog">Istraži katalog <span>↓</span></a>
      </div>
      <div class="hero-art" aria-hidden="true">
        <span class="art-caption">AUTOATLAS / ODABRANI MODELI</span><div class="orbit"></div>
        <svg viewBox="0 0 600 300" class="hero-car"><ellipse cx="310" cy="253" rx="251" ry="17" fill="#000" opacity=".22"/><path d="M52 205 85 166 183 148 250 91 Q267 78 300 80 L390 88 458 150 526 168 Q548 175 552 203 L546 235 58 235Z" fill="#d6e0d7"/><path d="m201 148 61-50 43 0-4 50Z" fill="#243931"/><path d="m315 99 65 6 49 45-114-2Z" fill="#243931"/><path d="m66 192 75-14-12 21-67 11Zm426-18 40 14 7 14-44-9Z" fill="#f7edc5"/><path d="M158 158 450 163M312 159v57" stroke="#9cae9f" stroke-width="3"/><rect x="329" y="168" width="22" height="4" rx="2" fill="#657d6c"/><path d="m62 220 486-1" stroke="#9bad9f" stroke-width="8"/><circle cx="161" cy="230" r="39" fill="#1b2420"/><circle cx="161" cy="230" r="22" fill="#a5b4aa"/><circle cx="161" cy="230" r="9" fill="#34473b"/><circle cx="459" cy="230" r="39" fill="#1b2420"/><circle cx="459" cy="230" r="22" fill="#a5b4aa"/><circle cx="459" cy="230" r="9" fill="#34473b"/></svg>
        <div class="art-bottom"><span>Stil. Praktičnost. Sloboda.</span><span>01 — 06</span></div>
      </div>
    </section>
    <section id="katalog" class="catalogue">
      <div class="section-heading"><div><p class="eyebrow muted">KATALOG</p><h2>Pronađi svoj smjer<span>.</span></h2></div><span class="collection-note">Šest modela. Različiti karakteri.</span></div>
      <div class="filters">
        <label class="search"><span>Pretraži</span><input v-model="pretraga" type="search" placeholder="Marka ili model automobila" /></label>
        <label><span>Marka</span><select v-model="marka"><option value="">Sve marke</option><option v-for="ime in marke" :key="ime">{{ ime }}</option></select></label>
        <label><span>Gorivo</span><select v-model="gorivo"><option value="">Sve vrste goriva</option><option v-for="vrsta in goriva" :key="vrsta">{{ vrsta }}</option></select></label>
        <button class="reset" @click="resetiraj">Poništi filtre ↺</button>
      </div>
      <div class="results-bar"><p aria-live="polite">Prikazano <strong>{{ rezultati.length }}</strong> od {{ automobili.length }} automobila</p><label>Sortiraj <select v-model="redoslijed" aria-label="Poredak automobila"><option value="zadano">Preporučeni redoslijed</option><option value="jeftinije">Cijena: niža prema višoj</option><option value="skuplje">Cijena: viša prema nižoj</option><option value="novije">Najnovije godište</option></select></label></div>
      <p v-if="ucitavanje" class="state" role="status">Učitavanje automobila…</p>
      <div v-else-if="greska" class="state" role="alert"><p>{{ greska }}</p><button class="primary" @click="ucitaj">Pokušaj ponovno</button></div>
      <div v-else-if="!rezultati.length" class="state"><h3>Nema automobila za odabrane filtre.</h3><p>Pokušaj s drugim pojmom ili ukloni filtre.</p><button class="primary" @click="resetiraj">Prikaži sve automobile</button></div>
      <div v-else class="grid">
        <article v-for="auto in rezultati" :key="auto.id" class="card">
          <div class="car-image" :style="{ '--car-color': auto.boja }"><span class="body-tag">{{ auto.karoserija }}</span><span class="car-number">0{{ auto.id }}</span>
            <svg viewBox="0 0 420 210" role="img" :aria-label="`Stilizirana ilustracija: ${auto.marka} ${auto.model}`"><ellipse cx="213" cy="174" rx="170" ry="10" fill="#000" opacity=".09"/><path :d="auto.karoserija === 'Karavan' ? 'M35 144 54 111 126 97 161 57 274 57 320 105 365 119 384 144 380 165 37 165Z' : 'M35 144 54 116 128 99 174 59 252 59 310 105 365 119 384 144 380 165 37 165Z'" fill="var(--car-color)"/><path d="m145 101 37-32h33v32Zm80-32h23l43 34-66-2Z" fill="#30433f"/><path d="m44 136 52-10-7 14-49 6Zm305-11 23 11 5 9-28-6Z" fill="#fcf4d6"/><path d="M115 109h194M223 112v40" stroke="#000" opacity=".16" stroke-width="2"/><rect x="234" y="117" width="15" height="3" rx="1" fill="#000" opacity=".3"/><path d="M39 157h338" stroke="#000" opacity=".12" stroke-width="5"/><circle cx="111" cy="161" r="28" fill="#28302e"/><circle cx="111" cy="161" r="16" fill="#c6cdca"/><circle cx="111" cy="161" r="6" fill="#67736e"/><circle cx="311" cy="161" r="28" fill="#28302e"/><circle cx="311" cy="161" r="16" fill="#c6cdca"/><circle cx="311" cy="161" r="6" fill="#67736e"/></svg>
          </div>
          <div class="card-content"><p class="brand">{{ auto.marka }}</p><h3>{{ auto.model }}</h3><p class="specs">{{ auto.godina }} <span>·</span> {{ formatBroja.format(auto.km) }} km <span>·</span> {{ auto.gorivo }}</p><div class="card-bottom"><strong>{{ novac.format(auto.cijena) }}</strong><button :aria-label="`Detalji za ${auto.marka} ${auto.model}`" @click="odabrani = auto">Detalji <span>↗</span></button></div></div>
        </article>
      </div>
      <p class="disclaimer">Demonstracijski katalog · Podaci i cijene su ogledni. Ilustracije ne prikazuju stvarni izgled modela.</p>
    </section>
  </main>
  <footer><span class="footer-brand">AutoAtlas.</span><span>Raspodijeljeni sustavi · Vježba 1</span><a href="#">Povratak na vrh ↑</a></footer>
  <dialog ref="dijalog" @close="odabrani = null" @cancel.prevent="odabrani = null">
    <div v-if="odabrani" class="detail"><button class="close" autofocus aria-label="Zatvori detalje" @click="odabrani = null">✕</button><p class="eyebrow muted">POGLED IZBLIZA</p><h2>{{ odabrani.marka }} {{ odabrani.model }}</h2><dl><div v-for="[naziv, vrijednost] in [['Godište', odabrani.godina], ['Gorivo', odabrani.gorivo], ['Snaga', `${odabrani.snaga} kW`], ['Kilometraža', `${formatBroja.format(odabrani.km)} km`], ['Mjenjač', odabrani.mjenjac], ['Karoserija', odabrani.karoserija]]" :key="naziv"><dt>{{ naziv }}</dt><dd>{{ vrijednost }}</dd></div></dl><p class="detail-price">{{ novac.format(odabrani.cijena) }}</p><button class="primary" @click="odabrani = null">Natrag na katalog</button></div>
  </dialog>
</template>
