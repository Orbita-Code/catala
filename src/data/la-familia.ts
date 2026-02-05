import { Task } from "@/types/tasks";

export const laFamiliaTasks: Task[] = [
  // ── Task 1: Observa i completa (family members) ──
  {
    id: "la-familia-1",
    type: "label-image",
    prompt: "Observa i completa:",
    image: "familia-sofa",
    labels: [
      { text: "el fill gran", x: 10, y: 30 },
      { text: "el pare", x: 35, y: 15 },
      { text: "la mare", x: 55, y: 15 },
      { text: "l'avi", x: 85, y: 15 },
      { text: "l'àvia", x: 10, y: 75 },
      { text: "la filla petita", x: 55, y: 75 },
    ],
    options: [
      "el pare",
      "la mare",
      "el fill gran",
      "la filla petita",
      "l'avi",
      "l'àvia",
      "l'oncle",
      "la tieta",
    ],
  },

  // ── Task 2: Observa i completa (Albert's family) ──
  {
    id: "la-familia-2",
    type: "fill-sentence",
    prompt: "Observa i completa. Jo soc l'Albert.",
    sentences: [
      {
        text: "Dibuix 1. És l'avi o àvia de l'Albert? És ___.",
        blank: "l'avi",
        options: ["l'àvia", "l'avi"],
      },
      {
        text: "Dibuix 2. És l'àvia o la mare de l'Albert? És ___.",
        blank: "l'àvia",
        options: ["la mare", "l'àvia"],
      },
      {
        text: "Dibuix 3. És l'avi o pare de l'Albert? És ___.",
        blank: "el pare",
        options: ["el pare", "l'avi"],
      },
      {
        text: "Dibuix 4. És la mare o germana de l'Albert? És ___.",
        blank: "la mare",
        options: ["la germana", "la mare"],
      },
      {
        text: "Dibuix 5. És la mare o germana de l'Albert? És ___.",
        blank: "la germana",
        options: ["la germana", "la mare"],
      },
    ],
  },

  // ── Task 3: Observa (family tree vocabulary) ──
  {
    id: "la-familia-3",
    type: "label-image",
    prompt: "Observa l'arbre genealògic i completa:",
    image: "arbre-familiar",
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

  // ── Task 4: Observa i respon (tieta, oncle, cosina) ──
  {
    id: "la-familia-4",
    type: "fill-sentence",
    prompt: "Observa i respon. Jo soc l'Albert.",
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
      { word: "primer", article: "el" },
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
        question: "El pare té la samarreta marró.",
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

  // ── Task 11: Desxifra el codi i dibuixa el personatge ──
  {
    id: "la-familia-11",
    type: "decode-grid",
    prompt: "Desxifra el codi i dibuixa el personatge:",
    codeGrid: {
      A1: "ELLA",
      A2: "I",
      A3: "CASTANYS",
      A4: "GERMANS",
      B1: "TÉ",
      B2: "UNA",
      B3: "ANNA",
      B4: "ES",
      C1: "UN",
      C2: "CABELLS",
      C3: "ANYS",
      C4: "BLAUS",
      D1: "ELS",
      D2: "DOS",
      D3: "GORRO",
      D4: "DIU",
      E1: "PORTA",
      E2: "GERMANA",
      E3: "VINT",
      E4: "ULLS",
    },
    words: [
      { codes: ["A1", "B1", "E3", "C3"], answer: "ELLA TÉ VINT ANYS" },
      { codes: ["B1", "D1", "C2", "A3"], answer: "TÉ ELS CABELLS CASTANYS" },
      { codes: ["A2", "D1", "E4", "C4"], answer: "I ELS ULLS BLAUS" },
      { codes: ["B1", "D2", "A4", "A2"], answer: "TÉ DOS GERMANS I" },
      { codes: ["B2", "E2", "C2", "A3"], answer: "UNA GERMANA CABELLS CASTANYS" },
      { codes: ["A1", "B4", "D4", "B3"], answer: "ELLA ES DIU ANNA" },
      { codes: ["E1", "C1", "D3"], answer: "PORTA UN GORRO" },
      { codes: ["D3", "B4", "D4", "B3"], answer: "GORRO ES DIU ANNA" },
    ],
  },

  // ── Task 12: Observa i completa (family tree questions) ──
  {
    id: "la-familia-12",
    type: "fill-sentence",
    prompt: "Observa i completa:",
    sentences: [
      {
        text: "Qui és en Manel? És ___.",
        blank: "l'avi",
        options: ["el pare", "l'avi", "l'oncle"],
      },
      {
        text: "Qui és la Júlia? És ___.",
        blank: "l'àvia",
        options: ["la mare", "la tieta", "l'àvia"],
      },
      {
        text: "Qui és l'Anna respecte la Júlia? És ___.",
        blank: "la filla",
        options: ["la germana", "la filla", "la cosina"],
      },
      {
        text: "Amb qui està casat en Pol? Amb ___.",
        blank: "l'Anna",
        options: ["la Sara", "la Júlia", "l'Anna"],
      },
      {
        text: "Qui és la filla de l'Anna i d'en Pol? És ___.",
        blank: "la Marta",
        options: ["la Dafne", "la Marta", "la Sara"],
      },
      {
        text: "Qui és la Marta respecte la Sara? És ___.",
        blank: "la neboda",
        options: ["la cosina", "la germana", "la neboda"],
      },
      {
        text: "Qui és la Sara respecte la Dafne i en Tomàs? És ___.",
        blank: "la mare",
        options: ["la tieta", "la mare", "l'àvia"],
      },
      {
        text: "Qui és en Pere? És ___.",
        blank: "el pare de la Dafne i en Tomàs",
        options: [
          "l'oncle de la Marta",
          "el germà d'en Pol",
          "el pare de la Dafne i en Tomàs",
        ],
      },
      {
        text: "Qui és la Marta respecte la Dafne i en Tomàs? És ___.",
        blank: "la cosina",
        options: ["la germana", "la neboda", "la cosina"],
      },
    ],
  },

  // ── Task 13: Llegeix i copia (animals) ──
  {
    id: "la-familia-13",
    type: "copy-word",
    prompt: "Llegeix i copia:",
    words: [
      { catalan: "gos" },
      { catalan: "gat" },
      { catalan: "conill" },
      { catalan: "hàmster" },
      { catalan: "ocell" },
      { catalan: "tortuga" },
      { catalan: "peix" },
      { catalan: "serp" },
      { catalan: "cavall" },
    ],
  },

  // ── Task 14: Cerca i copia 6 animals (word search) ──
  {
    id: "la-familia-14",
    type: "word-search",
    prompt: "Cerca i copia 6 animals:",
    gridSize: 8,
    words: ["conill", "serp", "tortuga", "gos", "gat", "ocell"],
    grid: [
      ["c", "h", "o", "q", "z", "a", "p", "o", "g"],
      ["o", "f", "j", "c", "s", "d", "v", "b", "a"],
      ["n", "s", "a", "v", "e", "f", "d", "t", "t"],
      ["i", "m", "s", "j", "l", "l", "e", "y", "g"],
      ["l", "l", "o", "t", "u", "c", "l", "a", "e"],
      ["l", "p", "g", "r", "i", "s", "e", "r", "p"],
      ["t", "o", "r", "t", "u", "g", "a", "f", "g"],
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
      { catalan: "pare", translation: "otac/tata" },
      { catalan: "mare", translation: "majka/mama" },
      { catalan: "fill", translation: "sin" },
      { catalan: "filla", translation: "ćerka" },
      { catalan: "avi", translation: "deda" },
      { catalan: "àvia", translation: "baba" },
      { catalan: "germà", translation: "brat" },
      { catalan: "germana", translation: "sestra" },
      { catalan: "oncle", translation: "ujak/stric" },
      { catalan: "tieta", translation: "tetka/ujna" },
      { catalan: "cosí", translation: "rođak" },
      { catalan: "cosina", translation: "rođaka" },
      { catalan: "marit", translation: "muž" },
      { catalan: "dona", translation: "žena/supruga" },
      { catalan: "gos", translation: "pas" },
      { catalan: "gat", translation: "mačka" },
      { catalan: "conill", translation: "zec" },
      { catalan: "tortuga", translation: "kornjača" },
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
