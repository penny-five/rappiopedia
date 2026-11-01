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
3. `verified` = alkuperäisnäyttö; `reported` = journalistinen uutisointi; `observed` = julkinen merkki / vahvasti perusteltu kaupallisen yhteistyön päätelmä; `lead` = avoin, kiistetty tai foorumin väite.
4. Ylilauta ja Reddit antavat arvokkaita vihjeitä; arkistoi ketjun tarkka URL ja ajankohta. Samankaltaisten anonyymien väitteiden toistuminen ei yksin vahvista niiden paikkansapitävyyttä.
5. `!kasinokurki`-tunnisteiden toistumista voi kuvata sponsorointi-/affiliate-yhteyteen vahvasti viittaavana havaintona, mutta sopimuksen osapuolet, euromäärät tai ehdot ovat avoimia.
6. Ohjelman, risteilyn tai tapahtuman yhteinen esiintyminen ei sellaisenaan todista henkilön osallisuutta toisen tekoihin, yhteistä rahoitusta tai liikekumppanuutta.
7. Älä julkaise yksityisosoitteita, ei-julkisia henkilötietoja tai tunnistamattomien henkilöiden identiteettiarvauksia. Vältä perusteettomia rikosväitteitä.
8. Kuvissa käytä tunnistettuja, oikein lisensoituja tai luvallisia kuvia ja atribuutioita; ei tekoälyn keksimiä tunnistettavaksi väitettyjä kasvokuvia.

## Implementation
- Säilytä vakaat solmu-ID:t: artikkelilinkit ja URL-hashit käyttävät niitä.
- Älä korvaa 3D-karttaa 2D-luettelolla. Orbit/pan/zoom ja visuaalinen hierarkia ovat tuotteen ydin.
- Artikkelin sisäinen `[[id|Otsikko]]` avaa oikean solmun. `[@P0]` näyttää lähdeviitteen.
- Markdownissa ei sallita raakaa HTML:ää; renderer escapeaa sen.
- Päivitä data ja artikkeli yhdessä. Testaa: `npm test` ja `npm run build`.
- GitHub Actions julkaisee vain onnistuneen buildin. Älä väitä julkaisun onnistuneen ilman tarkistusta.
- Tutki koodin nykyinen toteutus ennen muutosta. Tee pienet, tarkistettavat commitit.
