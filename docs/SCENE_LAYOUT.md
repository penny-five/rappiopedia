# Rappioversen 3D-skenesijoittelu

Rappioverse on **yhteyskartta**, ei erillisten laatikoiden satunnainen kokoelma. Skenet sijoitetaan niin, että verkoston vahvimmat lähteistetyt yhteydet ovat visuaalisesti lähellä toisiaan ja kaikkien 3D-tilavuuksien rajat pysyvät selvinä.

## Sijoittelun päälinjat (1.11.2026)

- **PACT** on kartan pääankkuri. PactHouse-kaudet ja PactTalks pysyvät sen nykyisessä ylätason tilavuudessa.
- **Julkkispelit / pokeri** sijaitsee PACTin lähellä, koska suuri osa Julkkispelien yhteyksistä tulee PACT-osallistujiin.
- **Rappiostriimaus** sijaitsee PACTin toisella puolella. Sen yhteisessä 3D-ylälaatikossa on vain yksi alaskene, **Pottukoira**.
- **Dokumentit** sijoitetaan PACTin ja Rappiostriimauksen välisen yhteysvyöhykkeen reunalle, erityisesti Kieksi-dokumentin rappiostriimaajayhteyksien takia.
- **Old School Tubetus** sijoitetaan Dokumenttien viereen, sillä siihen liittyy useita dokumenttiyhteyksiä.
- **Some- ja matkareality** sijoitetaan lähelle PACTia, erityisesti PactTalks- ja Jethro-yhteyksien vuoksi.
- **TV-ohjelmat / reality** on PACTin lähellä sijaitseva oma skene Big Brother Suomelle ja Temptation Island Suomelle. Ihmiset liitetään tv-ohjelmiin lähteistetyillä osallistumissuhteilla, mutta heidän ensisijainen skenensä perustuu heidän omaan toimintaansa.
- **Kasinokurki** sijoitetaan lähelle Rappiostriimausta, mutta se pysyy erillisenä kaupallisen näkyvyyden skenenä.
- **Sliki / keikat, Monarch / high stakes ja Ice Cage / kamppailu** muodostavat kartalle läheisen ketjun. Niiden välissä näkyvät tapahtuma- ja brändiyhteydet.
- **Bailupaatti / tapahtumat** on pienempi yhteysalue PACTin, Rappiostriimauksen ja Dokumenttien lähellä.
- **Media / palstat** sijaitsee lähellä PACTin ja keikkaskenen välistä aluetta; tärkeää ei ole tehdä lähdesivustoista oman kenttänsä keskustaa.

Nämä ovat **visuaalisia sijoitteluperiaatteita**. Lähekkäinen sijainti ei tarkoita yhteistä omistusta tai sopimussuhdetta. Solmujen todelliset yhteydet määräytyvät edelleen `src/data/network.json`-tiedoston lähteistetyistä `edges`-merkinnöistä.

## Toteutus ja tulevat muutokset

- Solmujen 3D-koordinaatit: `src/data/network.json` → `nodes[].pos3`.
- Näkyvien skenejen nimet, värit ja yksittäisen laatikon marginaalit: `src/data/skenes.json`.
- PACTin ja Rappiostriimauksen ylätason hierarkiat sekä niiden marginaalit: `src/lib/hierarchy.js`.
- Geometrian ja keskeisten skenejen vierekkäisyyden testit: `tests/layout.test.mjs`.

Siirrä skenejä mahdollisuuksien mukaan **jäykkänä kokonaisuutena**: lisää saman ryhmän kaikkien solmujen `pos3`-koordinaatteihin sama siirtovektori. Kun siirrät ylätason perhettä, siirrä samassa operaatiossa kaikki sen alaryhmät. Näin ryhmien sisäiset etäisyydet ja tunnistettavat muodot säilyvät.

Laskettaessa tilavuutta PACTin ylätason marginaali on 145 yksikköä ja Rappiostriimauksen 160 yksikköä. Tavallisen alaskenen oletusmarginaali on 100 yksikköä, ellei skenerekisteri määritä muuta. Älä salli eri ylätason tilavuuksien leikkautua tai suoraan vanhempaan kuuluvien solmujen joutua alalaatikon sisään.

Älä käytä pelkästään skenejen keskipisteiden etäisyyttä sijoittelun mittarina. Katso myös varsinaisten solmusta solmuun kulkevien yhteyksien pituuksia ja 3D-laatikoiden välisiä tyhjiä välejä. Vuoden 2026 marraskuun alun uudelleenjärjestelyn vertailussa ylätason skenejen välisten 87 yhteyden keskimääräinen pituus lyheni noin **3 500 → 2 411 yksikköön** (−31 %), mutta tärkeää on kokonaisuuden luettavuus, ei yhden numeerisen tavoitteen mekaaninen optimointi.

Aja sijoittelumuutosten jälkeen `node --test tests/layout.test.mjs`, `npm test` ja `npm run build`. Jos niitä ei voi ajaa ympäristössä, tarkista tilavuuksien erillisyys ja perheiden sisäkkäisyys ohjelmallisesti ja raportoi rajoitus.
