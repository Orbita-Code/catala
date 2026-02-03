import { Task } from "@/types/tasks";

export const lesBotiguesTasks: Task[] = [
  // === Workbook Ex. 1: Llegeix i copia les botigues ===
  {
    id: "les-botigues-1",
    type: "copy-word",
    prompt: "Llegeix i copia les botigues:",
    words: [
      { catalan: "fruiteria" },
      { catalan: "verduleria" },
      { catalan: "peixeteria" },
      { catalan: "carnisseria" },
      { catalan: "fleca" },
      { catalan: "farmàcia" },
    ],
  },

  // === Workbook Ex. 2: Completa (fill sentences about shops) ===
  {
    id: "les-botigues-2",
    type: "fill-sentence",
    prompt: "Completa la frase:",
    sentences: [
      {
        text: "Compro peix a la ___.",
        blank: "peixeteria",
        options: ["peixeteria", "carnisseria", "fleca"],
      },
      {
        text: "Compro pa a la ___.",
        blank: "fleca",
        options: ["fleca", "fruiteria", "farmàcia"],
      },
      {
        text: "Compro fruita a la ___.",
        blank: "fruiteria",
        options: ["fruiteria", "peixeteria", "carnisseria"],
      },
      {
        text: "Compro medicaments a la ___.",
        blank: "farmàcia",
        options: ["farmàcia", "fleca", "fruiteria"],
      },
      {
        text: "Compro carn a la ___.",
        blank: "carnisseria",
        options: ["carnisseria", "farmàcia", "peixeteria"],
      },
    ],
  },

  // === Workbook Ex. 3: Separa i copia les oracions ===
  {
    id: "les-botigues-3",
    type: "separate-words",
    prompt: "Separa i copia les oracions:",
    items: [
      {
        joined: "Comprofruitaalafruiteria.",
        words: ["Compro", "fruita", "a", "la", "fruiteria."],
      },
      {
        joined: "Lapeixeteriavenpeix.",
        words: ["La", "peixeteria", "ven", "peix."],
      },
      {
        joined: "Compropaalafleca.",
        words: ["Compro", "pa", "a", "la", "fleca."],
      },
      {
        joined: "Lafarmàciavenmedicaments.",
        words: ["La", "farmàcia", "ven", "medicaments."],
      },
      {
        joined: "Lacarnisseriavencarn.",
        words: ["La", "carnisseria", "ven", "carn."],
      },
    ],
  },

  // === Workbook Ex. 4a: Observa les fruites (9) ===
  {
    id: "les-botigues-4",
    type: "copy-word",
    prompt: "Llegeix i copia les fruites:",
    words: [
      { catalan: "poma" },
      { catalan: "pera" },
      { catalan: "plàtan" },
      { catalan: "taronja" },
      { catalan: "maduixa" },
      { catalan: "cirera" },
      { catalan: "préssec" },
      { catalan: "meló" },
      { catalan: "síndria" },
    ],
  },

  // === Workbook Ex. 4b: Observa les verdures (9) ===
  {
    id: "les-botigues-5",
    type: "copy-word",
    prompt: "Llegeix i copia les verdures:",
    words: [
      { catalan: "ceba" },
      { catalan: "enciam" },
      { catalan: "pastanaga" },
      { catalan: "patata" },
      { catalan: "pebrot" },
      { catalan: "tomàquet" },
      { catalan: "mongetes" },
    ],
  },

  // === Workbook Ex. 5: Completa (fill-letters for fruits) ===
  {
    id: "les-botigues-6",
    type: "fill-letters",
    prompt: "Completa les lletres que falten:",
    words: [
      { word: "meló", hint: "m_l_" },
      { word: "préssec", hint: "pr_ss_c" },
      { word: "poma", hint: "p_m_" },
      { word: "síndria", hint: "s_ndr_a" },
      { word: "taronja", hint: "t_r_nj_" },
      { word: "plàtan", hint: "pl_t_n" },
      { word: "cirera", hint: "c_r_ra" },
      { word: "pera", hint: "p_r_" },
      { word: "maduixa", hint: "m_du_x_" },
    ],
  },

  // === Workbook Ex. 5b: Llegeix i pinta les verdures ===
  {
    id: "les-botigues-7",
    type: "color-by-instruction",
    prompt: "Pinta les verdures del color correcte:",
    image: "verdures",
    instructions: [
      { text: "Pinta la ceba de color groc", targetColor: "groc", targetItem: "ceba" },
      { text: "Pinta l'enciam de color verd", targetColor: "verd", targetItem: "enciam" },
      { text: "Pinta la pastanaga de color taronja", targetColor: "taronja", targetItem: "pastanaga" },
      { text: "Pinta la patata de color marró", targetColor: "marró", targetItem: "patata" },
      { text: "Pinta el pebrot de color vermell", targetColor: "vermell", targetItem: "pebrot" },
      { text: "Pinta el tomàquet de color vermell", targetColor: "vermell", targetItem: "tomàquet" },
      { text: "Pinta les mongetes de color verd", targetColor: "verd", targetItem: "mongetes" },
    ],
  },

  // === Workbook Ex. 6: Completa (fill sentences with vegetables) ===
  {
    id: "les-botigues-8",
    type: "fill-sentence",
    prompt: "Completa amb el nom de la verdura:",
    sentences: [
      {
        text: "La ___ és de color taronja.",
        blank: "pastanaga",
        options: ["pastanaga", "ceba", "pebrot"],
      },
      {
        text: "El ___ és de color vermell.",
        blank: "tomàquet",
        options: ["tomàquet", "enciam", "patata"],
      },
      {
        text: "L'___ és verd i el mengem a l'amanida.",
        blank: "enciam",
        options: ["enciam", "pebrot", "ceba"],
      },
      {
        text: "La ___ fa plorar quan la tallem.",
        blank: "ceba",
        options: ["ceba", "patata", "pastanaga"],
      },
    ],
  },

  // === Workbook Ex. 7: Observa el peix (6) ===
  {
    id: "les-botigues-9",
    type: "copy-word",
    prompt: "Llegeix i copia el peix:",
    words: [
      { catalan: "sardina" },
      { catalan: "tonyina" },
      { catalan: "salmó" },
      { catalan: "calamar" },
      { catalan: "gamba" },
      { catalan: "musclo" },
    ],
  },

  // === Workbook Ex. 8: Completa singular/plural peix ===
  {
    id: "les-botigues-10",
    type: "matching",
    prompt: "Relaciona el singular amb el plural:",
    pairs: [
      { left: "sardina", right: "sardines" },
      { left: "tonyina", right: "tonyines" },
      { left: "salmó", right: "salmons" },
      { left: "calamar", right: "calamars" },
      { left: "gamba", right: "gambes" },
      { left: "musclo", right: "musclos" },
    ],
  },

  // === Workbook Ex. 9: Observa la carn (6) ===
  {
    id: "les-botigues-11",
    type: "copy-word",
    prompt: "Llegeix i copia la carn:",
    words: [
      { catalan: "pollastre" },
      { catalan: "salsitxa" },
      { catalan: "mandonguilla" },
      { catalan: "hamburguesa" },
      { catalan: "bistec" },
      { catalan: "cansalada" },
    ],
  },

  // === Workbook Ex. 10: Classifica EL / LA (carn) ===
  {
    id: "les-botigues-12",
    type: "classify-columns",
    prompt: "Classifica: EL o LA?",
    columns: [
      {
        title: "EL",
        items: ["pollastre", "bistec"],
      },
      {
        title: "LA",
        items: ["salsitxa", "mandonguilla", "hamburguesa", "cansalada"],
      },
    ],
    allItems: [
      "pollastre",
      "salsitxa",
      "mandonguilla",
      "hamburguesa",
      "bistec",
      "cansalada",
    ],
    circleMode: true,
  },

  // === Workbook Ex. 12: Observa productes de fleca (6) ===
  {
    id: "les-botigues-14",
    type: "copy-word",
    prompt: "Llegeix i copia els productes de la fleca:",
    words: [
      { catalan: "barra de pa" },
      { catalan: "pa rodó" },
      { catalan: "pa de motlle" },
      { catalan: "pastís" },
      { catalan: "croissant" },
      { catalan: "galeta" },
    ],
  },

  // === Workbook Ex. 13: Classifica en 4 botigues ===
  {
    id: "les-botigues-15",
    type: "classify-columns",
    prompt: "Classifica els productes a la seva botiga:",
    columns: [
      {
        title: "Peixeteria",
        items: ["sardina", "tonyina", "gamba", "musclo"],
      },
      {
        title: "Carnisseria",
        items: ["pollastre", "bistec", "salsitxa", "hamburguesa"],
      },
      {
        title: "Fleca",
        items: ["barra de pa", "croissant", "pastís", "galeta"],
      },
      {
        title: "Fruiteria",
        items: ["poma", "taronja", "pastanaga", "tomàquet"],
      },
    ],
    allItems: [
      "sardina",
      "tonyina",
      "gamba",
      "musclo",
      "pollastre",
      "bistec",
      "salsitxa",
      "hamburguesa",
      "barra de pa",
      "croissant",
      "pastís",
      "galeta",
      "poma",
      "taronja",
      "pastanaga",
      "tomàquet",
    ],
  },

  // === Workbook Ex. 14: Completa AHIR / AVUI / DEMÀ ===
  {
    id: "les-botigues-16",
    type: "fill-sentence",
    prompt: "Completa amb el verb correcte:",
    sentences: [
      {
        text: "Ahir ___ anar a la fruiteria.",
        blank: "vaig",
        options: ["vaig", "aniré", "vaig anar"],
      },
      {
        text: "Avui ___ a la fleca.",
        blank: "vaig",
        options: ["vaig", "aniré", "anava"],
      },
      {
        text: "Demà ___ a la peixeteria.",
        blank: "aniré",
        options: ["aniré", "vaig", "anava"],
      },
      {
        text: "Ahir ___ comprar sardines.",
        blank: "vaig",
        options: ["vaig", "compraré", "compro"],
      },
    ],
  },

  // === Workbook Ex. 15: Observa productes de farmàcia (6) ===
  {
    id: "les-botigues-17",
    type: "copy-word",
    prompt: "Llegeix i copia els productes de la farmàcia:",
    words: [
      { catalan: "tirita" },
      { catalan: "pastilla" },
      { catalan: "xeringa" },
      { catalan: "termòmetre" },
      { catalan: "cotó" },
      { catalan: "venda" },
    ],
  },

  // === Workbook Ex. 16: Separa oracions (farmàcia) ===
  {
    id: "les-botigues-18",
    type: "separate-words",
    prompt: "Separa i copia les oracions:",
    items: [
      {
        joined: "Eltermòmetremesurala temperatura.",
        words: ["El", "termòmetre", "mesura", "la", "temperatura."],
      },
      {
        joined: "Lainfermeraposaunatirita.",
        words: ["La", "infermera", "posa", "una", "tirita."],
      },
      {
        joined: "Prencculleresdexarop.",
        words: ["Prenc", "culleres", "de", "xarop."],
      },
      {
        joined: "Lavendaprotegeixlaferida.",
        words: ["La", "venda", "protegeix", "la", "ferida."],
      },
    ],
  },

  // === Workbook Ex. 17: Classifica productes per botiga ===
  {
    id: "les-botigues-19",
    type: "classify-columns",
    prompt: "Classifica: A quina botiga ho compres?",
    columns: [
      {
        title: "Farmàcia",
        items: ["tirita", "pastilla", "xeringa", "termòmetre", "venda"],
      },
      {
        title: "Fruiteria",
        items: ["poma", "pastanaga", "cirera", "pera", "tomàquet"],
      },
      {
        title: "Fleca",
        items: ["barra de pa", "croissant", "galeta", "pastís"],
      },
    ],
    allItems: [
      "tirita",
      "pastilla",
      "xeringa",
      "termòmetre",
      "venda",
      "poma",
      "pastanaga",
      "cirera",
      "pera",
      "tomàquet",
      "barra de pa",
      "croissant",
      "galeta",
      "pastís",
    ],
  },

  // === Workbook: AUTOAVALUACIÓ ===
  {
    id: "les-botigues-20",
    type: "self-assessment",
    prompt: "Saps dir aquestes paraules en català?",
    items: [
      { catalan: "fruiteria", translation: "voćara" },
      { catalan: "peixeteria", translation: "ribarnica" },
      { catalan: "carnisseria", translation: "mesara" },
      { catalan: "fleca", translation: "pekara" },
      { catalan: "farmàcia", translation: "apoteka" },
      { catalan: "sardina", translation: "sardina" },
      { catalan: "pollastre", translation: "piletina" },
      { catalan: "pastanaga", translation: "šargarepa" },
      { catalan: "tirita", translation: "flaster" },
      { catalan: "croissant", translation: "kroasan" },
    ],
  },

  // Bonus activity: Fun drawing
  {
    id: "les-botigues-bonus",
    type: "drawing-canvas",
    prompt: "Dibuixa una flor vermella!",
    bonus: true,
  },
];
