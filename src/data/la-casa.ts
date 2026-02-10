import { Task } from "@/types/tasks";

export const laCasaTasks: Task[] = [
  // ── Task 1: Llegeix i copia (9 parts de la casa) ──
  {
    id: "la-casa-1",
    type: "copy-word",
    prompt: "Llegeix i copia:",
    words: [
      { catalan: "teulada", image: "teulada" },
      { catalan: "xemeneia", image: "xemeneia" },
      { catalan: "antena", image: "antena" },
      { catalan: "balcó", image: "balco" },
      { catalan: "persiana", image: "persiana" },
      { catalan: "cortina", image: "cortina" },
      { catalan: "escala", image: "escala" },
      { catalan: "jardí", image: "jardi" },
      { catalan: "garatge", image: "garatge" },
    ],
  },

  // ── Task 2: Busca 6 paraules (sopa de lletres) ──
  {
    id: "la-casa-2",
    type: "word-search",
    prompt: "Busca 6 paraules relacionades amb la casa:",
    gridSize: 9,
    words: ["persiana", "antena", "escala", "cortina", "jardí", "balcó"],
    grid: [
      ["p", "e", "r", "s", "i", "a", "n", "a", "b"],
      ["g", "a", "d", "r", "f", "m", "t", "u", "a"],
      ["h", "n", "v", "p", "d", "s", "r", "j", "l"],
      ["f", "t", "m", "g", "u", "b", "d", "r", "c"],
      ["s", "e", "e", "s", "c", "a", "l", "a", "ó"],
      ["d", "n", "r", "t", "g", "h", "p", "m", "v"],
      ["u", "a", "c", "o", "r", "t", "i", "n", "a"],
      ["r", "f", "g", "h", "b", "s", "d", "p", "t"],
      ["j", "a", "r", "d", "í", "m", "n", "u", "v"],
    ],
  },

  // ── Task 3: Classifica (articles LA, EL, LES, ELS) ──
  {
    id: "la-casa-3",
    type: "classify-columns",
    prompt: "Classifica:",
    columns: [
      {
        title: "LA",
        items: ["xemeneia", "teulada", "escala", "cortina"],
      },
      {
        title: "EL",
        items: ["balcó", "jardí"],
      },
      {
        title: "LES",
        items: ["persianes", "antenes"],
      },
      {
        title: "ELS",
        items: ["garatges"],
      },
    ],
    allItems: [
      "xemeneia",
      "balcó",
      "teulada",
      "escala",
      "garatges",
      "persianes",
      "jardí",
      "antenes",
      "cortina",
    ],
  },

  // ── Task 4: Escriu les parts de la casa (label image) ──
  {
    id: "la-casa-4",
    type: "label-image",
    prompt: "Escriu les parts de la casa:",
    image: "casa-exterior",
    labels: [
      { text: "teulada", x: 50, y: 10 },
      { text: "xemeneia", x: 30, y: 5 },
      { text: "antena", x: 80, y: 5 },
      { text: "balcó", x: 20, y: 45 },
      { text: "jardí", x: 70, y: 85 },
      { text: "garatge", x: 85, y: 60 },
    ],
    options: [
      "teulada",
      "xemeneia",
      "antena",
      "balcó",
      "jardí",
      "garatge",
      "escala",
      "persiana",
    ],
  },

  // ── Task 5: Completa (fill letters) ──
  {
    id: "la-casa-5",
    type: "fill-letters",
    prompt: "Completa:",
    words: [
      { word: "teulada", hint: "t_ul_d_", image: "teulada" },
      { word: "xemeneia", hint: "x_m_n_ia", image: "xemeneia" },
      { word: "antena", hint: "_nt_n_", image: "antena" },
      { word: "balcó", hint: "b_lc_", image: "balco" },
      { word: "persiana", hint: "p_rs__na", image: "persiana" },
      { word: "cortina", hint: "c_rt_n_", image: "cortina" },
      { word: "escala", hint: "_sc_l_", image: "escala" },
      { word: "jardí", hint: "j_rd_", image: "jardi" },
      { word: "garatge", hint: "g_r_tge", image: "garatge" },
    ],
  },

  // ── Task 6: Relaciona i copia ──
  {
    id: "la-casa-6",
    type: "matching",
    prompt: "Relaciona i copia:",
    pairs: [
      { left: "teulada", right: "per protegir de la pluja" },
      { left: "escala", right: "per pujar al pis de dalt" },
      { left: "antena", right: "per veure la televisió" },
      { left: "xemeneia", right: "perquè surti el fum" },
      { left: "jardí", right: "per tenir flors" },
      { left: "garatge", right: "per guardar el cotxe" },
    ],
  },

  // ── Task 7: Llegeix i copia (habitacions) ──
  {
    id: "la-casa-7",
    type: "copy-word",
    prompt: "Llegeix i copia:",
    words: [
      { catalan: "dormitori", image: "dormitori" },
      { catalan: "cuina", image: "cuina" },
      { catalan: "menjador", image: "menjador" },
      { catalan: "sala d'estar", image: "sala-d-estar" },
      { catalan: "terrassa", image: "terrassa" },
      { catalan: "lavabo", image: "lavabo" },
    ],
  },

  // ── Task 8: Completa (fill letters - habitacions) ──
  {
    id: "la-casa-8",
    type: "fill-letters",
    prompt: "Completa:",
    words: [
      { word: "lavabo", hint: "l_v_b_", image: "lavabo" },
      { word: "dormitori", hint: "d_rm_t_ri", image: "dormitori" },
      { word: "cuina", hint: "c_in_", image: "cuina" },
      { word: "sala d'estar", hint: "s_la d'_st_r", image: "sala-d-estar" },
      { word: "menjador", hint: "m_nj_d_r", image: "menjador" },
      { word: "terrassa", hint: "t_rr_ss_", image: "terrassa" },
    ],
  },

  // ── Task 9: Observa - SALA D'ESTAR (copy-word) ──
  {
    id: "la-casa-9",
    type: "copy-word",
    prompt: "Observa: SALA D'ESTAR. Llegeix i copia:",
    words: [
      { catalan: "televisió", image: "televisio" },
      { catalan: "rellotge", image: "rellotge" },
      { catalan: "prestatge", image: "prestatge" },
      { catalan: "sofà", image: "sofa" },
      { catalan: "llàmpada", image: "llampada" },
      { catalan: "xemeneia", image: "xemeneia" },
      { catalan: "butaca", image: "butaca" },
      { catalan: "catifa", image: "catifa" },
      { catalan: "planta", image: "planta" },
    ],
  },

  // ── Task 10: Completa (sentences about sala d'estar) ──
  {
    id: "la-casa-10",
    type: "fill-sentence",
    prompt: "Completa:",
    sentences: [
      {
        text: "A la sala d'estar hi ha una ___.",
        blank: "televisió",
        options: ["nevera", "televisió", "banyera"],
      },
      {
        text: "A la sala d'estar hi ha ___.",
        blank: "un sofà",
        options: ["un llit", "una nevera", "un sofà"],
      },
      {
        text: "A la sala d'estar hi ha ___.",
        blank: "un rellotge",
        options: ["un rellotge", "un forn", "una dutxa"],
      },
      {
        text: "A la sala d'estar hi ha ___.",
        blank: "una catifa",
        options: ["una banyera", "una catifa", "un llit"],
      },
    ],
  },

  // ── Task 11: Observa - CUINA (copy-word) ──
  {
    id: "la-casa-11",
    type: "copy-word",
    prompt: "Observa: CUINA. Llegeix i copia:",
    words: [
      { catalan: "escombraries", image: "escombraries" },
      { catalan: "nevera", image: "nevera" },
      { catalan: "foc", image: "foc" },
      { catalan: "armari", image: "armari" },
      { catalan: "forn", image: "forn" },
      { catalan: "aixeta", image: "aixeta" },
      { catalan: "aiguera", image: "aiguera" },
      { catalan: "microones", image: "microones" },
      { catalan: "campana", image: "campana" },
    ],
  },

  // ── Task 11.A: Matching (cuina) ──
  {
    id: "la-casa-12",
    type: "matching",
    prompt: "Relaciona:",
    pairs: [
      { left: "A la nevera", right: "guardem el menjar." },
      { left: "A la cuina", right: "cuinem tot el que mengem." },
      { left: "Al forn", right: "fem pa." },
      { left: "A les escombraries", right: "tirem allò que ja no serveix." },
      { left: "A l'aiguera", right: "hi ha els plats bruts." },
    ],
  },

  // ── Task 12: Observa - DORMITORI (copy-word) ──
  {
    id: "la-casa-13",
    type: "copy-word",
    prompt: "Observa: DORMITORI. Llegeix i copia:",
    words: [
      { catalan: "llit", image: "llit" },
      { catalan: "coixí", image: "coixi" },
      { catalan: "llençol", image: "llencol" },
      { catalan: "tauleta de nit", image: "tauleta-de-nit" },
      { catalan: "despertador", image: "despertador" },
      { catalan: "armari", image: "armari" },
      { catalan: "manta", image: "manta" },
      { catalan: "escriptori", image: "escriptori" },
      { catalan: "prestatgeria", image: "prestatgeria" },
    ],
  },

  // ── Task 13: Llegeix i endevina quina part del dormitori és ──
  {
    id: "la-casa-14",
    type: "fill-sentence",
    prompt: "Llegeix i endevina quina part del dormitori és:",
    sentences: [
      {
        text: "On dorms.",
        blank: "llit",
        options: ["coixí", "llit", "manta"],
      },
      {
        text: "On poses el teu cap.",
        blank: "coixí",
        options: ["manta", "llit", "coixí"],
      },
      {
        text: "Te la poses a sobre quan tens fred.",
        blank: "manta",
        options: ["llençol", "manta", "coixí"],
      },
      {
        text: "El configures quan necessites aixecar-te aviat.",
        blank: "despertador",
        options: ["rellotge", "televisió", "despertador"],
      },
      {
        text: "Aquí guardes la teva roba.",
        blank: "armari",
        options: ["armari", "prestatge", "llit"],
      },
      {
        text: "Vesteixes el llit amb elles.",
        blank: "llençols",
        options: ["mantes", "llençols", "coixins"],
      },
    ],
  },

  // ── Task 12 (cont): Observa - LAVABO o BANY (copy-word) ──
  {
    id: "la-casa-15",
    type: "copy-word",
    prompt: "Observa: LAVABO o BANY. Llegeix i copia:",
    words: [
      { catalan: "vàter", image: "vater" },
      { catalan: "paper de vàter", image: "paper-de-vater" },
      { catalan: "lavabo", image: "lavabo" },
      { catalan: "banyera", image: "banyera" },
      { catalan: "dutxa", image: "dutxa" },
      { catalan: "tovallola", image: "tovallola" },
      { catalan: "mirall", image: "mirall" },
      { catalan: "sabó", image: "sabo" },
      { catalan: "esponja", image: "esponja" },
    ],
  },

  // ── Task 13: Completa (verb rentar-se conjugation) ──
  {
    id: "la-casa-16",
    type: "fill-sentence",
    prompt: "Completa:",
    sentences: [
      {
        text: "Jo em rento les ___.",
        blank: "mans",
        options: ["cames", "mans", "orelles"],
      },
      {
        text: "Tu et rentes les ___.",
        blank: "mans",
        options: ["dents", "cames", "mans"],
      },
      {
        text: "Ell es renta ___.",
        blank: "la cara",
        options: ["el braç", "la cara", "el peu"],
      },
      {
        text: "Nosaltres ens rentem ___.",
        blank: "les mans",
        options: ["els peus", "el cap", "les mans"],
      },
      {
        text: "Vosaltres us renteu ___.",
        blank: "les dents",
        options: ["els ulls", "les dents", "el nas"],
      },
      {
        text: "Ells es renten ___.",
        blank: "la cara",
        options: ["el braç", "les cames", "la cara"],
      },
    ],
  },

  // ── Task 14: Pinta (classify by room - color-code) ──
  {
    id: "la-casa-17",
    type: "classify-columns",
    prompt:
      "Classifica: vermell = dormitori, verd = sala d'estar, blau = lavabo, groc = cuina.",
    columns: [
      {
        title: "Dormitori",
        items: ["llit", "llençols", "despertador", "tauleta de nit"],
      },
      {
        title: "Sala d'estar",
        items: ["televisió", "sofà", "catifa", "cortina"],
      },
      {
        title: "Lavabo",
        items: ["banyera", "mirall", "dutxa", "lavabo", "tovallola"],
      },
      {
        title: "Cuina",
        items: ["aiguera", "forn", "nevera", "microones", "xemeneia", "armari"],
      },
    ],
    allItems: [
      "llit",
      "aiguera",
      "catifa",
      "dutxa",
      "televisió",
      "banyera",
      "mirall",
      "llençols",
      "forn",
      "sofà",
      "armari",
      "lavabo",
      "cortina",
      "nevera",
      "tauleta de nit",
      "despertador",
      "tovallola",
      "microones",
      "xemeneia",
    ],
  },

  // ── Task 14 (cont): Completa (on fem cada cosa) ──
  {
    id: "la-casa-18",
    type: "fill-sentence",
    prompt: "Completa:",
    sentences: [
      {
        text: "Dormim a ___.",
        blank: "l'habitació",
        options: ["la cuina", "l'habitació", "el jardí"],
      },
      {
        text: "Mengem a ___.",
        blank: "el menjador",
        options: ["el lavabo", "el garatge", "el menjador"],
      },
      {
        text: "Cuinem a ___.",
        blank: "la cuina",
        options: ["la cuina", "el dormitori", "la terrassa"],
      },
      {
        text: "Ens rentem a ___.",
        blank: "el lavabo",
        options: ["la cuina", "el lavabo", "el menjador"],
      },
      {
        text: "Guardem el cotxe a ___.",
        blank: "el garatge",
        options: ["el jardí", "la terrassa", "el garatge"],
      },
      {
        text: "Prenem el sol a ___.",
        blank: "la terrassa",
        options: ["el dormitori", "la terrassa", "la cuina"],
      },
      {
        text: "Mirem la televisió a ___.",
        blank: "la sala d'estar",
        options: ["el lavabo", "la cuina", "la sala d'estar"],
      },
      {
        text: "Guardem el menjar a ___.",
        blank: "la nevera",
        options: ["la nevera", "l'armari", "el garatge"],
      },
    ],
  },

  // ── Task 15: Relaciona ──
  {
    id: "la-casa-19",
    type: "matching",
    prompt: "Relaciona:",
    pairs: [
      { left: "On és l'antena de la televisió?", right: "És a la teulada." },
      { left: "De què està feta la taula?", right: "De fusta." },
      { left: "Quantes finestres hi ha?", right: "Hi ha tres finestres." },
      { left: "Amb què ens rentem les mans?", right: "Amb sabó." },
      { left: "On plantem flors?", right: "Al jardí." },
    ],
  },

  // ── Task 16: Escriu el contrari ──
  {
    id: "la-casa-20",
    type: "write-antonym",
    prompt: "Escriu el contrari:",
    pairs: [
      { word: "casa gran", antonym: "casa petita" },
      { word: "menjador gran", antonym: "menjador petit" },
      { word: "cuina petita", antonym: "cuina gran" },
      { word: "dormitoris petits", antonym: "dormitoris grans" },
      { word: "garatge net", antonym: "garatge brut" },
      { word: "lavabo net", antonym: "lavabo brut" },
      { word: "cortines brutes", antonym: "cortines netes" },
      { word: "terrassa bruta", antonym: "terrassa neta" },
      { word: "escales netes", antonym: "escales brutes" },
    ],
  },

  // ── Task 17: Ordena les oracions ──
  {
    id: "la-casa-21",
    type: "order-words",
    prompt: "Ordena les oracions:",
    sentences: [
      {
        scrambled: ["obro", "porta", "la", "Jo"],
        correct: ["Jo", "obro", "la", "porta"],
      },
      {
        scrambled: ["jardí", "El", "surt", "nen", "al"],
        correct: ["El", "nen", "surt", "al", "jardí"],
      },
      {
        scrambled: ["baixa", "escales", "les", "Maria", "La"],
        correct: ["La", "Maria", "baixa", "les", "escales"],
      },
      {
        scrambled: ["cotxe", "el", "al", "garatge", "Ell", "té"],
        correct: ["Ell", "té", "el", "cotxe", "al", "garatge"],
      },
      {
        scrambled: ["cinc", "Mireia", "casa", "té", "La", "finestres", "a"],
        correct: ["La", "Mireia", "té", "cinc", "finestres", "a", "casa"],
      },
    ],
  },

  // ── Task 18: Llegeix el text i digues quantes vegades surten les paraules ──
  {
    id: "la-casa-22",
    type: "count-and-write",
    prompt:
      "Llegeix el text: «Cada dia al matí obro la finestra del meu dormitori i pujo la persiana. Avui la persiana s'ha trencat. El meu pare l'ha arreglat, però s'ha tornat a trencar. Això no pot passar a la finestra de la cuina perquè no té persiana. La meva mare ha posat una cortina de color blanc amb flors. Al menjador, també tenim una cortina blanca.» Digues quantes vegades surten les paraules:",
    items: [
      { description: "PERSIANA", count: 3, word: "persiana" },
      { description: "FINESTRA", count: 2, word: "finestra" },
      { description: "CORTINA", count: 2, word: "cortina" },
    ],
  },

  // ── Autoavaluació ──
  {
    id: "la-casa-24",
    type: "self-assessment",
    prompt: "Autoavaluació: La casa",
    items: [
      { catalan: "teulada", translation: "krov", image: "teulada" },
      { catalan: "xemeneia", translation: "dimnjak", image: "xemeneia" },
      { catalan: "antena", translation: "antena", image: "antena" },
      { catalan: "balcó", translation: "balkon", image: "balco" },
      { catalan: "persiana", translation: "roletna", image: "persiana" },
      { catalan: "cortina", translation: "zavesa", image: "cortina" },
      { catalan: "escala", translation: "stepenice", image: "escala" },
      { catalan: "jardí", translation: "bašta", image: "jardi" },
      { catalan: "garatge", translation: "garaža", image: "garatge" },
      { catalan: "dormitori", translation: "spavaća soba", image: "dormitori" },
      { catalan: "cuina", translation: "kuhinja", image: "cuina" },
      { catalan: "menjador", translation: "trpezarija", image: "menjador" },
      { catalan: "sala d'estar", translation: "dnevna soba", image: "sala-d-estar" },
      { catalan: "terrassa", translation: "terasa", image: "terrassa" },
      { catalan: "lavabo", translation: "kupatilo", image: "lavabo" },
    ],
  },

  // Bonus activity: Fun drawing
  {
    id: "la-casa-bonus",
    type: "drawing-canvas",
    prompt: "Activitat extra! Diverteix-te, activa la creativitat i dibuixa alguna cosa màgica!",
    bonus: true,
  },
];
