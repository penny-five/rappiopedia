# Rappiopedia — Research Playbook

Tämä on käytännön tiedonhankinnan työkirja Rappiopedian toimittajille ja agenteille. Päivitetty 1.11.2026. Tarkoitus on löytää uusia julkisia henkilö-, ohjelma- ja tapahtumayhteyksiä, arvioida niiden merkitys ja siirtää havainnot Rappioverse-graafiin.

## 1. Aloita verkoston aukosta, älä valmiista teoriasta

- Etsi **silta** kahden nykyisen sektorin välille: sama henkilö kahdessa ohjelmassa, yhteinen striimi, dokumentti, tapahtuma, tuotantotiimi tai kaupallinen tunniste.
- Tee ensin graafihaku: esiintyykö nimi jo toisella aliaksella? Esimerkiksi `aleksi` on Aleksi Nurminen, ja `pact_pottu` on Pottukoiran PactTalks-jakso.
- Kysy jokaisesta löydöstä: mikä **täsmällinen suhde** tuli todistetuksi? "Vieraili striimissä" on eri väite kuin "on sponsori" tai "toimii järjestäjänä".
- Tutki erillisinä myös sisällön levitysketjut: lähteenä toimiva KickTracker ei ole itse ohjelman tuottaja eikä foorumiketju suoraan tapahtuman järjestäjä.

## 2. Käytännössä toimineet hakumenetelmät

### Nimi × henkilö × tapahtuma

Parhaiten toimivat rajatut parihakut, esim. `"Pottukoira" "Aleksi Nurminen" 2025` tai `"Pasi Viheraho" "Pact Talks" lokakuu`. Haun voi rajata `site:gekkonen.net`, `site:reddit.com`, `site:ylilauta.org` tai `site:seiska.fi`.

Aliaksia käytetään rinnakkain: Pottukoira/Jouko Kärkkäinen, Pirkkis/Pirkka-Ukko, Upi/Arttu Pulkkinen, Jethro/Jeti, Testotimo/Timo Naapila, PactTalks/Pact Talks, Bämät Matkoilla/BamatMatkoilla. Säilytä arkistossa kanavan alkuperäinen kirjoitusasu, mutta yhdistä kaikki saman henkilön vahvistetut aliakset samaan solmuun.

### Lähetyshistoria ensin, tulkinta vasta sitten

KickTrackerin ja AeroKickin ohjelmaotsikot sopivat **julkaistun lähetyksen päivämäärän, jaksonumeron, juontajan, vieraan ja komentotunnisteiden** tarkistamiseen. Esimerkiksi `pact`-kanavan lokakuun 2026 jaksoissa näkyvät *Bämät Matkoilla* EP 97–98 sekä `!stake`. Otsikko ei paljasta vierailun korvausta, rahaliikennettä eikä sopimuksen ehtoja.

Lisää mahdollisuuksien mukaan alkuperäinen video, klippi tai VOD-linkki. Säilytä ero lähteen kuvauksen ja siinä oikeasti näkyvän kuvan/äänen välillä.

### Foorumit ovat oikeita lähteitä

Ylilaudan, Redditin ja vastaavien **yksilöity julkinen foorumiketju** kelpaa itsenäiseksi lähteeksi tavalliseen matka-, vierailu-, yhteisstriimi- tai ohjelmayhteyteen. Virallista matkustusasiakirjaa tai valtamedian vahvistusta ei edellytetä.

Kirjaa väitteen alkuperäinen URL, postauspäivä, väitetty tapahtumapäivä, kirjoittajan väite ja onko kyse itse nähdystä tallenteesta, ensikäden kertomuksesta vai toisen käden huhusta. Toisistaan riippumattomat havaintoketjut lisäävät luottamusta; toistuva saman huhun kopiointi ei luo lisää riippumattomia lähteitä.

**Käytä väitteen mittaista merkintää:** "Reddit-ketjussa käyttäjät raportoivat matkaseurueen" on todennettava väite keskustelun sisällöstä. Älä kirjoita sen perusteella, että matkan rahoittaja, järjestäjä tai osallistujien sopimus on vahvistettu.

### Hakurobottien estot

Ylilauta voi estää koneellisen selaamisen. Älä keksi ketjun sisältöä tai oleta, että hakutuloksen katkelma kertoo koko ketjun. Etsi samasta nimiparista julkisia keskusteluhakutuloksia, arkistoja tai alkuperäisiä klippejä. Merkitse `access: blocked` tutkimuslokiin ja jätä sisällön tarkistus avoimeksi. Jos käyttäjä toimittaa ketjun tekstin tai kuvakaappauksen, analysoi se suoraan käyttäjän toimittamana aineistona.

## 3. Tiedon luokittelu — todiste koskee aina täsmällistä väitettä

| Taso | Käyttö |
|---|---|
| `verified` | Suoraan tarkistettava klippi, valokuva, arkistoitu ohjelmaotsikko tai ohjelman oma julkaisu osoittaa **sen nimenomaisen** suhteen |
| `reported` | Uutinen tai yksilöity, uskottava foorumihavainto raportoi suhteen, mutta lähteen omaa näyttöä ei ole vielä katsottu kokonaan |
| `observed` | Toistuva julkinen sponsorikomento tai muu havainto antaa vahvan päätelmän yhteistyöstä; älä keksi sopimusehtoja |
| `lead` | Epämääräinen arvaus, kiistetty tai toisen käden huhu; vaatii lisätutkimusta |

**Sama julkaisu ei ole monta riippumatonta lähdettä**, vaikka siitä olisi monta uutista tai Reddit-uudelleenpostaus. Yhden toimituksen kaksi samasta striimistä kirjoittamaa artikkelia tukevat tapahtumaa, mutta eivät osoita kahta riippumatonta silminnäkijää.

Tavallisista julkisista tapahtumayhteyksistä riittää huomattavasti vähemmän näyttöä kuin vakavista väärinkäytös-, rikos- tai yksityiselämäväitteistä. Vakavat syytökset jätetään pois pelkkien juorujen perusteella. Arkiset kontaktit eivät myöskään todista muiden tekemiä tekoja.

## 4. Solmut ja suhteet: vältä epäselvä suora linkki

Käytä tilannetta kuvaavaa tapahtumasolmua, kun samassa kokoonpanossa oli useita henkilöitä:

```
Pottukoira  ── vierailun isäntä ──┐
Testotimo   ── vierailija ────────┼── Yhteisstriimi Virossa 10/2025
Aleksi      ── vierailija ────────┘
Aleksi      ── osallistuja ───────── PactHouse 3 (eri lähde)
```

Näin vierailu ei muutu virheellisesti väitteeksi jatkuvasta liikekumppanuudesta. Lähteessä erotellaan **suunniteltu**, **ilmoitettu**, **toteutunut** ja **peruttu** esiintyminen.

Ajat määritellään tarkasti (väitteen tapahtuma-aika vs. artikkelin julkaisuaika) ja tarvittaessa aikavyöhyke merkitään. Älä oleta että streamin kellonaika on suomalaista paikallisaikaa.

## 5. Löydetyt esimerkit (1.11.2026)

- **Pottukoira ↔ Aleksi Nurminen ↔ Testotimo:** Gekkosen 28.10.2025 raportti kertoo heidän striimausvierailustaan Virossa; Aleksi kuuluu erillisen lähteen mukaan PactHouse 3:n osallistujalistaan. Hyvä kahden tutkintasektorin välinen siltatapaus. Lähde: https://gekkonen.net/oho-pottukoiralta-hurja-veto/
- **Pasi Viheraho ↔ PactTalks:** 11.10.2026 vieraana Jethro Rostedtin ohjelmassa; tuo Pasiradion historian julkisen verkkoviihteen karttaan. Lähde: https://gekkonen.net/pasi-viheraho-paljasti-pact-talksissa-totuuden-vesihanalegendasta-ihmiset-on-niin-dilleja/
- **Bämät Matkoilla ↔ PactTalks:** lähetykset EP 97–98 löytyvät aikaleimattuina KickTrackerista ja AeroKickista. Lähteet: https://kicktracker.net/pact/streams ja https://aerokick.app/stats/channels/pact
- **Ruusutossu / Alisa ↔ Bämät matkoilla:** lokakuun 2026 r/snappijuorut-ketjun käyttäjät kuvaavat kaksikon Ranskan-striimireissua. Dokumentoi foorumikertomus sellaisena, älä päättele sopimuksen tai rahoittajan sisältöä. Lähde: https://www.reddit.com/r/snappijuorut/comments/1xddl2r/joko_on_t%C3%A4%C3%A4ll%C3%A4_postaus_t%C3%A4st%C3%A4/

## 6. Julkaisuprosessi

1. Lisää lähde-ID `src/data/network.json`:n `sources`-osioon ja kuvaa, mitä lähde **todella tukee**.
2. Lisää solmu tai reunat `nodes` / `edges`-taulukkoon; säilytä aiemmat ID:t ja merkitse `level`, `date`, `detail`.
3. Luo tai päivitä `src/articles/<id>.md`. Sisäiset viitteet ovat `[[id|Nimi]]` ja lähteet `[@P60]`.
4. Suorita `npm test` ja `npm run build`; GitHub Actions tarkistaa myös.
5. Käy läpi muutoksen sisältö: ei haavoittavia oletuksia, yksityisiä tietoja, virheellisiä henkilökuvia tai suuria ei-lähteistettyjä kokonaisväitteitä.
6. Kirjaa jäljelle jäävät johtolangat `docs/RESEARCH_LOG.md`-tiedostoon sen sijaan, että pakottaisit ne graafiin.
