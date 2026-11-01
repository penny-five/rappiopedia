# Rappiopedia

**Rappiopedia on suomalaisen nettiviihteen ja striimauskulttuurin yhteysensyklopedia.** Se kokoaa samaan tutkittavaan verkostoon ihmisiä, ohjelmia, tapahtumia, yhteisstriimejä, medioita ja niiden välisiä julkisia kytköksiä. Tavoitteena on nähdä paitsi *kuka liittyy kehen* myös **miten, milloin ja minkä lähteen perusteella**.

Projekti seuraa esimerkiksi PACTin / PactHousen kausia ja PactTalksia, suomalaisia Kick- ja rappiostriimaajia, Pottukoiraa, Iippadaata, Upia ja Pirkkistä, Bailupaattia, rap-skenessä esiintyviä nimiä sekä tapahtuma-, media- ja rahapelimarkkinoinnin yhteyksiä. Verkosto ei ole valmis luettelo ihmisistä: uusia nimiä ja suhteita lisätään sitä mukaa kuin niistä löytyy julkista aineistoa.

## Avaa Rappiopedia

**[Rappiopedia verkossa](https://penny-five.github.io/rappiopedia/)** · [Selaa lähdekoodia](https://github.com/penny-five/rappiopedia) · [Kirjoita artikkeli](docs/CONTENT_AUTHORING.md)

> Julkinen osoite toimii, kun GitHub Pages on otettu käyttöön ja julkaisuajo on onnistunut. Jos sivu ei vielä aukea, katso [Actions](https://github.com/penny-five/rappiopedia/actions).

## Rappioverse — 3D-kartta, joka vie wikiartikkeleihin

**Rappiopedia** on koko sivusto. **Rappioverse** on sen 3D-universumi, jonka avulla yhteyksiä tutkitaan.

Sivun kolme osaa ovat:

1. **Vasen reuna:** haku, tutkintasektorit, yhteyksien näyttöaste ja kahden solmun välinen yhteyspolku.
2. **Keskellä Rappioverse:** pyöritettävä ja zoomattava 3D-verkosto. Henkilöt, ohjelmat ja tapahtumat ovat solmuja; viivat ovat lähteisiin sidottuja yhteyksiä. PACT-ohjelmaperheellä on hierarkkinen ylätason ryhmittely.
3. **Oikea reuna:** valitun solmun Rappiopedia-artikkeli. Se sisältää kuvallisen infoboksin, Markdown-tekstin, suorat sisälinkit muihin solmuihin, luokitellut suhteet ja lähteet.

**Esimerkki:** [[tekninen solmupolku]] Pottukoira → yhteinen Viron striimi → Aleksi Nurminen → PactHouse 3. Jokaisen välin taustalla on oma väite ja lähde; yhteysketju ei automaattisesti tarkoita liikekumppanuutta.

Käyttö: hiiren veto pyörittää 3D-näkymää, rulla zoomaa, Shift + veto siirtää karttaa ja solmun klikkaus avaa artikkelin. Solmuun voi linkittää suoraan esimerkiksi osoitteella [#/node/pottu](https://penny-five.github.io/rappiopedia/#/node/pottu).

## Mitä tietokanta sisältää?

Aineisto koostuu kolmesta ydinosasta tiedostossa [src/data/network.json](src/data/network.json):

- **Nodes**: julkiset henkilöt, ohjelmat, tapahtumat, brändit, kanavat, julkaisut ja muut verkostokohteet.
- **Edges**: kahden solmun välinen tarkasti nimetty suhde, esimerkiksi "osallistui ohjelmaan", "vieraili lähetyksessä" tai "esiintyy tapahtuman ohjelmassa".
- **Sources**: lähteen nimi ja linkki. Yhteydet viittaavat lähteisiin tunnisteilla, kuten \`P60\`.

Yhteydet luokitellaan näyttötyypin mukaan: \`verified\` (alkuperäinen havainto), \`reported\` (uutisoitu tai foorumilla raportoitu), \`observed\` (julkiseen merkkiin perustuva perusteltu päätelmä) ja \`lead\` (avoin johtolanka). **Reddit ja Ylilauta ovat hyväksyttäviä itsenäisiä lähteitä** tavallisille matka-, vierailu- ja striimiyhteyksille. Käytämme alkuperäisiä linkkejä ja kerromme mitä lähde todella tukee.

Saman ohjelman vieraat tai samaan tapahtumaan osallistuneet eivät automaattisesti ole samalla tavalla sidoksissa: suhteen tyyppi kertoo olennaisen.

## Kehittäminen paikallisesti

Tarvitset **Node.js 22+** ja npm:n.

\`\`\`bash
git clone https://github.com/penny-five/rappiopedia.git
cd rappiopedia
npm install
npm run dev
\`\`\`

Vite avaa paikallisen kehityspalvelimen. Testaus ja tuotantobuild:

\`\`\`bash
npm test
npm run build
npm run preview
\`\`\`

Tuotantoversio syntyy \`dist/\`-kansioon. GitHub Pagesin Vite-base on \`/rappiopedia/\`.

## Kuvamankeli — omat, pienet kuvat repoon

Solmukuvat tallennetaan projektiin **WebP-muodossa**, jolloin sovellus ei riipu muiden sivustojen kuvahotlinkeistä. Automatiikka hakee nykyiset \`imageSource\`-osoitteet, muuntaa onnistuneet kuvat ja korvaa \`node.image\`-kentän paikallisella \`images/<id>.webp\`-polulla.

\`\`\`bash
python -m pip install "Pillow>=11,<13"
python scripts/process_images.py --download --update-data
\`\`\`

Oletusrajat: pisin sivu 720 px ja enintään 160 KiB/kuva. Alkuperäisen kuvan voi myös tallentaa \`assets/source-images/<id>.jpg\`-kansioon ja ajaa mankelin ilman \`--download\`-valitsinta. **GitHub Actions → Optimize images** ajaa saman prosessin GitHubissa ja commitoi onnistuneet kuvat. Jos jokin palvelin estää latauksen, epäonnistunut kuva näkyy ajon lokissa eikä sitä merkitä onnistuneeksi.

Lisäohjeet: [Kuvamankeli](docs/IMAGE_PROCESSING.md).

## Projektin rakenne

\`\`\`text
rappiopedia/
├── .github/workflows/     # testaus, julkaisu ja kuvien optimointi
├── index.html             # käyttöliittymän runko
├── src/
│   ├── main.js            # 3D-kamera, piirtäminen, haku ja navigointi
│   ├── wiki.js            # Markdown-artikkelit ja lähteet
│   ├── styles.css         # mustavalkoinen wiki-ulkoasu
│   ├── data/network.json  # solmut, suhteet ja lähdearkisto
│   ├── articles/*.md      # toimitetut artikkelit
│   └── lib/               # graafipolut ja hierarkia
├── public/images/         # julkaistavat optimoidut WebP-kuvat
├── assets/source-images/  # paikalliset raakakuvat (ei Gitissä)
├── scripts/               # kuvamankeli
├── tests/                 # aineiston, artikkeleiden ja kuvien testit
└── docs/                  # tutkimus- ja sisällöntuotanto-ohjeet
\`\`\`

## Artikkelien kirjoittaminen ja tutkiminen

- [Content Authoring Guide](docs/CONTENT_AUTHORING.md) — uuden solmun ja Markdown-artikkelin tekeminen, sisälinkit \`[[id|nimi]]\` ja lähdeviitteet \`[@P60]\`.
- [Research Playbook](docs/RESEARCH_PLAYBOOK.md) — käytännössä toimineet tiedonhakumenetelmät, striimien otsikkohistoria, Reddit/Ylilauta, alialakset ja lähdetasot.
- [Research Log](docs/RESEARCH_LOG.md) — dokumentoidut tutkimushaarat ja seuraavat selvityskohteet.
- [AGENTS.md](AGENTS.md) — ohjeet koodia ja sisältöä muokkaaville agenteille.

Artikkeliteksti kirjoitetaan tiedostoon \`src/articles/<solmu-id>.md\`. Kun solmuun ei ole vielä kirjoitettu omaa artikkelia, sivu näyttää verkostosta kootun alustavan kuvauksen yhteyksineen.

## Julkaisu

Työnkulku [Test, build and deploy](.github/workflows/deploy.yml) suorittaa testit, rakentaa Viten tuotantoversion ja julkaisee GitHub Pagesiin. Käyttöönotto: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Kuvien omassa työnkulussa luodut commitit käynnistävät uuden tuotantobuildin.

Projekti on jatkuvasti täydentyvä tutkimus- ja kehityshanke. Löydösten tuki ja tulkinta näkyvät kussakin artikkelissa ja verkostoreunassa.
