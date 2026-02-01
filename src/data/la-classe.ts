import { Task } from "@/types/tasks";

export const laClasseTasks: Task[] = [
  // Exercise 1: Llegeix i copia
  {
    id: "la-classe-1",
    type: "copy-word",
    prompt: "Llegeix i copia les paraules de la classe.",
    words: [
      { catalan: "llapis" },
      { catalan: "goma" },
      { catalan: "bolígraf" },
      { catalan: "retolador" },
      { catalan: "llibreta" },
      { catalan: "llibre" },
      { catalan: "carpeta" },
      { catalan: "estoig" },
      { catalan: "maquineta" },
      { catalan: "regle" },
      { catalan: "motxilla" },
      { catalan: "tisores" },
      { catalan: "pissarra" },
      { catalan: "guix" },
      { catalan: "borrador" },
      { catalan: "paperera" },
      { catalan: "ordinador" },
      { catalan: "taula" },
      { catalan: "cadira" },
      { catalan: "porta" },
      { catalan: "finestra" },
    ],
  },

  // Exercise 2: Busca 10 paraules sopa de lletres
  {
    id: "la-classe-2",
    type: "word-search",
    prompt: "Busca 10 paraules a la sopa de lletres.",
    gridSize: 10,
    words: [
      "tisores",
      "estoig",
      "llapis",
      "regle",
      "retolador",
      "goma",
      "motxilla",
      "bolígraf",
      "llibreta",
      "pissarra",
    ],
    grid: [
      ["b", "b", "t", "i", "s", "o", "r", "e", "s", "n"],
      ["o", "e", "s", "t", "o", "i", "g", "o", "l", "v"],
      ["l", "l", "a", "p", "i", "s", "m", "v", "l", "h"],
      ["i", "i", "h", "v", "a", "i", "o", "p", "i", "d"],
      ["g", "e", "r", "e", "g", "l", "e", "n", "b", "k"],
      ["r", "e", "t", "o", "l", "a", "d", "o", "r", "w"],
      ["a", "a", "g", "o", "m", "a", "i", "l", "e", "q"],
      ["f", "e", "r", "b", "i", "l", "l", "a", "t", "j"],
      ["m", "o", "t", "x", "i", "l", "l", "a", "a", "c"],
      ["p", "i", "s", "s", "a", "r", "r", "a", "z", "u"],
    ],
  },

  // Exercise 3: Completa la paraula (all classroom items)
  {
    id: "la-classe-3",
    type: "fill-letters",
    prompt: "Completa la paraula.",
    words: [
      { word: "llapis", hint: "l_a_i_" },
      { word: "goma", hint: "g_m_" },
      { word: "llibre", hint: "ll_br_" },
      { word: "bolígraf", hint: "bo_í_r_f" },
      { word: "llibreta", hint: "ll_br_t_" },
      { word: "retolador", hint: "r_to_d_r" },
      { word: "carpeta", hint: "c_rp_t_" },
      { word: "estoig", hint: "e_t_ig" },
      { word: "maquineta", hint: "m_qu_n_ta" },
      { word: "regle", hint: "r_g_e" },
      { word: "motxilla", hint: "m_tx_l_a" },
      { word: "tisores", hint: "t_s_r_s" },
      { word: "pissarra", hint: "p_ss_r_a" },
      { word: "guix", hint: "g_i_" },
      { word: "borrador", hint: "b_rr_d_r" },
      { word: "paperera", hint: "p_p_r_ra" },
      { word: "ordinador", hint: "o_d_n_dor" },
      { word: "taula", hint: "t_u_a" },
      { word: "cadira", hint: "c_d_ra" },
      { word: "porta", hint: "p_r_a" },
      { word: "finestra", hint: "f_n_stra" },
    ],
  },

  // Exercise 4: Classifica gènere femení / masculí
  {
    id: "la-classe-4",
    type: "classify-columns",
    prompt: "Classifica les paraules: femení (una) o masculí (un).",
    columns: [
      {
        title: "Femení (una)",
        items: [
          "goma",
          "llibreta",
          "carpeta",
          "maquineta",
          "motxilla",
          "tisores",
        ],
      },
      {
        title: "Masculí (un)",
        items: [
          "llapis",
          "bolígraf",
          "retolador",
          "llibre",
          "estoig",
          "regle",
        ],
      },
    ],
    allItems: [
      "llapis",
      "goma",
      "bolígraf",
      "retolador",
      "llibreta",
      "llibre",
      "estoig",
      "carpeta",
      "maquineta",
      "regle",
      "motxilla",
      "tisores",
    ],
  },

  // Exercise 5: Relaciona (illustration to word)
  {
    id: "la-classe-5",
    type: "matching",
    prompt: "Relaciona cada dibuix amb la seva paraula.",
    illustrationMatch: true,
    pairs: [
      { left: "llapis", right: "llapis" },
      { left: "goma", right: "goma" },
      { left: "maquineta", right: "maquineta" },
      { left: "llibre", right: "llibre" },
      { left: "carpeta", right: "carpeta" },
      { left: "estoig", right: "estoig" },
      { left: "bolígraf", right: "bolígraf" },
      { left: "llibreta", right: "llibreta" },
      { left: "pissarra", right: "pissarra" },
      { left: "paperera", right: "paperera" },
      { left: "regle", right: "regle" },
      { left: "ordinador", right: "ordinador" },
      { left: "guix", right: "guix" },
      { left: "tisores", right: "tisores" },
      { left: "motxilla", right: "motxilla" },
      { left: "borrador", right: "borrador" },
      { left: "retolador", right: "retolador" },
      { left: "taula", right: "taula" },
    ],
  },

  // Exercise 6: Classifica UN vs MOLTS
  {
    id: "la-classe-6",
    type: "classify-columns",
    prompt: "Classifica les paraules: UN (singular) o MOLTS (plural).",
    columns: [
      {
        title: "UN (singular)",
        items: ["llapis", "goma", "llibre", "estoig", "regle"],
      },
      {
        title: "MOLTS (plural)",
        items: [
          "bolígrafs",
          "retoladors",
          "llibretes",
          "carpetes",
          "maquinetes",
          "motxilles",
          "tisores",
        ],
      },
    ],
    allItems: [
      "llapis",
      "goma",
      "bolígrafs",
      "retoladors",
      "llibretes",
      "llibre",
      "estoig",
      "carpetes",
      "maquinetes",
      "regle",
      "motxilles",
      "tisores",
    ],
  },

  // Exercise 7: Pinta (color-by-instruction)
  {
    id: "la-classe-7",
    type: "color-by-instruction",
    prompt: "Pinta cada objecte del color indicat.",
    image: "classroom-items",
    instructions: [
      { text: "Pinta el llapis de color blau", targetColor: "blau", targetItem: "✏️" },
      { text: "Pinta la goma de color verd", targetColor: "verd", targetItem: "🟩" },
      { text: "Pinta l'ordinador de color negre", targetColor: "negre", targetItem: "💻" },
      { text: "Pinta les tisores de color vermell", targetColor: "vermell", targetItem: "✂️" },
      { text: "Pinta la maquineta de color groc", targetColor: "groc", targetItem: "🔧" },
      { text: "Pinta el llibre de color blanc", targetColor: "blanc", targetItem: "📖" },
      { text: "Pinta la motxilla de color lila", targetColor: "lila", targetItem: "🎒" },
      { text: "Pinta l'estoig de color verd", targetColor: "verd", targetItem: "📦" },
      { text: "Pinta el regle de color taronja", targetColor: "taronja", targetItem: "📏" },
      { text: "Pinta el retolador de color marró", targetColor: "marró", targetItem: "🖊️" },
    ],
  },

  // Exercise 8: Què tenim a l'estoig? Completa
  {
    id: "la-classe-8",
    type: "fill-sentence",
    prompt: "Què tenim a l'estoig? Completa les frases.",
    sentences: [
      {
        text: "A l'estoig tenim una maquineta ___.",
        blank: "blava",
        options: ["vermella", "blava", "verda"],
      },
      {
        text: "A l'estoig tenim un regle ___.",
        blank: "groc",
        options: ["blau", "negre", "groc"],
      },
      {
        text: "A l'estoig tenim un ___.",
        blank: "bolígraf",
        options: ["bolígraf", "pissarra", "taula"],
      },
      {
        text: "A l'estoig tenim un ___.",
        blank: "pinzell",
        options: ["guix", "pinzell", "borrador"],
      },
      {
        text: "A l'estoig tenim un ___.",
        blank: "clip",
        options: ["ordinador", "cadira", "clip"],
      },
      {
        text: "A l'estoig tenim una cola de ___.",
        blank: "barra",
        options: ["porta", "barra", "finestra"],
      },
      {
        text: "A l'estoig tenim unes ___.",
        blank: "tisores",
        options: ["taules", "cadires", "tisores"],
      },
    ],
  },

  // Exercise 9: Escriu la paraula (classroom furniture/room words)
  {
    id: "la-classe-9",
    type: "copy-word",
    prompt: "Escriu la paraula de cada objecte de la classe.",
    words: [
      { catalan: "cadira" },
      { catalan: "porta" },
      { catalan: "finestra" },
      { catalan: "taula" },
      { catalan: "pissarra" },
      { catalan: "paperera" },
      { catalan: "ordinador" },
    ],
  },

  // Exercise 10: Ordena les síl·labes
  {
    id: "la-classe-10",
    type: "unscramble",
    prompt: "Ordena les síl·labes per formar la paraula correcta.",
    words: [
      { scrambled: "pis-lla", correct: "llapis" },
      { scrambled: "go-ma", correct: "goma" },
      { scrambled: "toig-es", correct: "estoig" },
      { scrambled: "xi-mot-lla", correct: "motxilla" },
      { scrambled: "so-ti-res", correct: "tisores" },
      { scrambled: "or-na-di-dor", correct: "ordinador" },
      { scrambled: "gui-x", correct: "guix" },
    ],
  },

  // Exercise 11: Escriu la paraula per cada objecte
  {
    id: "la-classe-11",
    type: "copy-word",
    prompt: "Escriu la paraula per cada objecte.",
    words: [
      { catalan: "regle" },
      { catalan: "motxilla" },
      { catalan: "borrador" },
      { catalan: "maquineta" },
      { catalan: "estoig" },
      { catalan: "bolígraf" },
    ],
  },

  // Exercise 12: Observa i completa
  {
    id: "la-classe-12",
    type: "fill-sentence",
    prompt: "Observa i completa les frases.",
    sentences: [
      {
        text: "A la classe hi ha una ___.",
        blank: "pissarra",
        options: ["pissarra", "cuina", "bany"],
      },
      {
        text: "El mestre escriu amb el ___.",
        blank: "guix",
        options: ["guix", "goma", "tisores"],
      },
      {
        text: "Cada alumne s'asseu a una ___.",
        blank: "cadira",
        options: ["cadira", "taula", "porta"],
      },
      {
        text: "Obrim la ___ per sortir.",
        blank: "porta",
        options: ["porta", "finestra", "pissarra"],
      },
    ],
  },

  // Exercise 13: Completa les frases sobre la classe
  {
    id: "la-classe-13",
    type: "fill-sentence",
    prompt: "Completa les frases sobre la classe.",
    sentences: [
      {
        text: "La mestra escriu a la ___.",
        blank: "pissarra",
        options: ["pissarra", "motxilla", "estoig"],
      },
      {
        text: "Els alumnes s'asseuen a la ___.",
        blank: "cadira",
        options: ["cadira", "porta", "goma"],
      },
      {
        text: "Llencem el paper a la ___.",
        blank: "paperera",
        options: ["paperera", "taula", "finestra"],
      },
      {
        text: "Miro per la ___.",
        blank: "finestra",
        options: ["finestra", "pissarra", "cadira"],
      },
    ],
  },

  // Exercise 14: Escriu el nom dels objectes
  {
    id: "la-classe-14",
    type: "fill-sentence",
    prompt: "Escriu el nom dels objectes.",
    sentences: [
      {
        text: "El ___ serveix per mesurar.",
        blank: "regle",
        options: ["regle", "guix", "goma"],
      },
      {
        text: "La ___ serveix per portar els llibres.",
        blank: "motxilla",
        options: ["motxilla", "tisores", "maquineta"],
      },
      {
        text: "El ___ serveix per pintar a la pissarra.",
        blank: "guix",
        options: ["guix", "llapis", "estoig"],
      },
      {
        text: "L'___ serveix per guardar els llapis.",
        blank: "estoig",
        options: ["estoig", "carpeta", "goma"],
      },
    ],
  },

  // Exercise 15: Col·loca cada paraula al seu lloc
  {
    id: "la-classe-15",
    type: "label-image",
    prompt: "Col·loca cada paraula al seu lloc.",
    image: "classroom",
    labels: [
      { text: "llapis", x: 15, y: 20 },
      { text: "goma", x: 65, y: 20 },
      { text: "tisores", x: 15, y: 55 },
      { text: "estoig", x: 65, y: 55 },
      { text: "motxilla", x: 15, y: 85 },
      { text: "llibre", x: 65, y: 85 },
    ],
    options: [
      "llapis",
      "goma",
      "tisores",
      "estoig",
      "motxilla",
      "llibre",
      "regle",
      "carpeta",
    ],
  },

  // Exercise 16: Autoavaluació
  {
    id: "la-classe-16",
    type: "self-assessment",
    prompt: "Autoavaluació: revisa el vocabulari de la classe.",
    items: [
      { catalan: "llapis", translation: "olovka" },
      { catalan: "goma", translation: "gumica" },
      { catalan: "bolígraf", translation: "hemijska" },
      { catalan: "retolador", translation: "flomaster" },
      { catalan: "llibreta", translation: "sveska" },
      { catalan: "llibre", translation: "knjiga" },
      { catalan: "carpeta", translation: "fascikla" },
      { catalan: "estoig", translation: "pernica" },
      { catalan: "maquineta", translation: "rezač" },
      { catalan: "regle", translation: "lenjir" },
      { catalan: "motxilla", translation: "ranac" },
      { catalan: "tisores", translation: "makaze" },
      { catalan: "pissarra", translation: "tabla" },
      { catalan: "guix", translation: "kreda" },
      { catalan: "borrador", translation: "brisač table" },
      { catalan: "paperera", translation: "korpa za smeće" },
      { catalan: "ordinador", translation: "kompjuter" },
      { catalan: "taula", translation: "sto" },
      { catalan: "cadira", translation: "stolica" },
      { catalan: "porta", translation: "vrata" },
      { catalan: "finestra", translation: "prozor" },
    ],
  },

  // Exercise 17: Dibuixa la teva classe
  {
    id: "la-classe-17",
    type: "drawing-canvas",
    prompt: "Dibuixa la teva classe.",
  },

  // === EXTRA TASKS (not in workbook) ===

  // Exercise 18: fill-sentence (general)
  {
    id: "la-classe-18",
    type: "fill-sentence",
    prompt: "Completa les frases amb la paraula correcta.",
    sentences: [
      {
        text: "Per escriure faig servir el ___.",
        blank: "llapis",
        options: ["llapis", "tisores", "motxilla"],
      },
      {
        text: "Per esborrar faig servir la ___.",
        blank: "goma",
        options: ["goma", "carpeta", "pissarra"],
      },
      {
        text: "Per tallar paper faig servir les ___.",
        blank: "tisores",
        options: ["tisores", "llibretes", "cadires"],
      },
      {
        text: "Per portar els llibres faig servir la ___.",
        blank: "motxilla",
        options: ["motxilla", "paperera", "finestra"],
      },
    ],
  },

  // Exercise 19: multiple-choice
  {
    id: "la-classe-19",
    type: "multiple-choice",
    prompt: "Tria la resposta correcta.",
    questions: [
      {
        question: "Què fem servir per escriure a la pissarra?",
        options: ["llapis", "bolígraf", "guix", "retolador"],
        correct: 2,
      },
      {
        question: "On llencem el paper?",
        options: ["motxilla", "paperera", "estoig", "carpeta"],
        correct: 1,
      },
      {
        question: "Què fem servir per mesurar?",
        options: ["goma", "tisores", "maquineta", "regle"],
        correct: 3,
      },
      {
        question: "On guardem els llapis i bolígrafs?",
        options: ["estoig", "pissarra", "cadira", "porta"],
        correct: 0,
      },
      {
        question: "Què fem servir per fer punta al llapis?",
        options: ["borrador", "guix", "maquineta", "regle"],
        correct: 2,
      },
    ],
  },

  // Exercise 20: classify-columns Coses grans vs Coses petites
  {
    id: "la-classe-20",
    type: "classify-columns",
    prompt: "Classifica: coses grans o coses petites de la classe.",
    columns: [
      {
        title: "Coses grans",
        items: [
          "pissarra",
          "ordinador",
          "taula",
          "cadira",
          "porta",
          "finestra",
          "paperera",
        ],
      },
      {
        title: "Coses petites",
        items: [
          "llapis",
          "goma",
          "bolígraf",
          "estoig",
          "maquineta",
          "regle",
          "guix",
        ],
      },
    ],
    allItems: [
      "pissarra",
      "ordinador",
      "taula",
      "cadira",
      "porta",
      "finestra",
      "paperera",
      "llapis",
      "goma",
      "bolígraf",
      "estoig",
      "maquineta",
      "regle",
      "guix",
    ],
  },
];
