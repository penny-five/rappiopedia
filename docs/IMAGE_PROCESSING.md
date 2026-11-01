# Kuvamankeli

Kuvat käsitellään kerran ja ne julkaistaan projektin omasta `public/images/`-kansiosta. GitHub Pages -sivusto ei tarvitse kuvaa ladatakseen yhteyttä kuvan alkuperäiseen verkkosivuun.

## Automaattinen GitHub-ajo

Workflow **Optimize images** löytyy GitHubin Actions-välilehdeltä. Se ajaa kuvamankelin ja puskee onnistuneesti muunnetut kuvat sekä vastaavat `src/data/network.json`-polut `main`-haaraan. Workflow käynnistyy myös, kun kuvamankeli tai verkostodata muuttuu. Yhden kuvan latausvirhe ei hukkaa muiden kuvien onnistuneita muunnoksia.

## Paikallinen ajo

Python 3.11+ ja Pillow:

```sh
python -m pip install "Pillow>=11,<13"
python scripts/process_images.py --download --update-data
```

Jos alkuperäiskuva on jo koneella, sen voi laittaa nimellä `assets/source-images/<node-id>.jpg` (tai png, webp jne.) ja ajaa ilman `--download`-valitsinta.

Oletukset: suurin sivu **720 pikseliä**, enintään **160 KiB** per WebP-kuva. Mankeli yrittää ensin hyvää kuvanlaatua ja laskee laatua tai kokoa vain tarvittaessa.

```sh
python scripts/process_images.py --update-data --max-width 640 --max-height 640 --max-kb 100
python scripts/process_images.py --download --force --update-data
python scripts/process_images.py --download --dry-run
```

- `imageSource`: alkuperäinen URL (säilytetään uusinta-ajoja varten)
- `image`: `images/<id>.webp` tuotantotiedoston suhteellinen polku
- `public/images/`: vain optimoidut julkaistavat kuvat
- `assets/source-images/`: omat alkuperäistiedostot, Git ei seuraa niitä

Virheviestit luettelevat kuvat, joita lähdepalvelin ei antanut ladata. Niitä ei merkitä onnistuneiksi. Kuvan voi myöhemmin lisätä manuaalisesti lähdekuvakansioon ja ajaa mankelin uudelleen.

Suhteelliset `images/...`-polut toimivat sekä paikallisessa Vite-palvelimessa että GitHub Pagesin `/rappiopedia/`-alipolussa.
