# Rappiopedia

**Rappiopedia** on suomenkielinen, lähteisiin perustuva yhteysensyklopedia. **Rappioverse** on sen interaktiivinen, pyöritettävä 3D-verkostokartta.

Käyttöliittymä on vaalea ja Wikipedia-henkinen: kartta on vasemmalla ja valitun henkilön, ohjelman tai tapahtuman tietosanakirjasivu oikealla. Artikkelitekstit ovat Markdownia; sisäiset linkit avaavat suoraan vastaavan solmun Rappioverse-kartassa.

## Käynnistys
Node.js 22+.

```sh
npm install
npm run dev
npm test
npm run build
```

## Rakenne
- `index.html` — käyttöliittymän runko
- `src/main.js` — 3D-projektio, kamera, haku ja solmun valinta
- `src/wiki.js` — turvallinen Markdown-artikkelinäkymä ja lähdearkisto
- `src/styles.css` — mustavalkoinen UI
- `src/data/network.json` — solmut, yhteydet ja lähteet
- `src/articles/*.md` — toimitetut artikkelit, muille generoidaan lähdepohjainen perusartikkeli
- `src/lib/hierarchy.js` — PACTin ylätason ryhmittely
- `tests/` — graafin ja sisälinkkien eheys
- `AGENTS.md` — agenttien kehitys- ja tietoturvaohjeet
- `docs/CONTENT_AUTHORING.md` — toimituksellinen sisällöntuotanto-opas

## Julkaisu
GitHub Actionsin `.github/workflows/deploy.yml` testaa ja rakentaa `main`-haaran muutokset sekä pyrkii julkaisemaan GitHub Pagesiin. Alkuasetuksena valitse repon **Settings → Pages → Source: GitHub Actions**. Julkaisuosoite, kun Pages on otettu käyttöön: https://penny-five.github.io/rappiopedia/ .

## Tutkimus- ja toimitusohjeet
- [AGENTS.md](AGENTS.md) – agenttien kehitys- ja lähdeohjeet.
- [Content Authoring Guide](docs/CONTENT_AUTHORING.md) – solmut, artikkelit, kuvien oikeudet ja näyttöluokat.
- [Research Playbook](docs/RESEARCH_PLAYBOOK.md) – tutkimuksessa toimineet kyselyt, alkuperäisarkistot, foorumikäytännöt ja graafipolut.
- [Research Log](docs/RESEARCH_LOG.md) – ajoitetut löydökset ja jatkotutkimuksen johtolangat.

## Lähde- ja turvallisuusperiaate
Yhteinen ohjelma tai tapahtuma osoittaa kontaktin, ei omistusta, rahoitusta tai osallistumista muiden tekoihin. Dokumentoitu tieto, uutisoitu väite, julkiseen tunnisteeseen perustuva päätelmä ja foorumijohtolanka näkyvät erillisinä. Yksilöity foorumikertomus riittää tavallisen julkisen matkustus-, vierailu- tai yhteisstriimiyhteyden raportoimiseen. Sen sijaan vakavat syytökset tai henkilökohtaiset sopimusväitteet edellyttävät vahvempaa näyttöä.

Kuville rakennetaan paikallinen WebP-assetputki: alkuperäiskuva käsitellään projektin kuvamankelilla ennen tallennusta julkaistaviin tiedostoihin.
