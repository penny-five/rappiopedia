# Sisällön lisääminen Rappiopediaan

Rappiopedian sisältö koostuu artikkeleista ja niiden taustalla olevasta verkostodatasta. Artikkeli kertoo aiheesta lukijalle. Verkostodata yhdistää saman henkilön, ohjelman tai tapahtuman muihin aiheisiin.

## 1. Lisää tai päivitä solmu

Avaa [`src/data/network.json`](../src/data/network.json). Sen `nodes`-taulukossa ovat sivuston aiheet. Tarkista ensin, onko aihe jo mukana toisella nimellä.

Solmun kentät:
- `id`: pysyvä, lyhyt tunniste, esimerkiksi `jethro`
- `name`: sivulla näkyvä nimi
- `group`: kartan aihealue, esimerkiksi `season3` tai `rappio`
- `cat`: aihetyyppi, esimerkiksi `person`, `show` tai `event`
- `note`: lyhyt kuvaus kokonaisilla suomenkielisillä virkkeillä
- `pos3`: sijainti kartalla kolmena lukuna
- `featured`: näytetäänkö kohteen nimi kartan perustilassa

Esimerkiksi `note`-kentässä kannattaa kirjoittaa ”Jethro Rostedt voitti PactHouse 3:n ja on juontanut PactTalksia.”, ei ”PactHouse 3 -voittaja; PactTalks-juontaja”.

Vanhojen solmujen tunnisteita ei kannata muuttaa, koska artikkeleiden sisäiset linkit ja sivuston osoitteet käyttävät niitä.

## 2. Merkitse yhteydet ja lähteet

`edges`-taulukossa yksittäinen yhteys sisältää:
- `a` ja `b`: yhteyden osapuolten solmu-ID:t
- `label`: mitä osapuolten välillä tapahtui
- `level`: `verified`, `reported`, `observed` tai `lead`
- `src`: luettelo lähde-ID:istä
- tarvittaessa `date` ja `detail`

Lähteen tiedot lisätään saman tiedoston `sources`-osioon, jossa ovat lähdetunnisteet, linkit ja selitteet. Yhteyttä ei lisätä ilman lähdettä.

Käytä tarkkoja suhdekuvauksia. ”Vieraili PactTalksissa 11.10.2026” kertoo enemmän kuin ”Pact-yhteys”. Jos kyse on suunnitellusta esiintymisestä, älä nimeä sitä toteutuneeksi osallistumiseksi.

### Mitä näyttötaso tarkoittaa?

| Taso | Milloin sitä käytetään |
| --- | --- |
| `verified` | Tallenne, kuva, ohjelman oma julkaisu tai muu alkuperäinen aineisto osoittaa kyseisen tapahtuman |
| `reported` | Tapahtuma on kerrottu uutisessa, haastattelussa tai yksilöidyssä ensikäden havainnossa |
| `observed` | Julkisista tiedoista tehdään perusteltu havainto tai tulkinta, esimerkiksi lähetysotsikoissa toistuvasta tunnisteesta |
| `lead` | Kyse on vielä selvittämättömästä, ristiriitaisesta tai välillisestä tiedosta |

Myös Reddit- ja Ylilauta-ketjut voivat olla lähteitä. Linkitä täsmällinen keskustelu ja kuvaa, mitä siinä kerrotaan. Esimerkiksi käyttäjien kuvaama yhteinen matka voidaan kirjata raportoituna tapahtumana ilman virallisia matkustusasiakirjoja. Jos ketjussa vain arvaillaan, merkitse tieto sen mukaisesti.

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

## 4. Kuvat

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

## 5. Tarkista muutos

Suorita projektin juuressa:

```sh
npm test
npm run build
```

Katso lisäksi itse, että teksti on luontevaa suomea, nimet ja päivät pitävät paikkansa, linkit vievät oikeisiin aiheisiin ja lähteet tukevat niitä väitteitä, joiden perässä ne ovat.

Laajempaa lähteiden etsimistä varten on [tutkimusopas](RESEARCH_PLAYBOOK.md). Kesken jääneet tarkistukset voi kirjata [tutkimuslokiin](RESEARCH_LOG.md).

## Suhdeverbit kartalla

Jokaisella `src/data/network.json`-tiedoston `edges`-yhteydellä on `verb`-kenttä. Kirjoita siihen lyhyt, täsmällinen suomenkielinen verbi tai verbirakenne (esimerkiksi `juontaa`, `osallistui`, `vieraili`, `perusti`). Kenttä kuvaa suunnan `a` → `b`: `jethro` → `talks`, `verb: "juontaa"`. Rappioverse näyttää verbin valitun solmun yhteysviivalla. `label` kertoo tarkemman suhteen ja `src` sisältää sitä tukevat lähteet. Kiistetyissä ja keskeneräisissä suhteissa verbinkin tulee kuvata tiedon epävarmuus.
