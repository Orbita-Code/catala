import { Task } from "@/types/tasks";

export const elMenjarTasks: Task[] = [
  // === Workbook Ex. 1: Llegeix i copia (tableware 9) ===
  {
    id: "el-menjar-1",
    type: "copy-word",
    prompt: "Llegeix i copia els estris de cuina:",
    words: [
      { catalan: "tassa" },
      { catalan: "ampolla" },
      { catalan: "got" },
      { catalan: "copa" },
      { catalan: "ganivet" },
      { catalan: "cullera" },
      { catalan: "forquilla" },
      { catalan: "plat" },
      { catalan: "tovalló" },
    ],
  },

  // === Workbook Ex. 2: Singular/plural table for tableware ===
  {
    id: "el-menjar-2",
    type: "matching",
    prompt: "Relaciona el singular amb el plural:",
    pairs: [
      { left: "tassa", right: "tasses" },
      { left: "ampolla", right: "ampolles" },
      { left: "got", right: "gots" },
      { left: "copa", right: "copes" },
      { left: "ganivet", right: "ganivets" },
      { left: "cullera", right: "culleres" },
      { left: "forquilla", right: "forquilles" },
      { left: "plat", right: "plats" },
      { left: "tovalló", right: "tovallons" },
    ],
  },

  // === Workbook Ex. 4: Observa aliments esmorzar (9) ===
  {
    id: "el-menjar-4",
    type: "copy-word",
    prompt: "Llegeix i copia els aliments de l'esmorzar:",
    words: [
      { catalan: "suc" },
      { catalan: "cafè" },
      { catalan: "pa de pessic" },
      { catalan: "te" },
      { catalan: "cereals" },
      { catalan: "llet" },
      { catalan: "galetes" },
      { catalan: "entrepà" },
      { catalan: "fruita" },
    ],
  },

  // === Workbook Ex. 5: Observa aliments dinar (9) ===
  {
    id: "el-menjar-5",
    type: "copy-word",
    prompt: "Llegeix i copia els aliments del dinar:",
    words: [
      { catalan: "verdures" },
      { catalan: "arròs" },
      { catalan: "macarrons" },
      { catalan: "amanida" },
      { catalan: "patates fregides" },
      { catalan: "pollastre" },
      { catalan: "pa" },
      { catalan: "aigua" },
      { catalan: "refresc" },
    ],
  },

  // === Workbook Ex. 6+7: Observa berenar (3) + sopar (6) ===
  {
    id: "el-menjar-6",
    type: "copy-word",
    prompt: "Llegeix i copia els aliments del berenar i el sopar:",
    words: [
      { catalan: "sandvitx" },
      { catalan: "iogurt" },
      { catalan: "hamburguesa" },
      { catalan: "truita de patates" },
      { catalan: "sopa" },
      { catalan: "pizza" },
      { catalan: "formatge" },
      { catalan: "pernil" },
    ],
  },

  // === Workbook Ex. 8: I tu, què menges? ===
  {
    id: "el-menjar-7",
    type: "fill-sentence",
    prompt: "Completa les frases sobre els àpats:",
    sentences: [
      {
        text: "Per esmorzar menjo ___ amb llet.",
        blank: "cereals",
        options: ["cereals", "sopa", "pizza"],
      },
      {
        text: "Per dinar menjo ___ amb verdures.",
        blank: "arròs",
        options: ["arròs", "galetes", "te"],
      },
      {
        text: "Per berenar menjo un ___.",
        blank: "sandvitx",
        options: ["sandvitx", "arròs", "sopa"],
      },
      {
        text: "Per sopar menjo ___.",
        blank: "sopa",
        options: ["sopa", "cereals", "cafè"],
      },
    ],
  },

  // === Workbook Ex. 9: interactive version ===
  {
    id: "el-menjar-8",
    type: "multiple-choice",
    prompt: "Tria la resposta correcta:",
    questions: [
      {
        question: "Què mengem per esmorzar normalment?",
        options: ["Cereals amb llet", "Sopa de peix", "Pizza", "Hamburguesa"],
        correct: 0,
      },
      {
        question: "Amb què tallem el menjar?",
        options: ["Cullera", "Tassa", "Ganivet", "Plat"],
        correct: 2,
      },
      {
        question: "On posem la sopa?",
        options: ["Al got", "Al plat", "A la copa", "A la forquilla"],
        correct: 1,
      },
      {
        question: "Quin àpat fem al migdia?",
        options: ["Esmorzar", "Berenar", "Sopar", "Dinar"],
        correct: 3,
      },
    ],
  },

  // === Workbook Ex. 10: Classifica PER MENJAR vs PER BEURE ===
  {
    id: "el-menjar-9",
    type: "classify-columns",
    prompt: "Classifica: Per menjar o per beure?",
    columns: [
      {
        title: "Per menjar",
        items: ["entrepà", "pizza", "hamburguesa", "amanida", "macarrons", "galetes"],
      },
      {
        title: "Per beure",
        items: ["suc", "cafè", "te", "llet", "aigua", "refresc"],
      },
    ],
    allItems: [
      "entrepà",
      "pizza",
      "hamburguesa",
      "amanida",
      "macarrons",
      "galetes",
      "suc",
      "cafè",
      "te",
      "llet",
      "aigua",
      "refresc",
    ],
  },

  // === Workbook Ex. 11: Relaciona (match sentences to utensils) ===
  {
    id: "el-menjar-10",
    type: "matching",
    prompt: "Relaciona cada frase amb l'estri correcte:",
    pairs: [
      { left: "Bec el cafè amb...", right: "tassa" },
      { left: "Menjo l'amanida amb...", right: "forquilla" },
      { left: "Tallo la carn amb...", right: "ganivet" },
      { left: "Menjo la sopa amb...", right: "cullera" },
      { left: "Poso el menjar al...", right: "plat" },
      { left: "Bec aigua amb...", right: "got" },
    ],
  },

  // === Workbook Ex. 11b: Separa oracions ===
  {
    id: "el-menjar-11",
    type: "separate-words",
    prompt: "Separa i copia les oracions:",
    items: [
      {
        joined: "Becsucdetaronjaperesmorzar.",
        words: ["Bec", "suc", "de", "taronja", "per", "esmorzar."],
      },
      {
        joined: "Menjomacarronsambtomàquet.",
        words: ["Menjo", "macarrons", "amb", "tomàquet."],
      },
      {
        joined: "Latassaésperbeurecafè.",
        words: ["La", "tassa", "és", "per", "beure", "cafè."],
      },
      {
        joined: "Posoelmenjaraldamuntdelplat.",
        words: ["Poso", "el", "menjar", "al", "damunt", "del", "plat."],
      },
      {
        joined: "Perberenarmenjo galetesam bllet.",
        words: ["Per", "berenar", "menjo", "galetes", "amb", "llet."],
      },
    ],
  },

  // === Workbook Ex. 12: Classifica fred vs calent ===
  {
    id: "el-menjar-12",
    type: "classify-columns",
    prompt: "Classifica: Fred o calent?",
    columns: [
      {
        title: "Fred",
        items: ["gelat", "suc", "amanida", "iogurt", "refresc", "fruita"],
      },
      {
        title: "Calent",
        items: ["sopa", "cafè", "te", "arròs", "pizza", "macarrons"],
      },
    ],
    allItems: [
      "gelat",
      "suc",
      "amanida",
      "iogurt",
      "refresc",
      "fruita",
      "sopa",
      "cafè",
      "te",
      "arròs",
      "pizza",
      "macarrons",
    ],
  },

  // === Workbook Ex. 13: Escriu FRED o CALENT (color version) ===
  {
    id: "el-menjar-13",
    type: "color-by-instruction",
    prompt: "Pinta de blau el menjar fred i de vermell el calent:",
    image: "aliments",
    instructions: [
      { text: "Pinta el gelat de color blau (fred)", targetColor: "blau", targetItem: "gelat" },
      { text: "Pinta la sopa de color vermell (calent)", targetColor: "vermell", targetItem: "sopa" },
      { text: "Pinta el cafè de color vermell (calent)", targetColor: "vermell", targetItem: "cafè" },
      { text: "Pinta el suc de color blau (fred)", targetColor: "blau", targetItem: "suc" },
      { text: "Pinta la pizza de color vermell (calent)", targetColor: "vermell", targetItem: "pizza" },
      { text: "Pinta el iogurt de color blau (fred)", targetColor: "blau", targetItem: "iogurt" },
      { text: "Pinta el te de color vermell (calent)", targetColor: "vermell", targetItem: "te" },
      { text: "Pinta el refresc de color blau (fred)", targetColor: "blau", targetItem: "refresc" },
    ],
  },

  // === Workbook Ex. 14+15: Observa tovalló/nevera/estovalles + Completa ===
  {
    id: "el-menjar-14",
    type: "fill-sentence",
    prompt: "Completa les frases:",
    sentences: [
      {
        text: "A la ___ hi ha suc fresc.",
        blank: "nevera",
        options: ["nevera", "tovalló", "estovalles"],
      },
      {
        text: "Quan em taco, em netejo amb el ___.",
        blank: "tovalló",
        options: ["tovalló", "nevera", "estovalles"],
      },
      {
        text: "M'encanta vestir la taula amb unes boniques ___.",
        blank: "estovalles",
        options: ["estovalles", "tovalló", "nevera"],
      },
    ],
  },

  // === Workbook Ex. 16: MASCULÍ / FEMENÍ ===
  {
    id: "el-menjar-15",
    type: "fill-sentence",
    prompt: "Completa amb fred, freda, calent o calenta:",
    sentences: [
      {
        text: "El gelat és ___.",
        blank: "fred",
        options: ["fred", "freda", "calent"],
      },
      {
        text: "La pizza és ___.",
        blank: "calenta",
        options: ["calenta", "calent", "freda"],
      },
      {
        text: "El cafè és ___.",
        blank: "calent",
        options: ["calent", "fred", "calenta"],
      },
      {
        text: "La fruita és ___.",
        blank: "freda",
        options: ["freda", "calenta", "fred"],
      },
    ],
  },

  // === Workbook Ex. 17+18: Classifica DOLÇ vs SALAT ===
  {
    id: "el-menjar-16",
    type: "classify-columns",
    prompt: "Classifica: Dolç o salat?",
    columns: [
      {
        title: "Dolç",
        items: ["pastís de xocolata", "gelat", "xocolata", "galetes", "caramels", "sucre", "plàtan"],
      },
      {
        title: "Salat",
        items: ["pizza", "macarrons", "amanida", "arròs", "entrepà", "pernil", "sal"],
      },
    ],
    allItems: [
      "pastís de xocolata",
      "gelat",
      "xocolata",
      "galetes",
      "caramels",
      "sucre",
      "plàtan",
      "pizza",
      "macarrons",
      "amanida",
      "arròs",
      "entrepà",
      "pernil",
      "sal",
    ],
  },

  // === Workbook Ex. 19-20: Menú del restaurant ===
  {
    id: "el-menjar-17",
    type: "multiple-choice",
    prompt: "Llegeix el menú del restaurant Tot Bo i contesta:",
    questions: [
      {
        question: "Quin primer plat pots triar al restaurant?",
        options: ["Amanida", "Hamburguesa", "Pastís", "Cafè"],
        correct: 0,
      },
      {
        question: "Quin segon plat hi ha amb patates?",
        options: ["Sopa", "Hamburguesa amb patates", "Amanida", "Macarrons"],
        correct: 1,
      },
      {
        question: "Què pots prendre de postres?",
        options: ["Sopa", "Entrepà", "Fruita amb gelat", "Arròs"],
        correct: 2,
      },
      {
        question: "Quina beguda ofereix el menú?",
        options: ["Refresc", "Cafè amb llet", "Xocolata", "Te"],
        correct: 1,
      },
    ],
  },

  // === Workbook Ex. 21: Escriu la pregunta ===
  {
    id: "el-menjar-18",
    type: "fill-sentence",
    prompt: "Completa la pregunta per cada resposta:",
    sentences: [
      {
        text: "Què ___? — Per dinar tinc macarrons amb tomàquet.",
        blank: "dinaràs",
        options: ["dinaràs", "soparàs", "esmorzaràs"],
      },
      {
        text: "Què ___? — Per berenar menjo pa amb xocolata.",
        blank: "berenaràs",
        options: ["berenaràs", "dinaràs", "soparàs"],
      },
      {
        text: "Què ___? — Per esmorzar menjo galetes amb llet.",
        blank: "esmorzaràs",
        options: ["esmorzaràs", "soparàs", "berenaràs"],
      },
    ],
  },

  // === Fill-letters for key vocabulary ===
  {
    id: "el-menjar-20",
    type: "fill-letters",
    prompt: "Completa les lletres que falten:",
    words: [
      { word: "forquilla", hint: "f_rqu_lla" },
      { word: "ganivet", hint: "g_n_v_t" },
      { word: "cullera", hint: "c_ll_ra" },
      { word: "tovalló", hint: "t_v_lló" },
      { word: "ampolla", hint: "_mp_lla" },
      { word: "cereals", hint: "c_re_ls" },
      { word: "hamburguesa", hint: "h_mb_rgu_sa" },
      { word: "macarrons", hint: "m_c_rr_ns" },
    ],
  },

  // === AUTOAVALUACIÓ ===
  {
    id: "el-menjar-21",
    type: "self-assessment",
    prompt: "Saps dir aquestes paraules en català?",
    items: [
      { catalan: "ganivet", translation: "nož" },
      { catalan: "cullera", translation: "kašika" },
      { catalan: "forquilla", translation: "viljuška" },
      { catalan: "plat", translation: "tanjir" },
      { catalan: "tassa", translation: "šolja" },
      { catalan: "got", translation: "čaša" },
      { catalan: "cereals", translation: "žitarice" },
      { catalan: "sopa", translation: "supa" },
      { catalan: "hamburguesa", translation: "hamburger" },
      { catalan: "gelat", translation: "sladoled" },
    ],
  },

  // Bonus activity: Fun drawing
  {
    id: "el-menjar-bonus",
    type: "drawing-canvas",
    prompt: "Dibuixa una poma verda!",
    bonus: true,
  },
];
