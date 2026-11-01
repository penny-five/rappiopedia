# Lähteiden etsiminen ja yhteyksien selvittäminen

Tämä opas kertoo, miten Rappiopediaan etsitään uusia henkilöitä, tapahtumia ja yhteyksiä. Varsinainen sisältö tallennetaan [verkostodataan](../src/data/network.json) ja [artikkeleihin](../src/articles/). Keskeneräiset selvitykset kirjataan [agenttien tutkimusjonoon](../research/leads.json). [Tutkimusloki](RESEARCH_LOG.md) säilyttää päivätyt havainnot tekstimuodossa.

## Käynnistä tutkimusagentti

Uusien aiheiden, suhteiden ja artikkelien löytämiseen tarkoitettu työnkulku on [Rappiopedian tutkimusskillissä](../.agents/skills/rappiopedia-research/SKILL.md). Se yhdistää tämän hakutapaoppaan, nykyisen verkostodatan, artikkelien kirjoittamisen ja avoimen tutkimusjonon käytännön tekemiseksi.

Agentti voi saada **valmiin lähtöaiheen** (henkilö, nimimerkki, tapahtuma, nimipari tai teema) tai toimia **oma-aloitteisesti**. Jälkimmäisessä tapauksessa se lukee tutkimusjonon ja etsii artikkelien sekä yhteyksien puutteita. Komento `npm run research:candidates` auttaa ehdokkaiden löytämisessä, ja `npm run research:candidates -- --focus upi` näyttää tiettyyn verkostosolmuun liittyviä avoimia aiheita. Komento antaa ehdokkaita, ei korvaa ulkoisten lähteiden tutkimista.

Jokaisen tutkimuskerran tarkoitus on viedä löydöt soveltuvin osin artikkeleihin, lähdeluetteloon ja verkostoyhteyksiin. Kirjaa keskeneräiset kysymykset erikseen tutkimusjonoon, jotta seuraava agentti voi jatkaa siitä.

## Mistä kannattaa aloittaa?

Etsi aihe, josta verkostossa on vielä vähän tietoa. Hyviä lähtökohtia ovat esimerkiksi tietty PactTalks-jakso, esiintyjä vierailijana toisen striimaajan lähetyksessä tai tapahtuma, johon osallistui eri yhteisöjen ihmisiä.

Tarkista ensin `network.json`-tiedostosta, löytyykö sama henkilö tai tapahtuma jo toisella nimellä. Esimerkiksi Pottukoira tunnetaan myös nimellä Jouko Kärkkäinen. Yhdelle henkilölle kuuluu yksi solmu, vaikka lähteissä käytettäisiin eri nimiä.

Etsi yhteyksiä myös **tapahtumien kautta**. Jos kaksi ihmistä esiintyi samassa lähetyksessä, kirjaa molempien suhde kyseiseen lähetykseen. Näin voidaan näyttää, missä he ovat kohdanneet, ilman että heidän välilleen keksitään muuta suhdetta.

## Toimivat hakutavat

### Hae nimipareilla ja ajankohdilla

Rajattu haku löytää usein enemmän kuin yleinen aihehaku. Esimerkiksi:

```text
"Pottukoira" "Aleksi Nurminen" 2025
"Pasi Viheraho" "Pact Talks" lokakuu
"Testotimo" "Pottukoira" Viro
```

Kokeile myös nimimerkkejä, aiempia nimiä ja eri kirjoitusasuja. Lähteitä voi etsiä sivustokohtaisesti esimerkiksi `site:gekkonen.net`, `site:seiska.fi`, `site:reddit.com` ja `site:ylilauta.org`.

### Tarkista lähetysarkistot

[KickTracker](https://kicktracker.net/pact/streams) ja [AeroKick](https://aerokick.app/stats/channels/pact) näyttävät lähetysotsikoita ja ajankohtia. Niistä voi selvittää esimerkiksi PactTalksin jaksonumeron, lähetyspäivän ja otsikossa mainitun vieraan.

Jos mahdollista, etsi myös itse tallenne tai klippi. Otsikko kertoo, mitä lähetyksestä on ilmoitettu; tallenne näyttää, mitä siinä tapahtui.

Esimerkki: lokakuun 2026 PACT-lähetysarkistoissa Bämät matkoilla näkyy jaksojen 97 ja 98 otsikoissa. Samoissa otsikoissa esiintyy myös `!stake`-tunniste. Nämä ovat erillisiä havaintoja, eikä tunniste yksin kerro vieraiden omista sopimuksista.

### Etsi myös Gekkosesta, Uunosta ja Redditistä

Suomalaisen rappiostriimauksen historiassa ajankohtaisia, päivämäärällä yksilöityjä tapahtumia löytyy usein myös Gekkosesta (`site:gekkonen.net`), Uunosta (`site:uuno.fi`), Seiskasta, Redditistä (`site:reddit.com/r/snappisensuroimaton` ja `site:reddit.com/r/snappisensuroimat0n`) sekä Ylilaudalta. Näistä voi löytää esimerkiksi lähetysten vieraita, ulkomaanmatkoja, subathonien kestoja, riitoja ja myöhempiä uutispäivityksiä. Hae nimellä, nimimerkillä, ajankohdalla ja paikalla; avaa yksittäinen uutinen tai keskusteluketju ja tallenna suora URL.

Lähteitä ei tarvitse rajata vain suurten uutismedioiden aineistoon, mutta erottele uutisen tekijän näkemä tallenne, nimetty haastateltava, viranomaisen vahvistus, toimitukselle kerrottu tieto ja keskustelijan arvaus. Kirjoita varsinkin kiistanalaiset väitteet niiden esittäjän kertomuksena. Älä päättele rikostuomiota rikosepäilystä tai yhdistä eri tapahtumia pelkän yhteisen nimimerkin perusteella.

**Subathonien kartoitus:** etsi jokaiselle lähetysmaratonille erikseen paikka, aloitus, tiedossa oleva päättyminen, formaatti, vieraat ja tallenne. Tulevasta maratonista kertova ennakko ei osoita toteutumista. Varmista myös hakutuloksen henkilö: KP2Timesin subathon ei ole Pottukoiran subathon.

### Ylilaudan lukurajoitukset ja korvaavat lähteet

Ylilaudan `robots.txt` kieltää muun muassa ChatGPT-User-, GPTBot- ja OAI-SearchBot-tunnuksilta sivujen automaattisen hakemisen. Sivustoa seuraava Crawl Census -mittaus on myös havainnut, että palvelin palauttaa datakeskusosoitteista tuleville hauille HTTP 410 -vastauksia. ChatGPT:n selaustyökalu voi siksi palauttaa ketjun avaamisesta `DisabledError`-virheen. Tämä on tekninen este, eikä se tarkoita, ettei ketjua olisi olemassa. Mittaus: https://crawlcensus.com/site/ylilauta.org.

Älä oleta lukeneesi Ylilaudan ketjun viestejä pelkän hakukatkelman perusteella. Etsi sama henkilö, videokooste tai tapahtuma alkuperäisistä YouTube-/Kick-tallenteista, Redditin päivätyistä ketjuista ja muista julkisista uutisista. Google-hakutulos voi ohjata lähteen jäljille, mutta tarkista yksityiskohdat avattavasta lähteestä ennen julkaisemista. Älä yritä ohittaa palvelimen estoa muuttamalla hakijan tunnistetta. Jos alkuperäinen ketju jää lukematta, jätä avoin tarkistuskysymys `research/leads.json`-tiedostoon.

### Käytä keskustelupalstojen aineistoa

Redditin, Ylilaudan ja muiden julkisten keskustelujen viestit voivat auttaa selvittämään striimausvierailuja, matkaseurueita ja tapahtumia. Yksilöity viesti tai ketju voi olla myös artikkelin lähde.

Merkitse muistiin:
- ketjun tai viestin osoite
- viestin kirjoituspäivä ja mahdollinen tapahtuman päivämäärä
- mitä kirjoittaja itse kertoo nähneensä tai kokeneensa
- löytyykö tapahtumasta videota, kuvaa tai muita erillisiä kuvauksia

Kirjoita artikkeliin tarvittaessa ”Reddit-keskustelussa kerrottiin…” sen sijaan, että keskustelun sisältö esitettäisiin suoraan vahvistettuna tapahtumana. Toistuvat lainaukset samasta viestistä eivät ole uusia lähteitä.

Jos keskustelupalsta estää automaattisen avaamisen, älä päättele koko ketjun sisältöä hakutuloksen katkelmasta. Merkitse tarkistus kesken jääneeksi ja jatka muista lähteistä.

## Mitä yhteyden lähde osoittaa?

Verkostodatan `level`-kenttä kuvaa tiedon perustaa:

| Taso | Esimerkki |
| --- | --- |
| `verified` | Videolta näkyy kahden ihmisen yhteinen lähetys tai ohjelman oma julkaisu vahvistaa osallistujan |
| `reported` | Uutinen tai yksilöity silminnäkijäkuvaus kertoo tapahtumasta |
| `observed` | Lähetysotsikoista tai muusta julkisesta aineistosta tehdään rajattu tulkinta |
| `lead` | Väite on vielä epäselvä, kiistetty tai tarkistamatta |

Kirjaa suhde mahdollisimman täsmällisesti. ”Vieraili Pottukoiran lähetyksessä lokakuussa 2025” on eri tieto kuin ”osallistui PactHouse 3:een toukokuussa 2026”. Sama henkilö voi yhdistää nämä tapahtumat, mutta se ei muuta niitä yhdeksi tapahtumaksi.

Erota myös tapahtuman suunnittelu ja toteutuminen. Esimerkiksi Bailupaatin ennakkoon ilmoitettu vieras ei välttämättä ollut mukana itse risteilyllä.

## Esimerkkejä nykyisestä aineistosta

**Pottukoira, Testotimo ja Aleksi Nurminen.** Gekkonen kirjoitti lokakuussa 2025 Aleksi Nurmisen ja Testotimon vierailusta Pottukoiran luona Virossa. Aleksi osallistui seuraavana vuonna PactHouse 3:een. Verkostossa näitä käsitellään erillisinä tapahtumina. Lähteet: [Gekkonen](https://gekkonen.net/oho-pottukoiralta-hurja-veto/) ja `P42`.

**Pasi Viheraho PactTalksissa.** Viheraho vieraili 11.10.2026 Jethro Rostedtin juontamassa PactTalksissa. Samalla sivustolle saadaan yhteys Viherahon aiempaan Pasiradioon. Lähde: [Gekkonen](https://gekkonen.net/pasi-viheraho-paljasti-pact-talksissa-totuuden-vesihanalegendasta-ihmiset-on-niin-dilleja/).

**Bämät matkoilla.** PactTalksin lähetysarkistossa on Bämät matkoilla -jaksoja, ja lokakuun 2026 [Reddit-keskustelussa](https://www.reddit.com/r/snappijuorut/comments/1xddl2r/joko_on_t%C3%A4%C3%A4ll%C3%A4_postaus_t%C3%A4st%C3%A4/) kuvaillaan Ruusutossun ja Alisan yhteistä Ranskan-matkaa. Lähetysarkisto ja keskustelu ovat kaksi eri lähdettä, joilla on omat tietonsa.

## Avoimet kysymykset ja huhujen jatkoselvitys

Huhut, kiistat ja ristiriitaiset kertomukset voivat olla yhtä lailla osa tapahtuman julkista historiaa. Kerro, mitä niistä on uutisoitu tai keskusteltu ja mitä myöhemmin tapahtui. Lähdeviitteet kuuluvat itse tekstiin, eivät erilliseksi huomautusosioksi.

Kun jokin asia jää avoimeksi, merkitse se [`research/leads.json`](../research/leads.json)-tiedostoon. Siellä on aiheen `nodeIds`- ja `sourceIds`-viitteet, etsittävät tiedot `questions`-kentässä, hakulausekkeet `queries`-kentässä ja seuraavat toimet `nextSteps`-kentässä. Tutkimusjono ei näy verkkosivustolla.

Esimerkiksi Ateenan-matkan artikkelissa voi kertoa Seiskan uutisoimasta Pirkkiksen katoamisesta ja löytymisestä, mutta tallenteiden jäljittäminen ja uutisten yksityiskohtien vertailu ovat agentille tutkimustehtäviä. Näitä varten on tutkimusaihe `pirkkis-athens-2025`.

Kun löydät uusia lähteitä, päivitä ne verkostodataan ja artikkeliin. Merkitse tutkimusjonoon, mikä selvisi ja mitä vielä puuttuu.

## Kun löydät uutta tietoa

1. Varmista, että nimiä, tapahtumia ja lähteitä vastaavat solmut löytyvät datasta, tai lisää ne.
2. Lisää lähde `sources`-osioon ja anna sille uusi tunniste. Kirjaa sen tukema yhteys `edges`-taulukkoon.
3. Päivitä aiheeseen liittyvä Markdown-artikkeli. Kerro asiasta tavallisena, luettavana tekstinä ja liitä lähdeviite.
4. Aja `npm test` ja `npm run build`.
5. Kirjaa jatkotutkimukset [agenttien tutkimusjonoon](../research/leads.json) ja päivätyt havainnot tarvittaessa [tutkimuslokiin](RESEARCH_LOG.md).

Datan kentät, artikkelien linkkimuoto ja kuvien käsittely on kuvattu [sisällön lisäysoppaassa](CONTENT_AUTHORING.md).
