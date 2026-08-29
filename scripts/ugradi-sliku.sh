#!/usr/bin/env bash
# ugradi-sliku.sh <nova.png> <kljuc>   — 512×512 u Ilustracije/ i webp u igru
#
# ODNOS STRANICA SE ČUVA (29.08.2026, prijava vlasnice: „zašto je ovako zbijena
# slika"). Ranije je stajalo `sips -z 512 512`, što sliku NASILNO razvuče u
# kvadrat. Dok su sve slike bile kvadratne to se nije videlo — ali likovi
# (astronautkinja, pevačica, balerina…) dolaze uspravni, 1024×1536, pa su bili
# stisnuti za trećinu: uža glava, izduženo telo.
#
# Sada se slika UKLAPA u kvadrat i dopunjuje belim sa strane. Bela je ista kao
# podloga kartice, pa se dopuna ne vidi; na završnoj strani se ionako skida.
set -euo pipefail
NOVA="$1"; KLJUC="$2"
SCR="${SCRATCH:-/tmp}"
[ -f "public/illustrations/$KLJUC.webp" ] && cp "public/illustrations/$KLJUC.webp" "$SCR/$KLJUC-STARA.webp"
node -e "
const sharp=require('sharp');
sharp(process.argv[1])
  .resize(512,512,{fit:'contain',background:{r:255,g:255,b:255,alpha:1}})
  .png().toFile(process.argv[2]).then(()=>{},e=>{console.error(e.message);process.exit(1)});
" "$NOVA" "$SCR/$KLJUC-512.png"
cp "$SCR/$KLJUC-512.png" "Ilustracije/$KLJUC.png"
cwebp -q 80 "$SCR/$KLJUC-512.png" -o "public/illustrations/$KLJUC.webp" >/dev/null 2>&1
grep -q "\"$KLJUC\"" src/lib/illustrations.ts && REG="registrovana" || REG="NIJE REGISTROVANA u illustrations.ts"
echo "$KLJUC → $(ls -l public/illustrations/$KLJUC.webp | awk '{print $5}') bajtova, $REG"
