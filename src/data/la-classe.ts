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

  // Exercise 9: Què fan? Completa (workbook: kids doing activities)
  {
    id: "la-classe-9",
    type: "fill-sentence",
    prompt: "Què fan? Completa les frases.",
    sentences: [
      {
        text: "La Sara ___.",
        blank: "canta",
        options: ["canta", "dibuixa", "pinta"],
      },
      {
        text: "En Marc ___.",
        blank: "escriu",
        options: ["pinta", "escriu", "retalla"],
      },
      {
        text: "En Toni ___.",
        blank: "dibuixa",
        options: ["dibuixa", "canta", "escriu"],
      },
      {
        text: "En Carles ___.",
        blank: "pinta",
        options: ["retalla", "canta", "pinta"],
      },
    ],
  },

  // Exercise 10: Relaciona (workbook: match item to function)
  {
    id: "la-classe-10",
    type: "matching",
    prompt: "Relaciona cada objecte amb la seva funció.",
    pairs: [
      { left: "tisores", right: "retallar" },
      { left: "llapis", right: "escriure" },
      { left: "cola de barra", right: "enganxar" },
      { left: "llapis de colors", right: "pintar" },
      { left: "goma", right: "esborrar" },
    ],
  },

  // Exercise 11: Encercla les paraules que siguin objectes de classe
  {
    id: "la-classe-11",
    type: "classify-columns",
    prompt: "Classifica: quines paraules són objectes de classe?",
    columns: [
      {
        title: "Objectes de classe",
        items: [
          "retolador",
          "tisores",
          "ordinador",
          "motxilla",
          "taula",
          "borrador",
          "guix",
          "goma",
          "estoig",
        ],
      },
      {
        title: "No són de classe",
        items: [
          "cuina",
          "pare",
          "gat",
          "guitarra",
          "anell",
          "bicicleta",
        ],
      },
    ],
    allItems: [
      "retolador",
      "cuina",
      "tisores",
      "pare",
      "ordinador",
      "gat",
      "guitarra",
      "motxilla",
      "anell",
      "taula",
      "borrador",
      "bicicleta",
      "guix",
      "goma",
      "estoig",
    ],
  },

  // Exercise 12: Afegeix l'article (workbook: add un/una)
  {
    id: "la-classe-12",
    type: "add-article",
    prompt: "Afegeix l'article: un o una.",
    words: [
      { word: "maquineta", article: "una" },
      { word: "pissarra", article: "una" },
      { word: "borrador", article: "un" },
      { word: "llibreta", article: "una" },
      { word: "regle", article: "un" },
      { word: "dibuix", article: "un" },
    ],
  },

  // Exercise 13: Escriu i pinta (workbook: write name of BW objects)
  {
    id: "la-classe-13",
    type: "copy-word",
    prompt: "Escriu el nom de cada objecte.",
    words: [
      { catalan: "llapis" },
      { catalan: "llibre" },
      { catalan: "porta" },
      { catalan: "finestra" },
      { catalan: "motxilla" },
      { catalan: "estoig" },
    ],
  },

  // Exercise 14: Completa (workbook: fill sentences about classroom activities)
  {
    id: "la-classe-14",
    type: "fill-sentence",
    prompt: "Completa les frases.",
    sentences: [
      {
        text: "Jo retallo amb les ___.",
        blank: "tisores",
        options: ["tisores", "gomes", "regles"],
      },
      {
        text: "Jo escric amb el ___.",
        blank: "llapis",
        options: ["llapis", "borrador", "estoig"],
      },
      {
        text: "Jo esborro amb la ___.",
        blank: "goma",
        options: ["goma", "maquineta", "carpeta"],
      },
      {
        text: "Jo dibuixo amb els ___.",
        blank: "retoladors",
        options: ["retoladors", "llibres", "guixos"],
      },
      {
        text: "Nosaltres dibuixem a la ___.",
        blank: "llibreta",
        options: ["llibreta", "pissarra", "motxilla"],
      },
      {
        text: "Vosaltres pinteu amb les ___.",
        blank: "pintures",
        options: ["pintures", "tisores", "gomes"],
      },
    ],
  },

  // Exercise 15: Separa i copia (workbook: separate joined words)
  {
    id: "la-classe-15",
    type: "separate-words",
    prompt: "Separa les paraules i copia la frase.",
    items: [
      {
        joined: "Joescricambelmeuflapis",
        words: ["Jo", "escric", "amb", "el", "meu", "llapis"],
      },
      {
        joined: "Elstresonescriuenalallibreta",
        words: ["Els", "tres", "on", "escriuen", "a", "la", "llibreta"],
      },
      {
        joined: "Elllapisésdecolorgroc",
        words: ["El", "llapis", "és", "de", "color", "groc"],
      },
    ],
  },

  // Exercise 16: Observa i escriu (workbook: count objects and write number)
  {
    id: "la-classe-16",
    type: "count-and-write",
    prompt: "Compta els objectes i escriu el número.",
    items: [
      { description: "llapis", count: 3, word: "tres" },
      { description: "goma", count: 2, word: "dues" },
      { description: "llibre", count: 4, word: "quatre" },
      { description: "ordinador", count: 1, word: "un" },
      { description: "regle", count: 5, word: "cinc" },
      { description: "retolador", count: 6, word: "sis" },
      { description: "tisores", count: 7, word: "set" },
      { description: "estoig", count: 8, word: "vuit" },
    ],
  },

  // Exercise 17: Dibuixa la teva classe (workbook task 17)
  {
    id: "la-classe-17",
    type: "drawing-canvas",
    prompt: "Dibuixa la teva classe.",
  },

  // Exercise 18: Autoavaluació (workbook: self-assessment with traffic lights)
  {
    id: "la-classe-18",
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
];
