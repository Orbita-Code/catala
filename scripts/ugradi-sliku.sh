#!/usr/bin/env bash
# ugradi-sliku.sh <nova.png> <kljuc>   — 512×512 u Ilustracije/ i webp u igru
set -euo pipefail
NOVA="$1"; KLJUC="$2"
SCR="${SCRATCH:-/tmp}"
[ -f "public/illustrations/$KLJUC.webp" ] && cp "public/illustrations/$KLJUC.webp" "$SCR/$KLJUC-STARA.webp"
sips -z 512 512 "$NOVA" -s format png --out "$SCR/$KLJUC-512.png" >/dev/null
cp "$SCR/$KLJUC-512.png" "Ilustracije/$KLJUC.png"
cwebp -q 80 "$SCR/$KLJUC-512.png" -o "public/illustrations/$KLJUC.webp" >/dev/null 2>&1
grep -q "\"$KLJUC\"" src/lib/illustrations.ts && REG="registrovana" || REG="NIJE REGISTROVANA u illustrations.ts"
echo "$KLJUC → $(ls -l public/illustrations/$KLJUC.webp | awk '{print $5}') bajtova, $REG"
