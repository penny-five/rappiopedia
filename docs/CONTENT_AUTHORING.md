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

## Evidenssiluokat
| Luokka | Merkitys | Kirjoitustapa |
|---|---|---|
| `verified` | Ensisijainen julkaisu, alkuperäinen striimi, virallinen lista | "esiintyi", "julkaisi" |
| `reported` | Journalistisesti uutisoitu tai attribuoitu väite | "X:n mukaan" |
| `observed` | Näkyvä tunniste tai promo; vahvasti perusteltu yhteistyöpäätelmä | "viittaa yhteistyöhön; sopimusta ei nähty" |
| `lead` | Ylilauta/Reddit-väite, kiistetty tai todentamaton | "keskustelussa väitettiin; ei vahvistettu" |

Toistuvat foorumiväitteet ovat hyvä tutkimuksen priorisointiperuste, eivät ilman riippumatonta näyttöä vahvistettu fakta. Säästä alkuperäiset ketjulinkit ja julkaisupäivät.

## Kuvien käyttö
`node.image`: tunnistettu, käyttökelpoinen kuva-URL; `node.imageCredit`: attribuutio. Älä julkaise luvattomia mediakuvia repoon tai esitä generoitua kasvokuvaa oikeana henkilönä. Jos kuva ei lataudu, käyttöliittymä näyttää nimikirjaimet.

## Tarkistuslista
- Identiteetti (esim. Ruusutossu) ja ohjelmakausi täsmäävät.
- Yhteys ja lähde kuvaavat samaa tapahtumaa.
- Sisälinkit ja lähdekoodit löytyvät datasta.
- Epävarmat asiat on attribuoitu eikä ketään syyllistetä niiden perusteella.
- Ei yksityisiä henkilötietoja.
- `npm test`, `npm run build`, ja Actions-tarkistus onnistuvat ennen julkaisuilmoitusta.
