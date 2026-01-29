import { Task } from "@/types/tasks";

export const elMenjarTasks: Task[] = [
  // Task 1: Copy food words
  {
    id: "el-menjar-1",
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

  // Task 2: Fill in missing letters (word=answer, hint=pattern)
  {
    id: "el-menjar-2",
    type: "fill-letters",
    prompt: "Completa les lletres que falten:",
    words: [
      { word: "poma", hint: "p_ma" },
      { word: "pera", hint: "p_r_" },
      { word: "plàtan", hint: "pl_t_n" },
      { word: "taronja", hint: "t_ro_ja" },
      { word: "maduixa", hint: "m_du_xa" },
      { word: "tomàquet", hint: "tom_qu_t" },
      { word: "pastanaga", hint: "pa_tan_ga" },
      { word: "llet", hint: "ll_t" },
      { word: "formatge", hint: "fo_mat_e" },
      { word: "peix", hint: "p_ix" },
    ],
  },

  // Task 3: Unscramble food words (exact anagrams)
  {
    id: "el-menjar-3",
    type: "unscramble",
    prompt: "Ordena les lletres per formar la paraula:",
    words: [
      { scrambled: "amop", correct: "poma" },
      { scrambled: "repa", correct: "pera" },
      { scrambled: "xpei", correct: "peix" },
      { scrambled: "etll", correct: "llet" },
      { scrambled: "baec", correct: "ceba" },
    ],
  },

  // Task 4: Match meals with foods
  {
    id: "el-menjar-4",
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
  {
    id: "el-menjar-5",
    type: "word-search",
    prompt: "Troba les paraules a la sopa de lletres:",
    gridSize: 10,
    words: ["poma", "pera", "pa", "llet", "ou"],
    grid: [
      ["p", "o", "m", "a", "f", "g", "t", "r", "s", "l"],
      ["d", "v", "n", "h", "b", "k", "j", "c", "q", "l"],
      ["w", "x", "r", "z", "i", "p", "e", "r", "a", "e"],
      ["g", "k", "t", "n", "d", "f", "h", "v", "b", "t"],
      ["s", "p", "a", "j", "m", "r", "c", "x", "w", "z"],
      ["f", "h", "d", "q", "v", "n", "g", "k", "t", "b"],
      ["r", "m", "w", "x", "j", "s", "d", "f", "h", "n"],
      ["c", "t", "v", "k", "b", "g", "o", "u", "r", "q"],
      ["n", "d", "j", "f", "h", "x", "w", "m", "s", "p"],
      ["z", "q", "b", "r", "t", "k", "v", "g", "d", "f"],
    ],
  },

  // Task 6: Classify fruit vs vegetable
  {
    id: "el-menjar-6",
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
    id: "el-menjar-7",
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
    id: "el-menjar-8",
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
    id: "el-menjar-9",
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
      { catalan: "maduixa", translation: "jagoda" },
      { catalan: "tomàquet", translation: "paradajz" },
      { catalan: "formatge", translation: "sir" },
      { catalan: "pastanaga", translation: "šargarepa" },
    ],
  },

  // Task 10: Label breakfast items
  {
    id: "el-menjar-10",
    type: "label-image",
    prompt: "Escriu el nom dels aliments de l'esmorzar:",
    image: "esmorzar",
    labels: [
      { text: "cereals", x: 15, y: 30 },
      { text: "suc", x: 40, y: 30 },
      { text: "llet", x: 65, y: 30 },
      { text: "torrada", x: 85, y: 30 },
      { text: "fruita", x: 50, y: 70 },
    ],
    options: ["cereals", "suc", "llet", "torrada", "fruita", "pa", "formatge"],
  },

  // Task 11: Fill sentences about meals
  {
    id: "el-menjar-11",
    type: "fill-sentence",
    prompt: "Què menges a cada àpat?",
    sentences: [
      {
        text: "Per esmorzar menjo ___.",
        blank: "cereals",
        options: ["cereals", "sopa", "pizza"],
      },
      {
        text: "Per dinar menjo ___.",
        blank: "arròs",
        options: ["arròs", "cereals", "torrada"],
      },
      {
        text: "Per berenar menjo un ___.",
        blank: "entrepà",
        options: ["entrepà", "arròs", "sopa"],
      },
      {
        text: "Per sopar menjo ___.",
        blank: "sopa",
        options: ["sopa", "cereals", "torrada"],
      },
    ],
  },

  // Task 12: Label food items
  {
    id: "el-menjar-12",
    type: "label-image",
    prompt: "Escriu el nom dels aliments:",
    image: "aliments",
    labels: [
      { text: "pa", x: 15, y: 25 },
      { text: "formatge", x: 50, y: 25 },
      { text: "ou", x: 85, y: 25 },
      { text: "pizza", x: 15, y: 70 },
      { text: "pasta", x: 50, y: 70 },
      { text: "hamburguesa", x: 85, y: 70 },
    ],
    options: ["pa", "formatge", "ou", "pizza", "pasta", "hamburguesa", "arròs", "sopa"],
  },

  // Task 13: Classify meals - Esmorzar vs Dinar vs Sopar
  {
    id: "el-menjar-13",
    type: "classify-columns",
    prompt: "Classifica: Esmorzar vs Dinar vs Sopar",
    columns: [
      { title: "Esmorzar", items: ["cereals", "torrada", "llet", "suc", "fruita"] },
      { title: "Dinar", items: ["arròs", "carn", "peix", "amanida", "pasta"] },
      { title: "Sopar", items: ["sopa", "entrepà", "ou", "formatge"] },
    ],
    allItems: [
      "cereals",
      "torrada",
      "llet",
      "suc",
      "fruita",
      "arròs",
      "carn",
      "peix",
      "amanida",
      "pasta",
      "sopa",
      "entrepà",
      "ou",
      "formatge",
    ],
  },

  // Task 14: Fill sentences about food descriptions
  {
    id: "el-menjar-14",
    type: "fill-sentence",
    prompt: "Completa sobre el menjar:",
    sentences: [
      {
        text: "El ___ és blanc i es beu.",
        blank: "llet",
        options: ["llet", "suc", "pa"],
      },
      {
        text: "La ___ és amb enciam i tomàquet.",
        blank: "amanida",
        options: ["amanida", "pizza", "sopa"],
      },
      {
        text: "L' ___ el ponen les gallines.",
        blank: "ou",
        options: ["ou", "pa", "arròs"],
      },
      {
        text: "El ___ es fa amb farina.",
        blank: "pa",
        options: ["pa", "ou", "peix"],
      },
    ],
  },

  // Task 15: Fill missing letters for food words
  {
    id: "el-menjar-15",
    type: "fill-letters",
    prompt: "Completa el nom de l'aliment:",
    words: [
      { word: "hamburguesa", hint: "h_mb_rgu_sa" },
      { word: "entrepà", hint: "_ntr_pà" },
      { word: "formatge", hint: "f_rm_tge" },
      { word: "amanida", hint: "_man_da" },
      { word: "cereals", hint: "c_re_ls" },
      { word: "torrada", hint: "t_rr_da" },
    ],
  },

  // Task 16: Classify sweet vs salty
  {
    id: "el-menjar-16",
    type: "classify-columns",
    prompt: "Classifica: Dolç vs Salat",
    columns: [
      { title: "Dolç", items: ["xocolata", "pastís", "galeta", "melmelada", "fruita"] },
      { title: "Salat", items: ["formatge", "pernil", "entrepà", "pizza", "sopa"] },
    ],
    allItems: [
      "xocolata",
      "pastís",
      "galeta",
      "melmelada",
      "fruita",
      "formatge",
      "pernil",
      "entrepà",
      "pizza",
      "sopa",
    ],
  },

  // Task 17: Fill sentences about food preferences
  {
    id: "el-menjar-17",
    type: "fill-sentence",
    prompt: "Escriu el teu menú:",
    sentences: [
      {
        text: "El meu menjar preferit és ___.",
        blank: "pizza",
        options: ["pizza", "sopa", "ou"],
      },
      {
        text: "No m'agrada ___.",
        blank: "peix",
        options: ["peix", "pa", "llet"],
      },
      {
        text: "M'encanta la ___.",
        blank: "xocolata",
        options: ["xocolata", "ceba", "pastanaga"],
      },
    ],
  },

  // Task 18: Label dinner menu
  {
    id: "el-menjar-18",
    type: "label-image",
    prompt: "Escriu el menú del sopar:",
    image: "sopar",
    labels: [
      { text: "sopa", x: 25, y: 25 },
      { text: "pa", x: 75, y: 25 },
      { text: "formatge", x: 25, y: 70 },
      { text: "fruita", x: 75, y: 70 },
    ],
    options: ["sopa", "pa", "formatge", "fruita", "pizza", "arròs"],
  },

  // Task 19: Label lunch menu
  {
    id: "el-menjar-19",
    type: "label-image",
    prompt: "Escriu el menú del dinar:",
    image: "dinar",
    labels: [
      { text: "amanida", x: 25, y: 25 },
      { text: "arròs", x: 75, y: 25 },
      { text: "peix", x: 25, y: 70 },
      { text: "suc", x: 75, y: 70 },
    ],
    options: ["amanida", "arròs", "peix", "suc", "sopa", "torrada"],
  },

  // Task 20: Drawing canvas - draw your favorite dish
  {
    id: "el-menjar-20",
    type: "drawing-canvas",
    prompt: "Dibuixa el teu plat preferit! 🍽️",
  },
];
