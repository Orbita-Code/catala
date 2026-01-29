import { Task } from "@/types/tasks";

export const elMenjarTasks: Task[] = [
  // Task 1: Copy food words
  {
    id: "menjar-1-copy",
    type: "copy-word",
    prompt: "Llegeix i copia els aliments:",
    words: [
      { catalan: "poma" },
      { catalan: "pera" },
      { catalan: "plàtan" },
      { catalan: "taronja" },
      { catalan: "maduixa" },
      { catalan: "tomàquet" },
      { catalan: "pastanaga" },
      { catalan: "pa" },
      { catalan: "peix" },
      { catalan: "llet" },
      { catalan: "formatge" },
      { catalan: "ou" },
    ],
  },

  // Task 2: Fill in missing letters
  {
    id: "menjar-2-fill-letters",
    type: "fill-letters",
    prompt: "Completa les lletres que falten:",
    words: [
      { word: "p_ma", hint: "poma" },
      { word: "p_r_", hint: "pera" },
      { word: "pl_t_n", hint: "plàtan" },
      { word: "t_ro_ja", hint: "taronja" },
      { word: "m_du_xa", hint: "maduixa" },
      { word: "tom_qu_t", hint: "tomàquet" },
      { word: "pa_tan_ga", hint: "pastanaga" },
      { word: "ll_t", hint: "llet" },
      { word: "fo_mat_e", hint: "formatge" },
      { word: "p_ix", hint: "peix" },
    ],
  },

  // Task 3: Unscramble food words (exact anagrams)
  {
    id: "menjar-3-unscramble",
    type: "unscramble",
    prompt: "Ordena les lletres per formar la paraula:",
    words: [
      { scrambled: "AMOP", correct: "POMA" },       // P-O-M-A -> A-M-O-P
      { scrambled: "REPA", correct: "PERA" },       // P-E-R-A -> R-E-P-A
      { scrambled: "XPEI", correct: "PEIX" },       // P-E-I-X -> X-P-E-I
      { scrambled: "ETLL", correct: "LLET" },       // L-L-E-T -> E-T-L-L
      { scrambled: "BAEC", correct: "CEBA" },       // C-E-B-A -> B-A-E-C
    ],
  },

  // Task 4: Match meals with foods
  {
    id: "menjar-4-matching",
    type: "matching",
    prompt: "Relaciona cada àpat amb el que menges:",
    pairs: [
      { left: "esmorzar", right: "cereals" },
      { left: "dinar", right: "sopa" },
      { left: "berenar", right: "fruita" },
      { left: "sopar", right: "amanida" },
    ],
  },

  // Task 5: Word search
  // Words placed in 10x10 grid:
  //   POMA  - row 0, cols 0-3 (horizontal)
  //   PERA  - row 2, cols 5-8 (horizontal)
  //   PA    - row 4, cols 1-2 (horizontal)
  //   LLET  - col 9, rows 0-3 (vertical)
  //   OU    - row 7, cols 6-7 (horizontal)
  {
    id: "menjar-5-word-search",
    type: "word-search",
    prompt: "Troba les paraules a la sopa de lletres:",
    gridSize: 10,
    words: ["POMA", "PERA", "PA", "LLET", "OU"],
    grid: [
      ["P", "O", "M", "A", "F", "G", "T", "R", "S", "L"],
      ["D", "V", "N", "H", "B", "K", "J", "C", "Q", "L"],
      ["W", "X", "R", "Z", "I", "P", "E", "R", "A", "E"],
      ["G", "K", "T", "N", "D", "F", "H", "V", "B", "T"],
      ["S", "P", "A", "J", "M", "R", "C", "X", "W", "Z"],
      ["F", "H", "D", "Q", "V", "N", "G", "K", "T", "B"],
      ["R", "M", "W", "X", "J", "S", "D", "F", "H", "N"],
      ["C", "T", "V", "K", "B", "G", "O", "U", "R", "Q"],
      ["N", "D", "J", "F", "H", "X", "W", "M", "S", "P"],
      ["Z", "Q", "B", "R", "T", "K", "V", "G", "D", "F"],
    ],
  },

  // Task 6: Classify fruit vs vegetable
  {
    id: "menjar-6-classify",
    type: "classify-columns",
    prompt: "Classifica: fruita o verdura?",
    columns: [
      { title: "Fruita", items: ["poma", "pera", "plàtan", "taronja", "maduixa"] },
      { title: "Verdura", items: ["tomàquet", "pastanaga", "ceba", "enciam", "patata"] },
    ],
    allItems: [
      "poma",
      "tomàquet",
      "pera",
      "pastanaga",
      "plàtan",
      "ceba",
      "taronja",
      "enciam",
      "maduixa",
      "patata",
    ],
  },

  // Task 7: Fill in sentences about meals
  {
    id: "menjar-7-fill-sentence",
    type: "fill-sentence",
    prompt: "Completa la frase:",
    sentences: [
      {
        text: "Al matí esmorzem ___.",
        blank: "llet",
        options: ["llet", "sopa", "amanida", "fruita"],
      },
      {
        text: "A migdia dinem ___.",
        blank: "sopa",
        options: ["llet", "sopa", "cereals", "ou"],
      },
      {
        text: "A la tarda berenem ___.",
        blank: "fruita",
        options: ["amanida", "sopa", "fruita", "peix"],
      },
      {
        text: "Al vespre sopem ___.",
        blank: "amanida",
        options: ["cereals", "llet", "fruita", "amanida"],
      },
    ],
  },

  // Task 8: Multiple choice about food
  {
    id: "menjar-8-multiple-choice",
    type: "multiple-choice",
    prompt: "Tria la resposta correcta:",
    questions: [
      {
        question: "Quin d'aquests és una fruita?",
        options: ["tomàquet", "poma", "pastanaga", "ceba"],
        correct: 1,
      },
      {
        question: "Amb què tallem el menjar?",
        options: ["cullera", "forquilla", "ganivet", "got"],
        correct: 2,
      },
      {
        question: "Quin àpat fem al matí?",
        options: ["dinar", "sopar", "berenar", "esmorzar"],
        correct: 3,
      },
      {
        question: "On posem la sopa?",
        options: ["got", "plat", "tovalló", "forquilla"],
        correct: 1,
      },
    ],
  },

  // Task 9: Self-assessment with Serbian translations
  {
    id: "menjar-9-self-assessment",
    type: "self-assessment",
    prompt: "Saps dir aquestes paraules en català?",
    items: [
      { catalan: "poma", translation: "jabuka" },
      { catalan: "pera", translation: "kruška" },
      { catalan: "plàtan", translation: "banana" },
      { catalan: "taronja", translation: "pomorandža" },
      { catalan: "pa", translation: "hleb" },
      { catalan: "llet", translation: "mleko" },
      { catalan: "peix", translation: "riba" },
      { catalan: "ou", translation: "jaje" },
    ],
  },
];
