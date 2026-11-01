# Rappiopedia

**Rappiopedia kartoittaa suomalaisen striimaus- ja nettiviihdekulttuurin ihmisiä, ohjelmia, tapahtumia ja niiden välisiä yhteyksiä.** Mukana on muun muassa rappiostriimaajia, Kick-lähetyksiä, PactHouse ja PactTalks, dokumentteja, musiikkiesiintymisiä, pokeritapahtumia sekä aiheita käsitteleviä uutisia ja verkkokeskusteluja.

Tarkoitus on selvittää esimerkiksi, **ketkä ovat esiintyneet samoissa lähetyksissä, keitä on nähty samoissa tapahtumissa ja miten eri nettipiirit liittyvät toisiinsa**. Yhteydet kirjataan lähteineen, jotta lukija voi tarkistaa, mistä tieto on peräisin. Tämä on keskeneräinen, karttuva tietosanakirja — ei pelkkä visualisointidemo.

**[Avaa Rappiopedia](https://penny-five.github.io/rappiopedia/)**

## Miten sivusto toimii?

Rappiopediassa on kaksi toisiinsa kytkettyä näkymää:

- **Rappioverse** on pyöritettävä ja zoomattava 3D-verkostokartta. Solmut ovat henkilöitä, ohjelmia, tapahtumia, julkaisuja tai muita aiheita. Niiden väliset viivat kuvaavat nimettyjä yhteyksiä, kuten osallistumista, vierailua tai esiintymistä.
- **Artikkelit** kertovat, kuka tai mikä valittu kohde on, mitä siitä tiedetään ja mihin muihin kohteisiin se liittyy. Artikkelin linkistä pääsee toiseen aiheeseen, ja lähdeviitteistä alkuperäisiin julkaisuihin.

Verkostosta voi hakea nimellä, rajata näkymää aihepiirin mukaan, tarkastella lähteitä ja etsiä **yhteyspolun kahden kohteen väliltä**. Suhteilla on myös eri näyttötasot: lähteessä suoraan osoitettu, raportoitu, havainnosta päätelty tai avoin johtolanka.

### Mitä verkostosta löytyy?

Esimerkiksi:

- **PACT / PactHouse / PactTalks:** ohjelmakaudet, osallistujat, juontajat ja vieraat.
- **Rappiostriimaus:** Pottukoira, Iippadaa, Upi, Pirkkis, Sami Kieksin dokumentit ja niihin liittyvät lähetykset.
- **Tapahtumat ja muu nettiviihde:** Bailupaatti, Slikin ja Korelonin esiintymiset, Ice Cage, Julkkispelit sekä rahapelibrändien näkyminen striimisisällöissä.
- **Media ja keskustelut:** uutisjutut, julkaistut lähetykset ja yksilöidyt foorumikeskustelut, joista yhteystietoja on kerätty.

Verkosto yhdistää nämä aihealueet esimerkiksi yhteisten esiintyjien ja tapahtumien kautta. Kaikki graafin solmut eivät vielä sisällä erikseen kirjoitettua artikkelia.

## Käynnistä omalla koneella

Tarvitset Node.js 22:n tai uudemman.

```sh
git clone https://github.com/penny-five/rappiopedia.git
cd rappiopedia
npm install
npm run dev
```

Vite tulostaa paikallisen sivuosoitteen. Muut komennot:

```sh
npm test       # Tarkista verkostodata ja artikkelien viitteet
npm run build  # Rakenna julkaistava sivusto dist/-kansioon
npm run preview
```

Sivusto toimii selaimessa ilman erillistä palvelinta tai tietokantaa. Se rakennetaan Vitellä ja tavallisella JavaScriptillä; 3D-kartta piirretään HTML-canvasille.

## Missä sisältö on?

| Tiedosto | Tarkoitus |
| --- | --- |
| [`src/data/network.json`](src/data/network.json) | Solmut (`nodes`), yhteydet (`edges`) ja lähdeluettelo (`sources`) |
| [`src/articles/`](src/articles/) | Käsin kirjoitetut suomenkieliset Markdown-artikkelit |
| [`src/main.js`](src/main.js) | Verkostokartta, haku, suodattimet, kamera ja yhteyspolut |
| [`src/wiki.js`](src/wiki.js) | Artikkelien esitys, sisälinkit ja datasta tuotetut perustekstit |
| [`src/styles.css`](src/styles.css) | Sivuston ulkoasu |
| [`research/leads.json`](research/leads.json) | Agenttien avoimet tutkimusaiheet; tiedostoa ei ladata sivustolle |
| [`tests/`](tests/) | Datan ja viitteiden testit |

Yhteys tallennetaan `network.json`-tiedostoon kahden solmu-ID:n välisenä reunana. Sillä on [suhdetyyppirekisteriin](src/data/relation-types.json) viittaava `type`, tapahtumaa kuvaava `label`, näyttötaso `level` sekä lähteiden tunnisteet `src`. Artikkelissa `[[pottu|Pottukoira]]` avaa vastaavan solmun ja `[@P53]` viittaa lähdeluettelon julkaisuun.

Sisällön lisäämistä käsitellään tarkemmin [kirjoitusohjeessa](docs/CONTENT_AUTHORING.md). Tutkimuksen lähteet ja keskeneräiset selvitykset löytyvät [tutkimusmuistiinpanoista](docs/RESEARCH_LOG.md) ja [tiedonhankinnan ohjeesta](docs/RESEARCH_PLAYBOOK.md).

## Uuden tutkimusagentin käynnistäminen

Repo sisältää [Rappiopedian tutkimusskillin](.agents/skills/rappiopedia-research/SKILL.md), jota Codex voi käyttää projektikohtaisena työnkulkuna. Myös uusi agentti, joka lukee `AGENTS.md`-tiedoston, ohjataan siihen. Skill neuvoo etsimään uusia lähteitä, täydentämään artikkeleita ja lisäämään verkostoon uusia solmuja sekä lähteistettyjä yhteyksiä.

Tutkimuksella on kaksi aloitustapaa:

- **Aihe annettu:** ”Tutki Ruusutossun historiaa ja hänen yhteyksiään muihin striimaajiin. Lisää löydöt Rappiopediaan.”
- **Agentti valitsee:** ”Jatka Rappiopedian tutkimusta itsenäisesti. Valitse kiinnostava aihe, etsi uusia yhteyksiä ja kirjoita löydöksistä artikkeleita.”

Agentin ei tarvitse pyytää lähtöaihetta jälkimmäisessä tapauksessa. Keskeneräiset selvitykset ovat [tutkimusjonossa](research/leads.json). Komento `npm run research:candidates` nostaa esiin avoimia tutkimusaiheita ja paljon yhteyksiä sisältäviä solmuja, joilta puuttuu käsin kirjoitettu artikkeli. Komento `npm run research:candidates -- --focus pottu` rajaa ehdotuksia olemassa olevaan aiheeseen ja sen naapureihin; muu käyttäjän antama lähtöaihe voidaan tutkia uutena solmuna.

Skill ei käynnistä itsestään ajastettua tutkimusta, vaan ohjaa käynnistettyä agenttia viemään tutkimuksensa konkreettisiksi muutoksiksi. ChatGPT:ssä erikseen asennettavien skillien saatavuus riippuu työtilasta; repossa oleva `SKILL.md` ei yksin tarkoita, että se olisi asennettu ChatGPT-tilille.

## Julkaisu

`main`-haaran päivitykset testataan ja rakennetaan GitHub Actionsissa. Julkaisu tehdään GitHub Pagesiin osoitteeseen **https://penny-five.github.io/rappiopedia/**. Työnkulku on tiedostossa [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
