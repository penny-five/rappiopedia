# Ohjeet Rappiopedian kehittämiseen

Rappiopedia on suomalaisen striimaus- ja nettiviihteen tietosanakirja. Sivusto kertoo ihmisistä, ohjelmista ja tapahtumista sekä näyttää niiden yhteydet Rappioverse-nimisellä 3D-kartalla. Kävijän pitää pystyä lukemaan aiheesta kuin tietosanakirjasta ja siirtymään sen jälkeen kiinnostaviin yhteyksiin.

## Aloita tutkimus- ja kirjoitustehtävä tästä

Kun tehtävänä on etsiä Rappiopediaan uusia ihmisiä, tapahtumia tai yhteyksiä, jatkaa tutkimusjonoa tai kirjoittaa laajempia artikkeleita, lue ja noudata [Rappiopedian tutkimusagentin taitoa](.agents/skills/rappiopedia-research/SKILL.md). Se kuvaa lähteiden tutkimisesta julkaistuun artikkeliin ja verkostodataankin asti kulkevan työn.

**Käyttäjän lähtöaihe on vapaaehtoinen.** Jos käyttäjä antaa henkilön, tapahtuman, nimiparin tai teeman, aloita siitä ja seuraa löytyviä yhteyksiä. Jos käyttäjä kehottaa jatkamaan oma-aloitteisesti, **valitse itse** lupaava tutkimusaihe `research/leads.json`-jonosta tai verkoston ja artikkelien aukoista. Komento `npm run research:candidates` näyttää mahdollisia aloituskohteita. Älä pysähdy pyytämään käyttäjältä aihetta, ellei sitä todella tarvita.

Tavoitteena on tehdä tutkimustyö saman tehtävän aikana ja viedä konkreettiset löydöt lähteisiin, artikkeleihin ja yhteyksiin. Pelkkä suunnitelma tai tutkimusjonon kartuttaminen ei yleensä täytä pyyntöä lisätä sisältöä.

## Henkilökuvien kerääminen ja korjaaminen

Kun tehtävänä on etsiä puuttuvia henkilökuvia, korjata väärä kuva tai täydentää kuvalähteitä, seuraa [Rappiopedian kuvankeruuskillin](.agents/skills/rappiopedia-images/SKILL.md) ohjeita. Aloitus henkilöstä on vapaaehtoinen: ilman lähtöaihetta listaa puutteet komennolla `npm run images:candidates`, etsi kuvien alkuperäiset julkaisut ja vie löydöt verkostodataan sekä optimointiin. Väärän kuvan vanha paikallinen WebP on myös korvattava, ettei se jää näkyviin.

## Kirjoittaminen

- Kirjoita **hyvää, tavallista suomea**. Oleta, ettei lukija tunne aihetta ennestään.
- **Henkilöartikkelin ensimmäinen kappale on esittely, ei yhteysluettelo.** Kerro henkilön nimi ja tunnettu nimimerkki, mistä hänet tunnetaan, mitä hän tekee tai on tehnyt ja mikä hänen julkisen toimintansa tausta on. Esimerkiksi yksi vierailu PactTalksissa tai osallistuminen PactHouseen ei yksin ole riittävä henkilöesittely.
- Selvitä henkilöstä mahdollisuuksien mukaan myös hänen toimintaansa **ennen verkostoon kirjattuja tapahtumia**: oma tuotanto, kanavat, ura, esiintymiset ja muu julkinen historia. Älä päättele puuttuvia elämäkertatietoja pelkistä graafin yhteyksistä.
- **Merkittävät tapahtumat saavat omat alaotsikkonsa.** Kerro henkilöä koskevista tärkeistä tapahtumista, vaikka ne eivät yhdistäisi häntä muihin solmuihin. Esimerkiksi Upin vuonna 2026 sattunut parvekeonnettomuus kuuluu hänen artikkelissaan omaan, lähteistettyyn osioonsa. Kerro mitä tapahtui ja milloin; älä spekuloi tapahtuman syyllä tai seurauksilla.
- Jäsennä artikkeli aiheen mukaan: esimerkiksi Tausta, Striimausura, Onnettomuus lokakuussa 2026 tai Muu julkisuus. Älä käytä otsikoita vain mallin täyttämiseksi.
- Kerro tapahtumista, esiintymisistä, tuotannoista ja muista olennaisista asioista kokonaisin virkkein. Älä kirjoita muistiinpanotyylisiä luetteloita kuten ”Striimaaja; vieras; tapahtumakonteksti”.
- Käytä otsikoita vain, kun niiden alla on oikeaa sisältöä. Älä pakota jokaiseen artikkeliin samaa ”Yhteenveto / Dokumentoidut yhteydet / Tulkinnan rajat” -rakennetta.
- **Älä lisää artikkelien loppuun automaattisia varaumia** tyyliin ”yhteinen esiintyminen ei itsessään osoita taloudellista yhteistyötä”. Kerro epävarmuudesta siinä kohdassa, jossa se koskee käsiteltävää väitettä.
- Kirjoita myös julkisuutta saaneista huhuista, ristiriitaisista kertomuksista, kiistoista ja henkilökohtaisista tapahtumista silloin, kun ne ovat aiheen kannalta olennaisia. Esittele kertomukset luontevasti osana tapahtumahistoriaa ja viittaa niiden lähteisiin. Älä korvaa aihetta varauksilla tai poissulkemisella.
- Älä kirjoita toimitusprosessista tai graafin rakenteesta osaksi henkilön elämäkertaa. Ilmaukset kuten ”tämä muodostaa verkostosillan” kuuluvat työmuistiinpanoihin, eivät artikkeliin.
- Pidä henkilöiden, ohjelmien, tapahtumien ja julkaisujen nimet sekä ajankohdat tarkkoina. Älä täytä aukkoja arvauksilla.

## Lähteet ja yhteydet

`src/data/network.json` sisältää solmut (`nodes`), niiden väliset yhteydet (`edges`) ja lähteet (`sources`). Jokaisella yhteydellä on lähdeviite. Kirjoita yhteyden `label` niin, että lukija ymmärtää, mitä tapahtui: esimerkiksi ”vieraili lähetyksessä”, ”osallistui kilpailuun” tai ”järjesti tapahtuman”.

**Yhteystekstin laatu koskee myös `edge.detail`-kenttää, ei vain artikkeleita.** Kirjoita `label`-kenttään konkreettinen teko, ohjelma, paikka tai tapahtuma. `detail` on valinnainen: käytä sitä vain, jos suhteeseen liittyy olennainen lisätieto, jota `label`, `date`, `level` tai lähdeviite ei jo kerro (esimerkiksi palkintosumma, poisjäännin syy tai tietyn väitteen kiistäminen). **Jätä `detail` pois** mieluummin kuin täytät sen metakommentilla, yleisellä varauksella, toistetulla lähdeselitteellä tai agentin tutkimusmuistiinpanolla. Älä kirjoita esimerkiksi ”yhteinen ohjelmatilanne ei yksin osoita liikesuhdetta”, ”tallenteiden otsikkojen metadataa” tai ”tarkennettava alkulähteellä”. Säädä `type`, `label` ja `level` vastaamaan sitä, mitä lähde osoittaa; kirjaa avoimet tarkistukset `research/leads.json`-tiedostoon. Jos yksittäinen kiistetty väite vaatii täsmennyksen, kerro kuka väitteen kiisti ja mistä on kyse – älä lisää rutiinivaraumaa kaikkiin yhteyksiin. Älä kopioi samaa `detail`-tekstiä monelle yhteydelle.

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
- Yhdistä tutkimus nykyisiin `nodeIds`- ja `sourceIds`-tunnisteisiin, jos sellaiset jo ovat olemassa. Uudesta aiheesta voi tehdä tutkimusmerkinnän ennen julkisen solmun tai lähteen lisäämistä. Alkuperäiset, vielä rekisteröimättömät lähdelinkit voi kirjata `sourceUrls`-kenttään. Merkitse `questions`-kenttään selvitettävät asiat, `queries`-kenttään käyttökelpoiset haut ja `nextSteps`-kenttään seuraavat tarkistukset.
- Kirjaa ristiriitaiset väitteet ja keskeneräiset havainnot `notes`-kenttään lähteineen. Julkiseen artikkeliin kuuluu se, mistä voidaan kirjoittaa lähteiden perusteella; työnkulun ohjeet, avoimet hakulistat ja agentin omat muistiinpanot jäävät tutkimustiedostoon.
- Kun selvitys etenee, täydennä lähteet ja artikkeli tarvittaessa. Päivitä samalla tutkimusaiheen tila (`open`, `in-progress`, `blocked` tai `done`). Älä merkitse aihetta ratkaistuksi, jos kysymyksiä jäi.
- `docs/RESEARCH_LOG.md` on päivättyjen havaintojen tekstimuotoinen loki; `research/leads.json` on koneellisesti luettava lista jatkotyöstä.

Tutkimustiedosto ei käynnistä automaattista tutkimusta itsestään. Sitä käyttävät agentit lukevat ja päivittävät sitä osana tehtäväänsä.

## Suhdetyypit

`src/data/relation-types.json` sisältää uudelleenkäytettävät suhteiden tyypit. Kun lisäät yhteyden `network.json`-tiedostoon, valitse ensin sopiva `type`. Uutta suhdetta varten lisää uusi tyyppi rekisteriin ennen yhteyden lisäämistä. Suunnattuun tyyppiin kuuluvat `forward` ja `reverse`, esimerkiksi `on isä` ja `on poika`. Symmetriselle tyypille riittää `symmetric: true` ja `verb`, esimerkiksi `esiintyi yhdessä`. Älä kirjoita yksittäisille yhteyksille omaa `verb`-kenttää. `label` voi yhä kuvata nimenomaista tapahtumaa.

## Solmujen tyypit

`src/data/entity-types.json` on kaikkien solmutyyppien rekisteri. `network.json`-solmulla on `cat` (yleinen luokka) ja `types` (ei-tyhjä lista rekisteröityjä, tarkempia tyyppejä). Tyypin rekisterimerkintä sisältää `category`- ja `label`-kentät. Jokaisen `types`-arvon `category`-arvon on vastattava solmun `cat`-arvoa; älä kirjoita vapaamuotoisia tyyppejä. Henkilöllä voi olla monta samanaikaista roolia, esimerkiksi `"types": ["juontaja", "tosi-tv-osallistuja"]`. Uusi luokka tai tyyppi lisätään ensin rekisteriin. Jos tarkka rooli ei ole tiedossa, käytä `henkilo`-tyyppiä äläkä arvaa ammattia. Paikat (`place`), sivustot (`site`), tapahtumat (`event`), kanavat (`channel`) ja julkaisut (`media`) ovat erillisiä luokkia. Solmun kartallinen merkittävyys, ryhmä ja tutkimuksen tila eivät ole sisältötyyppejä. Rappioverse ja artikkelit lukevat tyypin samasta rekisteristä.

## Artikkelit ja tekniikka

| Polku | Sisältö |
| --- | --- |
| `src/data/network.json` | Solmut, yhteydet ja lähteet |
| `src/data/relation-types.json` | Suhteiden tyypit ja molempien suuntien verbimuodot |
| `src/data/entity-types.json` | Solmuluokat sekä nimetyt, mahdollisesti moniarvoiset solmutyypit |
| `src/data/skenes.json` | Skenet, niiden värit ja 3D-laatikoiden marginaalit |
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

## Skenet: ensisijainen ryhmä ja erillinen Kasinokurki

Skenen tunnisteet, suomenkieliset nimet, värit ja mahdollinen poikkeava 3D-marginaali ovat tiedostossa `src/data/skenes.json`. Rappioverse lukee rekisterin suoraan; uuden skenen lisäys vaatii rekisterimerkinnän sekä jäsenille sopivat `group`- ja `pos3`-arvot. Jokaisen solmun `group` on sen **ensisijainen 3D-sijainti**, ei tyhjentävä luettelo kaikista yhteyksistä.

- **`rappio` / Rappiostriimaus:** itsenäisesti tunnetut rappiostriimaajat ja heihin liittyvät lähetykset ja tapahtumat. Tähän kuuluvat myös heidän uransa yksittäiset tapahtumat, vaikka ne koskisivat rahapelaamista.
- **`kasinokurki` / Kasinokurki:** Kasinokurki-palvelu ja streamaajat, joiden lähetyksistä on lähteistetty suora Kasinokurki-brändin näkyvyys (tällä hetkellä Pullis, SampeF2 ja KP2Times). Älä päättele pelkän komennon perusteella sopimuksen ehtoja tai omistajuutta. Pelkkä Kickissä toimiminen ei kuulu tähän skeneen.
- **`television` / TV-ohjelmat / reality:** Big Brother Suomen ja Temptation Island Suomen kaltaiset tv-ohjelmasarjat. Kytke niiden vahvistetut osallistujat ohjelmasolmuihin suhteilla, älä siirrä henkilöä televisioskeneen vain osallistumisen vuoksi.
- **`documents`, `reality`, `combat`, `monarch`:** dokumenttien ja tuotannon, some-/matkarealityn, kamppailuviihteen sekä Monarch/Duel-high stakes -toiminnan omat skenet.
- **`old-school-tubetus` / Old School Tubetus:** varhaisen suomalaisen YouTuben arkivlogit ja persoonalliset videokanavat, kuten Niilo22, Iltapalamies, Markoboy87 ja Pasi Viheraho. Tämä skene ei tarkoita rappiostriimausta. Videoihin tai dokumentteihin liittyvät suhteet säilyvät verkostoyhteyksinä.
- PACT-osallistumiset ja PactTalks-vierailut säilyvät yhteyksinä verkostossa. Yksi esiintyminen ei yksin määrää henkilön skeneä. Käytä ensisijaisena ryhmänä henkilön omaa pääasiallista toimintaa, jos se on tiedossa.

**Rappiostriimauksella on yksi perusteltu alaskene:** `pottu-streams` / Pottukoiran lähetykset (Pottukoira, Spurgu-TV, hänen oikeustapauksensa, Viron-vierailulähetys ja Rauno77). Muut rappiostriimaajat jäävät `rappio`-ryhmään. Älä luo Upi/Pirkkis- tai muita henkilöryhmiä yhden yhteisen reissun perusteella; lisää alalaatikko vasta, kun sille on itsenäinen ja laaja sisältökokonaisuus. Testotimon oma subathon ja Pirkkiksen omat matkat eivät kuulu automaattisesti Pottukoiran tuotantoihin.

**Hierarkiat ovat yleiskäyttöisiä:** `src/lib/hierarchy.js` määrittelee `hierarchyGroups`-rakenteen (PACT ja Rappiostriimaus). Kullakin perheellä on `id`, `groups`, `padding`, `color` ja `title`. Jos perheellä on suoraan sen omia solmuja, määritä `rootGroup` (Rappiostriimaus: `rappio`); tällöin ylätason skene toimii myös koko perheen valitsimena eikä sille piirretä erillistä sisälaatikkoa. Jos kaikille jäsenille on oma ryhmänsä, jätä `rootGroup` pois (PACT): sivupalkki näyttää valittavan virtuaalisen `id`-ylärivin ja kaikki sen alaskenet sisennettyinä. Valittaessa ylärivi myös kaikki alaryhmät näkyvät samassa rajauksessa, ja kamera kohdistuu koko perheen rajalaatikkoon. Älä nimeä PACTin `core`-skeneä uudelleen koko ohjelmaperheeksi: se sisältää PACT-brändin, Sainin ja Kick-alustan ja sen näyttönimi on `PACT / ALUSTA`.

Rappiostriimauksen yhteisellä ylätason laatikolla on `padding: 160` (`hierarchyGroups`), PACTilla 145 ja skenelaatikoilla `src/data/skenes.json`-rekisterin mukaiset marginaalit (oletus 100). **Tarkista vanhempien, lasten, suoraan vanhempaan sijoitettujen solmujen ja muiden skenejen tilavuuksien rajat**, kun muokkaat ryhmiä tai koordinaatteja.

Katso myös [3D-skenesijoittelun periaatteet](docs/SCENE_LAYOUT.md): skenet tulee sijoittaa niiden lähteistettyjen yhteyksien perusteella, ei pelkän tilavuuksien erillisyyden vuoksi. Siirrä skenen solmuja yhtenä kokonaisuutena, säilytä ylätason hierarkiat ja tarkista myös vierekkäisyyttä koskevat regressiotestit.

## Rappioverse: 3D-skenet eivät saa leikata toisiaan

**Tämä on toistuva regressio:** uusien solmujen lisääminen, niiden `pos3`-koordinaattien tai `group`-ryhmän muuttaminen sekä skenejen uudelleensijoittelu ovat aiemmin aiheuttaneet `tests/layout.test.mjs`-testien kaatumisen (esimerkiksi `rappio intersects PACT` ja `talks intersects rappio`).

- **Säilytä 3D-tilavuuksien erillisyys joka kerta, kun muutat verkostodataa tai sijoittelua.** Rajat lasketaan kaikkien skenen solmujen `pos3`-koordinaateista, eivät vain keskussolmuista tai näkyvästä projektiosta. `src/lib/scene.js`-tiedoston `bounds3D` laskee laatikot; yksittäisten alaskenejen marginaali tulee `src/data/skenes.json`-rekisteristä (oletus 100), vanhempien marginaali `src/lib/hierarchy.js`-perhemäärityksistä (PACT 145, Rappiostriimaus 160).
- **Tarkista neljä ehtoa:** (1) erilliset näkyvät skenelaatikot eivät leikkaa toisiaan, (2) jokaisen vanhemman koko pehmustettu laatikko sisältää kaikkien alaryhmien pehmustetut laatikot, (3) vanhempi ei leikkaa muita ylätason perheitä tai ulkopuolisia skenejä ja (4) vanhemman suoraan sisältämät solmut eivät sijaitse alalaatikoiden sisällä. Vanhemman ja oman alalaatikon sisäkkäisyys on tarkoituksellista.
- **Aja vähintään `node --test tests/layout.test.mjs` heti jokaisen `pos3`-, `group`- tai sijoittelumuutoksen jälkeen** ja ennen commitia. Aja sen lisäksi `npm test` ja `npm run build` ennen kuin ilmoitat työn valmiiksi. Varmista myös, että koko testiajo onnistuu; osa testeistä voi mennä läpi, vaikka layout-testit kaatuvat.
- **Korjaa ongelma koordinaateissa tai sijoittelussa, älä testejä heikentämällä.** Älä poista päällekkäisyystestejä, ohita skenejä, pienennä marginaaleja vain testin läpäisemiseksi tai piilota päällekkäisyyttä visuaalisesti. Siirrä tarvittaessa skenen solmuja yhtenä kokonaisuutena niin, että niiden keskinäinen sijoittelu ja yhteydet säilyvät.
- Jos et voi suorittaa testejä ympäristössäsi, tarkista samat ehdot ohjelmallisesti **päivitetystä datasta** ja kerro käyttäjälle nimenomaisesti, mitä tarkistit ja mitä et pystynyt ajamaan. Älä väitä `npm test`-komennon onnistuneen ilman todellista ajoa.

## Muutosten tekeminen

1. Tutki olemassa oleva data ja koodi ennen muutoksia. Korjaa lähteeseen, älä vain näkyvään tekstiin.
2. Lisää uusi lähde `sources`-osioon ja kirjaa sitä vastaavat solmut tai yhteydet. Älä kierrätä vanhaa lähde-ID:tä eri tarkoitukseen.
3. Kirjoita tai päivitä artikkeli. Tarkista viitteet, linkit, nimet ja päivämäärät.
4. Jos lisäät kuvia, käytä `scripts/process_images.py`-skriptiä. Se tuottaa pienet WebP-kuvat `public/images/`-hakemistoon. Ohjeet ovat [sisällön lisäysoppaassa](docs/CONTENT_AUTHORING.md).
5. Aja `npm test` ja `npm run build`. GitHub Actions huolehtii GitHub Pages -julkaisusta.

Tutkimuksen hakutavat löytyvät [tutkimusoppaasta](docs/RESEARCH_PLAYBOOK.md). Avoimet havainnot kirjataan [tutkimuslokiin](docs/RESEARCH_LOG.md).
