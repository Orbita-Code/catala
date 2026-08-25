import { Task } from "@/types/tasks";

export const laCiutatTasks: Task[] = [

  {
    id: "la-ciutat-1",
    type: "copy-word",
    prompt: "Llegeix i copia els llocs de la ciutat:",
    words: [
      { catalan: "carrer", image: "carrer" },
      { catalan: "plaça", image: "placa" },
      { catalan: "parc", image: "parc" },
      { catalan: "hospital", image: "hospital" },
      { catalan: "escola", image: "escola" },
      { catalan: "biblioteca", image: "biblioteca" },
      { catalan: "estació", image: "estacio" },
      { catalan: "museu", image: "museu" },
      { catalan: "cinema", image: "cinema" },
      { catalan: "restaurant", image: "restaurant" },
      { catalan: "mercat", image: "mercat" },
      { catalan: "semàfor", image: "semafor" },
    ],
  },
  {
    id: "la-ciutat-2",
    type: "fill-letters",
    prompt: "Completa les lletres que falten:",
    words: [
      { word: "carrer", hint: "c_rr_r", image: "carrer" },
      { word: "plaça", hint: "pl_ç_", image: "placa" },
      { word: "hospital", hint: "h_sp_t_l", image: "hospital" },
      { word: "escola", hint: "e_c_la", image: "escola" },
      { word: "biblioteca", hint: "b_bl_ot_ca", image: "biblioteca" },
      { word: "estació", hint: "e_t_ci_", image: "estacio" },
      { word: "museu", hint: "m_s_u", image: "museu" },
      { word: "cinema", hint: "c_n_ma", image: "cinema" },
      { word: "semàfor", hint: "s_m_f_r", image: "semafor" },
      { word: "mercat", hint: "m_rc_t", image: "mercat" },
    ],
  },
  {
    id: "la-ciutat-3",
    type: "unscramble",
    prompt: "Ordena les lletres per formar la paraula:",
    words: [
      { scrambled: "rracre", correct: "carrer", image: "carrer" },
      { scrambled: "açalp", correct: "plaça", image: "placa" },
      { scrambled: "usmeu", correct: "museu", image: "museu" },
      { scrambled: "ocelsa", correct: "escola", image: "escola" },
      { scrambled: "tarcme", correct: "mercat", image: "mercat" },
    ],
  },
  {
    id: "la-ciutat-4",
    type: "matching",
    prompt: "Relaciona cada lloc amb el que hi fas:",
    pairs: [
      { left: "hospital", right: "curar-se" },
      { left: "escola", right: "estudiar" },
      // BEZ SLIKE namerno: jedina slika koja se nađe je `veure` — dečak sa
      // LUPOM. Za „gledati film" to je pogrešna slika; dete bi razumelo
      // „tražiti", ne „gledati". Bolje bez slike nego sa pogrešnom.
      { left: "cinema", right: "veure pel·lícules", rightNoImage: true },
      { left: "parc", right: "jugar" },
      { left: "restaurant", right: "menjar" },
    ],
  },
  {
    id: "la-ciutat-5",
    type: "word-search",
    prompt: "Troba les paraules a la sopa de lletres. Poden anar →\u00A0←\u00A0↓\u00A0↑",
    gridSize: 10,
    words: ["parc", "museu", "plaça", "mercat", "cinema", "carrer", "hospital", "teatre", "estacio"],
    grid: [
      ["l", "m", "o", "i", "c", "a", "t", "s", "e", "u"],
      ["u", "h", "a", "m", "e", "n", "i", "c", "z", "c"],
      ["k", "o", "m", "m", "f", "n", "z", "l", "m", "h"],
      ["p", "s", "u", "z", "n", "e", "a", "s", "t", "p"],
      ["l", "p", "s", "r", "p", "l", "a", "c", "a", "o"],
      ["e", "i", "e", "i", "j", "x", "j", "c", "q", "t"],
      ["m", "t", "u", "r", "t", "a", "c", "r", "e", "m"],
      ["p", "a", "r", "e", "r", "r", "a", "c", "d", "m"],
      ["x", "l", "t", "a", "c", "r", "a", "p", "q", "b"],
      ["s", "w", "l", "t", "e", "a", "t", "r", "e", "j"],
    ],
  },
  {
    id: "la-ciutat-6",
    type: "classify-columns",
    prompt: "Classifica: diversió o serveis?",
    columns: [
      {
        title: "Diversió",
        items: ["parc", "cinema", "teatre", "museu"],
      },
      {
        title: "Serveis",
        items: ["hospital", "estació", "mercat", "ajuntament"],
      },
    ],
    allItems: [
      "parc",
      "cinema",
      "teatre",
      "museu",
      "hospital",
      "estació",
      "mercat",
      "ajuntament",
    ],
  },
  {
    id: "la-ciutat-7",
    type: "fill-sentence",
    prompt: "Completa la frase:",
    sentences: [
      {
        text: "Anem al ___ per veure una pel·lícula.",
        blank: "cinema",
        options: ["mercat", "cinema", "hospital"],
      },
      {
        text: "Comprem al ___.",
        blank: "mercat",
        options: ["museu", "parc", "mercat"],
      },
      {
        text: "Juguem al ___.",
        blank: "parc",
        options: ["parc", "cinema", "estació"],
      },
      {
        text: "Estudiem a l'___.",
        blank: "escola",
        options: ["restaurant", "escola", "teatre"],
      },
    ],
  },
  {
    id: "la-ciutat-8",
    type: "multiple-choice",
    prompt: "Tria la resposta correcta:",
    questions: [
      {
        question: "On anem quan estem malalts?",
        options: ["Al cinema", "A l'hospital", "Al parc", "Al mercat"],
        correct: 1,
      },
      {
        question: "On podem veure quadres i escultures?",
        options: ["Al restaurant", "A l'escola", "Al museu", "A l'estació"],
        correct: 2,
      },
      {
        question: "On creuem el carrer amb seguretat?",
        options: [
          "Al semàfor",
          "A la biblioteca",
          "Al teatre",
          "A l'ajuntament",
        ],
        correct: 0,
      },
      {
        question: "On agafem el tren?",
        options: ["Al mercat", "Al cinema", "Al parc", "A l'estació"],
        correct: 3,
      },
    ],
  },
  {
    id: "la-ciutat-9",
    type: "self-assessment",
    prompt: "Saps dir aquestes paraules en català?",
    items: [
      { catalan: "carrer", translation: "ulica", image: "carrer" },
      { catalan: "plaça", translation: "trg", image: "placa" },
      { catalan: "parc", translation: "park", image: "parc" },
      { catalan: "hospital", translation: "bolnica", image: "hospital" },
      { catalan: "escola", translation: "škola", image: "escola" },
      { catalan: "cinema", translation: "bioskop", image: "cinema" },
      { catalan: "mercat", translation: "pijaca/tržnica", image: "mercat" },
      { catalan: "estació", translation: "stanica", image: "estacio" },
    ],
  },
  {
    id: "la-ciutat-10",
    type: "matching",
    prompt: "Relaciona cada lloc amb què hi fas:",
    pairs: [
      { left: "hospital", right: "curar-se" },
      { left: "escola", right: "estudiar" },
      { left: "parc", right: "passejar" },
      { left: "mercat", right: "comprar" },
      { left: "estació", right: "viatjar" },
      // BEZ SLIKE namerno: jedina slika koja se nađe je `veure` — dečak sa
      // LUPOM. Za „gledati film" to je pogrešna slika; dete bi razumelo
      // „tražiti", ne „gledati". Bolje bez slike nego sa pogrešnom.
      { left: "cinema", right: "veure pel·lícules", rightNoImage: true },
    ],
  },
  {
    id: "la-ciutat-11",
    type: "fill-sentence",
    prompt: "On vas? Completa:",
    sentences: [
      {
        text: "Per comprar fruita vaig al ___.",
        blank: "mercat",
        options: ["cinema", "mercat", "hospital"],
      },
      {
        text: "Per llegir llibres vaig a la ___.",
        blank: "biblioteca",
        options: ["estació", "plaça", "biblioteca"],
      },
      {
        text: "Per viatjar en tren vaig a l'___.",
        blank: "estació",
        options: ["escola", "estació", "hospital"],
      },
      {
        text: "Per passejar vaig al ___.",
        blank: "parc",
        options: ["mercat", "museu", "parc"],
      },
    ],
  },
  {
    id: "la-ciutat-12",
    type: "classify-columns",
    prompt: "Classifica: Edificis vs Espais oberts",
    columns: [
      {
        title: "Edificis",
        items: ["hospital", "escola", "cinema", "museu", "biblioteca", "restaurant"],
      },
      {
        title: "Espais oberts",
        items: ["parc", "plaça", "carrer", "jardí", "platja"],
      },
    ],
    allItems: [
      "hospital",
      "escola",
      "cinema",
      "museu",
      "biblioteca",
      "restaurant",
      "parc",
      "plaça",
      "carrer",
      "jardí",
      "platja",
    ],
  },
  {
    id: "la-ciutat-13",
    type: "fill-sentence",
    prompt: "Descriu la teva ciutat:",
    sentences: [
      {
        text: "A la meva ciutat hi ha un ___ molt gran.",
        blank: "parc",
        options: ["llapis", "gat", "parc"],
      },
      {
        text: "El ___ és al centre de la ciutat.",
        blank: "mercat",
        options: ["bosc", "mercat", "riu"],
      },
      {
        text: "L' ___ és molt moderna.",
        blank: "escola",
        options: ["cova", "illa", "escola"],
      },
      {
        text: "La ___ té molts arbres.",
        blank: "plaça",
        options: ["plaça", "nevera", "taula"],
      },
    ],
  },
  {
    id: "la-ciutat-14",
    type: "fill-sentence",
    prompt: "Completa les frases sobre la ciutat:",
    sentences: [
      {
        text: "El ___ ens indica quan podem creuar.",
        blank: "semàfor",
        options: ["parc", "semàfor", "mercat"],
      },
      {
        text: "Creuem pel ___ quan el semàfor és verd.",
        blank: "pas de vianants",
        options: ["pas de vianants", "cinema", "hospital"],
      },
      {
        text: "Esperem l'autobús a la ___.",
        blank: "parada d'autobús",
        options: ["biblioteca", "museu", "parada d'autobús"],
      },
      {
        text: "El ___ il·lumina el carrer a la nit.",
        blank: "fanal",
        options: ["fanal", "semàfor", "parc"],
      },
    ],
  },

  // ── Slaganje reči iz dva dela (dodato 17.08.2026) ──
  // Vlasnica: „taj tip zadatka joj se svideo, stavi ga i u ostale teme."
  // Postojao je samo u temi 4. Sve reči su iz vokabulara OVE teme — ništa se
  // ne izmišlja, samo se već naučena reč seče na dva dela, po slogu.
  {
    id: "la-ciutat-slaganje",
    type: "matching",
    prompt: "Relaciona les dues parts per formar paraules:",
    joinParts: true,   // spaja delove jedne reči — izgovara se SPOJENA reč
    rightTextOnly: true,
    pairs: [
      { left: "CAR", right: "RER" },
      { left: "PLA", right: "ÇA" },
      { left: "HOS", right: "PITAL" },
      { left: "MU", right: "SEU" },
      { left: "CI", right: "NEMA" },
      { left: "TEA", right: "TRE" },
    ],
  },

  // Bonus activity: Fun drawing
  {
    id: "la-ciutat-bonus",
    type: "drawing-canvas",
    prompt: "Activitat extra! Diverteix-te, activa la creativitat i dibuixa alguna cosa màgica!",
    bonus: true,
  },
];
