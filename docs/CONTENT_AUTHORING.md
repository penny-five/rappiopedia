# Sisällön lisääminen Rappiopediaan

Rappiopedian sisältö koostuu artikkeleista ja niiden taustalla olevasta verkostodatasta. Artikkeli kertoo aiheesta lukijalle. Verkostodata yhdistää saman henkilön, ohjelman tai tapahtuman muihin aiheisiin.

## 1. Lisää tai päivitä solmu

Avaa [`src/data/network.json`](../src/data/network.json). Sen `nodes`-taulukossa ovat sivuston aiheet. Tarkista ensin, onko aihe jo mukana toisella nimellä.

Skenet (nimet, värit ja 3D-marginaalit) määritellään tiedostossa [`src/data/skenes.json`](../src/data/skenes.json). `old-school-tubetus` sisältää vanhemman arkitubetuksen tekijöitä (Niilo22, Iltapalamies, Markoboy87, Pasi Viheraho), `rappio` sisältää ensisijaisesti itsenäisen rappiostriimauksen, `kasinokurki` lähteistetysti Kasinokurki-nimeä lähetyksissään käyttävät tekijät. PACT-vierailu voi pysyä yhteytenä ilman että henkilö sijoitetaan PACT-skeneen. Rappiostriimauksen **ylälaatikon** marginaali on 160 yksikköä, PACTin 145 ja alalaatikoiden oletus 100. Hierarkiat määritellään tiedostossa [`src/lib/hierarchy.js`](../src/lib/hierarchy.js), jossa `rootGroup` tarkoittaa ylätason omia solmuja ilman erillistä sisälaatikkoa. `rappio` sisältää yleiset rappiostriimaajat ja `pottu-streams` Pottukoiran omaan lähetyskokonaisuuteen liittyvän sisällön. Älä päättele vierailijan kuuluvan toisen tekijän alaskeneen vain yhteislähetyksen perusteella. Hierarkiaa laajennettaessa varmista koko 3D-perheen ja alaryhmien rajalaatikot `tests/layout.test.mjs`-testillä.

Solmun kentät:
- `id`: pysyvä, lyhyt tunniste, esimerkiksi `jethro`
- `name`: sivulla näkyvä nimi
- `group`: ensisijainen skene, esimerkiksi `season3`, `rappio` tai `kasinokurki`. Ryhmän pitää löytyä `src/data/skenes.json`-rekisteristä; ryhmä ei tarkoita henkilön kaikkia yhteyksiä.
- `cat`: yleinen sisältöluokka `src/data/entity-types.json`-rekisteristä, esimerkiksi `person`, `place`, `site` tai `event`
- `types`: **lista** saman rekisterin tarkemmista tyyppi-ID:istä, esimerkiksi `["rappiostriimaaja"]` tai `["juontaja", "tosi-tv-osallistuja"]`
- `note`: lyhyt kuvaus kokonaisilla suomenkielisillä virkkeillä
- `pos3`: sijainti kartalla kolmena lukuna
- `featured`: näytetäänkö kohteen nimi kartan perustilassa

Esimerkiksi `note`-kentässä kannattaa kirjoittaa ”Jethro Rostedt voitti PactHouse 3:n ja on juontanut PactTalksia.”, ei ”PactHouse 3 -voittaja; PactTalks-juontaja”.

`types` ei ole vapaata tekstiä: tarkista, että kaikki tyypit löytyvät `src/data/entity-types.json`-rekisterin `types`-osiosta ja että niiden `category` on sama kuin solmun `cat`. Lisää uusi tyyppi ensin rekisteriin; uutta pääluokkaa varten lisää myös `categories`-merkintä. Henkilö voi olla yhtä aikaa esimerkiksi juontaja ja tosi-tv-osallistuja. Jos roolia ei tiedetä, käytä tyyppiä `henkilo`. Erota verkkosivusto (`site`), lehti (`media`), striimikanava (`channel`) ja palvelualusta (`platform`) toisistaan. Rappioverse käyttää samaa tyyppitietoa eikä korvaa sitä keskussolmu-merkinnällä.

Vanhojen solmujen tunnisteita ei kannata muuttaa, koska artikkeleiden sisäiset linkit ja sivuston osoitteet käyttävät niitä.

## 2. Merkitse yhteydet ja lähteet

`edges`-taulukossa yksittäinen yhteys sisältää:
- `a` ja `b`: yhteyden osapuolten solmu-ID:t
- `type`: tunniste `src/data/relation-types.json`-rekisterissä
- `label`: mitä juuri tässä yhteydessä tapahtui
- `level`: `verified`, `reported`, `observed` tai `lead`
- `src`: luettelo lähde-ID:istä
- tarvittaessa `date` ja `detail`

Lähteen tiedot lisätään saman tiedoston `sources`-osioon, jossa ovat lähdetunnisteet, linkit ja selitteet. Yhteyttä ei lisätä ilman lähdettä.

Suhdetyypin `forward` tarkoittaa suunnan `a → b` ilmaisua, `reverse` tarkoittaa suunnan `b → a` ilmaisua. Artikkelin yhteysryhmäotsikot määritellään erikseen `headingForward` ja `headingReverse` (symmetrisellä tyypillä `heading`) -kentillä. Käytä luettavissa otsikoissa substantiiveja, kuten ”Ohjelmavierailut” ja ”Ohjelmavieraat”, älä suoraan kartan verbejä. Jos suhde on molempiin suuntiin sama, käytä `symmetric: true` ja `verb`. Esimerkiksi isä–poika-suhteen muoto on `on isä` / `on poika`, mutta yhteinen striimaaminen on `striimasi yhdessä` kummastakin suunnasta. Lisää uudenlainen suhde ensin tyyppirekisteriin, sitten käytä tyyppiä verkostodatassa.

Käytä tarkkoja suhdekuvauksia. ”Vieraili PactTalksissa 11.10.2026” kertoo enemmän kuin ”Pact-yhteys”. Jos kyse on suunnitellusta esiintymisestä, älä nimeä sitä toteutuneeksi osallistumiseksi.

**Älä täytä `detail`-kenttää vain täyttämisen vuoksi.** Se näkyy suoraan yhteyden kuvauksen alla ja on vapaaehtoinen. Lisää siihen vain uusi, yhteyskohtainen tieto (esimerkiksi poissaolon syy, voittosumma tai tietyn tapahtuman kiistetty osallisuus). Jos `label` ja lähde jo kertovat kaiken olennaisen, jätä `detail` pois. Älä kopioi samaa selitettä kymmeniin yhteyksiin.

Huonoja kuvauksia ovat ”julkisesti kuvattu ohjelmatilanne; ei yksin muuta liikesuhdetta”, ”tallenteiden otsikkojen metadataa”, ”tarkennettava alkutuotannon lähteellä” ja ”yhteinen esiintyminen ei osoita henkilökohtaista suhdetta”. Ne ovat tutkimusprosessin kommentteja tai yleisvaraumia, eivät lukijaa auttavaa tietoa. Täsmennä sen sijaan tapahtuma `label`-kentässä ja käytä oikeaa `level`-tasoa. Lähteen puuttuva tarkistus kuuluu `research/leads.json`-jonoon, ei julkaistavaan yhteyskuvaukseen. Mahdollinen kiistäminen kirjoitetaan yksilöiden, kuka kiisti mitä.

### Mitä näyttötaso tarkoittaa?

| Taso | Milloin sitä käytetään |
| --- | --- |
| `verified` | Tallenne, kuva, ohjelman oma julkaisu tai muu alkuperäinen aineisto osoittaa kyseisen tapahtuman |
| `reported` | Tapahtuma on kerrottu uutisessa, haastattelussa tai yksilöidyssä ensikäden havainnossa |
| `observed` | Julkisista tiedoista tehdään perusteltu havainto tai tulkinta, esimerkiksi lähetysotsikoissa toistuvasta tunnisteesta |
| `lead` | Kyse on vielä selvittämättömästä, ristiriitaisesta tai välillisestä tiedosta |

Myös Reddit- ja Ylilauta-ketjut voivat olla lähteitä. Linkitä täsmällinen keskustelu ja kuvaa, mitä siinä kerrotaan. Esimerkiksi käyttäjien kuvaama yhteinen matka voidaan kirjata raportoituna tapahtumana ilman virallisia matkustusasiakirjoja. Jos ketjussa vain arvaillaan, merkitse tieto sen mukaisesti.

**Käsittele myös julkisuudessa esitettyjä huhuja, kiistoja ja henkilökohtaisia tapahtumia.** Kerro tapahtumien kulusta, ihmisten kertomuksista ja mahdollisista myöhemmistä käänteistä. Ilmaise lähteessä esitetty väite luontevasti sen esittäjän kertomuksena, älä kirjoita perään erillistä varausosuutta.

## 3. Kirjoita artikkeli

Artikkeli tallennetaan tiedostoon `src/articles/<id>.md`. Tiedostonimen pitää vastata solmun tunnistetta.

**Henkilöartikkelin alussa pitää esitellä henkilö itsenäisenä aiheena.** Kerro nimi ja nimimerkki, mistä hänet tunnetaan ja mitä hän on tehnyt. Selvitä tarvittaessa hänen taustaansa ja uraansa myös Rappiopedian verkoston ulkopuolelta. Esimerkiksi ”X vieraili PactTalksissa” ei kerro, kuka X on.

Kirjoita tämän jälkeen omaa toimintaansa käsittelevistä aiheista: ura, kanavat, ohjelmat, teokset ja julkiset esiintymiset. **Nosta tärkeät yksittäiset tapahtumat omiksi osioikseen.** Jos henkilö on ollut mukana paljon uutisoidussa onnettomuudessa, oikeusasiassa, kilpailussa tai muussa merkittävässä tapahtumassa, sille voi tehdä oman väliotsikon. Esimerkiksi Upi eli Arttu Pulkkinen tunnetaan rappiostriimaajana, ja hänen lokakuussa 2026 sattunut parvekeonnettomuutensa on perusteltu aihe omalle osiolleen. Osiossa kerrotaan tapahtuman ajankohta, uutisoitu kulku ja tiedossa olevat seuraukset lähteineen; ei arvailla motiiveja tai terveystietoja.

**Artikkelin rakenne määräytyy sisällöstä.** Kaikkien artikkelien ei tarvitse sisältää samoja otsikoita, eikä pelkkä `Yhteydet`-luettelo riitä korvaamaan elämäkertaa. Lyhyen henkilöartikkelin voi aloittaa suoraan ingressillä ilman `## Yhteenveto` -otsikkoa.

Kirjoita proosaa, älä hakukoneelle tehtyä avainsanalistaa. Vältä fraaseja kuten ”dokumentoidut yhteydet”, ”verkostosilta”, ”konteksti”, ”tulkinnan rajat” ja samanlaista automaattista huomautusta jokaisen artikkelin lopussa. Jos jokin yksittäinen tieto on epävarma, kerro se kyseisen tiedon yhteydessä.

Esimerkki:

```md
## PactHouse 3

PactHouse 3 järjestettiin Kreikassa toukokuussa 2026.
Kauden voitti [[jethro|Jethro Rostedt]]. [@P6]

## Osallistujat

Ohjelmassa olivat mukana muun muassa [[amanda|Amanda Harkimo]]
ja [[heiskari|Kristian Heiskari]]. [@P0]
```

Sivusto tukee `##`- ja `###`-otsikoita, kappaleita, luetteloita, **lihavoitua** ja *kursivoitua* tekstiä sekä lainauksia. Viittaustavat ovat:

- `[[pottu|Pottukoira]]` — linkki toiselle Rappiopedian sivulle
- `[@P53]` — lähdeviite `network.json`-tiedoston `sources`-osioon

Tavallisia Markdown-linkkejä ja HTML-koodia ei voi käyttää artikkelisisällössä. Tarkista, että artikkelin viittaamat solmut ja lähteet ovat olemassa.

Artikkelittomille solmuille näytetään `note`-tekstin ja yhteystietojen pohjalta koottu perusteksti. Siksi myös lyhyen kuvauksen pitää alkaa henkilön tai aiheen tunnistamisesta. Jos henkilöstä on saatavilla kunnollista elämäkertatietoa tai hänen elämäänsä liittyy merkittävä julkinen tapahtuma, kirjoita oma artikkelitiedosto automaattisen tekstin sijaan.

## 4. Agenttien tutkimusjono

Kun aihetta ei ehditä selvittää loppuun, kirjaa jatkotutkimus tiedostoon [`research/leads.json`](../research/leads.json). Tämä JSON-tiedosto on agenttien työmuistia, eikä sivusto lue tai julkaise sen sisältöä.

Yhden tutkimusaiheen kentät ovat:
- `id` ja `title`: tunniste ja ymmärrettävä nimi
- `status`: `open`, `in-progress`, `blocked` tai `done`
- `priority`: `high`, `medium` tai `low`
- `nodeIds` ja `sourceIds`: olemassa oleviin verkostosolmuihin ja lähteisiin viittaavat tunnisteet (voivat olla tyhjiä, jos aihe on uusi)
- `sourceUrls`: mahdolliset alkuperäiset linkit, joita ei vielä ole lähderekisterissä
- `notes`: mitä on jo löytynyt, mistä lähteestä ja missä tiedot ovat epäselviä
- `questions`: kysymykset, joihin tarvitaan vastaus
- `queries`: seuraaviin hakuihin soveltuvat hakulausekkeet
- `nextSteps`: konkreettiset toimet, esimerkiksi alkuperäisen lähetyksen etsiminen tai uutisten ristiriidan tarkistaminen

Tutkimusjonossa saa pitää keskeneräisiä huhuja ja vihjeitä erillään valmiista tekstistä. Kun tieto tarkentuu, muokkaa artikkelia sen mukaan ja päivitä tutkimusaiheen tila. Älä kopioi työmuistiinpanoja suoraan artikkelin loppuun. Ateenan-matkan tutkimusaihe `pirkkis-athens-2025` näyttää, miten avoimet kysymykset ja alkuperäisten striimien etsintä kirjataan.

## 5. Kuvat

Kuvia voi käsitellä skriptillä `scripts/process_images.py`. Se muuntaa lähdekuvat pieniksi WebP-tiedostoiksi `public/images/`-hakemistoon ja voi päivittää kuvatiedoston polun verkostodataan.

Asenna ensin Pillow ja käsittele paikalliset kuvat:

```sh
python -m pip install Pillow
python scripts/process_images.py --update-data
```

Alkuperäiset tiedostot löytyvät kansiosta `assets/source-images/`, nimettyinä solmu-ID:n mukaan. Jos `image`-kentässä on ladattava verkko-osoite, skripti voi myös hakea sen:

```sh
python scripts/process_images.py --download --update-data
```

Näin julkaistavaan sivustoon ei tarvitse lisätä suuria alkuperäiskuvia. Käsittelyn epäonnistuessa skripti ilmoittaa virheestä ja säilyttää verkko-osoitteen `imageSource`-kentässä myöhempää yritystä varten.

Kuvien etsimiseen, henkilöllisyyden tarkistukseen ja virheellisten muotokuvien korjaamiseen on erillinen [kuvankeruuskilli](../.agents/skills/rappiopedia-images/SKILL.md). `npm run images:candidates` näyttää henkilöiden puuttuvat kuvalähteet ja paikalliset WebP:t. Kun `imageSource` on tallennettu verkostodataan, GitHub Pages -rakennus käsittelee kuvan automaattisesti. **Jos vanha paikallinen kuva on väärä**, poista kyseinen `public/images/<id>.webp`, sillä käsittelijä ohittaa muuten olemassa olevan tiedoston.

## 6. Tarkista muutos

Suorita projektin juuressa:

```sh
npm test
npm run build
```

Katso lisäksi itse, että teksti on luontevaa suomea, nimet ja päivät pitävät paikkansa, linkit vievät oikeisiin aiheisiin ja lähteet tukevat niitä väitteitä, joiden perässä ne ovat.

Laajempaa lähteiden etsimistä varten on [tutkimusopas](RESEARCH_PLAYBOOK.md). Kesken jääneet tarkistukset voi kirjata [tutkimuslokiin](RESEARCH_LOG.md).

## Suhdetyypit kartalla

Rappioverse näyttää suhteen valitun solmun näkökulmasta. Yhteyden `type` viittaa `src/data/relation-types.json`-tiedostossa määriteltyyn suhdetyyppiin, eikä jokaiselle yhteydelle kirjoiteta erillistä `verb`-kenttää.

- **Suunnattu suhde:** `forward` on suunta `a → b`, `reverse` on suunta `b → a`. Esimerkiksi `jethro → joachim`: `on isä` / `on poika`.
- **Symmetrinen suhde:** `symmetric: true` ja `verb` tarkoittaa samaa verbiä kumpaankin suuntaan, esimerkiksi `striimasi yhdessä`.
- `label` kertoo yksittäisen suhteen tarkemmasta tapahtumasta ja `src` sisältää sitä tukevat lähteet.

Kun tarvitset uudenlaisen suhteen, lisää määritelmä ensin suhdetyyppirekisteriin ja viittaa sen tunnisteeseen `edges`-taulukossa.

### Relaatioiden laadunvarmistus

Pelkkä uutisartikkeli, foorumikeskustelu tai lähetysotsikon maininta ei automaattisesti muodosta henkilöiden välistä yhteistyö- tai sponsorointisuhdetta. Näytön varmuus kuuluu `level`-kenttään, ei omaan `reported-*`-relaatiotyyppiin. Ilmoitettu osallistuminen (`listattiin`) ei ole sama kuin toteutunut osallistuminen (`osallistui`). Ohjelmavieras (`vieraili`) on lähtökohtaisesti henkilö; projektin ohjelmavierailu ja henkilön luona käynti tulee erottaa toisistaan sopivilla suhdetyypeillä ennen uusien merkintöjen lisäämistä. Älä merkitse haastattelevaa sivustoa tapahtuman haastattelijaksi tai samaan dokumenttiin päätyneitä henkilöitä automaattisesti yhteistyökumppaneiksi.

Jokaiselle uudelle suhdetyypille vaaditaan `headingForward` ja `headingReverse` tai symmetriselle tyypille `heading`. Erilliset tapahtumat voivat olla erillisiä saman parin yhteyksiä, mutta saman faktan identtistä merkintää ei toisteta.
