# Rappioverse // 3D-tutkintakartta

Interaktiivinen, lähteistetty 3D-verkosto suomalaisen viihde-, Kick- ja rappiostriimausskenen julkisista yhteyksistä.

## Kehitys (Node.js 22+)
```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

## Projektin rakenne
- `index.html` – pieni sovelluksen käynnistyspiste
- `src/main.js` – 3D-visualisointi ja käyttöliittymä
- `src/styles.css` – tumman tutkintapaneelin tyylit
- `src/data/network.json` – erillinen muokattava tietoaineisto: nodes, edges, sources
- `src/lib/graph.js` – testattava yhteyspolun haku
- `src/lib/hierarchy.js` – PACT-ohjelmaperheen hierarkia (EI väite yhteisestä omistuksesta)
- `tests/` – automaattiset aineisto- ja graafitestit
- `.github/workflows/deploy.yml` – testaus + buildi + GitHub Pages -julkaisu

## GitHub Pages
Kun Pages on kytketty repon asetuksista päälle, julkaistu sivu: https://penny-five.github.io/rappioverse/

Kertaluonteinen valinta: **Settings → Pages → Build and deployment → Source: GitHub Actions**. `main`-haaran push testataan ja rakennetaan Viten avulla; vain onnistunut build julkaistaan. Pull requestit vain testataan.

## Tiedon tulkinta
Yhteyden tasot: `verified` = dokumentoitu, `reported` = uutisoitu, `observed` = julkisen tunnisteen tai esiintymisen havainto (voi viitata kaupalliseen yhteistyöhön), `lead` = vahvistamaton johtolanka. Yhteinen ohjelma, tapahtuma tai some-verkosto ei todista henkilöiden syyllisyyttä, rahoitus- tai sopimussuhdetta.

Kuvat ovat tällä hetkellä ulkoisia URL-linkkejä ja voivat olla latautumatta. Älä lisää valokuvia julkiseen repoon ilman tarvittavia käyttöoikeuksia.

### Buildin riippuvuudet
Vite on toistaiseksi suoraan versioon sidottu, mutta `package-lock.json` ei ole vielä mukana, koska npm-rekisteri ei vastannut paikallisessa ympäristössä. Työnkulku käyttää `npm install`-komentoa kunnes lukitustiedosto saadaan luotua.
