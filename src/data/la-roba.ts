import { Task } from "@/types/tasks";

export const laRobaTasks: Task[] = [
  // ── Task 1: Llegeix i copia (21 clothing items) ──
  {
    id: "la-roba-1",
    type: "copy-word",
    prompt: "Llegeix i copia les peces de roba:",
    words: [
      { catalan: "anorac", image: "anorac" },
      { catalan: "jersei", image: "jersei" },
      { catalan: "texans", image: "texans" },
      { catalan: "pantalons", image: "pantalons" },
      { catalan: "samarreta", image: "samarreta" },
      { catalan: "camisa", image: "camisa" },
      { catalan: "jaqueta", image: "jaqueta" },
      { catalan: "faldilla", image: "faldilla" },
      { catalan: "vestit", image: "vestit" },
      { catalan: "xandall", image: "xandall" },
      { catalan: "americana", image: "americana" },
      { catalan: "cinturó", image: "cinturo" },
      { catalan: "corbata", image: "corbata" },
      { catalan: "gorro" },
      { catalan: "gorra", image: "gorra" },
      { catalan: "mitjons", image: "mitjons" },
      { catalan: "sabates", image: "sabates" },
      { catalan: "vambes", image: "vambes" },
      { catalan: "botes", image: "botes" },
      { catalan: "guants", image: "guants" },
      { catalan: "bufanda", image: "bufanda" },
    ],
  },

  // ── Task 2: Observa i escriu (label dressed character) ──
  {
    id: "la-roba-2",
    type: "label-write",
    prompt: "Observa i escriu les peces de roba.",
    image: "nena-vestida",
    labels: [
      { text: "gorro", x: 50, y: 5 },
      { text: "bufanda", x: 75, y: 25 },
      { text: "jaqueta", x: 25, y: 35 },
      { text: "guants", x: 15, y: 50 },
      { text: "faldilla", x: 50, y: 55 },
      { text: "botes", x: 50, y: 85 },
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

  // ── Task 4: Busca 6 peces de vestir a la sopa de lletres ──
  {
    id: "la-roba-4",
    type: "word-search",
    prompt: "Busca 6 peces de vestir a la sopa de lletres:",
    gridSize: 10,
    words: ["pantalons", "camisa", "jaqueta", "corbata", "faldilla", "vestit"],
    grid: [
      ["p", "a", "n", "t", "a", "l", "o", "n", "s", "c"],
      ["r", "a", "m", "c", "r", "i", "c", "a", "n", "a"],
      ["c", "v", "r", "v", "c", "s", "t", "i", "r", "m"],
      ["m", "a", "t", "a", "b", "r", "o", "c", "b", "i"],
      ["j", "a", "q", "u", "e", "t", "a", "h", "f", "s"],
      ["f", "a", "l", "d", "i", "l", "l", "a", "n", "a"],
      ["k", "d", "t", "s", "p", "r", "h", "l", "b", "v"],
      ["c", "o", "r", "b", "a", "t", "a", "k", "g", "h"],
      ["t", "i", "t", "s", "e", "v", "d", "n", "r", "g"],
      ["p", "l", "m", "t", "n", "h", "r", "s", "f", "k"],
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
      { catalan: "calçotets" },
      { catalan: "calces" },
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
    sentences: [
      {
        text: "Els pantalons estan ___.",
        blank: "bruts",
        options: ["bruts", "nets", "nous"],
      },
      {
        text: "El jersei és ___.",
        blank: "nou",
        options: ["nou", "vell", "brut"],
      },
      {
        text: "Les sabates són ___.",
        blank: "velles",
        options: ["velles", "noves", "netes"],
      },
      {
        text: "Els mitjons estan ___.",
        blank: "nets",
        options: ["nets", "bruts", "vells"],
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

  // ── Task 11: Dibuixa i pinta ──
  {
    id: "la-roba-11",
    type: "drawing-canvas",
    prompt:
      "Dibuixa i pinta: Un nena que vesteix banyador vermell, sandàlies marrons, pantalons curts blancs i ulleres de sol.",
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
        options: ["sabates", "guants", "gorra"],
      },
      {
        text: "Ens abriga a l'hivern: ___.",
        blank: "abric",
        options: ["abric", "banyador", "samarreta"],
      },
      {
        text: "Ens la posem al cap: ___.",
        blank: "gorra",
        options: ["gorra", "mitjons", "camisa"],
      },
      {
        text: "Té botons: ___.",
        blank: "camisa",
        options: ["camisa", "xandall", "sabates"],
      },
      {
        text: "Ens abriga les mans: ___.",
        blank: "guants",
        options: ["guants", "botes", "bufanda"],
      },
      {
        text: "Ens els posem als peus i no són sabates: ___.",
        blank: "mitjons",
        options: ["mitjons", "guants", "gorra"],
      },
      {
        text: "Ens el posem per dormir: ___.",
        blank: "pijama",
        options: ["pijama", "vestit", "anorac"],
      },
      {
        text: "El portem per anar a la piscina: ___.",
        blank: "banyador",
        options: ["banyador", "abric", "jaqueta"],
      },
      {
        text: "El portem per fer exercici: ___.",
        blank: "xandall",
        options: ["xandall", "vestit", "americana"],
      },
    ],
  },

  // ── Task 14: Com vas vestit/da avui? ──
  {
    id: "la-roba-14",
    type: "drawing-canvas",
    prompt: "Com vas vestit o vestida avui? Dibuixa i escriu!",
  },

  // ── Task 15: Autoavaluació ──
  {
    id: "la-roba-15",
    type: "self-assessment",
    prompt: "Saps dir aquestes paraules en català?",
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
];
