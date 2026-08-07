"""
SLIKA ZA MNOŽINU — složena od postojeće slike za jedninu.

Zašto ovako, a ne nova generacija: dete uči da „tassa" i „tasses" NIJE druga
stvar nego ISTA stvar u više komada. Ako množinu nacrta model iznova, dobiju se
tri malo drugačije šolje — druga boja drške, drugi ugao — i poruka se izgubi.
Ovako je to bukvalno ista šolja u tri primerka, pa razliku nosi SAMO broj.

Raspored: jedna napred u sredini, dve iza levo i desno, malo manje i pomerene
naviše. Tako se vidi dubina i odmah se prebroji da ih je više.
"""
from PIL import Image
from collections import deque
import sys, os

# ime jednine -> ime množine (katalonski), po svesci Tema 8, zadatak 2
PAROVI = {
    "tassa": "tasses", "ampolla": "ampolles", "got": "gots", "copa": "copes",
    "ganivet": "ganivets", "cullera": "culleres", "forquilla": "forquilles",
    "plat": "plats", "tovallo": "tovallons",
}

IZVOR = "public/illustrations"
PLATNO = 512

def skini_belu_pozadinu(im, prag=238):
    """
    Belu POZADINU pretvara u prozirnu, ali samo onu koja dodiruje ivicu slike.
    Obična zamena „sve belo -> prozirno" izbušila bi rupe u samom predmetu
    (beli tanjir, beli papir, odsjaj na staklu) — zato se ide razlivanjem od
    ivice ka unutra, pa se belina zatvorena u predmetu ne dira.
    """
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    belo = lambda p: p[0] >= prag and p[1] >= prag and p[2] >= prag
    red, vid = deque(), [[False] * w for _ in range(h)]
    for x in range(w):
        for y in (0, h - 1):
            if belo(px[x, y]) and not vid[y][x]:
                vid[y][x] = True; red.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if belo(px[x, y]) and not vid[y][x]:
                vid[y][x] = True; red.append((x, y))
    while red:
        x, y = red.popleft()
        px[x, y] = (255, 255, 255, 0)
        for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not vid[ny][nx] and belo(px[nx, ny]):
                vid[ny][nx] = True; red.append((nx, ny))
    return im

def iseci_prazno(im):
    """Skida prozirnu ivicu da predmet bude centriran, ne slika."""
    im = skini_belu_pozadinu(im)
    kutija = im.split()[3].getbbox()
    return im.crop(kutija) if kutija else im

def mnozina(putanja, izlaz):
    izv = iseci_prazno(Image.open(putanja))
    platno = Image.new("RGBA", (PLATNO, PLATNO), (0, 0, 0, 0))

    # (razmera, x u %, y u %) — zadnja dva prvo, pa prednji preko njih
    mesta = [(0.52, 0.24, 0.34), (0.52, 0.76, 0.34), (0.66, 0.50, 0.62)]
    for raz, px, py in mesta:
        w = int(PLATNO * raz)
        h = int(izv.height * w / izv.width)
        if h > PLATNO * raz:                    # visoki predmeti (viljuška, nož)
            h = int(PLATNO * raz)
            w = int(izv.width * h / izv.height)
        kom = izv.resize((w, h), Image.LANCZOS)
        platno.alpha_composite(kom, (int(PLATNO * px - w / 2), int(PLATNO * py - h / 2)))
    # Ostale ilustracije imaju belu podlogu, pa je i ova dobija — inače bi u
    # tamnoj temi ili na obojenoj kartici izgledala drugačije od svih ostalih.
    podloga = Image.new("RGBA", (PLATNO, PLATNO), (255, 255, 255, 255))
    podloga.alpha_composite(platno)
    podloga.convert("RGB").save(izlaz)

if __name__ == "__main__":
    for jed, mn in PAROVI.items():
        ul = os.path.join(IZVOR, f"{jed}.webp")
        iz = os.path.join(sys.argv[1] if len(sys.argv) > 1 else ".", f"{mn}.png")
        mnozina(ul, iz)
        print("  napravljeno:", os.path.basename(iz))
