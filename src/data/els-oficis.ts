import { Task } from "@/types/tasks";

export const elsOficisTasks: Task[] = [

  {
    id: "els-oficis-1",
    type: "copy-word",
    prompt: "Llegeix i copia els oficis:",
    words: [
      { catalan: "mestre", image: "mestre" },
      { catalan: "metge", image: "metge" },
      { catalan: "bomber", image: "bomber" },
      { catalan: "policia", image: "policia" },
      { catalan: "cuiner", image: "cuiner" },
      { catalan: "infermer", image: "infermer" },
      { catalan: "pilot", image: "pilot" },
      { catalan: "cambrer", image: "cambrer" },
      { catalan: "dentista", image: "dentista" },
      { catalan: "veterinari", image: "veterinari" },
      { catalan: "jardiner", image: "jardiner" },
      { catalan: "pagès", image: "pages" },
    ],
  },
  {
    id: "els-oficis-2",
    type: "fill-letters",
    prompt: "Completa les lletres que falten:",
    words: [
      { word: "mestre", hint: "m_str_", image: "mestre" },
      { word: "metge", hint: "m_tg_", image: "metge" },
      { word: "bomber", hint: "b_mb_r", image: "bomber" },
      { word: "policia", hint: "p_lic_a", image: "policia" },
      { word: "cuiner", hint: "c_in_r", image: "cuiner" },
      { word: "infermer", hint: "inf_rm_r", image: "infermer" },
      { word: "pilot", hint: "p_l_t", image: "pilot" },
      { word: "cambrer", hint: "c_mbr_r", image: "cambrer" },
      { word: "dentista", hint: "d_nt_sta", image: "dentista" },
      { word: "jardiner", hint: "j_rdi_er", image: "jardiner" },
    ],
  },
  {
    id: "els-oficis-3",
    type: "unscramble",
    prompt: "Ordena les lletres per formar la paraula:",
    words: [
      { scrambled: "egtme", correct: "metge", image: "metge" },
      { scrambled: "lotip", correct: "pilot", image: "pilot" },
      { scrambled: "boemrb", correct: "bomber", image: "bomber" },
      { scrambled: "nricue", correct: "cuiner", image: "cuiner" },
      { scrambled: "gèspa", correct: "pagès", image: "pages" },
    ],
  },
  {
    id: "els-oficis-4",
    type: "matching",
    prompt: "Relaciona cada ofici amb el seu lloc de treball:",
    pairs: [
      { left: "mestre", right: "escola" },
      { left: "metge", right: "hospital" },
      { left: "bomber", right: "parc de bombers" },
      { left: "cuiner", right: "restaurant" },
      { left: "pilot", right: "avió" },
    ],
  },
  {
    id: "els-oficis-5",
    type: "word-search",
    prompt: "Troba les paraules a la sopa de lletres. Poden anar \u2192\u00A0\u2193",
    gridSize: 10,
    /**
     * REČI SU SAMO ONE KOJE TEMA STVARNO UČI I KOJE IMAJU SLIKU (27.08.2026).
     *
     * Prijava vlasnice: „nemamo slike za granger i pintor u sopa de lletres, a
     *  ne vidim da se spominju kasnije u zadacima".
     * Tačno: `granger` i `pintor` stajali su SAMO ovde — nigde drugde u temi, i
     * nijedno nije imalo sliku. Dete traži reč koju nikad nije videlo i koju
     * posle nigde ne sretne. Zamenjeni su `jardiner` i `carter`, koji se u temi
     * pojavljuju u više zadataka i imaju svoju sliku.
     */
    words: ["metge", "pilot", "bomber", "pagès", "cuiner", "mestre", "policia", "dentista", "jardiner", "carter"],
    grid: [
      ["f", "o", "f", "j", "p", "m", "z", "b", "j", "a"],
      ["i", "d", "e", "n", "t", "i", "s", "t", "a", "t"],
      ["z", "m", "q", "i", "g", "h", "p", "c", "r", "e"],
      ["b", "e", "h", "l", "g", "v", "o", "u", "d", "n"],
      ["o", "s", "m", "p", "c", "m", "l", "i", "i", "p"],
      ["m", "t", "e", "i", "a", "l", "i", "n", "n", "a"],
      ["b", "r", "t", "l", "r", "f", "c", "e", "e", "g"],
      ["e", "e", "g", "o", "t", "n", "i", "r", "r", "e"],
      ["r", "x", "e", "t", "e", "o", "a", "k", "l", "s"],
      ["a", "i", "h", "l", "r", "a", "n", "h", "w", "g"],
    ],
  },
  {
    id: "els-oficis-6",
    type: "classify-columns",
    prompt: "Classifica: treballa dins o fora?",
    columns: [
      {
        title: "Dins",
        items: ["mestre", "metge", "dentista", "cuiner", "pilot"],
      },
      {
        title: "Fora",
        items: ["bomber", "policia", "jardiner", "pagès", "carter"],
      },
    ],
    allItems: [
      "mestre",
      "metge",
      "dentista",
      "cuiner",
      "pilot",
      "bomber",
      "policia",
      "jardiner",
      "pagès",
      "carter",
    ],
  },
  {
    id: "els-oficis-7",
    type: "fill-sentence",
    prompt: "Completa la frase:",
    sentences: [
      {
        text: "El ___ apaga el foc.",
        blank: "bomber",
        options: ["mestre", "pilot", "bomber"],
      },
      {
        text: "El ___ ensenya a l'escola.",
        blank: "mestre",
        options: ["metge", "mestre", "cuiner"],
      },
      {
        text: "El ___ cura els malalts.",
        blank: "metge",
        options: ["dentista", "metge", "jardiner"],
      },
      {
        text: "El ___ porta les cartes.",
        blank: "carter",
        options: ["policia", "bomber", "carter"],
      },
    ],
  },
  // Zadatak „Tria la resposta correcta" — UKLONJEN 27.08.2026.
  //
  // Tema je isti sadržaj tražila u ČETIRI zadatka. Izmereno, koje zanimanje
  // gde traži:
  //                     zad.8  zad.10  zad.13  zad.14
  //   vatrogasac          ✓      ✓       ✓
  //   lekar               ✓      ✓       ✓      ✓
  //   učitelj                    ✓       ✓      ✓
  //   kuvar               ✓              ✓      ✓
  //   pilot               ✓              ✓      ✓
  //   policajac                  ✓
  //
  // Zadatak 8 je POTPUNO POKRIVEN ostalima — nijedno zanimanje nije samo u
  // njemu — i po obliku je isti kao zadatak 10 (oba su „Qui…?" sa četiri
  // ponuđena zanimanja). Bio je četvrto ponavljanje istog gradiva.
  //
  // Ostala tri OSTAJU, jer su tri različita oblika iste teme: pitanje (10),
  // zagonetka (13) i „kad porastem, biću…" (14). Raznovrsnost pomaže, četvrto
  // ponavljanje istog oblika ne.
  //
  // Sadržaj je zapisan da se zna šta je bilo:
  //   Qui treballa a l'hospital?          → metge
  //   Qui apaga els incendis?             → bomber
  //   Qui prepara el menjar al restaurant? → cuiner
  //   Qui condueix un avió?               → pilot

  {
    id: "els-oficis-9",
    type: "self-assessment",
    prompt: "Saps dir aquestes paraules en català? Toca el micròfon i digues la paraula.",
    items: [
      { catalan: "mestre", translation: "učitelj", image: "mestre" },
      { catalan: "metge", translation: "lekar", image: "metge" },
      { catalan: "bomber", translation: "vatrogasac", image: "bomber" },
      { catalan: "policia", translation: "policajac", image: "policia" },
      { catalan: "cuiner", translation: "kuvar", image: "cuiner" },
      { catalan: "pilot", translation: "pilot", image: "pilot" },
      { catalan: "dentista", translation: "zubar", image: "dentista" },
      { catalan: "infermer", translation: "medicinska sestra/tehničar", image: "infermer" },
    ],
  },
  {
    id: "els-oficis-10",
    type: "multiple-choice",
    prompt: "Qui és? Tria l'ofici correcte:",
    questions: [
      {
        question: "Qui apaga focs?",
        options: ["Bomber", "Policia", "Metge", "Cuiner"],
        correct: 0,
      },
      {
        question: "Qui cuida la seguretat?",
        options: ["Mestre", "Bomber", "Policia", "Jardiner"],
        correct: 2,
      },
      {
        question: "Qui cura els malalts?",
        options: ["Cuiner", "Pilot", "Jardiner", "Metge"],
        correct: 3,
      },
      {
        question: "Qui ensenya als nens?",
        options: ["Mestre", "Carter", "Bomber", "Policia"],
        correct: 0,
      },
    ],
  },
  {
    id: "els-oficis-11",
    type: "fill-sentence",
    prompt: "Què fa cada professional?",
    sentences: [
      {
        text: "El ___ cuida els animals.",
        blank: "veterinari",
        options: ["bomber", "veterinari", "mestre"],
      },
      {
        text: "L' ___ ajuda el metge a l'hospital.",
        blank: "infermer",
        options: ["cuiner", "policia", "infermer"],
      },
      {
        text: "El ___ cultiva verdures i fruites.",
        blank: "pagès",
        options: ["pilot", "pagès", "cambrer"],
      },
      {
        text: "El ___ arregla les dents.",
        blank: "dentista",
        options: ["jardiner", "carter", "dentista"],
      },
    ],
  },
  {
    id: "els-oficis-13",
    type: "matching",
    prompt: "Relaciona cada eina amb el seu ofici:",
    pairs: [
      { left: "estetoscopi", right: "metge" },
      { left: "extintor", right: "bomber" },
      { left: "xeringa", right: "infermer" },
      { left: "paella", right: "cuiner" },
      { left: "pissarra", right: "mestre" },
      { left: "tisores", right: "jardiner" },
    ],
  },
  {
    id: "els-oficis-12",
    type: "fill-sentence",
    prompt: "Endevina quin ofici és:",
    sentences: [
      {
        text: "Apaga els incendis i porta un casc: ___.",
        blank: "bomber",
        options: ["bomber", "cuiner", "mestre"],
      },
      {
        text: "Cura les persones malaltes a l'hospital: ___.",
        blank: "metge",
        options: ["pilot", "metge", "jardiner"],
      },
      {
        text: "Ensenya a llegir i escriure a l'escola: ___.",
        blank: "mestre",
        options: ["mestre", "policia", "cambrer"],
      },
      {
        text: "Cuina plats deliciosos al restaurant: ___.",
        blank: "cuiner",
        options: ["dentista", "cuiner", "pilot"],
      },
      {
        text: "Condueix l'avió pel cel: ___.",
        blank: "pilot",
        options: ["bomber", "metge", "pilot"],
      },
    ],
  },
  {
    id: "els-oficis-14",
    type: "fill-sentence",
    prompt: "De gran vull ser...",
    sentences: [
      {
        text: "De gran vull ser ___ per curar la gent.",
        blank: "metge",
        options: ["cuiner", "metge", "jardiner"],
      },
      {
        text: "De gran vull ser ___ per ensenyar.",
        blank: "mestre",
        options: ["bomber", "policia", "mestre"],
      },
      {
        text: "De gran vull ser ___ per volar.",
        blank: "pilot",
        options: ["pagès", "pilot", "cambrer"],
      },
      {
        text: "De gran vull ser ___ per cuinar.",
        blank: "cuiner",
        options: ["cuiner", "dentista", "carter"],
      },
    ],
  },

  // ── Slaganje reči iz dva dela (dodato 17.08.2026) ──
  // Vlasnica: „taj tip zadatka joj se svideo, stavi ga i u ostale teme."
  // Postojao je samo u temi 4. Sve reči su iz vokabulara OVE teme — ništa se
  // ne izmišlja, samo se već naučena reč seče na dva dela, po slogu.
  {
    id: "els-oficis-slaganje",
    type: "matching",
    prompt: "Relaciona les dues parts per formar paraules:",
    joinParts: true,   // spaja delove jedne reči — izgovara se SPOJENA reč
    rightTextOnly: true,
    pairs: [
      { left: "MES", right: "TRE" },
      { left: "MET", right: "GE" },
      { left: "BOM", right: "BER" },
      { left: "PO", right: "LICIA" },
      { left: "CUI", right: "NER" },
      { left: "DEN", right: "TISTA" },
    ],
  },

  // Bonus activity: Fun drawing
  {
    id: "els-oficis-bonus",
    type: "drawing-canvas",
    prompt: "Activitat extra! Diverteix-te, activa la creativitat i dibuixa alguna cosa màgica!",
    bonus: true,
  },
];
