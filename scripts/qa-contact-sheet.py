"""
⚠️ NE RADI NA OVOM MAC-u (12.08.2026): sistemski `python3` traži prihvatanje
Xcode licence, a ImageMagick pada iz istog razloga. Umesto ovoga koristi:

    node scripts/kontakt-liste.mjs

Isti posao, bez ijedne dozvole (`sharp` dolazi uz Next.js).
"""
"""
KONTAKT LISTA ILUSTRACIJA — sve slike jedne teme na jednom listu.

Izraz je iz fotografije: kad se razvije film, sve sličice se odštampaju jedna do
druge, pa se na prvi pogled vidi koja je promašena. Isto važi i ovde.

ZAŠTO POSTOJI: u aplikaciji dete vidi JEDNU sliku u jednom trenutku i svaka za
sebe izgleda u redu. Neujednačenost stila, tekst na slici ili lice na predmetu
vide se SAMO u poređenju. Prebrojavanje fajlova i provera da svaka slika postoji
prolaze uredno i kad je na čaši napisano „Yogurt" — a to je stajalo mesecima.
Slika se ne ocenjuje spiskom nego gledanjem.

Pokretanje:
    python3 scripts/qa-contact-sheet.py <tema> [izlazni-folder]
    python3 scripts/qa-contact-sheet.py --sve [izlazni-folder]

Bez izlaznog foldera piše u `AUDIT/kontakt-liste/`.
"""
import sys
import re
import os
import subprocess
import unicodedata

PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEME = ["la-classe", "l-escola", "el-cos", "la-roba", "la-casa", "la-familia",
        "les-botigues", "el-menjar", "els-animals", "la-ciutat", "els-vehicles", "els-oficis"]


def kljuc(w):
    """Ime reči → ime fajla: skida naglaske, srednju tačku i razmake."""
    s = unicodedata.normalize("NFD", w)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.replace("·", "-").lower()
    return re.sub(r"[\s']+", "-", s)


def lista_za_temu(slug, izlaz):
    data = open(os.path.join(PROJ, "src", "data", f"{slug}.ts"), encoding="utf-8").read()
    reci = set()
    for m in re.finditer(r'(?:catalan|word|correct|targetItem|item|image|blank|left|right):\s*"([^"]+)"', data):
        reci.add(m.group(1).strip())

    tmp = os.path.join(izlaz, f".tmp-{slug}")
    os.makedirs(tmp, exist_ok=True)
    ima, nema, pokvarene, vidjene = [], [], [], set()

    for w in sorted(reci):
        k = kljuc(w)
        if k in vidjene:
            continue
        vidjene.add(k)
        p = os.path.join(PROJ, "public", "illustrations", f"{k}.webp")
        if not os.path.exists(p):
            nema.append(w)
            continue
        tp = os.path.join(tmp, f"{k}.png")
        r = subprocess.run(["magick", p, "-resize", "200x200", tp], capture_output=True)
        if r.returncode != 0 or not os.path.exists(tp):
            pokvarene.append(w)
            continue
        ima.append((w, tp))

    if not ima:
        print(f"{slug}: nema nijedne slike")
        return 0, nema, pokvarene

    put = os.path.join(izlaz, f"kontakt-{slug}.png")
    args = ["montage"]
    for w, tp in ima:
        args += ["-label", w, tp]
    args += ["-tile", "6x", "-geometry", "200x200+6+26",
             "-background", "white", "-pointsize", "22", put]
    subprocess.run(args, check=True)
    for f in os.listdir(tmp):
        os.remove(os.path.join(tmp, f))
    os.rmdir(tmp)

    print(f"{slug:14s} {len(ima):3d} slika → {os.path.basename(put)}")
    if pokvarene:
        print("               OŠTEĆENE: " + ", ".join(pokvarene))
    if nema:
        print(f"               BEZ slike ({len(nema)}): " + ", ".join(nema[:12])
              + (" …" if len(nema) > 12 else ""))
    return len(ima), nema, pokvarene


if __name__ == "__main__":
    arg = sys.argv[1] if len(sys.argv) > 1 else "--sve"
    izlaz = sys.argv[2] if len(sys.argv) > 2 else os.path.join(PROJ, "AUDIT", "kontakt-liste")
    os.makedirs(izlaz, exist_ok=True)
    teme = TEME if arg == "--sve" else [arg]
    uk = 0
    for t in teme:
        n, _, _ = lista_za_temu(t, izlaz)
        uk += n
    print(f"\nukupno slika na listama: {uk}")
    print(f"liste su u: {izlaz}")
