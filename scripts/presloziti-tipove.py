"""
PRESLAGANJE ZADATAKA DA SE TIPOVI SMENJUJU (06.08.2026, odluka vlasnice)

Problem: u 11 od 12 tema isti tip zadatka ponavljao se jedan za drugim — 16 puta
ukupno. Kod pet tema baš na POČETKU (zadaci 1–3 sva tri prepisivanje), pa dete
uđe u novu temu i prvo dobije tri pisanja zaredom. „Imaju utisak da samo vežbaju
pisanje" — prijava vlasnice.

ODSTUPANJE OD PRAVILA #1, svesno i odobreno: `CLAUDE.md` traži da teme prate
svesku „tačnim redosledom". Ovo taj redosled menja. Nijedan zadatak se NE briše
i nijedna reč se ne menja — samo mesto u nizu. Vlasnica je obaveštena o sudaru
sa pravilom i odlučila ovako.

KAKO RADI — namerno najmanje moguće mešanje:
  Ide se s leva na desno. Kad zadatak ima ISTI tip kao prethodni, traži se
  NAJBLIŽI sledeći zadatak drugog tipa i on se dovede na to mesto; pomereni
  ostaje odmah iza. Ne pravi se nov raspored iz nule, nego se popravlja samo
  ono što je pokvareno — tako zadatak ne odleti sa 3. mesta na 17.
  Zadaci označeni `bonus: true` uvek ostaju na kraju teme.

Pokretanje:
    python3 scripts/presloziti-tipove.py            # samo prikaže šta bi uradio
    python3 scripts/presloziti-tipove.py --upisi    # stvarno upiše u src/data
"""
import re
import sys
import os

TEME = ["la-classe", "l-escola", "el-cos", "la-roba", "la-casa", "la-familia",
        "les-botigues", "el-menjar", "els-animals", "la-ciutat", "els-vehicles", "els-oficis"]

KOREN = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def podeli_na_zadatke(s):
    """
    Deli fajl na (zaglavlje, [blokovi zadataka], podnožje).
    Komentari koji stoje NEPOSREDNO iznad zadatka putuju zajedno sa njim —
    inače bi objašnjenje ostalo uz pogrešan zadatak.
    """
    # ZAMKA: prva „[" posle „export const" je ona u TIPU (`Task[]`), ne početak
    # niza. Traži se „= [", pa se uzme položaj same zagrade. Prva verzija je
    # gledala samo „[" i pojela je „] = [", pa je svih 12 fajlova ostalo bez
    # otvaranja niza i ništa se nije prevodilo.
    poc_niza = s.index("[", s.index("= [", s.index("export const")))
    kraj_niza = s.rindex("]")
    zaglavlje, telo, podnozje = s[:poc_niza + 1], s[poc_niza + 1:kraj_niza], s[kraj_niza:]

    blokovi, i, n = [], 0, len(telo)
    while i < n:
        j = telo.find("{", i)
        if j == -1:
            break
        # pokupi komentare i prazne redove ispred zadatka
        poc_reda = telo.rfind("\n", 0, j) + 1
        prefiks_poc = poc_reda
        k = poc_reda
        while True:
            pret_kraj = telo.rfind("\n", 0, k - 1)
            red = telo[pret_kraj + 1:k - 1] if pret_kraj != -1 else telo[:k - 1]
            if red.strip().startswith("//") or red.strip() == "":
                prefiks_poc = pret_kraj + 1
                k = pret_kraj + 1
                if k <= 0:
                    break
            else:
                break
        # nađi kraj objekta
        d, p, u_stringu = 0, j, None
        while p < n:
            c = telo[p]
            if u_stringu:
                if c == "\\":
                    p += 2
                    continue
                if c == u_stringu:
                    u_stringu = None
            elif c in "\"'":
                u_stringu = c
            elif c == "{":
                d += 1
            elif c == "}":
                d -= 1
                if d == 0:
                    break
            p += 1
        kraj = p + 1
        if kraj < n and telo[kraj] == ",":
            kraj += 1
        blokovi.append(telo[prefiks_poc:kraj])
        i = kraj
    return zaglavlje, blokovi, podnozje


def osobine(blok):
    tid = re.search(r'id: "([^"]+)"', blok)
    tip = re.search(r'type: "([^"]+)"', blok)
    return (tid.group(1) if tid else "?", tip.group(1) if tip else "?", "bonus: true" in blok)


def presloziti(stavke):
    """
    stavke: [(id, tip, bonus)] — vraća novi redosled indeksa.
    Bonus zadaci se izdvajaju i vraćaju na kraj.
    """
    obicni = [k for k, s in enumerate(stavke) if not s[2]]
    bonus = [k for k, s in enumerate(stavke) if s[2]]

    red = obicni[:]
    i = 1
    while i < len(red):
        if stavke[red[i]][1] != stavke[red[i - 1]][1]:
            i += 1
            continue
        # isti tip kao prethodni — dovedi najbliži sledeći drugog tipa
        z = next((j for j in range(i + 1, len(red))
                  if stavke[red[j]][1] != stavke[red[i - 1]][1]), None)
        if z is None:
            break              # dalje nema ničeg drugog tipa; ostaje kako jeste
        red.insert(i, red.pop(z))
        i += 1
    return red + bonus


def obradi(slug, upisi):
    putanja = os.path.join(KOREN, "src", "data", f"{slug}.ts")
    s = open(putanja, encoding="utf-8").read()
    zaglavlje, blokovi, podnozje = podeli_na_zadatke(s)
    stavke = [osobine(b) for b in blokovi]
    stari = [x[1] for x in stavke]
    red = presloziti(stavke)
    novi = [stavke[k][1] for k in red]

    def nizovi(t):
        return sum(1 for a, b in zip(t, t[1:]) if a == b)

    pomereni = [(stavke[k][0], k + 1, m + 1) for m, k in enumerate(red) if k != m]
    print(f"{slug:14s} {len(blokovi):2d} zadataka | ponavljanja: {nizovi(stari)} → {nizovi(novi)}"
          f" | pomereno: {len(pomereni)}")
    for tid, bio, sad in pomereni[:6]:
        print(f"                 {tid}: bio {bio}. → sad {sad}.")

    if upisi:
        telo = "\n".join(b.rstrip().rstrip(",") + "," for b in (blokovi[k] for k in red))
        open(putanja, "w", encoding="utf-8").write(zaglavlje + "\n" + telo + "\n" + podnozje)
    return nizovi(stari), nizovi(novi)


if __name__ == "__main__":
    upisi = "--upisi" in sys.argv
    print("PRESLAGANJE ZADATAKA" + ("" if upisi else "  (probni prolaz, ništa se ne upisuje)"))
    print("=" * 78)
    pre = posle = 0
    for slug in TEME:
        a, b = obradi(slug, upisi)
        pre += a
        posle += b
    print("=" * 78)
    print(f"ukupno ponavljanja istog tipa zaredom: {pre} → {posle}")
