# Tipovi Zadataka - Detaljna Specifikacija

Ovo su sve komponente engine-a. Svaka komponenta je reusable i prima podatke iz JSON-a.

---

## 1. CopyWord (Llegeix i copia)

**Opis:** Dete vidi sliku objekta sa napisanom recju ispod, i treba da prepise rec u input polje.

**Iz sveske:** Zadatak 1 u svakoj temi - uvek prvi, za upoznavanje vokabulara.

**JSON:**
```json
{
  "id": "la-classe-01",
  "type": "copy-word",
  "prompt": "Llegeix i copia:",
  "items": [
    { "word": "llapis", "image": "llapis.svg" },
    { "word": "goma", "image": "goma.svg" },
    { "word": "bolígraf", "image": "boligraf.svg" },
    { "word": "retolador", "image": "retolador.svg" },
    { "word": "llibreta", "image": "llibreta.svg" },
    { "word": "llibre", "image": "llibre.svg" },
    { "word": "carpeta", "image": "carpeta.svg" },
    { "word": "estoig", "image": "estoig.svg" },
    { "word": "maquineta", "image": "maquineta.svg" },
    { "word": "regle", "image": "regle.svg" },
    { "word": "motxilla", "image": "motxilla.svg" },
    { "word": "tisores", "image": "tisores.svg" },
    { "word": "pissarra", "image": "pissarra.svg" },
    { "word": "guix", "image": "guix.svg" },
    { "word": "borrador", "image": "borrador.svg" },
    { "word": "paperera", "image": "paperera.svg" },
    { "word": "ordinador", "image": "ordinador.svg" },
    { "word": "taula", "image": "taula.svg" }
  ]
}
```

**UX:** Grid kartica (3 po redu na tabletu), svaka kartica ima sliku gore i input dole. TTS dugme za izgovor. Validacija: case-insensitive, trim whitespace, ignorisi akcente za proveru.

**Napomena:** Ovaj zadatak moze biti podeljen na 2-3 ekrana ako ima mnogo reci (po 6 reci na ekranu).

---

## 2. WordSearch (Sopa de lletres)

**Opis:** Mreza slova u kojoj dete trazi sakrivene reci.

**Iz sveske:** Zadatak 2 - "Busca X paraules del vocabulari anterior en aquesta sopa de lletres"

**JSON:**
```json
{
  "id": "la-classe-02",
  "type": "word-search",
  "prompt": "Busca 10 paraules del vocabulari anterior en aquesta sopa de lletres:",
  "grid": [
    ["B", "B", "T", "I", "S", "O", "R", "E", "S"],
    ["O", "E", "S", "T", "O", "I", "G", "O", "L"],
    ["L", "L", "A", "P", "I", "S", "M", "V", "L"],
    ["I", "I", "H", "V", "A", "I", "O", "P", "I"],
    ["G", "E", "R", "E", "G", "L", "E", "N", "B"],
    ["R", "E", "T", "O", "L", "A", "D", "O", "R"],
    ["A", "A", "G", "O", "M", "A", "I", "L", "E"],
    ["F", "E", "R", "B", "I", "L", "L", "A", "T"],
    ["M", "O", "T", "X", "I", "L", "L", "A", "A"]
  ],
  "words": ["tisores", "estoig", "llapis", "regle", "retolador", "goma", "motxilla", "bolígraf", "llibreta", "libre"],
  "directions": ["horizontal", "vertical", "diagonal"]
}
```

**UX:** Interaktivna mreza - dete prevlaci prstom/misom preko slova da oznaci rec. Pronadjene reci se isticu bojom i precrtavaju sa liste. Animacija kad pronadje rec.

---

## 3. FillLetters (Completa la paraula)

**Opis:** Dete vidi sliku i delimicno popunjenu rec, treba da dopuni slova koja nedostaju.

**Iz sveske:** Zadatak 3 - "Completa la paraula"

**JSON:**
```json
{
  "id": "la-classe-03",
  "type": "fill-letters",
  "prompt": "Completa la paraula:",
  "items": [
    { "word": "llapis", "image": "llapis.svg", "template": "L_A_I_" },
    { "word": "goma", "image": "goma.svg", "template": "G__M_" },
    { "word": "llibre", "image": "llibre.svg", "template": "L_I_R_" },
    { "word": "bolígraf", "image": "boligraf.svg", "template": "BO_Í_R_F" },
    { "word": "llibreta", "image": "llibreta.svg", "template": "LL_BR_T_" },
    { "word": "retolador", "image": "retolador.svg", "template": "R_TO_D_R" },
    { "word": "carpeta", "image": "carpeta.svg", "template": "C_R_ET_" },
    { "word": "estoig", "image": "estoig.svg", "template": "E_T_IG" },
    { "word": "maquineta", "image": "maquineta.svg", "template": "M_Q_IE_A" }
  ]
}
```

**UX:** Svako slovo je u zasebnom polju (kao Wordle). Prazna polja su oznacena i aktivna. Auto-focus na sledece prazno polje. Tastatura na mobilnom. Animacija kad se rec kompletira.

---

## 4. ClassifyColumns (Classifica)

**Opis:** Dete razvrstava reci u dve ili vise kategorija.

**Iz sveske:** Zadatak 4 i 6 - "Classifica cada paraula segons el seu gènere" (femení/masculí) i "Classifica: UN/MOLTS"

**JSON:**
```json
{
  "id": "la-classe-04",
  "type": "classify-columns",
  "prompt": "Classifica cada paraula segons el seu gènere:",
  "columns": [
    { "label": "Femení (una)", "color": "#FFB6C1" },
    { "label": "Masculí (un)", "color": "#87CEEB" }
  ],
  "items": [
    { "word": "llapis", "correctColumn": 1 },
    { "word": "goma", "correctColumn": 0 },
    { "word": "bolígraf", "correctColumn": 1 },
    { "word": "retolador", "correctColumn": 1 },
    { "word": "llibreta", "correctColumn": 0 },
    { "word": "llibre", "correctColumn": 1 },
    { "word": "estoig", "correctColumn": 1 },
    { "word": "carpeta", "correctColumn": 0 },
    { "word": "maquineta", "correctColumn": 0 },
    { "word": "regle", "correctColumn": 1 },
    { "word": "motxilla", "correctColumn": 0 },
    { "word": "tisores", "correctColumn": 0 }
  ]
}
```

**UX:** Drag & drop reci u odgovarajucu kolonu, ili tap na rec pa tap na kolonu. Vizuelni feedback - zeleno/crveno. Reci koje su vec razvrstane ostaju u koloni.

---

## 5. Matching (Relaciona)

**Opis:** Dete povezuje slike sa recima (ili reci sa recima).

**Iz sveske:** Zadatak 5 - "Relaciona" - slika levo, rec desno, povuci liniju.

**JSON:**
```json
{
  "id": "la-classe-05",
  "type": "matching",
  "prompt": "Relaciona:",
  "pairs": [
    { "left": { "type": "image", "value": "llapis.svg" }, "right": { "type": "text", "value": "llapis" } },
    { "left": { "type": "image", "value": "goma.svg" }, "right": { "type": "text", "value": "goma" } },
    { "left": { "type": "image", "value": "maquineta.svg" }, "right": { "type": "text", "value": "maquineta" } },
    { "left": { "type": "image", "value": "llibre.svg" }, "right": { "type": "text", "value": "llibre" } },
    { "left": { "type": "image", "value": "carpeta.svg" }, "right": { "type": "text", "value": "carpeta" } },
    { "left": { "type": "image", "value": "llapis.svg" }, "right": { "type": "text", "value": "llapis" } },
    { "left": { "type": "image", "value": "estoig.svg" }, "right": { "type": "text", "value": "estoig" } },
    { "left": { "type": "image", "value": "boligraf.svg" }, "right": { "type": "text", "value": "bolígraf" } },
    { "left": { "type": "image", "value": "llibreta.svg" }, "right": { "type": "text", "value": "llibreta" } }
  ]
}
```

**UX:** Dve kolone - tap na levi element, pa tap na desni. Linija se crta izmedju njih (SVG). Promesan redosled desne kolone. Tacan par: linija postaje zelena, netacan: crvena i nestaje.

---

## 6. ColorByInstruction (Pinta)

**Opis:** Dete boji objekte prema uputstvu (npr. "un llapis blau", "una goma verda").

**Iz sveske:** Zadatak 7 - "Pinta: Recorda: groc, verd, taronja, vermell, blau, lila, marró, blanc, negre"

**JSON:**
```json
{
  "id": "la-classe-07",
  "type": "color-by-instruction",
  "prompt": "Pinta:",
  "colorPalette": [
    { "name": "groc", "hex": "#FFD700" },
    { "name": "verd", "hex": "#4CAF50" },
    { "name": "taronja", "hex": "#FF9800" },
    { "name": "vermell", "hex": "#F44336" },
    { "name": "blau", "hex": "#2196F3" },
    { "name": "lila", "hex": "#9C27B0" },
    { "name": "marró", "hex": "#795548" },
    { "name": "blanc", "hex": "#FFFFFF" },
    { "name": "negre", "hex": "#212121" }
  ],
  "items": [
    { "instruction": "un llapis blau", "image": "llapis-outline.svg", "correctColor": "blau" },
    { "instruction": "una goma verda", "image": "goma-outline.svg", "correctColor": "verd" },
    { "instruction": "un ordinador negre", "image": "ordinador-outline.svg", "correctColor": "negre" },
    { "instruction": "unes tisores vermelles", "image": "tisores-outline.svg", "correctColor": "vermell" }
  ]
}
```

**UX:** Paleta boja na dnu ekrana. Dete bira boju pa klikne na objekat. Objekat se "oboji" (CSS filter ili SVG fill). TTS cita uputstvo.

---

## 7. FillSentence (Completa)

**Opis:** Dete dopunjuje recenice koje nedostaju.

**Iz sveske:** Zadatak 8 - "Què tenim a l'estoig? Completa:"

**JSON:**
```json
{
  "id": "la-classe-08",
  "type": "fill-sentence",
  "prompt": "Què tenim a l'estoig? Completa:",
  "contextImage": "estoig-otvoren.svg",
  "sentences": [
    { "template": "A l'estoig tenim una maquineta ___.", "answer": "blava", "hint": "color" },
    { "template": "A l'estoig tenim un regle ___.", "answer": "groc", "hint": "color" },
    { "template": "A l'estoig tenim un ___.", "answer": "bolígraf", "hint": "object" },
    { "template": "A l'estoig tenim un ___.", "answer": "pinzell", "hint": "object" },
    { "template": "A l'estoig tenim un ___.", "answer": "clip", "hint": "object" },
    { "template": "A l'estoig tenim ___.", "answer": "cola de barra", "hint": "object" },
    { "template": "A l'estoig tenim unes ___.", "answer": "tisores", "hint": "object" }
  ]
}
```

**UX:** Slika konteksta gore (npr. otvoren pernica). Recenice ispod sa blank poljem. Input polje na mestu ___. Auto-check kad se unese odgovor.

---

## 8. LabelImage (Busca les parts)

**Opis:** Dete oznacava delove na slici (npr. delove tela, delove ptice).

**Iz sveske:** Zadatak u Els animals - "Busca les parts"

**JSON:**
```json
{
  "id": "els-animals-label",
  "type": "label-image",
  "prompt": "Busca les parts:",
  "image": "oreneta.svg",
  "labels": [
    { "word": "bec", "position": { "x": 15, "y": 30 } },
    { "word": "ales", "position": { "x": 50, "y": 20 } },
    { "word": "potes", "position": { "x": 45, "y": 75 } },
    { "word": "cua", "position": { "x": 85, "y": 40 } },
    { "word": "plomes", "position": { "x": 60, "y": 35 } }
  ],
  "wordBank": ["bec", "ales", "potes", "cua", "plomes"]
}
```

**UX:** Velika slika sa oznacenim tackama (pulsiraju). Word bank ispod. Drag rec na tacku ili tap-tap. Kad se postavi, rec se prikazuje sa linijom do tacke.

---

## 9. Unscramble (Ordena)

**Opis:** Dete stavlja slova ili reci u pravilnom redosledu.

**JSON:**
```json
{
  "id": "la-roba-unscramble",
  "type": "unscramble",
  "prompt": "Ordena les lletres:",
  "items": [
    { "scrambled": ["S", "A", "R", "M", "E", "I"], "answer": "CAMISER" },
    { "scrambled": ["T", "A", "N", "S", "L", "O", "A", "P"], "answer": "PANTALONS" }
  ]
}
```

**UX:** Slova kao "plocice" koje se mogu prevlaciti. Prazan niz slotova za odgovor. Drag & drop ili tap za premesetanje. Animacija kad se rec slozi.

---

## 10. MultipleChoice (Tria)

**Opis:** Dete bira tacan odgovor od ponudjenih opcija.

**JSON:**
```json
{
  "id": "la-classe-mc",
  "type": "multiple-choice",
  "prompt": "Què és?",
  "image": "llapis.svg",
  "options": ["llapis", "bolígraf", "retolador", "pinzell"],
  "correctAnswer": "llapis"
}
```

**UX:** Slika gore, dugmad sa opcijama ispod. Tap za odabir. Zeleno/crveno feedback sa animacijom.

---

## 11. DrawingCanvas (Dibuixa)

**Opis:** Slobodno crtanje - dete crta prema uputstvu.

**JSON:**
```json
{
  "id": "els-animals-draw",
  "type": "drawing-canvas",
  "prompt": "Dibuixa el teu animal preferit:",
  "tools": ["pen", "eraser", "colors"],
  "canvasSize": { "width": 400, "height": 300 }
}
```

**UX:** Canvas za crtanje sa osnovnim alatima (olovka, gumica, boje). Nema "tacnog" odgovora - dete samo crta i klikne "Fet!" (Gotovo!).

---

## 12. SelfAssessment (Autoavaluació)

**Opis:** Semafor sistem - dete procenjuje koliko je dobro uradilo temu.

**Iz sveske:** Na kraju svake teme - tri kruga (zeleni, zuti, crveni) sa pitanjima.

**JSON:**
```json
{
  "id": "la-classe-self",
  "type": "self-assessment",
  "prompt": "Autoavaluació - Quant he après?",
  "questions": [
    "He reconegut quasi tot",
    "He necessitat una mica d'ajuda",
    "Necessito repassar molt més"
  ],
  "options": [
    { "label": "Molt bé", "color": "#4CAF50", "emoji": "green" },
    { "label": "Regular", "color": "#FFC107", "emoji": "yellow" },
    { "label": "He de repassar", "color": "#F44336", "emoji": "red" }
  ]
}
```

**UX:** Tri kruga (semafor) - dete klikne na odgovarajuci. Maskota reaguje na odabir. Na kraju: "Vols repassar?" (Zelis da ponovis?) dugme.
