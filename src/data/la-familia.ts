import { Task } from "@/types/tasks";

export const laFamiliaTasks: Task[] = [

  // ── Task 1: Observa i completa els noms de la família ──
  {
    id: "la-familia-1",
    type: "fill-sentence",
    prompt: "Observa i completa els noms de la família:",
    description: [
      "• El pare es diu Borja.",
      "• La mare es diu Sofia.",
      "• El fill es diu Jaume.",
      "• La filla es diu Fiona.",
      "• L'avi es diu Miquel.",
      "• L'àvia es diu Anna.",
    ],
    image: "familia-sofa",
    sentences: [
      {
        text: "El pare es diu ___.",
        blank: "Borja",
        options: ["Sofia", "Borja", "Miquel"],
      },
      {
        text: "La mare es diu ___.",
        blank: "Sofia",
        options: ["Anna", "Fiona", "Sofia"],
      },
      {
        text: "El fill es diu ___.",
        blank: "Jaume",
        options: ["Jaume", "Borja", "Miquel"],
      },
      {
        text: "La filla es diu ___.",
        blank: "Fiona",
        options: ["Sofia", "Anna", "Fiona"],
      },
      {
        text: "L'avi es diu ___.",
        blank: "Miquel",
        options: ["Miquel", "Borja", "Jaume"],
      },
      {
        text: "L'àvia es diu ___.",
        blank: "Anna",
        options: ["Fiona", "Sofia", "Anna"],
      },
    ],
  },

  // ── Task 3: Observa (family tree vocabulary) ──
  {
    id: "la-familia-3",
    type: "label-image",
    prompt: "Observa l'arbre genealògic i completa:",
    image: "arbre-familiar-complet",
    labels: [
      { text: "avi", x: 20, y: 15 },
      { text: "àvia", x: 60, y: 15 },
      { text: "pare", x: 20, y: 50 },
      { text: "mare", x: 60, y: 50 },
      { text: "fill", x: 20, y: 85 },
      { text: "filla", x: 60, y: 85 },
    ],
    options: ["avi", "àvia", "pare", "mare", "fill", "filla", "oncle", "tieta"],
  },

  // ── Task 2: Observa i completa (Albert's family) ──
  {
    id: "la-familia-2",
    type: "fill-sentence",
    prompt: "Observa i completa:",
    image: "albert",
    // Ime stoji ISPOD slike, upisano u kodu — ne na samoj slici.
    // Tekst na ilustraciji je zabranjen: iste slike se dele za sve jezike.
    imageLabel: "Albert",
    description: ["Jo soc l'Albert."],
    // BEZ „Dibuix 1, 2, 3…" (24.08.2026, zahtev vlasnice). Ti brojevi su iz
    // sveske, gde su crteži poređani na stranici i broj kaže na koji se misli.
    // U igrici svaka rečenica ima SVOJU sliku tik uz sebe, pa broj ništa ne
    // znači — samo je jedna reč više za dete koje tek uči da čita.
    //
    // Uz to je ispravljena gramatika: uz drugu mogućnost je falio član
    // („o àvia" → „o l'àvia", „o pare" → „o el pare", „o germana" → „o la
    // germana"). Pitanje sada nudi dva puna oblika, kao što i odgovor traži.
    sentences: [
      {
        text: "És l'avi o l'àvia de l'Albert? És ___.",
        blank: "l'avi",
        options: ["l'àvia", "l'avi"],
        image: "albert-dibuix-1",
      },
      {
        text: "És l'àvia o la mare de l'Albert? És ___.",
        blank: "l'àvia",
        options: ["la mare", "l'àvia"],
        image: "albert-dibuix-2",
      },
      {
        text: "És l'avi o el pare de l'Albert? És ___.",
        blank: "el pare",
        options: ["el pare", "l'avi"],
        image: "albert-dibuix-3",
      },
      {
        text: "És la mare o la germana de l'Albert? És ___.",
        blank: "la mare",
        options: ["la germana", "la mare"],
        image: "albert-dibuix-4",
      },
      {
        text: "És la mare o la germana de l'Albert? És ___.",
        blank: "la germana",
        options: ["la germana", "la mare"],
        image: "albert-dibuix-5",
      },
    ],
  },

  // ── Task 6: Classifica (EL vs LA) ──
  {
    id: "la-familia-6",
    type: "classify-columns",
    prompt: "Classifica:",
    columns: [
      // `nebot` i `neboda` — ODLUKA VLASNICE 17.08.2026, posle provere.
      //
      // Reči NISU ispisane ni u jednoj vežbi sveske. Ali vežba 12 pita
      // „Qui és la Marta respecte la Sara?" — a odgovor na to je `neboda`.
      // Dakle sveska ih OČEKUJE, a ne uči. Vlasnica je odlučila da ih ostavimo,
      // pa dete reč i nauči umesto da se od njega traži da je zna.
      // Ovde im je i pravo mesto: uz član se odmah vidi razlika muškog i
      // ženskog roda, a slike postoje od ranije.
      {
        title: "EL",
        items: ["fill", "cosí", "pare", "germà", "marit", "avi", "nebot"],
      },
      {
        title: "LA",
        items: ["germana", "mare", "àvia", "filla", "cosina", "dona", "neboda"],
      },
    ],
    allItems: [
      "germana",
      "fill",
      "mare",
      "cosí",
      "pare",
      "àvia",
      "filla",
      "cosina",
      "germà",
      "marit",
      "dona",
      "avi",
      "nebot",
      "neboda",
    ],
    circleMode: true,
  },

  // ── Task 4: Observa i respon (tieta, oncle, cosina) ──
  {
    id: "la-familia-4",
    type: "fill-sentence",
    prompt: "Observa i respon. Jo soc l'Albert.",
    // Zadatak je govorio „Observa" (pogledaj), a NIJE bilo šta da se gleda —
    // slika `albert` je postojala i koristila se samo u prethodnom zadatku.
    // Nadjeno 14.08.2026 novom proverom „ime u zadatku → slika sa tim imenom".
    image: "albert",
    sentences: [
      {
        text: "Ella és la germana de la meva mare. És la meva ___.",
        blank: "tieta",
        options: ["cosina", "tieta", "àvia"],
      },
      {
        text: "Ell és el marit de la meva tieta. És el meu ___.",
        blank: "oncle",
        options: ["pare", "avi", "oncle"],
      },
      {
        text: "Ella és la filla del meu oncle i de la meva tieta. És la meva ___.",
        blank: "cosina",
        options: ["germana", "cosina", "tieta"],
      },
    ],
  },

  // ── Task 7: Completa amb (articles) ──
  {
    id: "la-familia-7",
    type: "add-article",
    prompt: "Completa amb LA, EL, LES o ELS:",
    words: [
      { word: "germà", article: "el" },
      { word: "tietes", article: "les" },
      { word: "àvia", article: "la" },
      { word: "germana", article: "la" },
      { word: "nét", article: "el" },
      { word: "germanes", article: "les" },
      { word: "cosins", article: "els" },
      { word: "mare", article: "la" },
      { word: "pare", article: "el" },
      { word: "oncle", article: "el" },
      { word: "tia", article: "la" },
      { word: "germans", article: "els" },
    ],
  },

  // ── Task 8: Separa les paraules i copia ──
  {
    id: "la-familia-8",
    type: "separate-words",
    prompt: "Separa les paraules i copia:",
    items: [
      {
        joined: "ElmeugermàesdiuBruno.",
        words: ["El", "meu", "germà", "es", "diu", "Bruno."],
      },
      {
        joined: "LamevamareesdiuAnna.",
        words: ["La", "meva", "mare", "es", "diu", "Anna."],
      },
      {
        joined: "ElmeupareesdiuSergi.",
        words: ["El", "meu", "pare", "es", "diu", "Sergi."],
      },
      {
        joined: "LamevagermanaesdiuOna.",
        words: ["La", "meva", "germana", "es", "diu", "Ona."],
      },
      {
        joined: "ElmeucosíesdiuJoan.",
        words: ["El", "meu", "cosí", "es", "diu", "Joan."],
      },
    ],
  },

  // ── Task 10: Observa i marca les oracions correctes ──
  {
    id: "la-familia-10",
    type: "multiple-choice",
    prompt: "Observa i marca les oracions correctes:",
    image: "familia-sofa",
    questions: [
      {
        question: "La mare té els cabells curts.",
        options: ["Sí", "No"],
        correct: 1,
      },
      {
        question: "El pare és més alt que la mare.",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        question: "El pare té els cabells curts.",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        question: "La mare té els cabells llargs.",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        question: "El fill té la samarreta vermella.",
        options: ["Sí", "No"],
        correct: 1,
      },
      {
        question: "El pare té la samarreta lila.",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        // BILO: „…del mateix color que la MARE" sa tačnim odgovorom „Sí".
        //
        // Prijava vlasnice 25.08.2026: ćerka je odgovorila „No" i bila je u
        // pravu. Na slici mama ima dugu tamnu (skoro crnu) kosu, a sin
        // tamnobraon — dete od sedam godina to vidi kao dve različite boje, i
        // teško da je iko drugačije vidi. Pitanje je bilo neodgovorivo, a
        // aplikacija je tačan odgovor deteta obeležila kao grešku.
        //
        // SADA se poredi sa TATOM (odluka vlasnice): otac i sin na slici imaju
        // istu tamnobraon kosu, pa je „Sí" nedvosmisleno tačno.
        question: "El fill té els cabells del mateix color que el pare.",
        options: ["Sí", "No"],
        correct: 0,
      },
    ],
  },

  // ── Task 11: Relaciona cada membre de la família amb la seva paraula ──
  {
    id: "la-familia-11",
    type: "matching",
    prompt: "Relaciona cada membre de la família amb la seva paraula.",
    illustrationMatch: true,
    pairs: [
      { left: "el pare", right: "el pare" },
      { left: "la mare", right: "la mare" },
      { left: "l'avi", right: "l'avi" },
      { left: "l'àvia", right: "l'àvia" },
      { left: "el bebè", right: "el bebè" },
    ],
  },

  // ── Task 12: Observa l'arbre i completa (relacions, sense noms) ──
  // Pitanja o rodbinskim odnosima koje dete čita sa slike porodičnog stabla
  // (3 generacije: avi/àvia → pare/mare → fill/filla). Bez imena — slika je
  // bez teksta, a odnosi su jednoznačni iz stabla.
  {
    id: "la-familia-12",
    type: "fill-sentence",
    prompt: "Observa l'arbre genealògic i completa:",
    image: "arbre-familiar-complet",
    sentenceImages: false,
    columns: 2,
    sentences: [
      {
        text: "El pare de la mare és ___.",
        blank: "l'avi",
        options: ["el pare", "l'avi", "l'oncle"],
      },
      {
        text: "La mare del pare és ___.",
        blank: "l'àvia",
        options: ["la mare", "la tieta", "l'àvia"],
      },
      {
        text: "La filla de l'avi i l'àvia és ___.",
        blank: "la mare",
        options: ["la filla", "la germana", "la mare"],
      },
      {
        text: "El fill de l'avi i l'àvia és ___.",
        blank: "el pare",
        options: ["l'avi", "el fill", "el pare"],
      },
      {
        text: "La filla és la ___ del fill.",
        blank: "germana",
        options: ["cosina", "germana", "filla"],
      },
    ],
  },

  // ── Task 13: Llegeix i copia (animals) ──
  {
    id: "la-familia-13",
    type: "copy-word",
    prompt: "Llegeix i copia:",
    words: [
      { catalan: "gos", image: "gos" },
      { catalan: "gat", image: "gat" },
      { catalan: "conill", image: "conill" },
      { catalan: "hàmster", image: "hamster" },
      { catalan: "ocell", image: "ocell" },
      { catalan: "tortuga", image: "tortuga" },
      { catalan: "peix", image: "peix" },
      { catalan: "serp", image: "serp" },
      { catalan: "cavall", image: "cavall" },
    ],
  },

  // ── Task 14: Cerca i copia 6 animals (word search) ──
  {
    id: "la-familia-14",
    type: "word-search",
    prompt: "Cerca i copia 6 animals. Poden anar →\u00A0←\u00A0↓\u00A0↑",
    gridSize: 10,
    words: ["conill", "serp", "tortuga", "gos", "gat", "ocell", "hamster", "cavall", "peix"],
    grid: [
      ["j", "p", "r", "e", "t", "s", "m", "a", "h", "v"],
      ["y", "t", "l", "l", "a", "v", "a", "c", "z", "d"],
      ["g", "o", "s", "j", "v", "v", "k", "p", "z", "l"],
      ["v", "r", "w", "k", "b", "q", "p", "e", "i", "x"],
      ["j", "t", "q", "n", "l", "h", "f", "b", "n", "y"],
      ["c", "u", "k", "m", "d", "p", "g", "j", "i", "t"],
      ["a", "g", "v", "v", "l", "l", "i", "n", "o", "c"],
      ["t", "a", "g", "l", "l", "e", "c", "o", "e", "s"],
      ["k", "x", "b", "j", "z", "y", "e", "d", "z", "x"],
      ["x", "u", "u", "s", "e", "r", "p", "l", "q", "h"],
    ],
  },

  // ── Task 15: Llegeix (Carlota i Cesc - mascotes) ──
  {
    id: "la-familia-15",
    type: "multiple-choice",
    prompt:
      "Llegeix el que han contestat la Carlota i en Cesc a la pregunta: Quines mascotes tens?",
    /**
     * TEKST KOJI SE ČITA — VRAĆEN 25.08.2026.
     *
     * Zadatak je od deteta tražio da pročita šta su Carlota i Cesc odgovorili,
     * a **odgovora nigde nije bilo** — ni teksta, ni slike. Dete je moglo samo
     * da pogađa, a pogrešna pogodba mu je upisivana kao greška.
     *
     * Rečenice su prepisane sa fotografije sveske (`Svi zadaci/La familia/
     * IMG_0996.JPG`, vežba 15) — iz oblačića iznad Carlote i Cesca.
     */
    speakers: [
      {
        name: "CARLOTA",
        image: "carlota",
        text: "Tinc un gos, un conill i tres gats.",
        pets: [
          { image: "gos", count: 1 },
          { image: "conill", count: 1 },
          { image: "gat", count: 3 },
        ],
      },
      {
        name: "CESC",
        image: "cesc",
        text: "Tinc dos ocells, tres peixos i una tortuga.",
        pets: [
          { image: "ocell", count: 2 },
          { image: "peix", count: 3 },
          { image: "tortuga", count: 1 },
        ],
      },
    ],
    /**
     * TRI OD ČETIRI TAČNA ODGOVORA BILA SU POGREŠNA (ispravljeno 25.08.2026).
     *
     * Provereno prema svesci, reč po reč:
     *   • Carlota ima psa („Tinc un gos") — stajalo je „No"  → sada „Sí"
     *   • Cesc NEMA mačku (ptice, ribe, kornjača) — stajalo „Sí" → sada „No"
     *   • Carlota NEMA hrčka (pas, zec, mačke) — stajalo „Sí" → sada „No"
     * Samo prvo pitanje (Cesc ima pticu) bilo je tačno.
     */
    questions: [
      {
        question: "En Cesc té un ocell?",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        question: "La Carlota té un gos?",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        question: "En Cesc té un gat?",
        options: ["Sí", "No"],
        correct: 1,
      },
      {
        question: "La Carlota té un hàmster?",
        options: ["Sí", "No"],
        correct: 1,
      },
    ],
  },

  // ── Autoavaluació ──
  {
    id: "la-familia-16",
    type: "self-assessment",
    prompt: "Autoavaluació: La família",
    items: [
      { catalan: "pare", translation: "otac/tata", image: "pare" },
      { catalan: "mare", translation: "majka/mama", image: "mare" },
      { catalan: "fill", translation: "sin", image: "fill" },
      { catalan: "filla", translation: "ćerka", image: "filla" },
      { catalan: "avi", translation: "deda", image: "avi" },
      { catalan: "àvia", translation: "baba", image: "avia" },
      { catalan: "germà", translation: "brat", image: "germa" },
      { catalan: "germana", translation: "sestra", image: "germana" },
      { catalan: "oncle", translation: "ujak/stric", image: "oncle" },
      { catalan: "tieta", translation: "tetka/ujna", image: "tieta" },
      { catalan: "cosí", translation: "rođak", image: "cosi" },
      { catalan: "cosina", translation: "rođaka", image: "cosina" },
      { catalan: "marit", translation: "muž", image: "marit" },
      { catalan: "dona", translation: "žena/supruga", image: "dona" },
      { catalan: "gos", translation: "pas", image: "gos" },
      { catalan: "gat", translation: "mačka", image: "gat" },
      { catalan: "conill", translation: "zec", image: "conill" },
      { catalan: "tortuga", translation: "kornjača", image: "tortuga" },
    ],
  },


  // ── Slaganje reči iz dva dela (dodato 17.08.2026) ──
  // Vlasnica: „taj tip zadatka joj se svideo, stavi ga i u ostale teme."
  // Postojao je samo u temi 4. Sve reči su iz vokabulara OVE teme — ništa se
  // ne izmišlja, samo se već naučena reč seče na dva dela, po slogu.
  {
    id: "la-familia-slaganje",
    type: "matching",
    prompt: "Relaciona les dues parts per formar paraules:",
    joinParts: true,   // spaja delove jedne reči — izgovara se SPOJENA reč
    rightTextOnly: true,
    pairs: [
      { left: "GER", right: "MÀ" },
      { left: "CO", right: "SÍ" },
      { left: "NE", right: "BOT" },
      { left: "À", right: "VIA" },
      { left: "FI", right: "LLA" },
      { left: "ON", right: "CLE" },
    ],
  },

  // Bonus activity: Fun drawing
  {
    id: "la-familia-bonus",
    type: "drawing-canvas",
    prompt: "Activitat extra! Diverteix-te, activa la creativitat i dibuixa alguna cosa màgica!",
    bonus: true,
  },
];
