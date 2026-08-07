"""
TREPTAJ IZ SAME SLIKE — bez ijedne nove generacije u ChatGPT-u.

Zašto ovako, a ne kroz ChatGPT: ChatGPT bi na zahtev „ista slika, zatvorene oči"
nacrtao lik koji je SLIČAN, ali ne isti — obraz drugačiji za pola tona, glava
pomerena za par piksela. Kad se dve takve slike brzo smene (treptaj traje 0,14 s),
oko to vidi kao poskakivanje, a ne kao treptaj.

Ovde se kapak crta PREKO originala, a boja kože se uzima SA TE ISTE SLIKE
(medijana pojasa ispod oka). Zato se poklapa u piksel i u ton, i smena je
neprimetna. Bonus: ne troši kvotu i može se ponoviti za bilo koju maskotu.
"""
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import sys

# Granice ŠARENICE (izmerene iz same slike, ne procenjene)
SARENICE = {
    "devojcica-let-oblaci": [(319, 135, 347, 163), (383, 132, 407, 160)],
    "decak-let-oblaci":     [(130, 157, 149, 179), (178, 142, 200, 164)],
    "devojcica-poza":       [(235, 150, 265, 179), (310, 142, 333, 172)],
    "decak-poza":           [(209, 112, 230, 135), (260, 110, 280, 132)],
}

def ton_koze(a, x0, y0, x1, y1):
    """Uzima se ISPOD oka (obraz) — iznad su obrve i kosa, pa bi ton bio pogrešan."""
    h = y1 - y0
    pojas = a[y1 + 3: y1 + 3 + max(8, h // 2), x0 + 3: x1 - 3]
    px = pojas.reshape(-1, 4)
    px = px[px[:, 3] > 200]
    return tuple(int(v) for v in np.median(px[:, :3], axis=0))

def zatvori_oko(im, sarenica):
    sx0, sy0, sx1, sy1 = sarenica
    # kapak mora da pokrije i beonjaču oko šarenice, pa se okvir širi
    dx, dy = int((sx1 - sx0) * 0.42), int((sy1 - sy0) * 0.62)
    x0, y0, x1, y1 = sx0 - dx, sy0 - dy, sx1 + dx, sy1 + dy
    a = np.array(im)
    koza = ton_koze(a, x0, y0, x1, y1)
    gore = tuple(max(0, int(c * 0.965)) for c in koza)  # kapak je nijansu tamniji gore
    w, h = x1 - x0, y1 - y0

    zakrpa = Image.new("RGBA", (w, h))
    d = ImageDraw.Draw(zakrpa)
    for i in range(h):
        t = i / max(1, h - 1)
        c = tuple(int(gore[k] + (koza[k] - gore[k]) * t) for k in range(3))
        d.line([(0, i), (w, i)], fill=c + (255,))

    # linija zatvorenog oka — luk naviše, tako da lik izgleda nasmejano
    tamna = (74, 47, 38)
    yl = int((sy0 + sy1) / 2 - y0)
    deb = max(3, h // 10)
    d.arc([3, yl - h // 4, w - 3, yl + h // 4], start=200, end=340, fill=tamna, width=deb)
    for k in range(3):  # trepavice na spoljnoj strani
        xs = int(w * (0.70 + k * 0.10))
        d.line([(xs, yl - 1), (xs + 6, yl - 7 - k)], fill=tamna, width=2)

    maska = Image.new("L", (w, h), 0)
    ImageDraw.Draw(maska).rounded_rectangle([1, 1, w - 2, h - 2], radius=h // 3, fill=255)
    maska = maska.filter(ImageFilter.GaussianBlur(2.4))

    novo = im.copy()
    novo.paste(zakrpa, (x0, y0), maska)
    return novo

if __name__ == "__main__":
    for ime, oci in SARENICE.items():
        im = Image.open(f"{ime}.png").convert("RGBA")
        for o in oci:
            im = zatvori_oko(im, o)
        im.save(f"{ime}-oci.png")
        im.convert("RGB").crop((60, 60, 470, 280)).resize((820, 440), Image.LANCZOS).save(f"pregled-{ime}-oci.png")
        print("napravljeno:", f"{ime}-oci.png")
