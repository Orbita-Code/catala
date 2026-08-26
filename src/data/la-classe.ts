import { Task } from "@/types/tasks";

export const laClasseTasks: Task[] = [

  // Exercise 1: Llegeix i copia
  // Podeljeno 03.08.2026: u svesci je ovo JEDAN zadatak od 21 reči, a to je
  // za dete od 5–8 godina predugačko — traka napretka se ne pomeri ni jednom
  // dok ne uradi svih 21. Nijedna reč nije izbačena, samo su spakovane u 3
  // koraka, redom kao u svesci.
  {
    id: "la-classe-1-1",
    type: "copy-word",
    prompt: "Llegeix i copia les paraules de la classe (1 de 3).",
    words: [
      { catalan: "llapis", image: "llapis" },
      { catalan: "goma", image: "goma" },
      { catalan: "bolígraf", image: "boligraf" },
      { catalan: "retolador", image: "retolador" },
      { catalan: "llibreta", image: "llibreta" },
      { catalan: "llibre", image: "llibre" },
      { catalan: "carpeta", image: "carpeta" },
    ],
  },

  // Exercise 2: Busca 10 paraules sopa de lletres
  {
    id: "la-classe-2",
    type: "word-search",
    prompt: "Busca 10 paraules a la sopa de lletres. Poden anar →\u00A0↓",
    gridSize: 10,
    words: ["tisores", "estoig", "llapis", "regle", "retolador", "goma", "motxilla", "bolígraf", "llibreta", "pissarra", "cadira", "porta", "finestra"],
    grid: [
      ["p", "k", "i", "t", "r", "e", "g", "l", "e", "c"],
      ["o", "b", "o", "l", "i", "g", "r", "a", "f", "a"],
      ["r", "a", "q", "e", "s", "t", "o", "i", "g", "d"],
      ["t", "i", "s", "o", "r", "e", "s", "v", "g", "i"],
      ["a", "r", "e", "t", "o", "l", "a", "d", "o", "r"],
      ["l", "l", "i", "b", "r", "e", "t", "a", "m", "a"],
      ["w", "p", "i", "s", "s", "a", "r", "r", "a", "l"],
      ["q", "y", "m", "o", "t", "x", "i", "l", "l", "a"],
      ["f", "f", "f", "i", "n", "e", "s", "t", "r", "a"],
      ["c", "b", "l", "l", "l", "a", "p", "i", "s", "f"],
    ],
  },
  {
    id: "la-classe-1-2",
    type: "copy-word",
    prompt: "Llegeix i copia les paraules de la classe (2 de 3).",
    words: [
      { catalan: "estoig", image: "estoig" },
      { catalan: "maquineta", image: "maquineta" },
      { catalan: "regle", image: "regle" },
      { catalan: "motxilla", image: "motxilla" },
      { catalan: "tisores", image: "tisores" },
      { catalan: "pissarra", image: "pissarra" },
      { catalan: "guix", image: "guix" },
    ],
  },

  // Exercise 3: Completa la paraula (all classroom items)
  // Podeljeno 03.08.2026: u svesci je ovo JEDAN zadatak od 21 reči, a to je
  // za dete od 5–8 godina predugačko — traka napretka se ne pomeri ni jednom
  // dok ne uradi svih 21. Nijedna reč nije izbačena, samo su spakovane u 3
  // koraka, redom kao u svesci.
  {
    id: "la-classe-3-1",
    type: "fill-letters",
    prompt: "Completa la paraula (1 de 3).",
    words: [
      { word: "llapis", hint: "l_a_i_", image: "llapis" },
      { word: "goma", hint: "g_m_", image: "goma" },
      { word: "llibre", hint: "ll_br_", image: "llibre" },
      { word: "bolígraf", hint: "bo_í_r_f", image: "boligraf" },
      { word: "llibreta", hint: "ll_br_t_", image: "llibreta" },
      { word: "retolador", hint: "r_tol_d_r", image: "retolador" },
      { word: "carpeta", hint: "c_rp_t_", image: "carpeta" },
    ],
  },
  {
    id: "la-classe-1-3",
    type: "copy-word",
    prompt: "Llegeix i copia les paraules de la classe (3 de 3).",
    words: [
      { catalan: "esborrador", image: "esborrador" },
      { catalan: "paperera", image: "paperera" },
      { catalan: "ordinador", image: "ordinador" },
      { catalan: "taula", image: "taula" },
      { catalan: "cadira", image: "cadira" },
      { catalan: "porta", image: "porta" },
      { catalan: "finestra", image: "finestra" },
    ],
  },
  {
    id: "la-classe-3-2",
    type: "fill-letters",
    prompt: "Completa la paraula (2 de 3).",
    words: [
      { word: "estoig", hint: "e_t_ig", image: "estoig" },
      { word: "maquineta", hint: "m_qu_n_ta", image: "maquineta" },
      { word: "regle", hint: "r_g_e", image: "regle" },
      { word: "motxilla", hint: "m_tx_l_a", image: "motxilla" },
      { word: "tisores", hint: "t_s_r_s", image: "tisores" },
      { word: "pissarra", hint: "p_ss_r_a", image: "pissarra" },
      { word: "guix", hint: "g_i_", image: "guix" },
    ],
  },

  // Exercise 4: Classifica gènere femení / masculí
  {
    id: "la-classe-4",
    type: "classify-columns",
    prompt: "Classifica les paraules: femení (una) o masculí (un).",
    circleMode: true,
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
  {
    id: "la-classe-3-3",
    type: "fill-letters",
    prompt: "Completa la paraula (3 de 3).",
    words: [
      { word: "esborrador", hint: "_sb_rr_d_r", image: "esborrador" },
      { word: "paperera", hint: "p_p_r_ra", image: "paperera" },
      { word: "ordinador", hint: "o_d_n_dor", image: "ordinador" },
      { word: "taula", hint: "t_u_a", image: "taula" },
      { word: "cadira", hint: "c_d_ra", image: "cadira" },
      { word: "porta", hint: "p_r_a", image: "porta" },
      { word: "finestra", hint: "f_n_stra", image: "finestra" },
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
      { left: "esborrador", right: "esborrador" },
      { left: "retolador", right: "retolador" },
      { left: "taula", right: "taula" },
    ],
  },

  // Exercise 6: Classifica UN vs MOLTS (workbook: two circles)
  {
    id: "la-classe-6",
    type: "classify-columns",
    prompt: "Classifica les paraules: UN (singular) o MOLTS (plural).",
    circleMode: true,
    columns: [
      {
        title: "Singular (un)",
        items: ["llapis", "goma", "llibre", "estoig", "regle"],
      },
      {
        title: "Plural (molts)",
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

  // Exercise 7: Pinta (workbook: color BW illustrations with correct color)
  {
    id: "la-classe-7",
    type: "color-by-instruction",
    prompt: "Pinta cada objecte del color indicat.",
    image: "classroom-items",
    instructions: [
      { text: "Pinta el llapis de color blau", targetColor: "blau", targetItem: "llapis" },
      { text: "Pinta la goma de color verd", targetColor: "verd", targetItem: "goma" },
      { text: "Pinta l'ordinador de color negre", targetColor: "negre", targetItem: "ordinador" },
      { text: "Pinta les tisores de color vermell", targetColor: "vermell", targetItem: "tisores" },
      { text: "Pinta la maquineta de color groc", targetColor: "groc", targetItem: "maquineta" },
      { text: "Pinta el llibre de color blanc", targetColor: "blanc", targetItem: "llibre" },
      { text: "Pinta la motxilla de color lila", targetColor: "lila", targetItem: "motxilla" },
      { text: "Pinta l'estoig de color verd", targetColor: "verd", targetItem: "estoig" },
      { text: "Pinta el regle de color taronja", targetColor: "taronja", targetItem: "regle" },
      { text: "Pinta el retolador de color marró", targetColor: "marró", targetItem: "retolador" },
      { text: "Pinta la carpeta de color rosa", targetColor: "rosa", targetItem: "carpeta" },
      { text: "Pinta la pissarra de color verd", targetColor: "verd", targetItem: "pissarra" },
    ],
  },

  // Exercise 8: Què tenim a l'estoig? Completa (workbook: pencil case illustration)
  {
    id: "la-classe-8",
    type: "fill-sentence",
    prompt: "Observa l'estoig i completa les frases.",
    image: "estoig-obert",
    sentences: [
      {
        text: "La maquineta és ___.",
        blank: "blava",
        options: ["vermella", "blava", "groga"],
      },
      {
        text: "El regle és ___.",
        blank: "groc",
        options: ["blau", "negre", "groc"],
      },
      {
        text: "El bolígraf és ___.",
        blank: "vermell",
        options: ["vermell", "verd", "groc"],
      },
      {
        text: "El pinzell és ___.",
        blank: "taronja",
        options: ["blau", "taronja", "lila"],
      },
      {
        text: "El clip és ___.",
        blank: "gris",
        options: ["negre", "blanc", "gris"],
      },
      {
        text: "La cola de barra és ___.",
        blank: "lila",
        options: ["lila", "vermella", "verda"],
        image: "cola-de-barra",
      },
      {
        text: "Les tisores són ___.",
        blank: "negres",
        options: ["grises", "negres", "blanques"],
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

  // Exercise 9: Què fan? Completa (workbook: kids doing activities)
  {
    id: "la-classe-9",
    type: "fill-sentence",
    prompt: "Què fan? Completa les frases.",
    columns: 2,
    sentences: [
      {
        text: "L'Ema ___.",
        blank: "dibuixa",
        options: ["canta", "dibuixa", "escriu"],
        image: "nena-dibuixa",
      },
      {
        text: "En Pau ___.",
        blank: "pinta",
        options: ["retalla", "canta", "pinta"],
        image: "nen-pinta",
      },
      {
        text: "La Júlia ___.",
        blank: "canta",
        options: ["dibuixa", "pinta", "canta"],
        image: "nena-canta",
      },
      {
        text: "En Hugo ___.",
        blank: "escriu",
        options: ["escriu", "pinta", "retalla"],
        image: "nen-escriu",
      },
      {
        text: "La Mia ___.",
        blank: "retalla",
        options: ["dibuixa", "retalla", "escriu"],
        image: "nena-retalla",
      },
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
          "pissarra",
          "motxilla",
          "taula",
          "esborrador",
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
          "televisió",
          "anell",
          "bicicleta",
          "collaret",
        ],
      },
    ],
    allItems: [
      "estoig",
      "cuina",
      "tisores",
      "gat",
      "pissarra",
      "televisió",
      "motxilla",
      "bicicleta",
      "taula",
      "anell",
      "esborrador",
      "collaret",
      "guix",
      "goma",
      "retolador",
      "pare",
    ],
  },

  // Exercise 12: Afegeix l'article determinat (el / la / l')
  // NAPOMENA: raniji komentar je glasio „workbook: add un/una" — to je pogrešno.
  // Vežba sa `un/una` iz sveske (str. „Classifica cada paraula segons el seu gènere")
  // već postoji kao la-classe-4. Ovaj zadatak uči ODREĐENE članove i dopuna je,
  // nije prepis iz sveske.
  // Prompt je ispravljen 30.07.2026: obećavao je „la, les, el o els", a među 8 reči
  // nema nijedne množine (4× la, 3× el, 1× l'), pa su `les` i `els` tražili nešto
  // čega nema, a `l'` — koji se stvarno bira — nije bio pomenut.
  {
    id: "la-classe-12",
    type: "add-article",
    prompt: "Afegeix l'article: el, la o l'.",
    words: [
      { word: "maquineta", article: "la" },
      { word: "goma", article: "la" },
      { word: "llapis", article: "el" },
      { word: "llibreta", article: "la" },
      { word: "guix", article: "el" },
      { word: "carpeta", article: "la" },
      { word: "ordinador", article: "l'" },
      { word: "retolador", article: "el" },
    ],
  },

  // Exercise 13: Escriu i pinta (workbook: write name of BW objects - classroom furniture)
  {
    id: "la-classe-13",
    type: "copy-word",
    prompt: "Escriu el nom dels mobles de la classe.",
    words: [
      { catalan: "cadira", image: "cadira" },
      { catalan: "taula", image: "taula" },
      { catalan: "porta", image: "porta" },
      { catalan: "finestra", image: "finestra" },
      { catalan: "pissarra", image: "pissarra" },
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
        options: ["gomes", "tisores", "regles"],
      },
      {
        text: "Jo escric amb el ___.",
        blank: "llapis",
        options: ["esborrador", "estoig", "llapis"],
      },
      {
        text: "Jo esborro amb la ___.",
        blank: "goma",
        options: ["goma", "maquineta", "carpeta"],
      },
      {
        text: "Jo dibuixo amb els ___.",
        blank: "retoladors",
        options: ["llibres", "retoladors", "guixos"],
      },
      {
        text: "Nosaltres dibuixem a la ___.",
        blank: "llibreta",
        options: ["carpeta", "motxilla", "llibreta"],
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
        joined: "Joescricambelmeullapis",
        words: ["Jo", "escric", "amb", "el", "meu", "llapis"],
      },
      {
        joined: "Elsnensescriuenalallibreta",
        words: ["Els", "nens", "escriuen", "a", "la", "llibreta"],
      },
      {
        joined: "Elllapisésdecolorgroc",
        words: ["El", "llapis", "és", "de", "color", "groc"],
      },
    ],
  },

  // Exercise 18: Autoavaluació (workbook: self-assessment with traffic lights)
  {
    id: "la-classe-18",
    type: "self-assessment",
    prompt: "Saps dir aquestes paraules en català? Toca el micròfon i digues la paraula.",
    items: [
      { catalan: "llapis", translation: "olovka", image: "llapis" },
      { catalan: "goma", translation: "gumica", image: "goma" },
      { catalan: "bolígraf", translation: "hemijska", image: "boligraf" },
      { catalan: "retolador", translation: "flomaster", image: "retolador" },
      { catalan: "llibreta", translation: "sveska", image: "llibreta" },
      { catalan: "llibre", translation: "knjiga", image: "llibre" },
      { catalan: "carpeta", translation: "fascikla", image: "carpeta" },
      { catalan: "estoig", translation: "pernica", image: "estoig" },
      { catalan: "maquineta", translation: "rezač", image: "maquineta" },
      { catalan: "regle", translation: "lenjir", image: "regle" },
      { catalan: "motxilla", translation: "ranac", image: "motxilla" },
      { catalan: "tisores", translation: "makaze", image: "tisores" },
      { catalan: "pissarra", translation: "tabla", image: "pissarra" },
      { catalan: "guix", translation: "kreda", image: "guix" },
      { catalan: "esborrador", translation: "brisač table", image: "esborrador" },
      { catalan: "paperera", translation: "korpa za smeće", image: "paperera" },
      { catalan: "ordinador", translation: "kompjuter", image: "ordinador" },
      { catalan: "taula", translation: "sto", image: "taula" },
      { catalan: "cadira", translation: "stolica", image: "cadira" },
      { catalan: "porta", translation: "vrata", image: "porta" },
      { catalan: "finestra", translation: "prozor", image: "finestra" },
    ],
  },


  // ── Slaganje reči iz dva dela (dodato 17.08.2026) ──
  // Vlasnica: „taj tip zadatka joj se svideo, stavi ga i u ostale teme."
  // Postojao je samo u temi 4. Sve reči su iz vokabulara OVE teme — ništa se
  // ne izmišlja, samo se već naučena reč seče na dva dela, po slogu.
  {
    id: "la-classe-slaganje",
    type: "matching",
    prompt: "Relaciona les dues parts per formar paraules:",
    joinParts: true,   // spaja delove jedne reči — izgovara se SPOJENA reč
    rightTextOnly: true,
    pairs: [
      { left: "LLA", right: "PIS" },
      { left: "TI", right: "SORES" },
      { left: "CA", right: "DIRA" },
      { left: "MOT", right: "XILLA" },
      { left: "FI", right: "NESTRA" },
      { left: "LLI", right: "BRE" },
    ],
  },

  // Bonus activity: Fun drawing
  {
    id: "la-classe-bonus",
    type: "drawing-canvas",
    prompt: "Activitat extra! Diverteix-te, activa la creativitat i dibuixa alguna cosa màgica!",
    bonus: true,
  },
];
