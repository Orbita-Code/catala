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
    image: "cap",
    labels: [
      { text: "cabell", x: 50, y: 8 },
      { text: "ull", x: 35, y: 38 },
      { text: "nas", x: 50, y: 52 },
      { text: "boca", x: 50, y: 68 },
      { text: "orella", x: 85, y: 40 },
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
    prompt: "Busca 7 paraules a la sopa de lletres.",
    gridSize: 9,
    words: ["nas", "ull", "boca", "panxa", "orella", "mà", "braç"],
    grid: [
      ["a", "y", "c", "n", "a", "s", "n", "d", "o"],
      ["k", "m", "v", "s", "w", "h", "e", "k", "r"],
      ["p", "j", "e", "o", "g", "p", "u", "q", "e"],
      ["x", "a", "f", "u", "l", "l", "z", "u", "l"],
      ["r", "v", "n", "b", "i", "b", "r", "n", "l"],
      ["a", "c", "l", "x", "a", "o", "a", "f", "a"],
      ["h", "m", "w", "z", "a", "y", "c", "g", "x"],
      ["d", "t", "a", "s", "q", "j", "o", "i", "m"],
      ["m", "a", "x", "c", "b", "p", "b", "t", "l"],
    ],
  },

  // ── Task 5: Completa el dibuix amb les parts del requadre ──
  {
    id: "el-cos-5",
    type: "label-image",
    prompt: "Completa el dibuix amb les parts del requadre.",
    image: "cara",
    labels: [
      { text: "ulls", x: 35, y: 35 },
      { text: "nas", x: 50, y: 50 },
      { text: "cabell", x: 50, y: 10 },
      { text: "boca", x: 50, y: 70 },
    ],
    options: ["ulls", "nas", "cabell", "boca", "orella", "colze"],
  },

  // ── Task 6: Llegeix i uneix la persona amb la descripció correcta ──
  {
    id: "el-cos-6",
    type: "matching",
    prompt: "Llegeix i uneix la persona amb la descripció correcta.",
    pairs: [
      { left: "Persona A", right: "cabell taronja" },
      { left: "Persona B", right: "cabell marró" },
      { left: "Persona C", right: "cabell ros" },
      { left: "Persona D", right: "cabell negre" },
      { left: "Persona E", right: "cabell blanc" },
    ],
  },

  // ── Task 7: Observa i busca les paraules a la sopa de lletres ──
  {
    id: "el-cos-7",
    type: "word-search",
    prompt: "Observa i busca les paraules a la sopa de lletres.",
    gridSize: 9,
    words: ["cella", "front", "esquena", "hombro", "llavi"],
    grid: [
      ["m", "w", "c", "e", "l", "l", "a", "c", "l"],
      ["a", "t", "l", "u", "j", "g", "f", "a", "l"],
      ["n", "h", "o", "m", "b", "r", "o", "e", "a"],
      ["o", "r", "e", "b", "a", "i", "a", "f", "v"],
      ["f", "r", "o", "n", "t", "e", "m", "t", "i"],
      ["e", "s", "q", "u", "e", "n", "a", "k", "u"],
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
    sentences: [
      {
        text: "La Laura és més ___ que en Carles.",
        blank: "alta",
        options: ["alta", "baixa", "vella"],
      },
      {
        text: "En Carles és més ___ que la Laura.",
        blank: "baix",
        options: ["baix", "alt", "jove"],
      },
    ],
  },

  // ── Task 12: Fixa-t'hi i completa (NOI → NOIA) ──
  {
    id: "el-cos-12",
    type: "fill-sentence",
    prompt: "Fixa-t'hi i completa: noi → noia.",
    sentences: [
      {
        text: "Un noi vell → Una noia ___.",
        blank: "vella",
        options: ["vella", "vell", "jove"],
      },
      {
        text: "Un noi alt → Una noia ___.",
        blank: "alta",
        options: ["alta", "alt", "baixa"],
      },
      {
        text: "Un noi baix → Una noia ___.",
        blank: "baixa",
        options: ["baixa", "baix", "alta"],
      },
      {
        text: "Un noi jove → Una noia ___.",
        blank: "jove",
        options: ["jove", "vella", "alta"],
      },
    ],
  },

  // ── Task 13: Llegeix i dibuixa segons les instruccions ──
  {
    id: "el-cos-13",
    type: "drawing-canvas",
    prompt:
      "Llegeix i dibuixa: Un noi alt amb el cabell curt de color marró, ulls verds, nas gran i boca petita.",
  },

  // ── Task 14: Observa i pinta SÍ o NO ──
  {
    id: "el-cos-14",
    type: "multiple-choice",
    prompt: "Observa la Maria i contesta SÍ o NO.",
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
        options: ["Carolina", "Sara", "Xavier"],
      },
      {
        text: "En ___ és un nen baix, amb el cabell curt i negre.",
        blank: "Sergi",
        options: ["Sergi", "Xavier", "Carolina"],
      },
      {
        text: "La ___ és molt jove, amb el cabell marró recollit en una cua.",
        blank: "Sara",
        options: ["Sara", "Carolina", "Sergi"],
      },
      {
        text: "En ___ és jove i alt, té bigoti i el cabell curt.",
        blank: "Xavier",
        options: ["Xavier", "Sergi", "Sara"],
      },
    ],
  },

  // ── Task 17: Dibuixa una persona ──
  {
    id: "el-cos-17",
    type: "drawing-canvas",
    prompt: "Dibuixa una persona amb totes les parts del cos.",
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
];
