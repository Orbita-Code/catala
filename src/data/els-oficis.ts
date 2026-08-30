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

  /**
   * VIŠE ZANIMANJA — ono što deca stvarno žele da budu (28.08.2026).
   *
   * Zahtev vlasnice: „Ako je Els oficis zanimanja, zašto nemamo: muzičar,
   *  slikar, vajar, sportista, prodavac/prodavačica, spasilac, i sigurno ima
   *  još mnogo zanimanja koja deca žele da postanu kad porastu, npr.
   *  astronaut, pevačica, glumica, apotekarka."
   *
   * Tema je do sada imala trinaest zanimanja i sva su bila „ozbiljna" — lekar,
   * vatrogasac, poštar. Nijedno od onih o kojima dete sanja.
   *
   * VEĆINA JE U ŽENSKOM RODU, i to namerno. Igru igraju dve devojčice, a stara
   * tema je gotovo cela bila u muškom. Katalonski i inače uči par
   * (`pintor`/`pintora`), pa je to usput i gradivo, ne samo pravednost.
   *
   * `socorrista` i `farmacèutic` su već imali svoje slike u igri, ali se nisu
   * koristili nigde — sada napokon jesu.
   */
  {
    id: "els-oficis-1b",
    type: "copy-word",
    prompt: "Què vols ser de gran? Llegeix i copia:",
    words: [
      { catalan: "astronauta", image: "astronauta" },
      { catalan: "cantant", image: "cantant" },
      { catalan: "actriu", image: "actriu" },
      { catalan: "ballarina", image: "ballarina" },
      { catalan: "esportista", image: "esportista" },
      { catalan: "pintora", image: "pintora" },
      { catalan: "escultora", image: "escultora" },
      { catalan: "músic", image: "music" },
      { catalan: "científica", image: "cientifica" },
      { catalan: "perruquera", image: "perruquera" },
      { catalan: "venedora", image: "venedora" },
      { catalan: "mecànic", image: "mecanic" },
      { catalan: "socorrista", image: "socorrista" },
      { catalan: "farmacèutic", image: "farmaceutic" },
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
      /**
       * I NOVA ZANIMANJA SE IZGOVARAJU (30.08.2026, prijava vlasnice).
       *
       * „Zašto nisi u 9. zadatak ubacio i nove reči, da deca kažu sve nove
       *  profesije."
       *
       * Bila je u pravu: dodao sam četrnaest novih zanimanja u rečnik, ali ih
       * nisam uveo nigde drugde — pa ih dete pročita i prepiše jednom, a nikad
       * ne izgovori. Reč koja se ne izgovori ne uđe u govor.
       */
      { catalan: "astronauta", translation: "astronaut", image: "astronauta" },
      { catalan: "cantant", translation: "pevačica", image: "cantant" },
      { catalan: "actriu", translation: "glumica", image: "actriu" },
      { catalan: "ballarina", translation: "balerina", image: "ballarina" },
      { catalan: "esportista", translation: "sportistkinja", image: "esportista" },
      { catalan: "pintora", translation: "slikarka", image: "pintora" },
      { catalan: "escultora", translation: "vajarka", image: "escultora" },
      { catalan: "músic", translation: "muzičar", image: "music" },
      { catalan: "científica", translation: "naučnica", image: "cientifica" },
      { catalan: "perruquera", translation: "frizerka", image: "perruquera" },
      { catalan: "venedora", translation: "prodavačica", image: "venedora" },
      { catalan: "mecànic", translation: "mehaničar", image: "mecanic" },
      { catalan: "socorrista", translation: "spasilac", image: "socorrista" },
      { catalan: "farmacèutic", translation: "apotekar", image: "farmaceutic" },
    ],
  },
  /**
   * SPOJI ZANIMANJE SA NJEGOVIM PREDMETOM (30.08.2026, zahtev vlasnice).
   *
   * „Vidim da nisi ubacio ni neki novi zadatak da im bude zanimljivo, tipa da
   *  povežu nove profesije sa njihovim instrumentima, predmetima ili
   *  rekvizitima."
   *
   * Ovo je najbolji način da se zanimanje ZAPAMTI, a ne samo pročita: dete ne
   * uči reč nego vezu — ko čime radi. I jedna i druga strana imaju sliku, pa
   * zadatak radi i pre nego što dete pouzdano čita.
   */
  {
    id: "els-oficis-9b",
    type: "matching",
    prompt: "Relaciona cada ofici amb el seu objecte:",
    pairs: [
      { left: "músic", right: "guitarra", leftImage: "music", rightImage: "guitarra" },
      { left: "cantant", right: "micròfon", leftImage: "cantant", rightImage: "microfon" },
      { left: "astronauta", right: "coet", leftImage: "astronauta", rightImage: "coet" },
      { left: "pintora", right: "pinzell", leftImage: "pintora", rightImage: "pinzell" },
      { left: "perruquera", right: "tisores", leftImage: "perruquera", rightImage: "tisores" },
      { left: "esportista", right: "sabatilles", leftImage: "esportista", rightImage: "sabatilles" },
      { left: "metge", right: "estetoscopi", leftImage: "metge", rightImage: "estetoscopi" },
      { left: "bomber", right: "extintor", leftImage: "bomber", rightImage: "extintor" },
    ],
  },

  /**
   * KO ŠTA RADI (30.08.2026) — treći nov zadatak iz istog zahteva.
   *
   * Dete gleda lik i bira šta on RADI, ne kako se zove. Time reč prestaje da
   * bude naziv i postaje radnja, a to je ono što ostane u govoru.
   * Sve slike već postoje; ponuđeni odgovori su glagoli koje tema uči.
   */
  {
    id: "els-oficis-9c",
    type: "multiple-choice",
    prompt: "Què fa? Tria la resposta correcta:",
    questions: [
      { question: "Què fa la cantant?", image: "cantant",
        options: ["canta", "pinta", "balla", "cuina"], correct: 0 },
      { question: "Què fa la ballarina?", image: "ballarina",
        options: ["cuina", "balla", "canta", "pinta"], correct: 1 },
      { question: "Què fa la pintora?", image: "pintora",
        options: ["balla", "canta", "pinta", "cuina"], correct: 2 },
      { question: "Què fa el mecànic?", image: "mecanic",
        options: ["canta", "balla", "pinta", "arregla cotxes"], correct: 3 },
      { question: "Què fa la científica?", image: "cientifica",
        options: ["investiga", "balla", "canta", "pinta"], correct: 0 },
      { question: "Què fa la venedora?", image: "venedora",
        options: ["balla", "ven coses", "canta", "pinta"], correct: 1 },
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
