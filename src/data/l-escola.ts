import { Task } from "@/types/tasks";

export const lEscolaTasks: Task[] = [
  // ── Task 1: Llegeix i copia (rooms) ──
  {
    id: "l-escola-1",
    type: "copy-word",
    prompt: "Llegeix i copia les paraules:",
    words: [
      { catalan: "aula", image: "aula" },
      { catalan: "biblioteca", image: "biblioteca" },
      { catalan: "laboratori", image: "laboratori" },
      { catalan: "passadís", image: "passadis" },
      { catalan: "lavabo", image: "lavabo" },
      { catalan: "menjador", image: "menjador" },
      { catalan: "gimnàs", image: "gimnas" },
      { catalan: "pati", image: "pati" },
    ],
  },

  // ── Task 2: Completa les lletres que falten (rooms) ──
  {
    id: "l-escola-2",
    type: "fill-letters",
    prompt: "Completa amb les lletres que falten:",
    words: [
      { word: "aula", hint: "a_l_", image: "aula" },
      { word: "biblioteca", hint: "b_bl_ot_ca", image: "biblioteca" },
      { word: "laboratori", hint: "l_b_r_t_ri", image: "laboratori" },
      { word: "passadís", hint: "p_ss_d_s", image: "passadis" },
      { word: "lavabo", hint: "l_v_b_", image: "lavabo" },
      { word: "menjador", hint: "m_nj_d_r", image: "menjador" },
      { word: "gimnàs", hint: "g_mn_s", image: "gimnas" },
      { word: "pati", hint: "p_t_", image: "pati" },
    ],
  },

  // ── Task 3: Relaciona i escriu - És la / És el (articles) ──
  {
    id: "l-escola-3",
    type: "add-article",
    prompt: "Escriu l'article correcte: el o la?",
    words: [
      { word: "classe", article: "la" },
      { word: "pati", article: "el" },
      { word: "biblioteca", article: "la" },
      { word: "laboratori", article: "el" },
      { word: "passadís", article: "el" },
      { word: "lavabo", article: "el" },
      { word: "menjador", article: "el" },
      { word: "gimnàs", article: "el" },
    ],
  },

  // ── Task 4: Ordena les síl·labes i escriu ──
  {
    id: "l-escola-4",
    type: "unscramble",
    prompt: "Ordena les síl·labes i escriu la paraula:",
    words: [
      { scrambled: "TI-PA", correct: "pati", image: "pati" },
      { scrambled: "VA-LA-BO", correct: "lavabo", image: "lavabo" },
      { scrambled: "LA-AU", correct: "aula", image: "aula" },
      { scrambled: "PAS-DÍS-SA", correct: "passadís", image: "passadis" },
      { scrambled: "DOR-JA-MEN", correct: "menjador", image: "menjador" },
    ],
  },

  // ── Task 5: Observa - ASSIGNATURES ──
  {
    id: "l-escola-5",
    type: "copy-word",
    prompt: "Observa i copia les assignatures:",
    words: [
      { catalan: "matemàtiques", image: "matematiques" },
      { catalan: "llengües", image: "llengues" },
      { catalan: "música", image: "musica" },
      { catalan: "ciències", image: "ciencies" },
      { catalan: "anglès", image: "angles" },
      { catalan: "informàtica", image: "informatica" },
      { catalan: "educació física", image: "educacio-fisica" },
      { catalan: "plàstica", image: "plastica" },
    ],
  },

  // ── Task 6: Escriu el nom de les assignatures sense mirar ──
  {
    id: "l-escola-6",
    type: "fill-letters",
    prompt: "Escriu el nom de les assignatures sense mirar!",
    words: [
      { word: "matemàtiques", hint: "m_t_m_t_qu_s", image: "matematiques" },
      { word: "llengües", hint: "ll_ng__s", image: "llengues" },
      { word: "música", hint: "m_s_c_", image: "musica" },
      { word: "ciències", hint: "c__nc__s", image: "ciencies" },
      { word: "anglès", hint: "_ngl_s", image: "angles" },
      { word: "informàtica", hint: "_nf_rm_t_c_", image: "informatica" },
      { word: "educació física", hint: "ed_c_c__ f_s_c_", image: "educacio-fisica" },
      { word: "plàstica", hint: "pl_st_c_", image: "plastica" },
    ],
  },

  // ── Task 7: Observa i escriu - Números 11-20 ──
  {
    id: "l-escola-7",
    type: "copy-word",
    prompt: "Observa i escriu els números de l'11 al 20:",
    words: [
      { catalan: "onze", image: "onze" },
      { catalan: "dotze", image: "dotze" },
      { catalan: "tretze", image: "tretze" },
      { catalan: "catorze", image: "catorze" },
      { catalan: "quinze", image: "quinze" },
      { catalan: "setze", image: "setze" },
      { catalan: "disset", image: "disset" },
      { catalan: "divuit", image: "divuit" },
      { catalan: "dinou", image: "dinou" },
      { catalan: "vint", image: "vint" },
    ],
  },

  // ── Task 8: Encercla les paraules relacionades amb l'escola ──
  {
    id: "l-escola-8",
    type: "classify-columns",
    prompt: "Encercla les paraules relacionades amb l'escola:",
    circleMode: true,
    columns: [
      {
        title: "L'escola",
        items: [
          "aula",
          "pati",
          "menjador",
          "biblioteca",
          "gimnàs",
          "laboratori",
          "passadís",
          "lavabo",
        ],
      },
      {
        title: "No és l'escola",
        items: ["platja", "muntanya", "bosc", "mercat", "cinema", "parc"],
      },
    ],
    allItems: [
      "aula",
      "platja",
      "pati",
      "muntanya",
      "menjador",
      "bosc",
      "biblioteca",
      "mercat",
      "gimnàs",
      "cinema",
      "laboratori",
      "parc",
      "passadís",
      "lavabo",
    ],
  },

  // ── Task 9: Observa i completa - Singular / Plural ──
  {
    id: "l-escola-9",
    type: "matching",
    prompt: "Relaciona el singular amb el plural:",
    pairs: [
      { left: "la classe", right: "les classes" },
      { left: "el pati", right: "els patis" },
      { left: "la noia", right: "les noies" },
      { left: "el noi", right: "els nois" },
      { left: "l'escola", right: "les escoles" },
      { left: "la biblioteca", right: "les biblioteques" },
      { left: "el lavabo", right: "els lavabos" },
      { left: "el passadís", right: "els passadissos" },
    ],
  },

  // ── Task 10: Observa - Dies de la setmana ──
  {
    id: "l-escola-10",
    type: "copy-word",
    prompt: "Llegeix i copia els dies de la setmana:",
    words: [
      { catalan: "dilluns", image: "dilluns" },
      { catalan: "dimarts", image: "dimarts" },
      { catalan: "dimecres", image: "dimecres" },
      { catalan: "dijous", image: "dijous" },
      { catalan: "divendres", image: "divendres" },
      { catalan: "dissabte", image: "dissabte" },
      { catalan: "diumenge", image: "diumenge" },
    ],
  },

  // ── Task 11: Completa - Ordinal days (shuffled) ──
  {
    id: "l-escola-11",
    type: "fill-sentence",
    prompt: "Completa els dies de la setmana:",
    sentences: [
      {
        text: "El ___ és el cinquè dia de la setmana.",
        blank: "divendres",
        options: ["diumenge", "divendres", "dimecres"],
      },
      {
        text: "El ___ és el primer dia de la setmana.",
        blank: "dilluns",
        options: ["dilluns", "dimarts", "diumenge"],
      },
      {
        text: "El ___ és el setè dia de la setmana.",
        blank: "diumenge",
        options: ["dissabte", "diumenge", "dimarts"],
      },
      {
        text: "El ___ és el tercer dia de la setmana.",
        blank: "dimecres",
        options: ["divendres", "dilluns", "dimecres"],
      },
      {
        text: "El ___ és el sisè dia de la setmana.",
        blank: "dissabte",
        options: ["dilluns", "dijous", "dissabte"],
      },
      {
        text: "El ___ és el segon dia de la setmana.",
        blank: "dimarts",
        options: ["dimecres", "dimarts", "dijous"],
      },
      {
        text: "El ___ és el quart dia de la setmana.",
        blank: "dijous",
        options: ["dijous", "dimarts", "dissabte"],
      },
    ],
  },

  // ── Task 12: Completa les lletres dels dies ──
  {
    id: "l-escola-12",
    type: "fill-letters",
    prompt: "Completa les lletres que falten dels dies:",
    words: [
      { word: "dissabte", hint: "d_ss_bt_", image: "dissabte" },
      { word: "dilluns", hint: "d_ll_ns", image: "dilluns" },
      { word: "dimecres", hint: "d_m_cr_s", image: "dimecres" },
      { word: "dimarts", hint: "d_m_rts", image: "dimarts" },
      { word: "diumenge", hint: "d__m_ng_", image: "diumenge" },
      { word: "divendres", hint: "d_v_ndr_s", image: "divendres" },
      { word: "dijous", hint: "d_j__s", image: "dijous" },
    ],
  },

  // ── Task 13: Escriu el dia d'abans i el de després ──
  {
    id: "l-escola-13",
    type: "fill-sentence",
    prompt: "Escriu el dia d'abans i el de després:",
    sentences: [
      {
        text: "El dia abans de divendres és ___.",
        blank: "dijous",
        options: ["dimecres", "dijous", "dissabte"],
      },
      {
        text: "El dia després de divendres és ___.",
        blank: "dissabte",
        options: ["diumenge", "dijous", "dissabte"],
      },
      {
        text: "El dia abans de dimarts és ___.",
        blank: "dilluns",
        options: ["dilluns", "dimecres", "diumenge"],
      },
      {
        text: "El dia després de dimarts és ___.",
        blank: "dimecres",
        options: ["dijous", "dimecres", "dilluns"],
      },
      {
        text: "El dia abans de diumenge és ___.",
        blank: "dissabte",
        options: ["divendres", "dilluns", "dissabte"],
      },
      {
        text: "El dia després de diumenge és ___.",
        blank: "dilluns",
        options: ["dimarts", "dilluns", "dissabte"],
      },
      {
        text: "El dia abans de dijous és ___.",
        blank: "dimecres",
        options: ["dimarts", "divendres", "dimecres"],
      },
      {
        text: "El dia després de dijous és ___.",
        blank: "divendres",
        options: ["dissabte", "dimecres", "divendres"],
      },
    ],
  },

  // ── Task 15: Observa i completa - Preposicions de lloc (el gat) ──
  {
    id: "l-escola-15",
    type: "copy-word",
    prompt: "On és el gat? Observa i copia les preposicions de lloc:",
    words: [
      { catalan: "a sobre", image: "a-sobre" },
      { catalan: "a sota", image: "a-sota" },
      { catalan: "a dins", image: "a-dins" },
      { catalan: "a fora", image: "a-fora" },
      { catalan: "al costat", image: "al-costat" },
      { catalan: "al davant", image: "al-davant" },
      { catalan: "al darrere", image: "al-darrere" },
    ],
  },

  // ── Task 16: Completa amb preposicions (el gat) ──
  {
    id: "l-escola-16",
    type: "fill-sentence",
    prompt: "On és el gat? Completa amb la preposició correcta:",
    sentences: [
      {
        text: "El gat està ___ la cadira.",
        blank: "a sobre",
        options: ["a sota", "a sobre", "a dins"],
        image: "a-sobre",
      },
      {
        text: "El gat està ___ la cadira.",
        blank: "a sota",
        options: ["a sobre", "a sota", "al costat"],
        image: "a-sota",
      },
      {
        text: "El gat està ___ de la caixa.",
        blank: "a dins",
        options: ["a dins", "a fora", "a sobre"],
        image: "a-dins",
      },
      {
        text: "El gat està ___ de la caixa.",
        blank: "a fora",
        options: ["a dins", "a fora", "a sota"],
        image: "a-fora",
      },
      {
        text: "El gat està ___ de la cadira.",
        blank: "al costat",
        options: ["al davant", "al costat", "al darrere"],
        image: "al-costat",
      },
      {
        text: "El gat està ___ de la cadira.",
        blank: "al davant",
        options: ["al darrere", "al costat", "al davant"],
        image: "al-davant",
      },
      {
        text: "El gat està ___ de la cadira.",
        blank: "al darrere",
        options: ["al davant", "a sota", "al darrere"],
        image: "al-darrere",
      },
    ],
  },

  // ── Task 17: Completa - Conjugation (entrar, sortir) ──
  {
    id: "l-escola-17",
    type: "fill-sentence",
    prompt: "Completa les frases amb el verb correcte:",
    sentences: [
      {
        text: "Jo entro al menjador. Tu ___ al menjador.",
        blank: "entres",
        options: ["entra", "entres", "entrem"],
      },
      {
        text: "Jo entro al menjador. Ell ___ al menjador.",
        blank: "entra",
        options: ["entres", "entren", "entra"],
      },
      {
        text: "Jo entro al menjador. Nosaltres ___ al menjador.",
        blank: "entrem",
        options: ["entreu", "entrem", "entren"],
      },
      {
        text: "Jo entro al menjador. Ells ___ al menjador.",
        blank: "entren",
        options: ["entrem", "entra", "entren"],
      },
      {
        text: "Jo surto al passadís. Tu ___ al passadís.",
        blank: "surts",
        options: ["surt", "sortim", "surts"],
      },
      {
        text: "Jo surto al passadís. Ell ___ al passadís.",
        blank: "surt",
        options: ["surts", "surt", "surten"],
      },
      {
        text: "Jo surto al passadís. Nosaltres ___ al passadís.",
        blank: "sortim",
        options: ["sortiu", "surten", "sortim"],
      },
      {
        text: "Jo surto al passadís. Ells ___ al passadís.",
        blank: "surten",
        options: ["surten", "sortim", "surt"],
      },
    ],
  },

  // ── Task 19: Autoavaluació ──
  {
    id: "l-escola-19",
    type: "self-assessment",
    prompt: "Saps dir aquestes paraules en català?",
    items: [
      { catalan: "aula", translation: "učionica", image: "aula" },
      { catalan: "biblioteca", translation: "biblioteka", image: "biblioteca" },
      { catalan: "pati", translation: "dvorište", image: "pati" },
      { catalan: "menjador", translation: "trpezarija", image: "menjador" },
      { catalan: "gimnàs", translation: "fiskulturna sala", image: "gimnas" },
      { catalan: "laboratori", translation: "laboratorija", image: "laboratori" },
      { catalan: "lavabo", translation: "toalet", image: "lavabo" },
      { catalan: "passadís", translation: "hodnik", image: "passadis" },
      { catalan: "dimarts", translation: "utorak", image: "dimarts" },
      { catalan: "divendres", translation: "petak", image: "divendres" },
      { catalan: "a sobre", translation: "na/iznad", image: "a-sobre" },
      { catalan: "a sota", translation: "ispod", image: "a-sota" },
    ],
  },

  // Bonus activity: Fun drawing
  {
    id: "l-escola-bonus",
    type: "drawing-canvas",
    prompt: "Activitat extra! Diverteix-te, activa la creativitat i dibuixa alguna cosa màgica!",
    bonus: true,
  },
];
