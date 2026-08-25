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
      { catalan: "flamenc", image: "flamenc" },
      { catalan: "cigonya", image: "cigonya" },
      { catalan: "gavina", image: "gavina" },
      { catalan: "pingüí", image: "pingui" },
      { catalan: "estruç", image: "estruc" },
      { catalan: "mussol", image: "mussol" },
      // DODATO 17.08.2026 — reč JE u svesci, slika je postojala, a reči nije bilo
      // u nijednom zadatku. Nađeno unakrsnim poređenjem sveska ↔ igrica ↔ slike.
      { catalan: "oreneta", image: "oreneta" },
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

  // === Workbook Ex. 6: Escriu dos exemples de cada ===
  {
    id: "els-animals-6",
    type: "classify-columns",
    prompt: "Classifica cada animal a la seva categoria:",
    columns: [
      {
        title: "Au",
        items: ["gallina", "oca", "flamenc", "ànec"],
      },
      {
        title: "Insecte",
        items: ["mosca", "formiga", "abella", "papallona"],
      },
      {
        title: "Peix",
        items: ["sardina", "tauró", "peix"],
      },
      {
        title: "Rèptil",
        items: ["serp", "tortuga", "granota"],
      },
    ],
    allItems: [
      "gallina",
      "oca",
      "flamenc",
      "ànec",
      "mosca",
      "formiga",
      "abella",
      "papallona",
      "sardina",
      "tauró",
      "peix",
      "serp",
      "tortuga",
      "granota",
    ],
  },

  // === Workbook Ex. 4: Llegeix i copia ELS PEIXOS (6) ===
  {
    id: "els-animals-4",
    type: "copy-word",
    prompt: "Llegeix i copia els peixos:",
    words: [
      { catalan: "peix", image: "peix" },
      { catalan: "tauró", image: "tauro" },
      { catalan: "sardina", image: "sardina" },
    ],
  },

  // === Domèstics vs Salvatges (dodato 24.07.2026) ===
  {
    id: "els-animals-6c",
    type: "classify-columns",
    prompt: "Classifica: animal domèstic o salvatge?",
    columns: [
      {
        title: "Domèstic",
        items: ["gos", "gat", "cavall", "gallina", "ànec", "vaca"],
      },
      {
        title: "Salvatge",
        items: ["lleó", "tigre", "elefant", "girafa", "ós", "mico"],
      },
    ],
    allItems: [
      "gos",
      "gat",
      "cavall",
      "gallina",
      "ànec",
      "vaca",
      "lleó",
      "tigre",
      "elefant",
      "girafa",
      "ós",
      "mico",
    ],
    circleMode: true,
  },

  // === Animals divertits (dodato 24.07.2026 — zabavne popularne životinje) ===
  {
    id: "els-animals-4b",
    type: "copy-word",
    prompt: "Llegeix i copia aquests animals:",
    words: [
      { catalan: "flamenc", image: "flamenc" },
      { catalan: "ànec", image: "anec" },
      { catalan: "oca", image: "oca" },
      { catalan: "granota", image: "granota" },
      { catalan: "unicorn", image: "unicorn" },
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
      // BEZ SLIKE namerno: „peix" je ovde KATEGORIJA, a levo već stoji
      // `sardina` — koja i sama jeste riba. Slika ribe uz kategoriju „riba"
      // ne uči ništa, a dete može da pomisli da je to druga životinja.
      { left: "sardina", right: "peix", rightNoImage: true },
      { left: "flamenc", right: "au" },
      { left: "serp", right: "rèptil" },
      { left: "papallona", right: "insecte" },
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

  // === Workbook Ex. 8: Observa ELS MAMÍFERS (18) ===
  // Podeljeno 03.08.2026: u svesci je ovo JEDAN zadatak od 18 reči, a to je
  // za dete od 5–8 godina predugačko — traka napretka se ne pomeri ni jednom
  // dok ne uradi svih 18. Nijedna reč nije izbačena, samo su spakovane u 3
  // koraka, redom kao u svesci.
  {
    id: "els-animals-8-1",
    type: "copy-word",
    prompt: "Llegeix i copia els mamífers: (1 de 3).",
    words: [
      { catalan: "gos", image: "gos" },
      { catalan: "gat", image: "gat" },
      { catalan: "conill", image: "conill" },
      { catalan: "cavall", image: "cavall" },
      { catalan: "porc", image: "porc" },
      { catalan: "vaca", image: "vaca" },
    ],
  },

  // === Workbook Ex. 11: Sopa de lletres (8 mamífers) ===
  {
    id: "els-animals-11",
    type: "word-search",
    prompt: "Busca 8 mamífers a la sopa de lletres. Poden anar →\u00A0↓",
    gridSize: 10,
    words: ["gos", "gat", "lleo", "vaca", "ovella", "porc", "os", "tigre", "conill", "girafa", "mussol"],
    grid: [
      ["g", "a", "e", "l", "l", "e", "o", "g", "c", "g"],
      ["m", "o", "v", "e", "l", "l", "a", "a", "o", "g"],
      ["j", "v", "i", "w", "h", "m", "g", "t", "n", "i"],
      ["m", "a", "b", "z", "o", "p", "i", "i", "i", "d"],
      ["u", "c", "r", "d", "p", "h", "r", "g", "l", "l"],
      ["s", "a", "g", "v", "o", "n", "a", "r", "l", "m"],
      ["s", "l", "f", "n", "r", "x", "f", "e", "o", "k"],
      ["o", "l", "a", "i", "c", "h", "a", "l", "a", "n"],
      ["l", "g", "o", "s", "h", "o", "w", "g", "v", "m"],
      ["e", "h", "u", "q", "o", "s", "a", "c", "h", "v"],
    ],
  },
  {
    id: "els-animals-8-2",
    type: "copy-word",
    prompt: "Llegeix i copia els mamífers: (2 de 3).",
    words: [
      { catalan: "ratolí", image: "ratoli" },
      { catalan: "ovella", image: "ovella" },
      { catalan: "hipopòtam", image: "hipopotam" },
      { catalan: "goril·la", image: "gorila" },
      { catalan: "zebra", image: "zebra" },
      { catalan: "ós", image: "os" },
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
  {
    id: "els-animals-8-3",
    type: "copy-word",
    prompt: "Llegeix i copia els mamífers: (3 de 3).",
    words: [
      { catalan: "lleó", image: "lleo" },
      { catalan: "camell", image: "camell" },
      { catalan: "elefant", image: "elefant" },
      { catalan: "tigre", image: "tigre" },
      { catalan: "llop", image: "llop" },
      { catalan: "guineu", image: "guineu" },
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
        image: "serp",
      },
      {
        text: "La granota és de color ___.",
        blank: "verd",
        options: ["verd", "blau", "vermell"],
        image: "granota",
      },
      {
        text: "L'elefant és un animal molt ___.",
        blank: "gran",
        options: ["gran", "petit", "alt"],
        image: "elefant",
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
      { word: "flamenc", hint: "fl_m_nc", image: "flamenc" },
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


  // ── Slaganje reči iz dva dela (dodato 17.08.2026) ──
  // Vlasnica: „taj tip zadatka joj se svideo, stavi ga i u ostale teme."
  // Postojao je samo u temi 4. Sve reči su iz vokabulara OVE teme — ništa se
  // ne izmišlja, samo se već naučena reč seče na dva dela, po slogu.
  {
    id: "els-animals-slaganje",
    type: "matching",
    prompt: "Relaciona les dues parts per formar paraules:",
    joinParts: true,   // spaja delove jedne reči — izgovara se SPOJENA reč
    rightTextOnly: true,
    pairs: [
      { left: "GA", right: "LLINA" },
      { left: "CO", right: "NILL" },
      { left: "TOR", right: "TUGA" },
      { left: "GI", right: "RAFA" },
      { left: "MUS", right: "SOL" },
      { left: "PAPA", right: "LLONA" },
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
