# AGENTS.md — Rappiopedia / Rappioverse

## Product
- **Rappiopedia** = koko sivusto ja lähteistetty tietosanakirja.
- **Rappioverse** = Rappiopedian interaktiivinen 3D-verkostonäkymä.
- UI-kieli on suomi. Tyyli: valkoinen, musta ja harmaa, Wikipedia-henkinen toimituksellinen luettavuus.
- Solmun klikkaaminen avaa oikealle artikkelin: ingressi, Markdown, infoboksi, linkit, lähteet.
- PACT on visuaalinen yläryhmä PactHouse-kausille ja PactTalksille. Tämä EI väitä yhteistä omistusta tai sopimusta.

## Repository map
- `src/data/network.json`: solmut, reunat, lähderekisteri
- `src/articles/<id>.md`: kirjoitetut solmuartikkelit
- `src/wiki.js`: turvallinen Markdown-renderöinti, sisälinkitys ja automaattiset artikkelit
- `src/main.js`: 3D-kartta, kamera, hiiri, haku, tilanmuutokset
- `src/styles.css`, `index.html`: vaalea Wiki-layout
- `src/lib/hierarchy.js`: visuaaliset yläryhmät
- `tests/`: eheystarkistukset
- `docs/CONTENT_AUTHORING.md`: sisällöntuotanto-ohje

## Editorial safety and sourcing
1. Älä keksi lähteitä, tapahtumia, ajankohtia, henkilöllisyyksiä, valokuvien henkilötunnistuksia tai yhteyksiä.
2. Jokainen olennainen graafin yhteys tarvitsee lähde-ID:n ja rajatun, testattavan väitteen. Merkitse väitteen ja tulkinnan ero.
3. Arvioi **todisteen luonne, ei sivuston mainetta**. `verified` = väitteen yksityiskohdan näyttävä alkuperäisaineisto (myös foorumilla julkaistu kuvallinen/ajallisesti tunnistettava primääriaineisto); `reported` = lähteessä kerrottu konkreettinen tapahtuma, mukaan lukien uskottava, yksilöity ensi käden foorumikertomus; `observed` = suora julkinen havainto tai perusteltu päätelmä (esimerkiksi toistuva sponsoritunniste); `lead` = spekulaatio, välillinen huhu tai liian epämääräinen väite.
4. **Ylilauta, Reddit ja muut keskustelupalstat ovat hyväksyttäviä itsenäisiä lähteitä**, eivät vain tutkimusvihjeitä. Tavallisille, vähäriskisille skene- ja tapahtumayhteyksille (kuka striimasi kenen kanssa, kuka kävi reissulla, mitä videolla näkyi) tarkka julkinen foorumiviesti voi riittää graafin reunaan ja artikkeliin. Älä vaadi matkustusasiakirjoja, viranomaisrekistereitä tai valtamedian vahvistusta tällaisista arkisista tapahtumista.
   - Kirjaa alkuperäinen ketju / kommentti, päivämäärä, käyttäjän väitteen tarkka sisältö sekä mahdolliset klipit ja linkit.
   - Useampi **ajallisesti ja sisällöllisesti riippumaton** yhtäpitävä havainto kasvattaa luottamusta; samaa huhua kopioivat viestit eivät ole itsenäisiä lähteitä.
   - Kuvaa itse tapahtuma tarvittaessa sanoin "keskusteluketjujen mukaan" tai "useiden käyttäjäkuvausten perusteella". Älä ylitulkkaa matkalla mukanaoloa rahoitus- tai rikosyhteydeksi.
   - Kun mukana on merkittävä rikosväite, yksityisyyteen tunkeutuva väite tai muu vakava mainehaitta, edellytä tätä vahvempaa näyttöä tai jätä väite pois.
5. `!kasinokurki`-tunnisteiden toistumista voi kuvata sponsorointi-/affiliate-yhteyteen vahvasti viittaavana havaintona, mutta sopimuksen osapuolet, euromäärät tai ehdot ovat avoimia.
6. Ohjelman, risteilyn tai tapahtuman yhteinen esiintyminen ei sellaisenaan todista henkilön osallisuutta toisen tekoihin, yhteistä rahoitusta tai liikekumppanuutta.
7. Älä julkaise yksityisosoitteita, ei-julkisia henkilötietoja tai tunnistamattomien henkilöiden identiteettiarvauksia. Vältä perusteettomia rikosväitteitä.
8. Kuvissa käytä tunnistettuja, oikein lisensoituja tai luvallisia kuvia ja atribuutioita; ei tekoälyn keksimiä tunnistettavaksi väitettyjä kasvokuvia.

## Tutkimuksen käytännön työskentelytapa
- Lue aina [docs/RESEARCH_PLAYBOOK.md](docs/RESEARCH_PLAYBOOK.md) ennen laajaa lähdekartoitusta. Se sisältää todellisessa työssä toimineet parihaku-, stream-arkisto-, foorumi- ja lähde-eheysmenetelmät.
- Merkitse uusia löytöjä ja avoimia tarkistuksia [docs/RESEARCH_LOG.md](docs/RESEARCH_LOG.md) -lokiin.
- Etsi kytkentöjä tapahtumasolmujen kautta: "X osallistui ohjelmaan" ja "X vieraili toisen lähetyksessä" ovat eri reunat.
- Jokaiselle lähde-ID:lle on kirjattava URL ja tarkkaan rajattu väite. Älä muuta viite-ID:n merkitystä vanhoille artikkeleille.

## Implementation
- Säilytä vakaat solmu-ID:t: artikkelilinkit ja URL-hashit käyttävät niitä.
- Älä korvaa 3D-karttaa 2D-luettelolla. Orbit/pan/zoom ja visuaalinen hierarkia ovat tuotteen ydin.
- Artikkelin sisäinen `[[id|Otsikko]]` avaa oikean solmun. `[@P0]` näyttää lähdeviitteen.
- Markdownissa ei sallita raakaa HTML:ää; renderer escapeaa sen.
- Päivitä data ja artikkeli yhdessä. Testaa: `npm test` ja `npm run build`.
- GitHub Actions julkaisee vain onnistuneen buildin. Älä väitä julkaisun onnistuneen ilman tarkistusta.
- Tutki koodin nykyinen toteutus ennen muutosta. Tee pienet, tarkistettavat commitit.
