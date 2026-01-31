import { Task } from "@/types/tasks";

export const elCosTasks: Task[] = [
  // 1. Llegeix i copia
  {
    id: "el-cos-1",
    type: "copy-word",
    prompt: "Llegeix i copia les parts del cos.",
    words: [
      { catalan: "boca" },
      { catalan: "ull" },
      { catalan: "nas" },
      { catalan: "orella" },
      { catalan: "dents" },
      { catalan: "cabell" },
      { catalan: "braç" },
      { catalan: "cama" },
      { catalan: "cap" },
      { catalan: "colze" },
      { catalan: "panxa" },
      { catalan: "mà" },
      { catalan: "dit" },
      { catalan: "peu" },
      { catalan: "ungla" },
    ],
  },

  // 2. Ordena les síl·labes
  {
    id: "el-cos-2",
    type: "unscramble",
    prompt: "Ordena les síl·labes per formar paraules.",
    words: [
      { scrambled: "CA-BO", correct: "boca" },
      { scrambled: "RA-PAN-XA", correct: "panxa" },
      { scrambled: "RE-O-LLA", correct: "orella" },
      { scrambled: "CA-BE-LL", correct: "cabell" },
      { scrambled: "LA-UN-G", correct: "ungla" },
      { scrambled: "COL-ZE", correct: "colze" },
    ],
  },

  // 3. Escriu-me les parts del cos
  {
    id: "el-cos-3",
    type: "label-image",
    prompt: "Escriu les parts del cos.",
    image: "cos",
    labels: [
      { text: "cap", x: 50, y: 10 },
      { text: "braç", x: 20, y: 40 },
      { text: "mà", x: 15, y: 55 },
      { text: "panxa", x: 50, y: 45 },
      { text: "cama", x: 40, y: 70 },
      { text: "peu", x: 40, y: 90 },
    ],
    options: ["cap", "braç", "mà", "panxa", "cama", "peu", "coll", "dit"],
  },

  // 4. Busca 7 paraules a la sopa de lletres
  {
    id: "el-cos-4",
    type: "word-search",
    prompt: "Busca 7 paraules a la sopa de lletres.",
    gridSize: 8,
    words: ["boca", "cap", "nas", "ull", "peu", "orella", "braç"],
    grid: [
      ["o", "v", "c", "n", "a", "s", "n", "d"],
      ["r", "m", "v", "s", "w", "h", "e", "r"],
      ["e", "a", "q", "f", "u", "l", "l", "u"],
      ["l", "b", "o", "c", "a", "r", "t", "o"],
      ["l", "v", "b", "i", "l", "n", "t", "p"],
      ["a", "c", "a", "p", "e", "u", "g", "e"],
      ["b", "r", "a", "ç", "w", "i", "f", "u"],
      ["m", "p", "s", "i", "d", "o", "l", "k"],
    ],
  },

  // 5. Completa el dibuix amb les parts del cap
  {
    id: "el-cos-5",
    type: "label-image",
    prompt: "Completa el dibuix amb les parts del cap.",
    image: "cara",
    labels: [
      { text: "ull", x: 35, y: 35 },
      { text: "nas", x: 50, y: 50 },
      { text: "boca", x: 50, y: 70 },
      { text: "orella", x: 85, y: 40 },
      { text: "cabell", x: 50, y: 10 },
    ],
    options: ["ull", "nas", "boca", "orella", "cabell", "cella", "galta"],
  },

  // 6. Llegeix i assenyala (hair color descriptions)
  {
    id: "el-cos-6",
    type: "fill-sentence",
    prompt: "Llegeix i completa el color del cabell.",
    sentences: [
      {
        text: "Té el cabell de color ___.",
        blank: "taronja",
        options: ["blau", "taronja", "verd"],
      },
      {
        text: "Té el cabell de color ___.",
        blank: "negre",
        options: ["blanc", "vermell", "negre"],
      },
      {
        text: "Té el cabell de color ___.",
        blank: "ros",
        options: ["ros", "blau", "verd"],
      },
      {
        text: "Té el cabell de color ___.",
        blank: "marró",
        options: ["groc", "marró", "lila"],
      },
    ],
  },

  // 7. Observa i busca les paraules a la sopa de lletres
  {
    id: "el-cos-7",
    type: "word-search",
    prompt: "Observa i busca les paraules a la sopa de lletres.",
    gridSize: 7,
    words: ["front", "galtes", "orelles", "ulls", "celles"],
    grid: [
      ["g", "a", "l", "t", "e", "s", "o"],
      ["f", "r", "o", "n", "t", "h", "r"],
      ["c", "e", "l", "l", "e", "s", "e"],
      ["m", "b", "q", "v", "d", "n", "l"],
      ["u", "l", "l", "s", "w", "a", "l"],
      ["k", "i", "p", "j", "g", "t", "e"],
      ["d", "f", "r", "c", "a", "m", "s"],
    ],
  },

  // 8. Llegeix i copia (verbs about senses)
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

  // 9. Relaciona (match sense to body part)
  {
    id: "el-cos-9",
    type: "matching",
    prompt: "Relaciona cada part del cos amb la seva acció.",
    pairs: [
      { left: "ulls", right: "mirar" },
      { left: "orelles", right: "escoltar" },
      { left: "boca", right: "cantar" },
      { left: "mans", right: "aplaudir" },
      { left: "cames", right: "caminar" },
      { left: "nas", right: "olorar" },
    ],
  },

  // 10. Observa (people descriptions)
  {
    id: "el-cos-10",
    type: "fill-sentence",
    prompt: "Observa i completa les frases.",
    sentences: [
      {
        text: "La Carla té el cabell ___.",
        blank: "llarg",
        options: ["llarg", "curt", "verd"],
      },
      {
        text: "En Pere té els ulls ___.",
        blank: "marrons",
        options: ["marrons", "vermells", "grocs"],
      },
      {
        text: "La Laia és molt ___.",
        blank: "alta",
        options: ["alta", "petita", "verda"],
      },
    ],
  },

  // 11. Observa i completa (body part counting)
  {
    id: "el-cos-11",
    type: "fill-sentence",
    prompt: "Observa i completa les frases.",
    sentences: [
      {
        text: "Tinc dos ___.",
        blank: "ulls",
        options: ["ulls", "nassos", "boques"],
      },
      {
        text: "Tinc dues ___.",
        blank: "orelles",
        options: ["orelles", "boques", "panxes"],
      },
      {
        text: "Tinc deu ___.",
        blank: "dits",
        options: ["dits", "caps", "nassos"],
      },
      {
        text: "Tinc un ___.",
        blank: "nas",
        options: ["nas", "ull", "peu"],
      },
    ],
  },

  // 12. Fins i completa (senses and body parts)
  {
    id: "el-cos-12",
    type: "fill-sentence",
    prompt: "Completa les frases amb la part del cos correcta.",
    sentences: [
      {
        text: "Veig amb els ___.",
        blank: "ulls",
        options: ["ulls", "peus", "braços"],
      },
      {
        text: "Escolto amb les ___.",
        blank: "orelles",
        options: ["orelles", "mans", "cames"],
      },
      {
        text: "Camino amb els ___.",
        blank: "peus",
        options: ["peus", "ulls", "dits"],
      },
      {
        text: "Toco amb les ___.",
        blank: "mans",
        options: ["mans", "orelles", "boques"],
      },
    ],
  },

  // 13. Llegeix i dibuixa
  {
    id: "el-cos-13",
    type: "drawing-canvas",
    prompt: "Llegeix i dibuixa segons les instruccions.",
  },

  // 14. Observa i pinta SÍ o NO
  {
    id: "el-cos-14",
    type: "multiple-choice",
    prompt: "Observa i contesta SÍ o NO.",
    questions: [
      {
        question: "La Maria té els ulls grans?",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        question: "Té el nas petit?",
        options: ["Sí", "No"],
        correct: 1,
      },
      {
        question: "Té una panda?",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        question: "Té el cabell llarg?",
        options: ["Sí", "No"],
        correct: 1,
      },
    ],
  },

  // 15. Observa el vocabulari nou (face details)
  {
    id: "el-cos-15",
    type: "label-image",
    prompt: "Observa el vocabulari nou de la cara.",
    image: "cara-detall",
    labels: [
      { text: "barba", x: 50, y: 80 },
      { text: "bigoti", x: 50, y: 65 },
      { text: "arrugues", x: 70, y: 40 },
      { text: "dentadura", x: 50, y: 70 },
    ],
    options: ["barba", "bigoti", "arrugues", "dentadura", "celles", "galtes"],
  },

  // 16. Qui és qui?
  {
    id: "el-cos-16",
    type: "fill-sentence",
    prompt: "Qui és qui? Llegeix i tria la persona correcta.",
    sentences: [
      {
        text: "La ___ té el cabell llarg i negre. També porta ulleres.",
        blank: "Carla",
        options: ["Carla", "Pere", "Maria"],
      },
      {
        text: "En ___ és vermellós, amb el cabell curt i rapat.",
        blank: "Dani",
        options: ["Dani", "Laura", "Marc"],
      },
      {
        text: "La ___ té el cabell curt, rossa i ulleres.",
        blank: "Laura",
        options: ["Laura", "Dani", "Carla"],
      },
    ],
  },

  // 17. Autoavaluació
  {
    id: "el-cos-17",
    type: "self-assessment",
    prompt: "Autoavaluació: Les parts del cos.",
    items: [
      { catalan: "cap", translation: "glava" },
      { catalan: "ull", translation: "oko" },
      { catalan: "nas", translation: "nos" },
      { catalan: "boca", translation: "usta" },
      { catalan: "orella", translation: "uvo" },
      { catalan: "braç", translation: "ruka" },
      { catalan: "mà", translation: "šaka" },
      { catalan: "dit", translation: "prst" },
      { catalan: "cama", translation: "noga" },
      { catalan: "peu", translation: "stopalo" },
      { catalan: "cabell", translation: "kosa" },
      { catalan: "dents", translation: "zubi" },
    ],
  },

  // 18. Dibuixa una persona
  {
    id: "el-cos-18",
    type: "drawing-canvas",
    prompt: "Dibuixa una persona amb totes les parts del cos.",
  },

  // === EXTRA TASKS ===

  // 19. Al cap o al cos? (classify columns)
  {
    id: "el-cos-19",
    type: "classify-columns",
    prompt: "Classifica: Al cap o al cos?",
    columns: [
      { title: "Cap", items: ["ull", "nas", "boca", "orella", "cabell"] },
      { title: "Cos", items: ["braç", "mà", "cama", "genoll", "peu"] },
    ],
    allItems: [
      "ull",
      "nas",
      "boca",
      "orella",
      "cabell",
      "braç",
      "mà",
      "cama",
      "genoll",
      "peu",
    ],
  },

  // 20. Pinta les parts del cos
  {
    id: "el-cos-20",
    type: "color-by-instruction",
    prompt: "Pinta les parts del cos segons les instruccions.",
    image: "cos-silueta",
    instructions: [
      {
        text: "Pinta el cap de groc",
        targetColor: "groc",
        targetItem: "🟡",
      },
      {
        text: "Pinta els braços de blau",
        targetColor: "blau",
        targetItem: "💪",
      },
      {
        text: "Pinta les cames de verd",
        targetColor: "verd",
        targetItem: "🦵",
      },
      {
        text: "Pinta la panxa de taronja",
        targetColor: "taronja",
        targetItem: "⭕",
      },
      {
        text: "Pinta les mans de rosa",
        targetColor: "rosa",
        targetItem: "🤚",
      },
    ],
  },
];
