# Rappiopedia: Content Authoring Guide

## Perusperiaate
Rappiopedia on lähteistetty yhteysensyklopedia, Rappioverse sen tutkittava 3D-graafi. Kirjoita artikkelit neutraalisti, selkeästi ja suomeksi. Erota lähteen osoittama havainto, uutisoitu väite, oma perusteltu päätelmä ja avoin kysymys.

## Datan lisääminen
Muokkaa `src/data/network.json`: `nodes` sisältää kohteet, `edges` suhteet ja `sources` lähteet.
Uusi solmu tarvitsee vakaan lyhyen `id`-tunnisteen, julkisen `name`-nimen, `group`-ryhmän, `cat`-luokan, neutraalin `note`-kuvauksen, kolmen numeron `pos3`-koordinaatit sekä `featured`-arvon.
Suhde tarvitsee `a`, `b`, selkeän `label`-tekstin, `level`-luokituksen, `src`-lähde-ID-listan ja tarvittaessa `detail` / `date`. Älä lisää lähteetöntä suhdetta.

## Artikkelit
Artikkelit ovat muotoa `src/articles/<id>.md`. Sama `id` kuin solmulla. Tuki: toisen ja kolmannen tason otsikot (`##`, `###`), kappaleet, **lihavoitu**, *kursivoitu*, listat ja lainauslohkot.
- `[[jethro|Jethro Rostedt]]` linkittää toiseen solmuun.
- `[@P6]` on lähdeviite, jonka URL ja nimi löytyvät `network.json`-tiedoston `sources`-osiosta.
- HTML, ulkopuoliset Markdown-linkit ja scriptit eivät ole tuettuja artikkelisisällössä.
- Muista tarkistaa että kaikki sisälinkitetyt ID:t ovat olemassa.

Esimerkki:

```md
## Yhteenveto
**PactHouse 3** kuului [[pact|PACT]]-ohjelmaperheeseen. [@P0]

## Dokumentoidut yhteydet
- [[jethro|Jethro Rostedt]] — voittaja. [@P6]
- [[talks|PactTalks]] — sama ohjelmabrändi. [@P7]

## Avoimet kysymykset
> Ohjelmayhteys ei osoita yhteistä omistusta.
```

## Evidenssiluokat: lähde voi olla myös foorumi

**Ylilauta, Reddit ja muut julkiset foorumit hyväksytään itsenäisiksi lähteiksi.** Rappiopedia kartoittaa muun muassa striimejä, matkaseurueita, esiintymisiä ja skenen sisäisiä tapahtumia. Niistä ei yleensä ole matkustusasiakirjoja, rekisterimerkintöjä eikä journalistisia uutisia, eikä niitä tarvitse vaatia. Merkitse kuitenkin selvästi, *mitä lähde kertoo*.

| Luokka | Todistusaineiston laatu | Esimerkki |
|---|---|---|
| `verified` | Alkuperäinen tarkistettava kuva, video, striimitallenne, virallinen julkaisu tai muu väitteen suoraan näyttävä aineisto — myös foorumilla julkaistuna | "Videolla X ja Y esiintyvät yhdessä." |
| `reported` | Yksilöity ensi käden kuvaus, uskottava silminnäkijäraportti tai useita aidosti riippumattomia yhtäpitäviä kuvauksia; myös foorumilta | "Ylilaudan ketjun mukaan X ja Y olivat samalla reissulla." |
| `observed` | Julkisesta sisällöstä nähty signaali ja siitä tehty perusteltu päätelmä, esim. usean striimin sponsori-/affiliate-tunniste | "Toistuva !kasinokurki viittaa vahvasti kaupalliseen yhteistyöhön." |
| `lead` | Yksittäinen epämääräinen huhu, nimettömän kirjoittajan spekulaatio, kiistetty tai keskenään ristiriitainen tieto | "Yksittäinen kommentoija arveli X:n järjestäneen matkan." |

### Foorumilähteen arviointi käytännössä

1. Linkitä **yksilöity ketju tai kommentti** lähdearkistoon, kirjaa päiväys ja väitteen sisältö. Alkuperäinen kuva tai klippi kannattaa linkittää rinnalle, jos se on saatavilla.
2. Arvioi, kirjoittaako käyttäjä **omista havainnoistaan vai toistaako hän kuulemaansa**. Ajankohtainen, yksityiskohtainen ja helposti tarkistettava havainto voi riittää vähäriskisen suhteen merkitsemiseen.
3. Useamman käyttäjän toisistaan riippumattomat yhtenevät kertomukset lisäävät näyttöä. Pelkkä kommenttien määrä tai huhun lainaaminen ei tuo riippumatonta vahvistusta.
4. Tavallisen matkustamisen, ohjelmavierailun ja yhteislähetyksen voi merkitä `reported`-tasolle foorumin perusteella. Ilmaise lähde tekstissä, älä kirjoita varmentamatonta havaintoa absoluuttisena faktana.
5. **Älä vaadi matkustusasiakirjoja** tai muita epärealistisia dokumentteja. Vakaviin rikos-, väkivalta-, hyväksikäyttö- tai petosväitteisiin tarvitaan huomattavasti vahvempi näyttö ja huolellinen attribuutio; pelkkä foorumihuhu ei riitä.

Esimerkiksi **Upin, Pirkkiksen ja Taigan Amsterdamin-matkaa** koskevan ketjun voi merkitä tapahtuman lähteeksi ja tarvittaessa `reported`-tasolle, jos keskustelu sisältää tunnistettavia, ajankohtaisia ensi käden kertomuksia. Jos kyse on vain yhden kommentoijan arvauksesta, käytä `lead`-tasoa. Tapahtumaa ei tarvitse todistaa lentolipulla.

## Kuvien käsittely
Kuvat kuuluvat Rappiopedian omaan tiedostorakenteeseen, eivät suoraan ulkoisten palvelimien URL-osoitteisiin. Hae kuvat ensin paikalliseen lähdekuvakansioon, aja projektin kuvamankeli ja käytä graafissa tuloksena syntyviä optimoituja kuvia. `node.image` osoittaa paikalliseen assettiin, esimerkiksi `/images/pottu.webp`. Kokoa henkilöt, tapahtumat ja ohjelmat samaan käsittelyputkeen; kuvaa ei tarvitse käsitellä käsin jokaisella lisäyskerralla.

## Tiedonhankinnan toistettava työprosessi
Laajemmat käytännöt ovat [Research Playbookissa](RESEARCH_PLAYBOOK.md). Uusi tutkimushaara aloitetaan nimeämällä **kaksi tutkittavaa sektoria**, etsimällä niiden väliin sopivaa tapahtumaa tai henkilöä ja kirjaamalla haussa käytetyt nimialiakset. Lähetysmetadatasta tarkistetaan vieraat ja päivät. Foorumien ajankohtaisista kommenteista saadaan osallistujien kertomukset; kummallakaan lähdetyypillä ei yksin päätellä yksityisiä sopimuksia. Kirjaa myös mikä ei auennut tai mitä ei löytynyt.

## Tarkistuslista
- Identiteetti (esim. Ruusutossu) ja ohjelmakausi täsmäävät.
- Yhteys ja lähde kuvaavat samaa tapahtumaa.
- Sisälinkit ja lähdekoodit löytyvät datasta.
- Epävarmat asiat on attribuoitu eikä ketään syyllistetä niiden perusteella.
- `npm test`, `npm run build`, ja Actions-tarkistus onnistuvat ennen julkaisuilmoitusta.
