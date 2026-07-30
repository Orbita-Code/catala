# Ponovno generisanje — 3 slike devojčice sa ljutim izrazom

> Nastalo 30.07.2026. Vlasnica je uočila da se deci ne dopada ljut izraz lica.
> Provereno gledanjem svih 24 slike uvećano: kod devojčice su ljute tri
> (`led`, `stit`, `vatra`), kod dečaka nijedna.
> `decak-stit` ima poluosmeh sa podignutom obrvom — čita se kao samouveren, ostavljen.

## Najbolji način: PRILOŽITI postojeću sliku, ne opisivati lika od nule

ChatGPT mnogo bolje drži isti lik kad dobije sliku uz prompt. Zato za svaku od tri:

1. Priloži postojeći fajl (`devojcica-led.png` itd.) u ChatGPT
2. Pošalji prompt ispod
3. Sve ostalo mora ostati **isto** — lik, kostim, moć, pozadina

Time se izbegava rizik da novi lik ne izgleda kao ostalih 21 slika.

## Opis lika (ako ChatGPT traži, ili ako slika ne može da se priloži)

Devojčica oko 6 godina, dugačka smeđa kosa koja leti, **roze/crvena traka za glavu**,
velike plave oči, rumeni obrazi. Kostim: plava majica sa **velikom žutom zvezdom na
grudima**, crvena suknjica, žuti pojas, crvena pelerina, crvene čizmice. 3D crtani stil,
vesele boje. Pozadina: bela sa sitnim roze srcima i žutim zvezdicama.

## Prompti

### 1. devojcica-led

```
Keep this exact same character, costume, ice/snowflake power effect and background —
change ONLY her facial expression. She must look happy and delighted: warm open smile
showing teeth, soft rounded eyebrows raised in a friendly way, sparkling cheerful eyes.
No frown, no angry or furrowed eyebrows, no serious or stern look. She is having fun
with her ice powers, not fighting. 3D cartoon style illustration, white background with
small decorative hearts and stars, 512x512px, PNG, colorful and cheerful, for children
ages 5-8. No text, no letters anywhere in the image.
```

### 2. devojcica-stit

```
Keep this exact same character, costume, glowing shield and background — change ONLY
her facial expression. She must look happy and proud: warm open smile, soft rounded
eyebrows raised in a friendly way, bright cheerful eyes. No frown, no angry or furrowed
eyebrows, no stern or determined scowl. She is proudly showing her shield like a game,
not defending against an enemy. 3D cartoon style illustration, white background with
small decorative hearts and stars, 512x512px, PNG, colorful and cheerful, for children
ages 5-8. No text, no letters anywhere in the image.
```

### 3. devojcica-vatra

```
Keep this exact same character, costume, fire power effect and background — change ONLY
her eyebrows and expression. Her smile is good, but her eyebrows are angry and furrowed
— make them soft, rounded and raised in a friendly, joyful way so the whole face reads
as delighted and playful. No angry eyebrows, no frown, no fierce look. 3D cartoon style
illustration, white background with small decorative hearts and stars, 512x512px, PNG,
colorful and cheerful, for children ages 5-8. No text, no letters anywhere in the image.
```

## Posle generisanja

1. **Provera pre snimanja:** je li lik isti kao na ostalim slikama (traka za glavu,
   zvezda na grudima, boje kostima)? je li izraz zaista vedar? je li donja polovina
   slike izoštrena (poznata greška — mutna donja polovina)?
2. Snimiti kao `Ilustracije/maskota-superheroj/devojcica-<varijanta>.png`
   (prepisati staru — stara ostaje u `~/Projects/_ARHIVA-AI-GENERACIJE/`)
3. Kompresovati: `sips -z 512 512 <fajl> -s format png --out <fajl>` (cilj 50–150 KB)
4. Kopirati u `public/mascot/` kad se maskota bude povezivala u kod
5. Osvežiti `PREGLED-24-varijante.jpg`

## Pravila koja ovde važe (iz CLAUDE.md projekta)

- Ljudi i životinje **smeju** imati lice — pravilo „bez lica" važi samo za predmete
- **Bez teksta na slici** (višejezičnost — iste slike se dele za druge jezike)
- Jedna reč po poruci, čekati odgovor pre sledeće
- Nikad dva puta isti prompt; ako stigne poruka o ograničenju — stati potpuno i čekati
  navedeno vreme + 1 minut
