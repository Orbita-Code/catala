import { Task } from "@/types/tasks";

export const elCosTasks: Task[] = [
  // ── Task 1: Llegeix i copia (15 body parts) ──
  {
    id: "el-cos-1",
    type: "copy-word",
    prompt: "Llegeix i copia les parts del cos.",
    words: [
      { catalan: "boca", image: "boca" },
      { catalan: "ull", image: "ull" },
      { catalan: "nas", image: "nas" },
      { catalan: "dents", image: "dents" },
      { catalan: "cabell", image: "cabell" },
      { catalan: "orella", image: "orella" },
      { catalan: "braç", image: "brac" },
      { catalan: "cama", image: "cama" },
      { catalan: "cap", image: "cap" },
      { catalan: "colze", image: "colze" },
      { catalan: "panxa", image: "panxa" },
      { catalan: "mà", image: "ma" },
      { catalan: "dit", image: "dit" },
      { catalan: "peu", image: "peu" },
      { catalan: "ungla", image: "ungla" },
    ],
  },

  // ── Task 2: Escriu-ne les parts (label the head) ──
  {
    id: "el-cos-2",
    type: "label-write",
    prompt: "Escriu les parts del cap.",
    image: "cara-detall",
    labels: [
      // Left side (3): cabell, ull, nas
      { text: "cabell", x: 25, y: 12 },
      { text: "ull", x: 30, y: 40 },
      { text: "nas", x: 48, y: 58 },
      // Right side (2): boca, orella
      { text: "boca", x: 52, y: 75 },
      { text: "orella", x: 85, y: 42 },
    ],
  },

  // ── Task 3: Ordena les síl·labes ──
  {
    id: "el-cos-3",
    type: "unscramble",
    prompt: "Ordena les síl·labes per formar paraules.",
    words: [
      { scrambled: "CA-BO", correct: "boca", image: "boca" },
      { scrambled: "XA-PAN", correct: "panxa", image: "panxa" },
      { scrambled: "ZE-COL", correct: "colze", image: "colze" },
      { scrambled: "GLA-UN", correct: "ungla", image: "ungla" },
      { scrambled: "BELL-CA", correct: "cabell", image: "cabell" },
      { scrambled: "RE-O-LLA", correct: "orella", image: "orella" },
    ],
  },

  // ── Task 4: Busca 7 paraules a la sopa de lletres ──
  {
    id: "el-cos-4",
    type: "word-search",
    prompt: "Busca 7 paraules a la sopa de lletres. Poden anar →\u00A0←\u00A0↓\u00A0↑\u00A0↗",
    gridSize: 9,
    words: ["nas", "ull", "boca", "panxa", "orella", "mà", "braç"],
    grid: [
      ["m", "m", "l", "l", "u", "g", "t", "f", "h"],
      ["h", "a", "l", "l", "e", "r", "o", "m", "à"],
      ["e", "y", "c", "i", "x", "m", "q", "v", "w"],
      ["r", "p", "a", "n", "x", "a", "c", "t", "p"],
      ["g", "n", "x", "t", "s", "b", "r", "a", "ç"],
      ["g", "z", "z", "l", "m", "v", "g", "e", "o"],
      ["v", "f", "s", "k", "c", "w", "q", "v", "y"],
      ["n", "a", "s", "c", "p", "k", "m", "b", "i"],
      ["r", "b", "o", "c", "a", "a", "n", "g", "l"],
    ],
  },

  // ── Task 5: Completa el dibuix amb les parts del requadre ──
  {
    id: "el-cos-5",
    type: "label-image",
    prompt: "Col·loca les parts de la cara al lloc correcte.",
    image: "cara",
    labels: [
      { text: "cabell", x: 50, y: 10 },
      { text: "ulls", x: 35, y: 35 },
      { text: "nas", x: 50, y: 50 },
      { text: "boca", x: 50, y: 70 },
    ],
    options: ["ulls", "nas", "cabell", "boca", "orella", "colze"],
  },

  // ── Task 6: Uneix cada part del cos amb la seva funció ──
  {
    id: "el-cos-6",
    type: "matching",
    prompt: "Uneix cada part del cos amb la seva funció.",
    pairs: [
      { left: "ull", right: "veure" },
      { left: "orella", right: "escoltar" },
      { left: "nas", right: "olorar" },
      { left: "boca", right: "parlar" },
      { left: "mà", right: "tocar" },
    ],
  },

  // ── Task 7: Observa i busca les paraules a la sopa de lletres ──
  {
    id: "el-cos-7",
    type: "word-search",
    prompt: "Observa i busca les paraules a la sopa de lletres. Poden anar →\u00A0←\u00A0↓\u00A0↑\u00A0↗",
    gridSize: 9,
    words: ["cella", "front", "esquena", "espatlla", "llavi"],
    grid: [
      ["e", "s", "p", "a", "t", "l", "l", "a", "l"],
      ["m", "r", "d", "g", "b", "n", "j", "u", "l"],
      ["t", "f", "v", "n", "h", "p", "o", "r", "a"],
      ["o", "e", "s", "q", "u", "e", "n", "a", "v"],
      ["c", "b", "g", "r", "d", "m", "t", "p", "i"],
      ["e", "j", "n", "s", "h", "f", "u", "d", "r"],
      ["l", "r", "b", "f", "r", "o", "n", "t", "g"],
      ["l", "u", "t", "m", "v", "q", "e", "s", "p"],
      ["a", "d", "h", "j", "p", "s", "r", "f", "n"],
    ],
  },

  // ── Task 8: Llegeix i copia (verbs dels sentits) ──
  {
    id: "el-cos-8",
    type: "copy-word",
    prompt: "Llegeix i copia els verbs dels sentits.",
    words: [
      { catalan: "escoltar" },
      { catalan: "mirar" },
      { catalan: "cantar" },
      { catalan: "aplaudir" },
    ],
  },

  // ── Task 9: Relaciona (verbs → body parts) ──
  {
    id: "el-cos-9",
    type: "matching",
    prompt: "Relaciona cada acció amb la part del cos.",
    pairs: [
      { left: "mirem", right: "ulls" },
      { left: "escoltem", right: "orelles" },
      { left: "parlem", right: "boca" },
      { left: "aplaudim", right: "mans" },
      { left: "caminem", right: "cames" },
    ],
  },

  // ── Task 10: Observa (jove, vell, alt, baix) ──
  {
    id: "el-cos-10",
    type: "copy-word",
    prompt: "Observa i copia les paraules noves:",
    words: [
      { catalan: "jove" },
      { catalan: "vell" },
      { catalan: "alt" },
      { catalan: "baix" },
    ],
  },

  // ── Task 11: Observa y completa (comparisons) ──
  {
    id: "el-cos-11",
    type: "fill-sentence",
    prompt: "Observa i completa les frases.",
    image: "alt-baix",
    sentences: [
      {
        text: "La Laura és més ___ que en Carles.",
        blank: "alta",
        options: ["baixa", "alta", "vella"],
      },
      {
        text: "En Carles és més ___ que la Laura.",
        blank: "baix",
        options: ["alt", "jove", "baix"],
      },
    ],
  },

  // ── Task 12: Fixa-t'hi i completa (NOI → NOIA) ──
  {
    id: "el-cos-12",
    type: "fill-sentence",
    prompt: "Fixa-t'hi i completa: noi → noia.",
    image: "noi-noia",
    sentences: [
      {
        text: "Un noi vell → Una noia ___.",
        blank: "vella",
        options: ["vell", "jove", "vella"],
      },
      {
        text: "Un noi alt → Una noia ___.",
        blank: "alta",
        options: ["alt", "alta", "baixa"],
      },
      {
        text: "Un noi baix → Una noia ___.",
        blank: "baixa",
        options: ["baixa", "baix", "alta"],
      },
      {
        text: "Un noi jove → Una noia ___.",
        blank: "jove",
        options: ["vella", "alta", "jove"],
      },
    ],
  },

  // ── Task 14: Observa i pinta SÍ o NO ──
  {
    id: "el-cos-14",
    type: "multiple-choice",
    prompt: "Observa la Maria i contesta SÍ o NO.",
    image: "maria",
    questions: [
      {
        question: "La Maria té els ulls grans?",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        question: "Els seus ulls són verds?",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        question: "Té un nas petit?",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        question: "És una persona jove?",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        question: "Té el cabell vermell?",
        options: ["Sí", "No"],
        correct: 1,
      },
      {
        question: "Se li veuen les dents?",
        options: ["Sí", "No"],
        correct: 1,
      },
      {
        question: "No té celles?",
        options: ["Sí", "No"],
        correct: 1,
      },
      {
        question: "El cabell li tapa una orella?",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        question: "Es diu Maria?",
        options: ["Sí", "No"],
        correct: 0,
      },
    ],
  },

  // ── Task 15: Observa el vocabulari nou (face details) ──
  {
    id: "el-cos-15",
    type: "label-image",
    prompt: "Observa el vocabulari nou i completa les parts que falten.",
    image: "cara-detall",
    labels: [
      { text: "bigoti", x: 50, y: 55 },
      { text: "barba", x: 50, y: 80 },
      { text: "ulleres", x: 50, y: 40 },
      { text: "arrugues", x: 70, y: 30 },
    ],
    options: ["bigoti", "barba", "ulleres", "arrugues", "cella", "nas"],
  },

  // ── Task 16: Qui és qui? ──
  {
    id: "el-cos-16",
    type: "fill-sentence",
    prompt: "Qui és qui? Llegeix i escriu el nom correcte.",
    sentences: [
      {
        text: "La ___ és jove, té el cabell llarg i negre. També porta ulleres.",
        blank: "Carolina",
        options: ["Sara", "Carolina", "Xavier"],
      },
      {
        text: "En ___ és un nen baix, amb el cabell curt i negre.",
        blank: "Sergi",
        options: ["Xavier", "Carolina", "Sergi"],
      },
      {
        text: "La ___ és molt jove, amb el cabell marró recollit en una cua.",
        blank: "Sara",
        options: ["Carolina", "Sara", "Sergi"],
      },
      {
        text: "En ___ és jove i alt, té bigoti i el cabell curt.",
        blank: "Xavier",
        options: ["Sergi", "Sara", "Xavier"],
      },
    ],
  },

  // ── Task 18: Autoavaluació ──
  {
    id: "el-cos-18",
    type: "self-assessment",
    prompt: "Autoavaluació: Les parts del cos.",
    items: [
      { catalan: "cap", translation: "glava", image: "cap" },
      { catalan: "ull", translation: "oko", image: "ull" },
      { catalan: "nas", translation: "nos", image: "nas" },
      { catalan: "boca", translation: "usta", image: "boca" },
      { catalan: "orella", translation: "uvo", image: "orella" },
      { catalan: "braç", translation: "ruka", image: "brac" },
      { catalan: "mà", translation: "šaka", image: "ma" },
      { catalan: "dit", translation: "prst", image: "dit" },
      { catalan: "cama", translation: "noga", image: "cama" },
      { catalan: "peu", translation: "stopalo", image: "peu" },
      { catalan: "cabell", translation: "kosa", image: "cabell" },
      { catalan: "dents", translation: "zubi", image: "dents" },
    ],
  },

  // Bonus activity: Fun drawing
  {
    id: "el-cos-bonus",
    type: "drawing-canvas",
    prompt: "Activitat extra! Diverteix-te, activa la creativitat i dibuixa alguna cosa màgica!",
    bonus: true,
  },
];
