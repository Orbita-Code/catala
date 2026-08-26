import { Task } from "@/types/tasks";

export const laRobaTasks: Task[] = [

  // ── Task 1: Llegeix i copia (21 clothing items) ──
  // Podeljeno 03.08.2026: u svesci je ovo JEDAN zadatak od 21 reči, a to je
  // za dete od 5–8 godina predugačko — traka napretka se ne pomeri ni jednom
  // dok ne uradi svih 21. Nijedna reč nije izbačena, samo su spakovane u 3
  // koraka, redom kao u svesci.
  {
    id: "la-roba-1-1",
    type: "copy-word",
    prompt: "Llegeix i copia les peces de roba: (1 de 3).",
    words: [
      { catalan: "anorac", image: "anorac" },
      { catalan: "jersei", image: "jersei" },
      { catalan: "texans", image: "texans" },
      { catalan: "pantalons", image: "pantalons" },
      { catalan: "samarreta", image: "samarreta" },
      { catalan: "camisa", image: "camisa" },
      { catalan: "jaqueta", image: "jaqueta" },
    ],
  },

  // ── Task 2: Observa i escriu (label dressed character) ──
  {
    id: "la-roba-2",
    type: "label-write",
    prompt: "Observa i escriu les peces de roba.",
    image: "nena-vestida",
    labels: [
      { text: "gorro", x: 48, y: 14 },
      { text: "jaqueta", x: 50, y: 46 },
      { text: "guants", x: 33, y: 57 },
      { text: "bufanda", x: 50, y: 36 },
      { text: "faldilla", x: 50, y: 63 },
      { text: "botes", x: 47, y: 82 },
    ],
  },
  {
    id: "la-roba-1-2",
    type: "copy-word",
    prompt: "Llegeix i copia les peces de roba: (2 de 3).",
    words: [
      { catalan: "faldilla", image: "faldilla" },
      { catalan: "vestit", image: "vestit" },
      { catalan: "xandall", image: "xandall" },
      { catalan: "americana", image: "americana" },
      // `abric` (kaput) JE U SVESCI, u istom prvom spisku odeće, ali je ISPAO
      // kad je taj spisak podeljen na tri dela (17.08.2026, prijava vlasnice:
      // „posle botes a pre texans ima jedan kaputić kog nema u prethodnim
      // zadacima, probala je anorac, jersei, jaqueta").
      // Dete ga je prvi put sretalo tek u zadatku sa mikrofonom — dakle
      // tražilo se da izgovori reč koju mu niko nije pokazao.
      { catalan: "abric", image: "abric" },
      { catalan: "cinturó", image: "cinturo" },
      { catalan: "corbata", image: "corbata" },
      { catalan: "gorro", image: "gorro" },
      // `pantalons curts` — POTVRĐENO u svesci, vežba 11
      // („banyador vermell, sandàlies marrons, pantalons curts blancs…").
      // `caputxa` je 17.08. UKLONJENA: dodao sam je iz nepouzdanog dokumenta,
      // a nema je ni na jednoj od šest stranica teme 4.
      { catalan: "pantalons curts", image: "pantalons-curts" },
    ],
  },

  // ── Task 3: Ordena les síl·labes i escriu ──
  {
    id: "la-roba-3",
    type: "unscramble",
    prompt: "Ordena les síl·labes i escriu la paraula:",
    words: [
      { scrambled: "DI-LLA-FAL", correct: "faldilla", image: "faldilla" },
      { scrambled: "TES-BO", correct: "botes", image: "botes" },
      { scrambled: "SEI-JER", correct: "jersei", image: "jersei" },
      { scrambled: "JONS-MIT", correct: "mitjons", image: "mitjons" },
      { scrambled: "DALL-XAN", correct: "xandall", image: "xandall" },
      { scrambled: "TES-SA-BA", correct: "sabates", image: "sabates" },
      { scrambled: "SA-CA-MI", correct: "camisa", image: "camisa" },
      { scrambled: "RAC-NO-A", correct: "anorac", image: "anorac" },
      { scrambled: "XANS-TE", correct: "texans", image: "texans" },
    ],
  },
  {
    id: "la-roba-1-3",
    type: "copy-word",
    prompt: "Llegeix i copia les peces de roba: (3 de 3).",
    words: [
      { catalan: "gorra", image: "gorra" },
      { catalan: "mitjons", image: "mitjons" },
      { catalan: "sabates", image: "sabates" },
      { catalan: "vambes", image: "vambes" },
      { catalan: "botes", image: "botes" },
      { catalan: "guants", image: "guants" },
      { catalan: "bufanda", image: "bufanda" },
      // `barret` — POTVRĐENO u svesci, vežba 12 („Barret groc").
      //
      // `mitges` i `sabatilles` OSTAJU IZBAČENE (odluka vlasnice 17.08.2026,
      // posle provere u svesci):
      //   • čarape su `mitjons` i tako ih sveska i uči (vežba 1 i vežba 12);
      //     `mitges` znači HULAHOPKE, druga stvar, i nema je ni na jednoj
      //     stranici teme 4;
      //   • patike su `vambes` i tako ih sveska uči; `sabatilles` samo znači
      //     PAPUČE (patike bi bile `sabatilles esportives`). Vlasnica: „vambes
      //     ostavi, sabatilles izbaci" — ne mogu obe za istu stvar.
      { catalan: "barret", image: "barret" },
    ],
  },

  // ── Task 4: Busca 6 peces de vestir a la sopa de lletres ──
  {
    id: "la-roba-4",
    type: "word-search",
    prompt: "Busca 6 peces de vestir a la sopa de lletres. Poden anar →\u00A0↓",
    gridSize: 10,
    words: ["pantalons", "camisa", "jaqueta", "corbata", "faldilla", "vestit", "botes", "gorra", "abric", "mitjons"],
    grid: [
      ["h", "d", "h", "m", "i", "t", "j", "o", "n", "s"],
      ["g", "p", "a", "n", "t", "a", "l", "o", "n", "s"],
      ["g", "c", "v", "h", "z", "d", "f", "c", "a", "x"],
      ["j", "a", "d", "j", "u", "r", "a", "o", "b", "h"],
      ["a", "m", "b", "g", "v", "a", "l", "r", "r", "h"],
      ["q", "i", "o", "o", "e", "w", "d", "b", "i", "l"],
      ["u", "s", "t", "r", "s", "n", "i", "a", "c", "d"],
      ["e", "a", "e", "r", "t", "h", "l", "t", "h", "s"],
      ["t", "d", "s", "a", "i", "v", "l", "a", "h", "g"],
      ["a", "d", "i", "j", "t", "h", "a", "c", "x", "j"],
    ],
  },

  // ── Task 5: Observa (new vocabulary: swimwear, underwear) ──
  {
    id: "la-roba-5",
    type: "copy-word",
    prompt: "Observa i copia les paraules noves:",
    words: [
      { catalan: "banyador", image: "banyador" },
      { catalan: "biquini", image: "biquini" },
      { catalan: "banyador de dona", image: "banyador-de-dona" },
      { catalan: "pijama", image: "pijama" },
      { catalan: "calçotets", image: "calcotets" },
      { catalan: "calces", image: "calces" },
    ],
  },

  // ── Task 6: Encercla les peces de vestir i escriu-les ──
  {
    id: "la-roba-6",
    type: "classify-columns",
    prompt: "Encercla les peces de vestir:",
    circleMode: true,
    columns: [
      {
        title: "Roba",
        items: [
          "bufanda",
          "sabates",
          "gorra",
          "faldilla",
          "mitjons",
          "anell",
          "calçotets",
        ],
      },
      {
        title: "No és roba",
        items: [
          "menjador",
          "finestra",
          "goma",
          "porta",
          "ordinador",
          "cadira",
          "biblioteca",
        ],
      },
    ],
    allItems: [
      "bufanda",
      "menjador",
      "sabates",
      "finestra",
      "gorra",
      "goma",
      "faldilla",
      "porta",
      "mitjons",
      "ordinador",
      "anell",
      "cadira",
      "calçotets",
      "biblioteca",
    ],
  },

  // ── Task 7: Observa, relaciona i escriu (UN / UNA) ──
  {
    id: "la-roba-7",
    type: "add-article",
    prompt: "Escriu l'article correcte: un o una?",
    words: [
      { word: "abric", article: "un" },
      { word: "camisa", article: "una" },
      { word: "jersei", article: "un" },
      { word: "gorra", article: "una" },
      { word: "faldilla", article: "una" },
      // `calçotet` VRAĆEN 17.08.2026 — MOJA GREŠKA istog dana.
      // Izbacio sam ga jer nije imao sliku, i zamenio sa `banyador`. Onda sam
      // otvorio svesku (`Svi zadaci/La roba/IMG_0977.JPG`, vežba 7) i video da
      // sveska ima TAČNO `calçotet`, u jednini, u tom istom spisku sa članovima.
      // Nije falila reč nego SLIKA: postojala je samo `calcotets` (dva para).
      // Sada postoji `calcotet` — jedan par.
      // Pouka: kad reč nema sliku, pravi se slika. Reč iz sveske se ne menja.
      { word: "calçotet", article: "un" },
      { word: "jaqueta", article: "una" },
      { word: "corbata", article: "una" },
      { word: "pijama", article: "un" },
      { word: "bota", article: "una" },
    ],
  },

  // ── Task 8: Observa i completa (nou/vell/net/brut) ──
  {
    id: "la-roba-8",
    type: "fill-sentence",
    prompt: "Observa i completa les frases:",
    // ZADATAK SE NIJE MOGAO RESITI (17.08.2026, prijava vlasnice: „deseti
    // zadatak je katastrofa, ništa nije dobro").
    //
    // Rečenica pita jesu li pantalone prljave, a prikazivala se OBIČNA slika
    // pantalona — čiste. Dete gleda čiste pantalone i treba da odgovori
    // „bruts". Nije se moglo znati, moglo se samo pogađati.
    // Slika se izvodila iz subjekta rečenice („Els pantalons…" → `pantalons`),
    // pa je uvek ispadala neutralna verzija.
    //
    // Slike `pantalons-bruts`, `jersei-nou`, `sabates-velles` i `mitjons-nets`
    // POSTOJE od ranije i nikad se nisu koristile — napravljene su baš za ovaj
    // zadatak. Sada dete VIDI prljave pantalone i zato zna odgovor.
    sentences: [
      {
        text: "Els pantalons estan ___.",
        blank: "bruts",
        image: "pantalons-bruts",
        options: ["nets", "bruts", "nous"],
      },
      {
        text: "El jersei és ___.",
        blank: "nou",
        image: "jersei-nou",
        options: ["vell", "brut", "nou"],
      },
      {
        text: "Les sabates són ___.",
        blank: "velles",
        image: "sabates-velles",
        options: ["velles", "noves", "netes"],
      },
      {
        text: "Els mitjons estan ___.",
        blank: "nets",
        image: "mitjons-nets",
        options: ["bruts", "nets", "vells"],
      },
    ],
  },

  // ── Task 9: Llegeix i copia (accessories) ──
  {
    id: "la-roba-9",
    type: "copy-word",
    prompt: "Llegeix i copia els complements:",
    words: [
      { catalan: "arracades", image: "arracades" },
      { catalan: "anell", image: "anell" },
      { catalan: "collaret", image: "collaret" },
      { catalan: "rellotge", image: "rellotge" },
      { catalan: "ulleres", image: "ulleres" },
      { catalan: "sandàlies", image: "sandalies" },
    ],
  },

  // ── Task 10: Relaciona, forma paraules i escriu ──
  {
    id: "la-roba-10",
    type: "matching",
    prompt: "Relaciona les dues parts per formar paraules:",
    pairs: [
      { left: "A", right: "NELL" },
      { left: "SANDÀ", right: "LIES" },
      { left: "RELLO", right: "TGE" },
      { left: "MIT", right: "JONS" },
      { left: "CO", right: "LLARET" },
      { left: "VES", right: "TIT" },
    ],
  },

  // ── Task 12: Llegeix i pinta (color clothing) ──
  {
    id: "la-roba-12",
    type: "color-by-instruction",
    prompt: "Llegeix i pinta la roba:",
    image: "roba-silueta",
    instructions: [
      {
        text: "Pinta el jersei de blau",
        targetColor: "blau",
        targetItem: "jersei",
      },
      {
        text: "Pinta les botes de marró",
        targetColor: "marró",
        targetItem: "botes",
      },
      {
        text: "Pinta els mitjons de verd",
        targetColor: "verd",
        targetItem: "mitjons",
      },
      {
        text: "Pinta el pijama de lila",
        targetColor: "lila",
        targetItem: "pijama",
      },
      {
        text: "Pinta els guants de rosa",
        targetColor: "rosa",
        targetItem: "guants",
      },
    ],
  },

  // ── Task 13: Escriu cada paraula al seu lloc ──
  {
    id: "la-roba-13",
    type: "fill-sentence",
    prompt: "Escriu cada paraula al seu lloc:",
    sentences: [
      {
        text: "Les portem als peus: ___.",
        blank: "sabates",
        options: ["guants", "sabates", "gorra"],
      },
      {
        text: "Ens abriga a l'hivern: ___.",
        blank: "abric",
        options: ["banyador", "samarreta", "abric"],
      },
      {
        text: "Ens la posem al cap: ___.",
        blank: "gorra",
        options: ["gorra", "mitjons", "camisa"],
      },
      {
        text: "Té botons: ___.",
        blank: "camisa",
        options: ["xandall", "camisa", "sabates"],
      },
      {
        text: "Ens abriga les mans: ___.",
        blank: "guants",
        options: ["botes", "bufanda", "guants"],
      },
      {
        text: "Ens els posem als peus i no són sabates: ___.",
        blank: "mitjons",
        options: ["guants", "mitjons", "gorra"],
      },
      {
        text: "Ens el posem per dormir: ___.",
        blank: "pijama",
        options: ["vestit", "anorac", "pijama"],
      },
      {
        text: "El portem per anar a la piscina: ___.",
        blank: "banyador",
        options: ["abric", "banyador", "jaqueta"],
      },
      {
        text: "El portem per fer exercici: ___.",
        blank: "xandall",
        options: ["xandall", "vestit", "americana"],
      },
    ],
  },

  // ── Task 15: Autoavaluació ──
  {
    id: "la-roba-15",
    type: "self-assessment",
    prompt: "Saps dir aquestes paraules en català? Toca el micròfon i digues la paraula.",
    items: [
      { catalan: "vestit", translation: "haljina", image: "vestit" },
      { catalan: "camisa", translation: "košulja", image: "camisa" },
      { catalan: "samarreta", translation: "majica", image: "samarreta" },
      { catalan: "jaqueta", translation: "jakna", image: "jaqueta" },
      { catalan: "pantalons", translation: "pantalone", image: "pantalons" },
      { catalan: "sabates", translation: "cipele", image: "sabates" },
      { catalan: "faldilla", translation: "suknja", image: "faldilla" },
      { catalan: "mitjons", translation: "čarape", image: "mitjons" },
      { catalan: "botes", translation: "čizme", image: "botes" },
      { catalan: "abric", translation: "kaput", image: "abric" },
      { catalan: "texans", translation: "farmerke", image: "texans" },
      { catalan: "bufanda", translation: "šal", image: "bufanda" },
      { catalan: "guants", translation: "rukavice", image: "guants" },
      { catalan: "gorra", translation: "kapa", image: "gorra" },
      { catalan: "pijama", translation: "pidžama", image: "pijama" },
    ],
  },

  // Bonus activity: Fun drawing
  {
    id: "la-roba-bonus",
    type: "drawing-canvas",
    prompt: "Activitat extra! Diverteix-te, activa la creativitat i dibuixa alguna cosa màgica!",
    bonus: true,
  },
];
