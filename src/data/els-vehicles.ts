import { Task } from "@/types/tasks";

export const elsVehiclesTasks: Task[] = [

  {
    id: "els-vehicles-1",
    type: "copy-word",
    prompt: "Llegeix i copia els vehicles:",
    words: [
      { catalan: "cotxe", image: "cotxe" },
      { catalan: "autobús", image: "autobus" },
      { catalan: "tren", image: "tren" },
      { catalan: "avió", image: "avio" },
      { catalan: "bicicleta", image: "bicicleta" },
      { catalan: "moto", image: "moto" },
      { catalan: "vaixell", image: "vaixell" },
      { catalan: "helicòpter", image: "helicopter" },
      { catalan: "camió", image: "camio" },
      { catalan: "taxi", image: "taxi" },
      { catalan: "ambulància", image: "ambulancia" },
      { catalan: "barca", image: "barca" },
    ],
  },
  {
    id: "els-vehicles-2",
    type: "fill-letters",
    prompt: "Completa les lletres que falten:",
    words: [
      { word: "cotxe", hint: "c_tx_", image: "cotxe" },
      { word: "autobús", hint: "a_tob_s", image: "autobus" },
      { word: "tren", hint: "tr_n", image: "tren" },
      { word: "avió", hint: "av_ó", image: "avio" },
      { word: "bicicleta", hint: "b_cicl_ta", image: "bicicleta" },
      { word: "moto", hint: "m_t_", image: "moto" },
      { word: "vaixell", hint: "v_ix_ll", image: "vaixell" },
      { word: "helicòpter", hint: "h_licò_ter", image: "helicopter" },
    ],
  },
  {
    id: "els-vehicles-3",
    type: "unscramble",
    prompt: "Ordena les lletres per formar la paraula:",
    words: [
      { scrambled: "xetco", correct: "cotxe", image: "cotxe" },
      { scrambled: "nert", correct: "tren", image: "tren" },
      { scrambled: "otom", correct: "moto", image: "moto" },
      { scrambled: "lleixav", correct: "vaixell", image: "vaixell" },
      { scrambled: "óimac", correct: "camió", image: "camio" },
    ],
  },
  {
    id: "els-vehicles-4",
    type: "matching",
    prompt: "Relaciona cada vehicle amb on va:",
    pairs: [
      { left: "cotxe", right: "carretera" },
      { left: "vaixell", right: "mar" },
      { left: "avió", right: "cel" },
      { left: "tren", right: "vies" },
      { left: "metro", right: "sota terra" },
    ],
  },
  {
    id: "els-vehicles-5",
    type: "word-search",
    prompt: "Troba les paraules a la sopa de lletres. Poden anar →\u00A0←\u00A0↓\u00A0↑",
    gridSize: 10,
    words: ["cotxe", "tren", "moto", "taxi", "avió", "barca", "camió", "vaixell", "metro", "patinet", "helicopter"],
    grid: [
      ["q", "s", "x", "d", "e", "f", "c", "b", "p", "b"],
      ["h", "l", "l", "e", "x", "i", "a", "v", "i", "i"],
      ["w", "w", "m", "t", "t", "n", "m", "d", "j", "o"],
      ["j", "b", "y", "z", "o", "j", "i", "d", "f", "a"],
      ["o", "t", "o", "m", "c", "w", "o", "i", "v", "a"],
      ["o", "c", "m", "e", "t", "r", "o", "c", "n", "y"],
      ["r", "e", "t", "p", "o", "c", "i", "l", "e", "h"],
      ["f", "t", "e", "n", "i", "t", "a", "p", "r", "x"],
      ["j", "y", "q", "h", "i", "x", "a", "t", "t", "m"],
      ["p", "t", "t", "b", "a", "r", "c", "a", "m", "z"],
    ],
  },
  {
    id: "els-vehicles-6",
    type: "classify-columns",
    prompt: "Classifica: terra, mar o aire?",
    columns: [
      {
        title: "Terra",
        items: ["cotxe", "autobús", "tren", "moto", "bicicleta", "taxi"],
      },
      {
        title: "Mar o aire",
        items: ["vaixell", "barca", "avió", "helicòpter"],
      },
    ],
    allItems: [
      "cotxe",
      "autobús",
      "tren",
      "moto",
      "bicicleta",
      "taxi",
      "vaixell",
      "barca",
      "avió",
      "helicòpter",
    ],
    circleMode: true,
  },
  {
    id: "els-vehicles-7",
    type: "fill-sentence",
    prompt: "Completa la frase:",
    sentences: [
      {
        text: "Anem a l'escola en ___.",
        blank: "autobús",
        options: ["vaixell", "autobús", "helicòpter"],
      },
      {
        text: "Viatgem per l'aire en ___.",
        blank: "avió",
        options: ["tren", "bicicleta", "avió"],
      },
      {
        text: "Naveguem pel mar en ___.",
        blank: "vaixell",
        options: ["cotxe", "vaixell", "moto"],
      },
      {
        text: "Anem ràpid en ___.",
        blank: "cotxe",
        options: ["patinet", "barca", "cotxe"],
      },
    ],
  },
  {
    id: "els-vehicles-8",
    type: "multiple-choice",
    prompt: "Tria la resposta correcta:",
    questions: [
      {
        question: "Quin vehicle va pel cel?",
        options: ["Avió", "Tren", "Vaixell", "Cotxe"],
        correct: 0,
      },
      {
        question: "Quin vehicle va per les vies?",
        options: ["Autobús", "Tren", "Moto", "Barca"],
        correct: 1,
      },
      {
        question: "Quin vehicle té dues rodes i pedals?",
        options: ["Cotxe", "Camió", "Bicicleta", "Taxi"],
        correct: 2,
      },
      {
        question: "Quin vehicle ens porta a l'hospital?",
        options: ["Taxi", "Tramvia", "Moto", "Ambulància"],
        correct: 3,
      },
    ],
  },
  {
    id: "els-vehicles-9",
    type: "self-assessment",
    prompt: "Saps dir aquestes paraules en català?",
    items: [
      { catalan: "cotxe", translation: "auto/kola", image: "cotxe" },
      { catalan: "autobús", translation: "autobus", image: "autobus" },
      { catalan: "tren", translation: "voz", image: "tren" },
      { catalan: "avió", translation: "avion", image: "avio" },
      { catalan: "bicicleta", translation: "bicikl", image: "bicicleta" },
      { catalan: "vaixell", translation: "brod", image: "vaixell" },
      { catalan: "moto", translation: "motor", image: "moto" },
      { catalan: "helicòpter", translation: "helikopter", image: "helicopter" },
    ],
  },
  {
    id: "els-vehicles-10",
    type: "fill-sentence",
    prompt: "Completa les frases sobre els vehicles:",
    sentences: [
      {
        text: "El ___ va per les vies.",
        blank: "tren",
        options: ["cotxe", "tren", "vaixell"],
      },
      {
        text: "L' ___ vola pel cel.",
        blank: "avió",
        options: ["bicicleta", "autobús", "avió"],
      },
      {
        text: "L' ___ té moltes rodes i porta molta gent.",
        blank: "autobús",
        options: ["moto", "autobús", "barca"],
      },
      {
        text: "La ___ té dues rodes i pedals.",
        blank: "bicicleta",
        options: ["ambulància", "taxi", "bicicleta"],
      },
    ],
  },
  {
    id: "els-vehicles-11",
    type: "classify-columns",
    prompt: "Classifica: Terra vs Mar vs Aire",
    columns: [
      {
        title: "Terra",
        items: ["cotxe", "autobús", "tren", "moto", "bicicleta", "camió", "taxi"],
      },
      {
        title: "Mar",
        items: ["vaixell", "barca", "canoa"],
      },
      {
        title: "Aire",
        items: ["avió", "helicòpter", "globus"],
      },
    ],
    allItems: [
      "cotxe",
      "autobús",
      "tren",
      "moto",
      "bicicleta",
      "camió",
      "taxi",
      "vaixell",
      "barca",
      "canoa",
      "avió",
      "helicòpter",
      "globus",
    ],
  },
  {
    id: "els-vehicles-12",
    type: "unscramble",
    prompt: "Mira la imatge i ordena les síl·labes:",
    words: [
      { scrambled: "xe-cot", correct: "cotxe", image: "cotxe" },
      { scrambled: "bús-to-au", correct: "autobús", image: "autobus" },
      { scrambled: "ó-vi-a", correct: "avió", image: "avio" },
      { scrambled: "to-mo", correct: "moto", image: "moto" },
      { scrambled: "xell-vai", correct: "vaixell", image: "vaixell" },
      { scrambled: "ó-mi-ca", correct: "camió", image: "camio" },
      { scrambled: "xi-ta", correct: "taxi", image: "taxi" },
      { scrambled: "ta-cle-ci-bi", correct: "bicicleta", image: "bicicleta" },
    ],
  },

  // ── Slaganje reči iz dva dela (dodato 17.08.2026) ──
  // Vlasnica: „taj tip zadatka joj se svideo, stavi ga i u ostale teme."
  // Postojao je samo u temi 4. Sve reči su iz vokabulara OVE teme — ništa se
  // ne izmišlja, samo se već naučena reč seče na dva dela, po slogu.
  {
    id: "els-vehicles-slaganje",
    type: "matching",
    prompt: "Relaciona les dues parts per formar paraules:",
    joinParts: true,   // spaja delove jedne reči — izgovara se SPOJENA reč
    rightTextOnly: true,
    pairs: [
      { left: "CO", right: "TXE" },
      { left: "AUTO", right: "BÚS" },
      { left: "BICI", right: "CLETA" },
      { left: "CA", right: "MIÓ" },
      { left: "A", right: "VIÓ" },
      { left: "VAI", right: "XELL" },
    ],
  },

  // Bonus activity: Fun drawing
  {
    id: "els-vehicles-bonus",
    type: "drawing-canvas",
    prompt: "Activitat extra! Diverteix-te, activa la creativitat i dibuixa alguna cosa màgica!",
    bonus: true,
  },
];
