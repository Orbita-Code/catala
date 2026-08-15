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
    description: ["Jo soc l'Albert."],
    sentences: [
      {
        text: "Dibuix 1. És l'avi o àvia de l'Albert? És ___.",
        blank: "l'avi",
        options: ["l'àvia", "l'avi"],
        image: "albert-dibuix-1",
      },
      {
        text: "Dibuix 2. És l'àvia o la mare de l'Albert? És ___.",
        blank: "l'àvia",
        options: ["la mare", "l'àvia"],
        image: "albert-dibuix-2",
      },
      {
        text: "Dibuix 3. És l'avi o pare de l'Albert? És ___.",
        blank: "el pare",
        options: ["el pare", "l'avi"],
        image: "albert-dibuix-3",
      },
      {
        text: "Dibuix 4. És la mare o germana de l'Albert? És ___.",
        blank: "la mare",
        options: ["la germana", "la mare"],
        image: "albert-dibuix-4",
      },
      {
        text: "Dibuix 5. És la mare o germana de l'Albert? És ___.",
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
      {
        title: "EL",
        items: ["fill", "cosí", "pare", "germà", "marit", "avi"],
      },
      {
        title: "LA",
        items: ["germana", "mare", "àvia", "filla", "cosina", "dona"],
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
        question: "El fill té els cabells del mateix color que la mare.",
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
    prompt: "Cerca i copia 6 animals. Poden anar →\u00A0←\u00A0↓\u00A0↑\u00A0↗",
    gridSize: 8,
    words: ["conill", "serp", "tortuga", "gos", "gat", "ocell"],
    grid: [
      ["c", "d", "f", "r", "m", "b", "h", "u"],
      ["o", "p", "t", "v", "n", "g", "o", "s"],
      ["n", "m", "j", "o", "c", "e", "l", "l"],
      ["i", "r", "d", "h", "f", "b", "v", "m"],
      ["l", "g", "n", "t", "s", "e", "r", "p"],
      ["l", "d", "f", "r", "m", "b", "u", "g"],
      ["t", "o", "r", "t", "u", "g", "a", "a"],
      ["h", "j", "n", "d", "p", "f", "r", "t"],
    ],
  },

  // ── Task 15: Llegeix (Carlota i Cesc - mascotes) ──
  {
    id: "la-familia-15",
    type: "multiple-choice",
    prompt:
      "Llegeix el que han contestat la Carlota i en Cesc a la pregunta: Quines mascotes tens?",
    questions: [
      {
        question: "En Cesc té un ocell?",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        question: "La Carlota té un gos?",
        options: ["Sí", "No"],
        correct: 1,
      },
      {
        question: "En Cesc té un gat?",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        question: "La Carlota té un hàmster?",
        options: ["Sí", "No"],
        correct: 0,
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

  // Bonus activity: Fun drawing
  {
    id: "la-familia-bonus",
    type: "drawing-canvas",
    prompt: "Activitat extra! Diverteix-te, activa la creativitat i dibuixa alguna cosa màgica!",
    bonus: true,
  },
];
