# Ohjeet Rappiopedian kehittämiseen

Rappiopedia on suomalaisen striimaus- ja nettiviihteen tietosanakirja. Sivusto kertoo ihmisistä, ohjelmista ja tapahtumista sekä näyttää niiden yhteydet Rappioverse-nimisellä 3D-kartalla. Kävijän pitää pystyä lukemaan aiheesta kuin tietosanakirjasta ja siirtymään sen jälkeen kiinnostaviin yhteyksiin.

## Kirjoittaminen

- Kirjoita **hyvää, tavallista suomea**. Oleta, ettei lukija tunne aihetta ennestään.
- **Henkilöartikkelin ensimmäinen kappale on esittely, ei yhteysluettelo.** Kerro henkilön nimi ja tunnettu nimimerkki, mistä hänet tunnetaan, mitä hän tekee tai on tehnyt ja mikä hänen julkisen toimintansa tausta on. Esimerkiksi yksi vierailu PactTalksissa tai osallistuminen PactHouseen ei yksin ole riittävä henkilöesittely.
- Selvitä henkilöstä mahdollisuuksien mukaan myös hänen toimintaansa **ennen verkostoon kirjattuja tapahtumia**: oma tuotanto, kanavat, ura, esiintymiset ja muu julkinen historia. Älä päättele puuttuvia elämäkertatietoja pelkistä graafin yhteyksistä.
- **Merkittävät tapahtumat saavat omat alaotsikkonsa.** Kerro henkilöä koskevista tärkeistä tapahtumista, vaikka ne eivät yhdistäisi häntä muihin solmuihin. Esimerkiksi Upin vuonna 2026 sattunut parvekeonnettomuus kuuluu hänen artikkelissaan omaan, lähteistettyyn osioonsa. Kerro mitä tapahtui ja milloin; älä spekuloi tapahtuman syyllä tai seurauksilla.
- Jäsennä artikkeli aiheen mukaan: esimerkiksi Tausta, Striimausura, Onnettomuus lokakuussa 2026 tai Muu julkisuus. Älä käytä otsikoita vain mallin täyttämiseksi.
- Kerro tapahtumista, esiintymisistä, tuotannoista ja muista olennaisista asioista kokonaisin virkkein. Älä kirjoita muistiinpanotyylisiä luetteloita kuten ”Striimaaja; vieras; tapahtumakonteksti”.
- Käytä otsikoita vain, kun niiden alla on oikeaa sisältöä. Älä pakota jokaiseen artikkeliin samaa ”Yhteenveto / Dokumentoidut yhteydet / Tulkinnan rajat” -rakennetta.
- **Älä lisää artikkelien loppuun automaattisia varaumia** tyyliin ”yhteinen esiintyminen ei itsessään osoita taloudellista yhteistyötä”. Kerro epävarmuudesta siinä kohdassa, jossa se koskee käsiteltävää väitettä.
- Huhut, julkinen spekulaatio, ristiriitaiset kertomukset ja henkilökohtaiset tapahtumat voivat olla merkittäviä osia aiheen historiaa. Älä jätä niitä pois yleisen kiellon perusteella. Kirjoita, kuka väitteen esitti, missä ja milloin; erottele tapahtumat, väitteet ja myöhemmät oikaisut. Älä muuta huhua omaksi faktaväitteeksi.
- Älä kirjoita toimitusprosessista tai graafin rakenteesta osaksi henkilön elämäkertaa. Ilmaukset kuten ”tämä muodostaa verkostosillan” kuuluvat työmuistiinpanoihin, eivät artikkeliin.
- Pidä henkilöiden, ohjelmien, tapahtumien ja julkaisujen nimet sekä ajankohdat tarkkoina. Älä täytä aukkoja arvauksilla.

## Lähteet ja yhteydet

`src/data/network.json` sisältää solmut (`nodes`), niiden väliset yhteydet (`edges`) ja lähteet (`sources`). Jokaisella yhteydellä on lähdeviite. Kirjoita yhteyden `label` niin, että lukija ymmärtää, mitä tapahtui: esimerkiksi ”vieraili lähetyksessä”, ”osallistui kilpailuun” tai ”järjesti tapahtuman”.

Näyttötasot ovat:
- `verified`: lähde näyttää tai vahvistaa kuvatun tapahtuman suoraan
- `reported`: tapahtumasta kerrotaan uutisessa, haastattelussa tai yksilöidyssä silminnäkijäkuvauksessa
- `observed`: lähteestä tehty havainto tai perusteltu tulkinta
- `lead`: avoin tai ristiriitainen tieto, joka vaatii selvittämistä

Käytä myös Ylilautaa, Redditiä ja muita julkisia keskusteluja lähteinä, kun niiden sisältö liittyy käsiteltävään asiaan. Merkitse lähteeksi yksittäinen ketju tai viesti, ei vain keskustelupalstan etusivua. Kerro suoraan, jos tieto perustuu keskustelussa esitettyyn kertomukseen. Älä esitä arvauksia varmoina tapahtumina tai keksi puuttuvia yksityiskohtia.

Tarkista ennen uuden solmun lisäämistä, löytyykö sama henkilö tai tapahtuma jo toisella nimellä. Pidä solmujen tunnisteet vakaina: artikkeleiden linkit ja sivuston URL-osoitteet käyttävät niitä.

## Tutkimusaiheet, joita ei vielä ole selvitetty

Avoimet tutkimusaiheet pidetään tiedostossa [`research/leads.json`](research/leads.json). Se on agenttien työjono, ei osa sivuston julkaistavaa sisältöä.

- Lue tutkimusjono ennen uutta lähdekartoitusta. Valitse tärkeä avoin kysymys tai lisää uusi, jos aihe puuttuu.
- Yhdistä tutkimus nykyisiin `nodeIds`- ja `sourceIds`-tunnisteisiin. Merkitse `questions`-kenttään selvitettävät asiat, `queries`-kenttään käyttökelpoiset haut ja `nextSteps`-kenttään seuraavat tarkistukset.
- Kirjaa ristiriitaiset väitteet ja keskeneräiset havainnot `notes`-kenttään lähteineen. Julkiseen artikkeliin kuuluu se, mistä voidaan kirjoittaa lähteiden perusteella; työnkulun ohjeet, avoimet hakulistat ja agentin omat muistiinpanot jäävät tutkimustiedostoon.
- Kun selvitys etenee, täydennä lähteet ja artikkeli tarvittaessa. Päivitä samalla tutkimusaiheen tila (`open`, `in-progress`, `blocked` tai `done`). Älä merkitse aihetta ratkaistuksi, jos kysymyksiä jäi.
- `docs/RESEARCH_LOG.md` on päivättyjen havaintojen tekstimuotoinen loki; `research/leads.json` on koneellisesti luettava lista jatkotyöstä.

Tutkimustiedosto ei käynnistä automaattista tutkimusta itsestään. Sitä käyttävät agentit lukevat ja päivittävät sitä osana tehtäväänsä.

## Artikkelit ja tekniikka

| Polku | Sisältö |
| --- | --- |
| `src/data/network.json` | Solmut, yhteydet ja lähteet |
| `research/leads.json` | Agenttien jatkotutkimukset; ei näytetä sivustolla |
| `src/articles/<id>.md` | Varsinaiset artikkelitekstit |
| `src/wiki.js` | Artikkelien näyttäminen ja automaattinen perusteksti |
| `src/main.js` | 3D-kartta, haku, suodattimet ja yhteyspolut |
| `src/lib/graph.js` | Yhteyspolkujen haku |
| `src/lib/hierarchy.js` | Kartan visuaalinen ryhmittely |
| `index.html`, `src/styles.css` | Käyttöliittymä ja ulkoasu |
| `scripts/process_images.py` | Kuvien pienentäminen WebP-muotoon |

Artikkelissa `[[jethro|Jethro Rostedt]]` avaa toisen artikkelin ja `[@P6]` linkittää lähteeseen. Markdown-tuki on rajattu: käytä otsikoita, kappaleita, luetteloita, lihavointia, kursivointia ja lainauksia. Raakaa HTML:ää ja tavallisia Markdown-URL-linkkejä ei renderöidä.

`node.note` näkyy kartan kuvauksissa ja siitä voidaan muodostaa lyhyt artikkeliteksti. Sen pitää kertoa, kuka tai mikä aihe on, ei vain listata verkostosuhteita. Kirjoita lyhyt esittely kokonaisin virkkein.

Automaattisesti tuotettu perusteksti ei korvaa toimitettua henkilöartikkelia. Tärkeistä henkilöistä kirjoitetaan Markdown-artikkeli, jossa on myös tausta, ura ja merkittävät tapahtumat.

**Ennen henkilöartikkelin hyväksymistä:** saako uusi lukija heti selville, kuka henkilö on? Käsitelläänkö hänen omaa toimintaansa ja elämäntapahtumiaan, vai onko sivu pelkkä luettelo suhteista muihin solmuihin?

Käyttöliittymä on suomenkielinen, vaalea ja tietosanakirjamainen. Säilytä 3D-kartan pyöritys, zoomaus, siirtäminen ja kohteiden avaaminen. PACTin ohjelmat kuuluvat samaan kartalla näytettävään ryhmään.

## Muutosten tekeminen

1. Tutki olemassa oleva data ja koodi ennen muutoksia. Korjaa lähteeseen, älä vain näkyvään tekstiin.
2. Lisää uusi lähde `sources`-osioon ja kirjaa sitä vastaavat solmut tai yhteydet. Älä kierrätä vanhaa lähde-ID:tä eri tarkoitukseen.
3. Kirjoita tai päivitä artikkeli. Tarkista viitteet, linkit, nimet ja päivämäärät.
4. Jos lisäät kuvia, käytä `scripts/process_images.py`-skriptiä. Se tuottaa pienet WebP-kuvat `public/images/`-hakemistoon. Ohjeet ovat [sisällön lisäysoppaassa](docs/CONTENT_AUTHORING.md).
5. Aja `npm test` ja `npm run build`. GitHub Actions huolehtii GitHub Pages -julkaisusta.

Tutkimuksen hakutavat löytyvät [tutkimusoppaasta](docs/RESEARCH_PLAYBOOK.md). Avoimet havainnot kirjataan [tutkimuslokiin](docs/RESEARCH_LOG.md).
