import { Task } from "@/types/tasks";

export const elsAnimalsTasks: Task[] = [
  // === Workbook Ex. 1: Llegeix i copia LES AUS (9 birds) ===
  {
    id: "els-animals-1",
    type: "copy-word",
    prompt: "Llegeix i copia les aus:",
    words: [
      { catalan: "gallina", image: "gallina" },
      { catalan: "gall", image: "gall" },
      { catalan: "pollet", image: "pollet" },
      { catalan: "oreneta", image: "oreneta" },
      { catalan: "cigonya", image: "cigonya" },
      { catalan: "gavina", image: "gavina" },
      { catalan: "pingüí", image: "pingui" },
      { catalan: "estruç", image: "estruc" },
      { catalan: "mussol", image: "mussol" },
    ],
  },

  // === Workbook Ex. 2: Parts de l'au + completa ===
  {
    id: "els-animals-2",
    type: "fill-sentence",
    prompt: "Completa les frases sobre les aus:",
    sentences: [
      {
        text: "Les aus tenen el cos cobert de ___.",
        blank: "plomes",
        options: ["escates", "plomes", "pel"],
      },
      {
        text: "Neixen dels ___.",
        blank: "ous",
        options: ["arbres", "rius", "ous"],
      },
      {
        text: "Tenen ___ per poder volar.",
        blank: "ales",
        options: ["potes", "ales", "cua"],
      },
      {
        text: "Tenen ___ potes.",
        blank: "dues",
        options: ["quatre", "sis", "dues"],
      },
      {
        text: "Nosaltres tenim boca i les aus tenen ___.",
        blank: "bec",
        options: ["bec", "nas", "orelles"],
      },
    ],
  },

  // === Workbook Ex. 3: Llegeix i copia ELS INSECTES (6) ===
  {
    id: "els-animals-3",
    type: "copy-word",
    prompt: "Llegeix i copia els insectes:",
    words: [
      { catalan: "mosca", image: "mosca" },
      { catalan: "formiga", image: "formiga" },
      { catalan: "abella", image: "abella" },
      { catalan: "escarabat", image: "escarabat" },
      { catalan: "papallona", image: "papallona" },
      { catalan: "mosquit", image: "mosquit" },
    ],
  },

  // === Workbook Ex. 4: Llegeix i copia ELS PEIXOS (6) ===
  {
    id: "els-animals-4",
    type: "copy-word",
    prompt: "Llegeix i copia els peixos:",
    words: [
      { catalan: "sardina", image: "sardina" },
      { catalan: "tauró", image: "tauro" },
      { catalan: "tonyina", image: "tonyina" },
      { catalan: "peix espasa", image: "peix-espasa" },
      { catalan: "salmó", image: "salmo" },
      { catalan: "bacallà", image: "bacalla" },
    ],
  },

  // === Workbook Ex. 5: Llegeix i copia ELS REPTILS (3) ===
  {
    id: "els-animals-5",
    type: "copy-word",
    prompt: "Llegeix i copia els rèptils:",
    words: [
      { catalan: "serp", image: "serp" },
      { catalan: "tortuga", image: "tortuga" },
      { catalan: "cocodril", image: "cocodril" },
    ],
  },

  // === Workbook Ex. 6: Escriu dos exemples de cada ===
  {
    id: "els-animals-6",
    type: "classify-columns",
    prompt: "Classifica cada animal a la seva categoria:",
    columns: [
      {
        title: "Au",
        items: ["gallina", "mussol", "oreneta", "gavina"],
      },
      {
        title: "Insecte",
        items: ["mosca", "formiga", "abella", "papallona"],
      },
      {
        title: "Peix",
        items: ["sardina", "tauró", "tonyina", "salmó"],
      },
      {
        title: "Rèptil",
        items: ["serp", "tortuga", "cocodril"],
      },
    ],
    allItems: [
      "gallina",
      "mussol",
      "oreneta",
      "gavina",
      "mosca",
      "formiga",
      "abella",
      "papallona",
      "sardina",
      "tauró",
      "tonyina",
      "salmó",
      "serp",
      "tortuga",
      "cocodril",
    ],
  },

  // === Workbook Ex. 8: Observa ELS MAMÍFERS (18) ===
  {
    id: "els-animals-8",
    type: "copy-word",
    prompt: "Llegeix i copia els mamífers:",
    words: [
      { catalan: "gos", image: "gos" },
      { catalan: "gat", image: "gat" },
      { catalan: "conill", image: "conill" },
      { catalan: "cavall", image: "cavall" },
      { catalan: "porc", image: "porc" },
      { catalan: "vaca", image: "vaca" },
      { catalan: "ratolí", image: "ratoli" },
      { catalan: "ovella", image: "ovella" },
      { catalan: "hipopòtam", image: "hipopotam" },
      { catalan: "goril·la", image: "gorila" },
      { catalan: "zebra", image: "zebra" },
      { catalan: "ós", image: "os" },
      { catalan: "lleó", image: "lleo" },
      { catalan: "camell", image: "camell" },
      { catalan: "elefant", image: "elefant" },
      { catalan: "tigre", image: "tigre" },
      { catalan: "llop", image: "llop" },
      { catalan: "guineu", image: "guineu" },
    ],
  },

  // === Workbook Ex. 9: Relaciona (match animals to categories) ===
  {
    id: "els-animals-9",
    type: "matching",
    prompt: "Relaciona cada animal amb la seva categoria:",
    rightTextOnly: true,
    pairs: [
      { left: "gat", right: "mamífer" },
      { left: "sardina", right: "peix" },
      { left: "oreneta", right: "au" },
      { left: "serp", right: "rèptil" },
      { left: "papallona", right: "insecte" },
    ],
  },

  // === Workbook Ex. 10: Classifica UN / UNA ===
  {
    id: "els-animals-10",
    type: "classify-columns",
    prompt: "Classifica: UN o UNA?",
    columns: [
      {
        title: "UN",
        items: ["gos", "gat", "lleó", "dofí", "cavall", "elefant"],
      },
      {
        title: "UNA",
        items: ["vaca", "zebra", "ovella", "guineu", "serp", "tortuga"],
      },
    ],
    allItems: [
      "gos",
      "gat",
      "lleó",
      "dofí",
      "cavall",
      "elefant",
      "vaca",
      "zebra",
      "ovella",
      "guineu",
      "serp",
      "tortuga",
    ],
    circleMode: true,
  },

  // === Workbook Ex. 11: Sopa de lletres (8 mamífers) ===
  {
    id: "els-animals-11",
    type: "word-search",
    prompt: "Busca 8 mamífers a la sopa de lletres. Poden anar →\u00A0←\u00A0↓\u00A0↑\u00A0↗",
    gridSize: 10,
    words: ["gos", "gat", "lleo", "vaca", "ovella", "porc", "os", "tigre"],
    grid: [
      ["t", "i", "g", "r", "e", "v", "a", "c", "a", "n"],
      ["j", "r", "h", "m", "e", "w", "z", "f", "j", "y"],
      ["g", "a", "t", "l", "l", "e", "o", "h", "c", "b"],
      ["i", "s", "u", "r", "z", "m", "t", "e", "n", "d"],
      ["k", "w", "o", "v", "e", "l", "l", "a", "e", "g"],
      ["a", "l", "v", "h", "f", "p", "k", "g", "j", "s"],
      ["p", "o", "r", "c", "a", "r", "i", "a", "o", "a"],
      ["g", "o", "s", "b", "h", "k", "s", "c", "e", "e"],
      ["e", "n", "b", "e", "q", "d", "a", "u", "o", "w"],
      ["z", "m", "a", "f", "n", "x", "p", "r", "s", "c"],
    ],
  },

  // === Workbook Ex. 12: Pinta cada animal d'un color diferent (aprèn tots els colors) ===
  {
    id: "els-animals-12",
    type: "color-by-instruction",
    prompt: "Pinta cada animal del color que et diu:",
    image: "animals",
    instructions: [
      { text: "Pinta el lleó de color groc", targetColor: "groc", targetItem: "lleó" },
      { text: "Pinta la gavina de color blau", targetColor: "blau", targetItem: "gavina" },
      { text: "Pinta el cocodril de color verd", targetColor: "verd", targetItem: "cocodril" },
      { text: "Pinta el ratolí de color marró", targetColor: "marró", targetItem: "ratolí" },
      { text: "Pinta el tauró de color negre", targetColor: "negre", targetItem: "tauró" },
      { text: "Pinta la serp de color taronja", targetColor: "taronja", targetItem: "serp" },
      { text: "Pinta el conill de color rosa", targetColor: "rosa", targetItem: "conill" },
      { text: "Pinta la vaca de color vermell", targetColor: "vermell", targetItem: "vaca" },
      { text: "Pinta la tortuga de color lila", targetColor: "lila", targetItem: "tortuga" },
    ],
  },

  // === Workbook Ex. 13: Les parts de l'au (quiz per funció) ===
  {
    id: "els-animals-13",
    type: "multiple-choice",
    prompt: "Les parts de l'au. Tria la resposta correcta:",
    questions: [
      {
        question: "Amb què vola l'au?",
        options: ["potes", "ales", "bec", "cua"],
        correct: 1,
      },
      {
        question: "Amb què menja l'au?",
        options: ["cua", "plomes", "potes", "bec"],
        correct: 3,
      },
      {
        question: "De què està cobert el cos de l'au?",
        options: ["escates", "pèl", "plomes", "ales"],
        correct: 2,
      },
      {
        question: "Amb què camina l'au per terra?",
        options: ["potes", "ales", "bec", "cua"],
        correct: 0,
      },
      {
        question: "Què té l'au al darrere per dirigir el vol?",
        options: ["bec", "plomes", "potes", "cua"],
        correct: 3,
      },
    ],
  },

  // === Workbook Ex. 14: FEMENÍ / MASCULÍ (gender pairs) ===
  {
    id: "els-animals-14",
    type: "matching",
    prompt: "Relaciona el masculí amb el femení:",
    pairs: [
      { left: "gos", right: "gossa" },
      { left: "lleó", right: "lleona" },
      { left: "gat", right: "gata" },
      { left: "ós", right: "óssa" },
      { left: "conill", right: "conilla" },
      { left: "gall", right: "gallina" },
      { left: "tigre", right: "tigressa" },
      { left: "elefant", right: "elefanta" },
    ],
  },

  // === Workbook Ex. 15: Què fan? Completa (neda, vola, camina, s'arrossega) ===
  {
    id: "els-animals-15",
    type: "fill-sentence",
    prompt: "Què fan els animals? Completa:",
    sentences: [
      {
        text: "El tauró ___.",
        blank: "neda",
        options: ["vola", "neda", "camina", "s'arrossega"],
      },
      {
        text: "El mussol ___.",
        blank: "vola",
        options: ["neda", "camina", "vola", "s'arrossega"],
      },
      {
        text: "El gos ___.",
        blank: "camina",
        options: ["vola", "neda", "camina", "s'arrossega"],
      },
      {
        text: "La serp ___.",
        blank: "s'arrossega",
        options: ["neda", "vola", "camina", "s'arrossega"],
      },
      {
        text: "L'elefant ___.",
        blank: "camina",
        options: ["s'arrossega", "vola", "camina", "neda"],
      },
      {
        text: "La sardina ___.",
        blank: "neda",
        options: ["camina", "s'arrossega", "neda", "vola"],
      },
    ],
  },

  // === Workbook Ex. 16: Explica com és cada animal (interactive version) ===
  {
    id: "els-animals-16",
    type: "multiple-choice",
    prompt: "Tria la descripció correcta:",
    questions: [
      {
        question: "Com és l'ós?",
        image: "os",
        options: [
          "Gran, mamífer, cobert de pel, viu al bosc",
          "Petit, insecte, té ales, viu a les flors",
          "Llarg, rèptil, s'arrossega, viu al riu",
          "Petit, peix, neda, viu al mar",
        ],
        correct: 0,
      },
      {
        question: "Com és el cavall?",
        image: "cavall",
        options: [
          "Petit, té escates, neda al mar",
          "Gran, mamífer, cobert de pel, camina",
          "Petit, insecte, vola, té 6 potes",
          "Gran, rèptil, s'arrossega",
        ],
        correct: 1,
      },
      {
        question: "Com és la papallona?",
        image: "papallona",
        options: [
          "Gran, mamífer, camina",
          "Petit, rèptil, s'arrossega",
          "Petit, insecte, vola, té ales de colors",
          "Gran, au, neda",
        ],
        correct: 2,
      },
      {
        question: "Com és el tauró?",
        image: "tauro",
        options: [
          "Petit, insecte, vola",
          "Gran, au, camina",
          "Petit, rèptil, s'arrossega",
          "Gran, peix, neda, perillos, viu al mar",
        ],
        correct: 3,
      },
    ],
  },

  // === Workbook Ex. 17: Completa l'oració (versió fàcil de "ordena les paraules") ===
  {
    id: "els-animals-17",
    type: "fill-sentence",
    prompt: "Completa les oracions sobre els animals:",
    sentences: [
      {
        text: "La serp menja rates i ___.",
        blank: "conills",
        options: ["conills", "flors", "arbres"],
      },
      {
        text: "Tinc dos gossos de color ___.",
        blank: "negre",
        options: ["negre", "blau", "verd"],
      },
      {
        text: "L'elefant és un animal molt ___.",
        blank: "gran",
        options: ["gran", "petit", "alt"],
      },
    ],
  },

  // === Workbook Ex. 18: Mira la serp i respon (versió fàcil i visual) ===
  {
    id: "els-animals-18",
    type: "multiple-choice",
    prompt: "Mira la serp i respon:",
    image: "serp",
    questions: [
      {
        question: "La serp té potes?",
        options: ["Sí", "No"],
        correct: 1,
      },
      {
        question: "Com es mou la serp?",
        options: ["vola", "neda", "s'arrossega"],
        correct: 2,
      },
      {
        question: "La serp és un...",
        options: ["au", "rèptil", "peix"],
        correct: 1,
      },
    ],
  },

  // === Workbook Ex. 19: Endevina quin animal és (riddles) ===
  {
    id: "els-animals-19",
    type: "fill-sentence",
    prompt: "Endevina quin animal és:",
    sentences: [
      {
        text: "Mamífer amb orelles grans i una gran trompa: ___.",
        blank: "elefant",
        options: ["lleó", "elefant", "gos"],
      },
      {
        text: "Rèptil perillos, amb moltes dents, de color verd: ___.",
        blank: "cocodril",
        options: ["tortuga", "serp", "cocodril"],
      },
      {
        text: "Rèptil verinós, llarg, que s'arrossega: ___.",
        blank: "serp",
        options: ["cocodril", "serp", "tortuga"],
      },
      {
        text: "Viu a la selva, taronja i negre, sembla un gat gran: ___.",
        blank: "tigre",
        options: ["lleó", "gat", "tigre"],
      },
    ],
  },

  // === Fill-letters for key vocabulary ===
  {
    id: "els-animals-20",
    type: "fill-letters",
    prompt: "Completa les lletres que falten:",
    words: [
      { word: "gallina", hint: "g_ll_na", image: "gallina" },
      { word: "oreneta", hint: "o_en_ta", image: "oreneta" },
      { word: "papallona", hint: "p_p_ll_na", image: "papallona" },
      { word: "cocodril", hint: "c_c_dr_l", image: "cocodril" },
      { word: "elefant", hint: "e_ef_nt", image: "elefant" },
      { word: "hipopòtam", hint: "h_p_p_tam", image: "hipopotam" },
      { word: "tortuga", hint: "t_rt_ga", image: "tortuga" },
      { word: "peix", hint: "p_ix", image: "peix" },
    ],
  },

  // === AUTOAVALUACIÓ ===
  {
    id: "els-animals-21",
    type: "self-assessment",
    prompt: "Saps dir aquestes paraules en català?",
    items: [
      { catalan: "gos", translation: "pas", image: "gos" },
      { catalan: "gat", translation: "mačka", image: "gat" },
      { catalan: "gallina", translation: "kokoška", image: "gallina" },
      { catalan: "serp", translation: "zmija", image: "serp" },
      { catalan: "tortuga", translation: "kornjača", image: "tortuga" },
      { catalan: "papallona", translation: "leptir", image: "papallona" },
      { catalan: "peix", translation: "riba", image: "peix" },
      { catalan: "lleó", translation: "lav", image: "lleo" },
      { catalan: "elefant", translation: "slon", image: "elefant" },
      { catalan: "tigre", translation: "tigar", image: "tigre" },
    ],
  },

  // Bonus activity: Fun drawing
  {
    id: "els-animals-bonus",
    type: "drawing-canvas",
    prompt: "Activitat extra! Diverteix-te, activa la creativitat i dibuixa alguna cosa màgica!",
    bonus: true,
  },
];
