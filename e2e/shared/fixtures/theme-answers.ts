/**
 * Answer keys for all tasks across 12 themes — GENERATED from e2e/qa/tasks.json
 * (which is extracted from src/data/task-data). Do not edit by hand; regenerate:
 *   node e2e/qa/extract-tasks.mjs && node e2e/shared/fixtures/generate-theme-answers.mjs
 */

export type TaskAnswer =
  | { id: string; type: "copy-word"; words: string[] }
  | { id: string; type: "fill-letters"; words: { word: string; hint: string }[] }
  | { id: string; type: "unscramble"; words: { scrambled: string; correct: string }[] }
  | { id: string; type: "matching"; illustrationMatch: boolean; pairs: { left: string; right: string }[] }
  | { id: string; type: "word-search"; gridSize: number; words: string[]; grid: string[][] }
  | { id: string; type: "classify-columns"; columns: { title: string; items: string[] }[] }
  | { id: string; type: "fill-sentence"; blanks: string[] }
  | { id: string; type: "multiple-choice"; answers: string[] }
  | { id: string; type: "self-assessment" }
  | { id: string; type: "color-by-instruction"; instructions: { targetItem: string; targetColor: string }[] }
  | { id: string; type: "label-image"; labels: string[] }
  | { id: string; type: "label-write"; labels: { text: string; x: number }[] }
  | { id: string; type: "drawing-canvas" }
  | { id: string; type: "add-article"; words: { word: string; article: string }[] }
  | { id: string; type: "separate-words"; items: { joined: string; words: string[] }[] }
  | { id: string; type: "count-and-write"; counts: number[] }
  | { id: string; type: "write-antonym"; antonyms: string[] }
  | { id: string; type: "order-words"; sentences: string[][] };

export const themeAnswers: Record<string, TaskAnswer[]> = {
  "la-classe": [
    {
      "id": "la-classe-1",
      "type": "copy-word",
      "words": [
        "llapis",
        "goma",
        "bolígraf",
        "retolador",
        "llibreta",
        "llibre",
        "carpeta",
        "estoig",
        "maquineta",
        "regle",
        "motxilla",
        "tisores",
        "pissarra",
        "guix",
        "borrador",
        "paperera",
        "ordinador",
        "taula",
        "cadira",
        "porta",
        "finestra"
      ]
    },
    {
      "id": "la-classe-2",
      "type": "word-search",
      "gridSize": 10,
      "words": [
        "tisores",
        "estoig",
        "llapis",
        "regle",
        "retolador",
        "goma",
        "motxilla",
        "bolígraf",
        "llibreta",
        "pissarra"
      ],
      "grid": [
        [
          "b",
          "b",
          "t",
          "i",
          "s",
          "o",
          "r",
          "e",
          "s",
          "n"
        ],
        [
          "o",
          "e",
          "s",
          "t",
          "o",
          "i",
          "g",
          "o",
          "l",
          "v"
        ],
        [
          "l",
          "l",
          "a",
          "p",
          "i",
          "s",
          "m",
          "v",
          "l",
          "h"
        ],
        [
          "i",
          "i",
          "h",
          "v",
          "a",
          "i",
          "o",
          "p",
          "i",
          "d"
        ],
        [
          "g",
          "e",
          "r",
          "e",
          "g",
          "l",
          "e",
          "n",
          "b",
          "k"
        ],
        [
          "r",
          "e",
          "t",
          "o",
          "l",
          "a",
          "d",
          "o",
          "r",
          "w"
        ],
        [
          "a",
          "a",
          "g",
          "o",
          "m",
          "a",
          "i",
          "l",
          "e",
          "q"
        ],
        [
          "f",
          "e",
          "r",
          "b",
          "i",
          "l",
          "l",
          "a",
          "t",
          "j"
        ],
        [
          "m",
          "o",
          "t",
          "x",
          "i",
          "l",
          "l",
          "a",
          "a",
          "c"
        ],
        [
          "p",
          "i",
          "s",
          "s",
          "a",
          "r",
          "r",
          "a",
          "z",
          "u"
        ]
      ]
    },
    {
      "id": "la-classe-3",
      "type": "fill-letters",
      "words": [
        {
          "word": "llapis",
          "hint": "l_a_i_"
        },
        {
          "word": "goma",
          "hint": "g_m_"
        },
        {
          "word": "llibre",
          "hint": "ll_br_"
        },
        {
          "word": "bolígraf",
          "hint": "bo_í_r_f"
        },
        {
          "word": "llibreta",
          "hint": "ll_br_t_"
        },
        {
          "word": "retolador",
          "hint": "r_tol_d_r"
        },
        {
          "word": "carpeta",
          "hint": "c_rp_t_"
        },
        {
          "word": "estoig",
          "hint": "e_t_ig"
        },
        {
          "word": "maquineta",
          "hint": "m_qu_n_ta"
        },
        {
          "word": "regle",
          "hint": "r_g_e"
        },
        {
          "word": "motxilla",
          "hint": "m_tx_l_a"
        },
        {
          "word": "tisores",
          "hint": "t_s_r_s"
        },
        {
          "word": "pissarra",
          "hint": "p_ss_r_a"
        },
        {
          "word": "guix",
          "hint": "g_i_"
        },
        {
          "word": "borrador",
          "hint": "b_rr_d_r"
        },
        {
          "word": "paperera",
          "hint": "p_p_r_ra"
        },
        {
          "word": "ordinador",
          "hint": "o_d_n_dor"
        },
        {
          "word": "taula",
          "hint": "t_u_a"
        },
        {
          "word": "cadira",
          "hint": "c_d_ra"
        },
        {
          "word": "porta",
          "hint": "p_r_a"
        },
        {
          "word": "finestra",
          "hint": "f_n_stra"
        }
      ]
    },
    {
      "id": "la-classe-4",
      "type": "classify-columns",
      "columns": [
        {
          "title": "Femení (una)",
          "items": [
            "goma",
            "llibreta",
            "carpeta",
            "maquineta",
            "motxilla",
            "tisores"
          ]
        },
        {
          "title": "Masculí (un)",
          "items": [
            "llapis",
            "bolígraf",
            "retolador",
            "llibre",
            "estoig",
            "regle"
          ]
        }
      ]
    },
    {
      "id": "la-classe-5",
      "type": "matching",
      "illustrationMatch": true,
      "pairs": [
        {
          "left": "llapis",
          "right": "llapis"
        },
        {
          "left": "goma",
          "right": "goma"
        },
        {
          "left": "maquineta",
          "right": "maquineta"
        },
        {
          "left": "llibre",
          "right": "llibre"
        },
        {
          "left": "carpeta",
          "right": "carpeta"
        },
        {
          "left": "estoig",
          "right": "estoig"
        },
        {
          "left": "bolígraf",
          "right": "bolígraf"
        },
        {
          "left": "llibreta",
          "right": "llibreta"
        },
        {
          "left": "pissarra",
          "right": "pissarra"
        },
        {
          "left": "paperera",
          "right": "paperera"
        },
        {
          "left": "regle",
          "right": "regle"
        },
        {
          "left": "ordinador",
          "right": "ordinador"
        },
        {
          "left": "guix",
          "right": "guix"
        },
        {
          "left": "tisores",
          "right": "tisores"
        },
        {
          "left": "motxilla",
          "right": "motxilla"
        },
        {
          "left": "borrador",
          "right": "borrador"
        },
        {
          "left": "retolador",
          "right": "retolador"
        },
        {
          "left": "taula",
          "right": "taula"
        }
      ]
    },
    {
      "id": "la-classe-6",
      "type": "classify-columns",
      "columns": [
        {
          "title": "Singular (un)",
          "items": [
            "llapis",
            "goma",
            "llibre",
            "estoig",
            "regle"
          ]
        },
        {
          "title": "Plural (molts)",
          "items": [
            "bolígrafs",
            "retoladors",
            "llibretes",
            "carpetes",
            "maquinetes",
            "motxilles",
            "tisores"
          ]
        }
      ]
    },
    {
      "id": "la-classe-7",
      "type": "color-by-instruction",
      "instructions": [
        {
          "targetItem": "llapis",
          "targetColor": "blau"
        },
        {
          "targetItem": "goma",
          "targetColor": "verd"
        },
        {
          "targetItem": "ordinador",
          "targetColor": "negre"
        },
        {
          "targetItem": "tisores",
          "targetColor": "vermell"
        },
        {
          "targetItem": "maquineta",
          "targetColor": "groc"
        },
        {
          "targetItem": "llibre",
          "targetColor": "blanc"
        },
        {
          "targetItem": "motxilla",
          "targetColor": "lila"
        },
        {
          "targetItem": "estoig",
          "targetColor": "verd"
        },
        {
          "targetItem": "regle",
          "targetColor": "taronja"
        },
        {
          "targetItem": "retolador",
          "targetColor": "marró"
        },
        {
          "targetItem": "carpeta",
          "targetColor": "rosa"
        },
        {
          "targetItem": "pissarra",
          "targetColor": "verd"
        }
      ]
    },
    {
      "id": "la-classe-8",
      "type": "fill-sentence",
      "blanks": [
        "blava",
        "groc",
        "vermell",
        "taronja",
        "gris",
        "lila",
        "negres"
      ]
    },
    {
      "id": "la-classe-9",
      "type": "fill-sentence",
      "blanks": [
        "dibuixa",
        "pinta",
        "canta",
        "escriu",
        "retalla"
      ]
    },
    {
      "id": "la-classe-10",
      "type": "matching",
      "illustrationMatch": false,
      "pairs": [
        {
          "left": "tisores",
          "right": "retallar"
        },
        {
          "left": "llapis",
          "right": "escriure"
        },
        {
          "left": "cola de barra",
          "right": "enganxar"
        },
        {
          "left": "llapis de colors",
          "right": "pintar"
        },
        {
          "left": "goma",
          "right": "esborrar"
        }
      ]
    },
    {
      "id": "la-classe-11",
      "type": "classify-columns",
      "columns": [
        {
          "title": "Objectes de classe",
          "items": [
            "retolador",
            "tisores",
            "pissarra",
            "motxilla",
            "taula",
            "borrador",
            "guix",
            "goma",
            "estoig"
          ]
        },
        {
          "title": "No són de classe",
          "items": [
            "cuina",
            "pare",
            "gat",
            "televisió",
            "anell",
            "bicicleta",
            "collaret"
          ]
        }
      ]
    },
    {
      "id": "la-classe-12",
      "type": "add-article",
      "words": [
        {
          "word": "maquineta",
          "article": "la"
        },
        {
          "word": "goma",
          "article": "la"
        },
        {
          "word": "llapis",
          "article": "el"
        },
        {
          "word": "llibreta",
          "article": "la"
        },
        {
          "word": "guix",
          "article": "el"
        },
        {
          "word": "carpeta",
          "article": "la"
        },
        {
          "word": "ordinador",
          "article": "l'"
        },
        {
          "word": "retolador",
          "article": "el"
        }
      ]
    },
    {
      "id": "la-classe-13",
      "type": "copy-word",
      "words": [
        "cadira",
        "taula",
        "porta",
        "finestra",
        "pissarra"
      ]
    },
    {
      "id": "la-classe-14",
      "type": "fill-sentence",
      "blanks": [
        "tisores",
        "llapis",
        "goma",
        "retoladors",
        "llibreta"
      ]
    },
    {
      "id": "la-classe-15",
      "type": "separate-words",
      "items": [
        {
          "joined": "Joescricambelmeullapis",
          "words": [
            "Jo",
            "escric",
            "amb",
            "el",
            "meu",
            "llapis"
          ]
        },
        {
          "joined": "Elsnensescriuenalallibreta",
          "words": [
            "Els",
            "nens",
            "escriuen",
            "a",
            "la",
            "llibreta"
          ]
        },
        {
          "joined": "Elllapisésdecolorgroc",
          "words": [
            "El",
            "llapis",
            "és",
            "de",
            "color",
            "groc"
          ]
        }
      ]
    },
    {
      "id": "la-classe-18",
      "type": "self-assessment"
    },
    {
      "id": "la-classe-bonus",
      "type": "drawing-canvas"
    }
  ],
  "l-escola": [
    {
      "id": "l-escola-1",
      "type": "copy-word",
      "words": [
        "aula",
        "biblioteca",
        "laboratori",
        "passadís",
        "lavabo",
        "menjador",
        "gimnàs",
        "pati"
      ]
    },
    {
      "id": "l-escola-2",
      "type": "fill-letters",
      "words": [
        {
          "word": "aula",
          "hint": "a_l_"
        },
        {
          "word": "biblioteca",
          "hint": "b_bl_ot_ca"
        },
        {
          "word": "laboratori",
          "hint": "l_b_r_t_ri"
        },
        {
          "word": "passadís",
          "hint": "p_ss_d_s"
        },
        {
          "word": "lavabo",
          "hint": "l_v_b_"
        },
        {
          "word": "menjador",
          "hint": "m_nj_d_r"
        },
        {
          "word": "gimnàs",
          "hint": "g_mn_s"
        },
        {
          "word": "pati",
          "hint": "p_t_"
        }
      ]
    },
    {
      "id": "l-escola-3",
      "type": "add-article",
      "words": [
        {
          "word": "classe",
          "article": "la"
        },
        {
          "word": "pati",
          "article": "el"
        },
        {
          "word": "biblioteca",
          "article": "la"
        },
        {
          "word": "laboratori",
          "article": "el"
        },
        {
          "word": "passadís",
          "article": "el"
        },
        {
          "word": "lavabo",
          "article": "el"
        },
        {
          "word": "menjador",
          "article": "el"
        },
        {
          "word": "gimnàs",
          "article": "el"
        }
      ]
    },
    {
      "id": "l-escola-4",
      "type": "unscramble",
      "words": [
        {
          "scrambled": "TI-PA",
          "correct": "pati"
        },
        {
          "scrambled": "VA-LA-BO",
          "correct": "lavabo"
        },
        {
          "scrambled": "LA-AU",
          "correct": "aula"
        },
        {
          "scrambled": "PAS-DÍS-SA",
          "correct": "passadís"
        },
        {
          "scrambled": "DOR-JA-MEN",
          "correct": "menjador"
        }
      ]
    },
    {
      "id": "l-escola-5",
      "type": "copy-word",
      "words": [
        "matemàtiques",
        "llengües",
        "música",
        "ciències",
        "anglès",
        "informàtica",
        "educació física",
        "plàstica"
      ]
    },
    {
      "id": "l-escola-6",
      "type": "fill-letters",
      "words": [
        {
          "word": "matemàtiques",
          "hint": "m_t_m_t_qu_s"
        },
        {
          "word": "llengües",
          "hint": "ll_ng__s"
        },
        {
          "word": "música",
          "hint": "m_s_c_"
        },
        {
          "word": "ciències",
          "hint": "c__nc__s"
        },
        {
          "word": "anglès",
          "hint": "_ngl_s"
        },
        {
          "word": "informàtica",
          "hint": "_nf_rm_t_c_"
        },
        {
          "word": "educació física",
          "hint": "ed_c_c__ f_s_c_"
        },
        {
          "word": "plàstica",
          "hint": "pl_st_c_"
        }
      ]
    },
    {
      "id": "l-escola-7",
      "type": "copy-word",
      "words": [
        "onze",
        "dotze",
        "tretze",
        "catorze",
        "quinze",
        "setze",
        "disset",
        "divuit",
        "dinou",
        "vint"
      ]
    },
    {
      "id": "l-escola-8",
      "type": "classify-columns",
      "columns": [
        {
          "title": "L'escola",
          "items": [
            "aula",
            "pati",
            "menjador",
            "biblioteca",
            "gimnàs",
            "laboratori",
            "passadís",
            "lavabo"
          ]
        },
        {
          "title": "No és l'escola",
          "items": [
            "platja",
            "muntanya",
            "bosc",
            "mercat",
            "cinema",
            "parc"
          ]
        }
      ]
    },
    {
      "id": "l-escola-9",
      "type": "matching",
      "illustrationMatch": false,
      "pairs": [
        {
          "left": "la classe",
          "right": "les classes"
        },
        {
          "left": "el pati",
          "right": "els patis"
        },
        {
          "left": "la noia",
          "right": "les noies"
        },
        {
          "left": "el noi",
          "right": "els nois"
        },
        {
          "left": "l'escola",
          "right": "les escoles"
        },
        {
          "left": "la biblioteca",
          "right": "les biblioteques"
        },
        {
          "left": "el lavabo",
          "right": "els lavabos"
        },
        {
          "left": "el passadís",
          "right": "els passadissos"
        }
      ]
    },
    {
      "id": "l-escola-10",
      "type": "copy-word",
      "words": [
        "dilluns",
        "dimarts",
        "dimecres",
        "dijous",
        "divendres",
        "dissabte",
        "diumenge"
      ]
    },
    {
      "id": "l-escola-11",
      "type": "fill-sentence",
      "blanks": [
        "divendres",
        "dilluns",
        "diumenge",
        "dimecres",
        "dissabte",
        "dimarts",
        "dijous"
      ]
    },
    {
      "id": "l-escola-12",
      "type": "fill-letters",
      "words": [
        {
          "word": "dissabte",
          "hint": "d_ss_bt_"
        },
        {
          "word": "dilluns",
          "hint": "d_ll_ns"
        },
        {
          "word": "dimecres",
          "hint": "d_m_cr_s"
        },
        {
          "word": "dimarts",
          "hint": "d_m_rts"
        },
        {
          "word": "diumenge",
          "hint": "d__m_ng_"
        },
        {
          "word": "divendres",
          "hint": "d_v_ndr_s"
        },
        {
          "word": "dijous",
          "hint": "d_j__s"
        }
      ]
    },
    {
      "id": "l-escola-13",
      "type": "fill-sentence",
      "blanks": [
        "dijous",
        "dissabte",
        "dilluns",
        "dimecres",
        "dissabte",
        "dilluns",
        "dimecres",
        "divendres"
      ]
    },
    {
      "id": "l-escola-15",
      "type": "copy-word",
      "words": [
        "a sobre",
        "a sota",
        "a dins",
        "a fora",
        "al costat",
        "al davant",
        "al darrere"
      ]
    },
    {
      "id": "l-escola-16",
      "type": "fill-sentence",
      "blanks": [
        "a sobre",
        "a sota",
        "a dins",
        "a fora",
        "al costat",
        "al davant",
        "al darrere"
      ]
    },
    {
      "id": "l-escola-17",
      "type": "fill-sentence",
      "blanks": [
        "entres",
        "entra",
        "entrem",
        "entren",
        "surts",
        "surt",
        "sortim",
        "surten"
      ]
    },
    {
      "id": "l-escola-19",
      "type": "self-assessment"
    },
    {
      "id": "l-escola-bonus",
      "type": "drawing-canvas"
    }
  ],
  "el-cos": [
    {
      "id": "el-cos-1",
      "type": "copy-word",
      "words": [
        "boca",
        "ull",
        "nas",
        "dents",
        "cabell",
        "orella",
        "braç",
        "cama",
        "cap",
        "colze",
        "panxa",
        "mà",
        "dit",
        "peu",
        "ungla"
      ]
    },
    {
      "id": "el-cos-2",
      "type": "label-write",
      "labels": [
        {
          "text": "cabell",
          "x": 50
        },
        {
          "text": "ull",
          "x": 38
        },
        {
          "text": "nas",
          "x": 50
        },
        {
          "text": "orella",
          "x": 80
        },
        {
          "text": "boca",
          "x": 50
        }
      ]
    },
    {
      "id": "el-cos-3",
      "type": "unscramble",
      "words": [
        {
          "scrambled": "CA-BO",
          "correct": "boca"
        },
        {
          "scrambled": "XA-PAN",
          "correct": "panxa"
        },
        {
          "scrambled": "ZE-COL",
          "correct": "colze"
        },
        {
          "scrambled": "GLA-UN",
          "correct": "ungla"
        },
        {
          "scrambled": "BELL-CA",
          "correct": "cabell"
        },
        {
          "scrambled": "RE-O-LLA",
          "correct": "orella"
        }
      ]
    },
    {
      "id": "el-cos-4",
      "type": "word-search",
      "gridSize": 9,
      "words": [
        "nas",
        "ull",
        "boca",
        "panxa",
        "orella",
        "mà",
        "braç"
      ],
      "grid": [
        [
          "m",
          "m",
          "l",
          "l",
          "u",
          "g",
          "t",
          "f",
          "h"
        ],
        [
          "h",
          "a",
          "l",
          "l",
          "e",
          "r",
          "o",
          "m",
          "à"
        ],
        [
          "e",
          "y",
          "c",
          "i",
          "x",
          "m",
          "q",
          "v",
          "w"
        ],
        [
          "r",
          "p",
          "a",
          "n",
          "x",
          "a",
          "c",
          "t",
          "p"
        ],
        [
          "g",
          "n",
          "x",
          "t",
          "s",
          "b",
          "r",
          "a",
          "ç"
        ],
        [
          "g",
          "z",
          "z",
          "l",
          "m",
          "v",
          "g",
          "e",
          "o"
        ],
        [
          "v",
          "f",
          "s",
          "k",
          "c",
          "w",
          "q",
          "v",
          "y"
        ],
        [
          "n",
          "a",
          "s",
          "c",
          "p",
          "k",
          "m",
          "b",
          "i"
        ],
        [
          "r",
          "b",
          "o",
          "c",
          "a",
          "a",
          "n",
          "g",
          "l"
        ]
      ]
    },
    {
      "id": "el-cos-5",
      "type": "classify-columns",
      "columns": [
        {
          "title": "Parts del cap",
          "items": [
            "cabell",
            "ull",
            "nas",
            "boca",
            "orella"
          ]
        },
        {
          "title": "Parts del cos",
          "items": [
            "braç",
            "cama",
            "mà",
            "peu",
            "panxa"
          ]
        }
      ]
    },
    {
      "id": "el-cos-6",
      "type": "matching",
      "illustrationMatch": false,
      "pairs": [
        {
          "left": "ull",
          "right": "veure"
        },
        {
          "left": "orella",
          "right": "escoltar"
        },
        {
          "left": "nas",
          "right": "olorar"
        },
        {
          "left": "boca",
          "right": "parlar"
        },
        {
          "left": "mà",
          "right": "tocar"
        }
      ]
    },
    {
      "id": "el-cos-7",
      "type": "word-search",
      "gridSize": 9,
      "words": [
        "cap",
        "cabell",
        "cama",
        "colze",
        "dents",
        "dit",
        "peu"
      ],
      "grid": [
        [
          "m",
          "i",
          "u",
          "w",
          "c",
          "a",
          "p",
          "r",
          "h"
        ],
        [
          "v",
          "t",
          "i",
          "d",
          "k",
          "y",
          "y",
          "b",
          "h"
        ],
        [
          "b",
          "z",
          "k",
          "m",
          "i",
          "c",
          "g",
          "p",
          "s"
        ],
        [
          "w",
          "k",
          "c",
          "c",
          "a",
          "m",
          "a",
          "e",
          "g"
        ],
        [
          "u",
          "p",
          "a",
          "m",
          "u",
          "o",
          "e",
          "u",
          "i"
        ],
        [
          "e",
          "h",
          "b",
          "x",
          "r",
          "r",
          "i",
          "x",
          "s"
        ],
        [
          "n",
          "d",
          "e",
          "n",
          "t",
          "s",
          "s",
          "m",
          "l"
        ],
        [
          "h",
          "e",
          "l",
          "q",
          "p",
          "c",
          "y",
          "b",
          "d"
        ],
        [
          "e",
          "u",
          "l",
          "c",
          "o",
          "l",
          "z",
          "e",
          "f"
        ]
      ]
    },
    {
      "id": "el-cos-8",
      "type": "copy-word",
      "words": [
        "escoltar",
        "mirar",
        "cantar",
        "aplaudir"
      ]
    },
    {
      "id": "el-cos-9",
      "type": "matching",
      "illustrationMatch": false,
      "pairs": [
        {
          "left": "mirem",
          "right": "ulls"
        },
        {
          "left": "escoltem",
          "right": "orelles"
        },
        {
          "left": "parlem",
          "right": "boca"
        },
        {
          "left": "aplaudim",
          "right": "mans"
        },
        {
          "left": "caminem",
          "right": "cames"
        }
      ]
    },
    {
      "id": "el-cos-10",
      "type": "copy-word",
      "words": [
        "jove",
        "vell",
        "alt",
        "baix"
      ]
    },
    {
      "id": "el-cos-11",
      "type": "fill-sentence",
      "blanks": [
        "alta",
        "baix"
      ]
    },
    {
      "id": "el-cos-12",
      "type": "fill-sentence",
      "blanks": [
        "vella",
        "alta",
        "baixa",
        "jove"
      ]
    },
    {
      "id": "el-cos-14",
      "type": "multiple-choice",
      "answers": [
        "Sí",
        "Sí",
        "Sí",
        "Sí",
        "No",
        "No",
        "No",
        "Sí",
        "Sí"
      ]
    },
    {
      "id": "el-cos-15",
      "type": "label-image",
      "labels": [
        "bigoti",
        "barba",
        "ulleres",
        "arrugues"
      ]
    },
    {
      "id": "el-cos-16",
      "type": "fill-sentence",
      "blanks": [
        "Carolina",
        "Sergi",
        "Sara",
        "Xavier"
      ]
    },
    {
      "id": "el-cos-18",
      "type": "self-assessment"
    },
    {
      "id": "el-cos-bonus",
      "type": "drawing-canvas"
    }
  ],
  "la-roba": [
    {
      "id": "la-roba-1",
      "type": "copy-word",
      "words": [
        "anorac",
        "jersei",
        "texans",
        "pantalons",
        "samarreta",
        "camisa",
        "jaqueta",
        "faldilla",
        "vestit",
        "xandall",
        "americana",
        "cinturó",
        "corbata",
        "gorro",
        "gorra",
        "mitjons",
        "sabates",
        "vambes",
        "botes",
        "guants",
        "bufanda"
      ]
    },
    {
      "id": "la-roba-2",
      "type": "label-write",
      "labels": [
        {
          "text": "gorro",
          "x": 35
        },
        {
          "text": "jaqueta",
          "x": 25
        },
        {
          "text": "guants",
          "x": 18
        },
        {
          "text": "bufanda",
          "x": 65
        },
        {
          "text": "faldilla",
          "x": 65
        },
        {
          "text": "botes",
          "x": 60
        }
      ]
    },
    {
      "id": "la-roba-3",
      "type": "unscramble",
      "words": [
        {
          "scrambled": "DI-LLA-FAL",
          "correct": "faldilla"
        },
        {
          "scrambled": "TES-BO",
          "correct": "botes"
        },
        {
          "scrambled": "SEI-JER",
          "correct": "jersei"
        },
        {
          "scrambled": "JONS-MIT",
          "correct": "mitjons"
        },
        {
          "scrambled": "DALL-XAN",
          "correct": "xandall"
        },
        {
          "scrambled": "TES-SA-BA",
          "correct": "sabates"
        },
        {
          "scrambled": "SA-CA-MI",
          "correct": "camisa"
        },
        {
          "scrambled": "RAC-NO-A",
          "correct": "anorac"
        },
        {
          "scrambled": "XANS-TE",
          "correct": "texans"
        }
      ]
    },
    {
      "id": "la-roba-4",
      "type": "word-search",
      "gridSize": 10,
      "words": [
        "pantalons",
        "camisa",
        "jaqueta",
        "corbata",
        "faldilla",
        "vestit"
      ],
      "grid": [
        [
          "p",
          "a",
          "n",
          "t",
          "a",
          "l",
          "o",
          "n",
          "s",
          "c"
        ],
        [
          "r",
          "a",
          "m",
          "c",
          "r",
          "i",
          "c",
          "a",
          "n",
          "a"
        ],
        [
          "c",
          "v",
          "r",
          "v",
          "c",
          "s",
          "t",
          "i",
          "r",
          "m"
        ],
        [
          "m",
          "a",
          "t",
          "a",
          "b",
          "r",
          "o",
          "c",
          "b",
          "i"
        ],
        [
          "j",
          "a",
          "q",
          "u",
          "e",
          "t",
          "a",
          "h",
          "f",
          "s"
        ],
        [
          "f",
          "a",
          "l",
          "d",
          "i",
          "l",
          "l",
          "a",
          "n",
          "a"
        ],
        [
          "k",
          "d",
          "t",
          "s",
          "p",
          "r",
          "h",
          "l",
          "b",
          "v"
        ],
        [
          "c",
          "o",
          "r",
          "b",
          "a",
          "t",
          "a",
          "k",
          "g",
          "h"
        ],
        [
          "t",
          "i",
          "t",
          "s",
          "e",
          "v",
          "d",
          "n",
          "r",
          "g"
        ],
        [
          "p",
          "l",
          "m",
          "t",
          "n",
          "h",
          "r",
          "s",
          "f",
          "k"
        ]
      ]
    },
    {
      "id": "la-roba-5",
      "type": "copy-word",
      "words": [
        "banyador",
        "biquini",
        "banyador de dona",
        "pijama",
        "calçotets",
        "calces"
      ]
    },
    {
      "id": "la-roba-6",
      "type": "classify-columns",
      "columns": [
        {
          "title": "Roba",
          "items": [
            "bufanda",
            "sabates",
            "gorra",
            "faldilla",
            "mitjons",
            "anell",
            "calçotets"
          ]
        },
        {
          "title": "No és roba",
          "items": [
            "menjador",
            "finestra",
            "goma",
            "porta",
            "ordinador",
            "cadira",
            "biblioteca"
          ]
        }
      ]
    },
    {
      "id": "la-roba-7",
      "type": "add-article",
      "words": [
        {
          "word": "abric",
          "article": "un"
        },
        {
          "word": "camisa",
          "article": "una"
        },
        {
          "word": "jersei",
          "article": "un"
        },
        {
          "word": "gorra",
          "article": "una"
        },
        {
          "word": "faldilla",
          "article": "una"
        },
        {
          "word": "calçotet",
          "article": "un"
        },
        {
          "word": "jaqueta",
          "article": "una"
        },
        {
          "word": "corbata",
          "article": "una"
        },
        {
          "word": "pijama",
          "article": "un"
        },
        {
          "word": "bota",
          "article": "una"
        }
      ]
    },
    {
      "id": "la-roba-8",
      "type": "fill-sentence",
      "blanks": [
        "bruts",
        "nou",
        "velles",
        "nets"
      ]
    },
    {
      "id": "la-roba-9",
      "type": "copy-word",
      "words": [
        "arracades",
        "anell",
        "collaret",
        "rellotge",
        "ulleres",
        "sandàlies"
      ]
    },
    {
      "id": "la-roba-10",
      "type": "matching",
      "illustrationMatch": false,
      "pairs": [
        {
          "left": "A",
          "right": "NELL"
        },
        {
          "left": "SANDÀ",
          "right": "LIES"
        },
        {
          "left": "RELLO",
          "right": "TGE"
        },
        {
          "left": "MIT",
          "right": "JONS"
        },
        {
          "left": "CO",
          "right": "LLARET"
        },
        {
          "left": "VES",
          "right": "TIT"
        }
      ]
    },
    {
      "id": "la-roba-12",
      "type": "color-by-instruction",
      "instructions": [
        {
          "targetItem": "jersei",
          "targetColor": "blau"
        },
        {
          "targetItem": "botes",
          "targetColor": "marró"
        },
        {
          "targetItem": "mitjons",
          "targetColor": "verd"
        },
        {
          "targetItem": "pijama",
          "targetColor": "lila"
        },
        {
          "targetItem": "guants",
          "targetColor": "rosa"
        }
      ]
    },
    {
      "id": "la-roba-13",
      "type": "fill-sentence",
      "blanks": [
        "sabates",
        "abric",
        "gorra",
        "camisa",
        "guants",
        "mitjons",
        "pijama",
        "banyador",
        "xandall"
      ]
    },
    {
      "id": "la-roba-15",
      "type": "self-assessment"
    },
    {
      "id": "la-roba-bonus",
      "type": "drawing-canvas"
    }
  ],
  "la-casa": [
    {
      "id": "la-casa-1",
      "type": "copy-word",
      "words": [
        "teulada",
        "xemeneia",
        "antena",
        "balcó",
        "persiana",
        "cortina",
        "escala",
        "jardí",
        "garatge"
      ]
    },
    {
      "id": "la-casa-2",
      "type": "word-search",
      "gridSize": 9,
      "words": [
        "persiana",
        "antena",
        "escala",
        "cortina",
        "jardí",
        "balcó"
      ],
      "grid": [
        [
          "p",
          "e",
          "r",
          "s",
          "i",
          "a",
          "n",
          "a",
          "b"
        ],
        [
          "g",
          "a",
          "d",
          "r",
          "f",
          "m",
          "t",
          "u",
          "a"
        ],
        [
          "h",
          "n",
          "v",
          "p",
          "d",
          "s",
          "r",
          "j",
          "l"
        ],
        [
          "f",
          "t",
          "m",
          "g",
          "u",
          "b",
          "d",
          "r",
          "c"
        ],
        [
          "s",
          "e",
          "e",
          "s",
          "c",
          "a",
          "l",
          "a",
          "ó"
        ],
        [
          "d",
          "n",
          "r",
          "t",
          "g",
          "h",
          "p",
          "m",
          "v"
        ],
        [
          "u",
          "a",
          "c",
          "o",
          "r",
          "t",
          "i",
          "n",
          "a"
        ],
        [
          "r",
          "f",
          "g",
          "h",
          "b",
          "s",
          "d",
          "p",
          "t"
        ],
        [
          "j",
          "a",
          "r",
          "d",
          "í",
          "m",
          "n",
          "u",
          "v"
        ]
      ]
    },
    {
      "id": "la-casa-3",
      "type": "classify-columns",
      "columns": [
        {
          "title": "LA",
          "items": [
            "xemeneia",
            "teulada",
            "escala",
            "cortina"
          ]
        },
        {
          "title": "EL",
          "items": [
            "balcó",
            "jardí"
          ]
        },
        {
          "title": "LES",
          "items": [
            "persianes",
            "antenes"
          ]
        },
        {
          "title": "ELS",
          "items": [
            "garatges"
          ]
        }
      ]
    },
    {
      "id": "la-casa-4",
      "type": "label-image",
      "labels": [
        "teulada",
        "xemeneia",
        "antena",
        "balcó",
        "jardí",
        "garatge"
      ]
    },
    {
      "id": "la-casa-5",
      "type": "fill-letters",
      "words": [
        {
          "word": "teulada",
          "hint": "t_ul_d_"
        },
        {
          "word": "xemeneia",
          "hint": "x_m_n_ia"
        },
        {
          "word": "antena",
          "hint": "_nt_n_"
        },
        {
          "word": "balcó",
          "hint": "b_lc_"
        },
        {
          "word": "persiana",
          "hint": "p_rs__na"
        },
        {
          "word": "cortina",
          "hint": "c_rt_n_"
        },
        {
          "word": "escala",
          "hint": "_sc_l_"
        },
        {
          "word": "jardí",
          "hint": "j_rd_"
        },
        {
          "word": "garatge",
          "hint": "g_r_tge"
        }
      ]
    },
    {
      "id": "la-casa-6",
      "type": "matching",
      "illustrationMatch": false,
      "pairs": [
        {
          "left": "teulada",
          "right": "per protegir de la pluja"
        },
        {
          "left": "escala",
          "right": "per pujar al pis de dalt"
        },
        {
          "left": "antena",
          "right": "per veure la televisió"
        },
        {
          "left": "xemeneia",
          "right": "perquè surti el fum"
        },
        {
          "left": "jardí",
          "right": "per tenir flors"
        },
        {
          "left": "garatge",
          "right": "per guardar el cotxe"
        }
      ]
    },
    {
      "id": "la-casa-7",
      "type": "copy-word",
      "words": [
        "dormitori",
        "cuina",
        "menjador",
        "sala d'estar",
        "terrassa",
        "lavabo"
      ]
    },
    {
      "id": "la-casa-8",
      "type": "fill-letters",
      "words": [
        {
          "word": "lavabo",
          "hint": "l_v_b_"
        },
        {
          "word": "dormitori",
          "hint": "d_rm_t_ri"
        },
        {
          "word": "cuina",
          "hint": "c_in_"
        },
        {
          "word": "sala d'estar",
          "hint": "s_la d'_st_r"
        },
        {
          "word": "menjador",
          "hint": "m_nj_d_r"
        },
        {
          "word": "terrassa",
          "hint": "t_rr_ss_"
        }
      ]
    },
    {
      "id": "la-casa-9",
      "type": "copy-word",
      "words": [
        "televisió",
        "rellotge",
        "prestatge",
        "sofà",
        "llàmpada",
        "xemeneia",
        "butaca",
        "catifa",
        "planta"
      ]
    },
    {
      "id": "la-casa-10",
      "type": "fill-sentence",
      "blanks": [
        "televisió",
        "un sofà",
        "un rellotge",
        "una catifa"
      ]
    },
    {
      "id": "la-casa-11",
      "type": "copy-word",
      "words": [
        "escombraries",
        "nevera",
        "foc",
        "armari",
        "forn",
        "aixeta",
        "aiguera",
        "microones",
        "campana"
      ]
    },
    {
      "id": "la-casa-12",
      "type": "matching",
      "illustrationMatch": false,
      "pairs": [
        {
          "left": "A la nevera",
          "right": "guardem el menjar."
        },
        {
          "left": "A la cuina",
          "right": "cuinem tot el que mengem."
        },
        {
          "left": "Al forn",
          "right": "fem pa."
        },
        {
          "left": "A les escombraries",
          "right": "tirem allò que ja no serveix."
        },
        {
          "left": "A l'aiguera",
          "right": "hi ha els plats bruts."
        }
      ]
    },
    {
      "id": "la-casa-13",
      "type": "copy-word",
      "words": [
        "llit",
        "coixí",
        "llençol",
        "tauleta de nit",
        "despertador",
        "armari",
        "manta",
        "escriptori",
        "prestatgeria"
      ]
    },
    {
      "id": "la-casa-14",
      "type": "fill-sentence",
      "blanks": [
        "llit",
        "coixí",
        "manta",
        "despertador",
        "armari",
        "llençols"
      ]
    },
    {
      "id": "la-casa-15",
      "type": "copy-word",
      "words": [
        "vàter",
        "paper de vàter",
        "lavabo",
        "banyera",
        "dutxa",
        "tovallola",
        "mirall",
        "sabó",
        "esponja"
      ]
    },
    {
      "id": "la-casa-16",
      "type": "fill-sentence",
      "blanks": [
        "mans",
        "mans",
        "la cara",
        "les mans",
        "les dents",
        "la cara"
      ]
    },
    {
      "id": "la-casa-17",
      "type": "classify-columns",
      "columns": [
        {
          "title": "Dormitori",
          "items": [
            "llit",
            "llençols",
            "despertador",
            "tauleta de nit"
          ]
        },
        {
          "title": "Sala d'estar",
          "items": [
            "televisió",
            "sofà",
            "catifa",
            "cortina"
          ]
        },
        {
          "title": "Lavabo",
          "items": [
            "banyera",
            "mirall",
            "dutxa",
            "lavabo",
            "tovallola"
          ]
        },
        {
          "title": "Cuina",
          "items": [
            "aiguera",
            "forn",
            "nevera",
            "microones",
            "xemeneia",
            "armari"
          ]
        }
      ]
    },
    {
      "id": "la-casa-18",
      "type": "fill-sentence",
      "blanks": [
        "l'habitació",
        "el menjador",
        "la cuina",
        "el lavabo",
        "el garatge",
        "la terrassa",
        "la sala d'estar",
        "la nevera"
      ]
    },
    {
      "id": "la-casa-19",
      "type": "matching",
      "illustrationMatch": false,
      "pairs": [
        {
          "left": "On és l'antena de la televisió?",
          "right": "És a la teulada."
        },
        {
          "left": "De què està feta la taula?",
          "right": "De fusta."
        },
        {
          "left": "Quantes finestres hi ha?",
          "right": "Hi ha tres finestres."
        },
        {
          "left": "Amb què ens rentem les mans?",
          "right": "Amb sabó."
        },
        {
          "left": "On plantem flors?",
          "right": "Al jardí."
        }
      ]
    },
    {
      "id": "la-casa-20",
      "type": "write-antonym",
      "antonyms": [
        "casa petita",
        "menjador petit",
        "cuina gran",
        "dormitoris grans",
        "garatge brut",
        "lavabo brut",
        "cortines netes",
        "terrassa neta",
        "escales brutes"
      ]
    },
    {
      "id": "la-casa-21",
      "type": "order-words",
      "sentences": [
        [
          "Jo",
          "obro",
          "la",
          "porta"
        ],
        [
          "El",
          "nen",
          "surt",
          "al",
          "jardí"
        ],
        [
          "La",
          "Maria",
          "baixa",
          "les",
          "escales"
        ],
        [
          "Ell",
          "té",
          "el",
          "cotxe",
          "al",
          "garatge"
        ],
        [
          "La",
          "Mireia",
          "té",
          "cinc",
          "finestres",
          "a",
          "casa"
        ]
      ]
    },
    {
      "id": "la-casa-22",
      "type": "count-and-write",
      "counts": [
        3,
        2,
        2
      ]
    },
    {
      "id": "la-casa-24",
      "type": "self-assessment"
    },
    {
      "id": "la-casa-bonus",
      "type": "drawing-canvas"
    }
  ],
  "la-familia": [
    {
      "id": "la-familia-1",
      "type": "fill-sentence",
      "blanks": [
        "Borja",
        "Sofia",
        "Jaume",
        "Fiona",
        "Miquel",
        "Anna"
      ]
    },
    {
      "id": "la-familia-2",
      "type": "fill-sentence",
      "blanks": [
        "l'avi",
        "l'àvia",
        "el pare",
        "la mare",
        "la germana"
      ]
    },
    {
      "id": "la-familia-3",
      "type": "label-image",
      "labels": [
        "avi",
        "àvia",
        "pare",
        "mare",
        "fill",
        "filla"
      ]
    },
    {
      "id": "la-familia-4",
      "type": "fill-sentence",
      "blanks": [
        "tieta",
        "oncle",
        "cosina"
      ]
    },
    {
      "id": "la-familia-6",
      "type": "classify-columns",
      "columns": [
        {
          "title": "EL",
          "items": [
            "fill",
            "cosí",
            "pare",
            "germà",
            "marit",
            "avi"
          ]
        },
        {
          "title": "LA",
          "items": [
            "germana",
            "mare",
            "àvia",
            "filla",
            "cosina",
            "dona"
          ]
        }
      ]
    },
    {
      "id": "la-familia-7",
      "type": "add-article",
      "words": [
        {
          "word": "germà",
          "article": "el"
        },
        {
          "word": "tietes",
          "article": "les"
        },
        {
          "word": "àvia",
          "article": "la"
        },
        {
          "word": "germana",
          "article": "la"
        },
        {
          "word": "nét",
          "article": "el"
        },
        {
          "word": "germanes",
          "article": "les"
        },
        {
          "word": "cosins",
          "article": "els"
        },
        {
          "word": "mare",
          "article": "la"
        },
        {
          "word": "pare",
          "article": "el"
        },
        {
          "word": "oncle",
          "article": "el"
        },
        {
          "word": "tia",
          "article": "la"
        },
        {
          "word": "germans",
          "article": "els"
        }
      ]
    },
    {
      "id": "la-familia-8",
      "type": "separate-words",
      "items": [
        {
          "joined": "ElmeugermàesdiuBruno.",
          "words": [
            "El",
            "meu",
            "germà",
            "es",
            "diu",
            "Bruno."
          ]
        },
        {
          "joined": "LamevamareesdiuAnna.",
          "words": [
            "La",
            "meva",
            "mare",
            "es",
            "diu",
            "Anna."
          ]
        },
        {
          "joined": "ElmeupareesdiuSergi.",
          "words": [
            "El",
            "meu",
            "pare",
            "es",
            "diu",
            "Sergi."
          ]
        },
        {
          "joined": "LamevagermanaesdiuOna.",
          "words": [
            "La",
            "meva",
            "germana",
            "es",
            "diu",
            "Ona."
          ]
        },
        {
          "joined": "ElmeucosíesdiuJoan.",
          "words": [
            "El",
            "meu",
            "cosí",
            "es",
            "diu",
            "Joan."
          ]
        }
      ]
    },
    {
      "id": "la-familia-10",
      "type": "multiple-choice",
      "answers": [
        "No",
        "Sí",
        "Sí",
        "Sí",
        "No",
        "Sí",
        "Sí"
      ]
    },
    {
      "id": "la-familia-11",
      "type": "matching",
      "illustrationMatch": true,
      "pairs": [
        {
          "left": "el pare",
          "right": "el pare"
        },
        {
          "left": "la mare",
          "right": "la mare"
        },
        {
          "left": "l'avi",
          "right": "l'avi"
        },
        {
          "left": "l'àvia",
          "right": "l'àvia"
        },
        {
          "left": "el bebè",
          "right": "el bebè"
        }
      ]
    },
    {
      "id": "la-familia-12",
      "type": "fill-sentence",
      "blanks": [
        "l'avi",
        "l'àvia",
        "la mare",
        "el pare",
        "germana",
        "pares"
      ]
    },
    {
      "id": "la-familia-13",
      "type": "copy-word",
      "words": [
        "gos",
        "gat",
        "conill",
        "hàmster",
        "ocell",
        "tortuga",
        "peix",
        "serp",
        "cavall"
      ]
    },
    {
      "id": "la-familia-14",
      "type": "word-search",
      "gridSize": 8,
      "words": [
        "conill",
        "serp",
        "tortuga",
        "gos",
        "gat",
        "ocell"
      ],
      "grid": [
        [
          "c",
          "d",
          "f",
          "r",
          "m",
          "b",
          "h",
          "u"
        ],
        [
          "o",
          "p",
          "t",
          "v",
          "n",
          "g",
          "o",
          "s"
        ],
        [
          "n",
          "m",
          "j",
          "o",
          "c",
          "e",
          "l",
          "l"
        ],
        [
          "i",
          "r",
          "d",
          "h",
          "f",
          "b",
          "v",
          "m"
        ],
        [
          "l",
          "g",
          "n",
          "t",
          "s",
          "e",
          "r",
          "p"
        ],
        [
          "l",
          "d",
          "f",
          "r",
          "m",
          "b",
          "u",
          "g"
        ],
        [
          "t",
          "o",
          "r",
          "t",
          "u",
          "g",
          "a",
          "a"
        ],
        [
          "h",
          "j",
          "n",
          "d",
          "p",
          "f",
          "r",
          "t"
        ]
      ]
    },
    {
      "id": "la-familia-15",
      "type": "multiple-choice",
      "answers": [
        "Sí",
        "No",
        "Sí",
        "Sí"
      ]
    },
    {
      "id": "la-familia-16",
      "type": "self-assessment"
    },
    {
      "id": "la-familia-bonus",
      "type": "drawing-canvas"
    }
  ],
  "les-botigues": [
    {
      "id": "les-botigues-1",
      "type": "copy-word",
      "words": [
        "fruiteria",
        "verduleria",
        "peixeteria",
        "carnisseria",
        "fleca",
        "farmàcia"
      ]
    },
    {
      "id": "les-botigues-2",
      "type": "fill-sentence",
      "blanks": [
        "peixeteria",
        "fleca",
        "fruiteria",
        "farmàcia",
        "carnisseria"
      ]
    },
    {
      "id": "les-botigues-3",
      "type": "separate-words",
      "items": [
        {
          "joined": "Comprofruitaalafruiteria.",
          "words": [
            "Compro",
            "fruita",
            "a",
            "la",
            "fruiteria."
          ]
        },
        {
          "joined": "Lapeixeteriavenpeix.",
          "words": [
            "La",
            "peixeteria",
            "ven",
            "peix."
          ]
        },
        {
          "joined": "Compropaalafleca.",
          "words": [
            "Compro",
            "pa",
            "a",
            "la",
            "fleca."
          ]
        },
        {
          "joined": "Lafarmàciavenmedicaments.",
          "words": [
            "La",
            "farmàcia",
            "ven",
            "medicaments."
          ]
        },
        {
          "joined": "Lacarnisseriavencarn.",
          "words": [
            "La",
            "carnisseria",
            "ven",
            "carn."
          ]
        }
      ]
    },
    {
      "id": "les-botigues-4",
      "type": "copy-word",
      "words": [
        "poma",
        "pera",
        "plàtan",
        "taronja",
        "maduixa",
        "cirera",
        "préssec",
        "meló",
        "síndria"
      ]
    },
    {
      "id": "les-botigues-5",
      "type": "copy-word",
      "words": [
        "ceba",
        "enciam",
        "pastanaga",
        "patata",
        "pebrot",
        "tomàquet",
        "mongetes"
      ]
    },
    {
      "id": "les-botigues-6",
      "type": "fill-letters",
      "words": [
        {
          "word": "meló",
          "hint": "m_l_"
        },
        {
          "word": "préssec",
          "hint": "pr_ss_c"
        },
        {
          "word": "poma",
          "hint": "p_m_"
        },
        {
          "word": "síndria",
          "hint": "s_ndr_a"
        },
        {
          "word": "taronja",
          "hint": "t_r_nj_"
        },
        {
          "word": "plàtan",
          "hint": "pl_t_n"
        },
        {
          "word": "cirera",
          "hint": "c_r_ra"
        },
        {
          "word": "pera",
          "hint": "p_r_"
        },
        {
          "word": "maduixa",
          "hint": "m_du_x_"
        }
      ]
    },
    {
      "id": "les-botigues-7",
      "type": "color-by-instruction",
      "instructions": [
        {
          "targetItem": "ceba",
          "targetColor": "groc"
        },
        {
          "targetItem": "enciam",
          "targetColor": "verd"
        },
        {
          "targetItem": "pastanaga",
          "targetColor": "taronja"
        },
        {
          "targetItem": "patata",
          "targetColor": "marró"
        },
        {
          "targetItem": "pebrot",
          "targetColor": "vermell"
        },
        {
          "targetItem": "tomàquet",
          "targetColor": "vermell"
        },
        {
          "targetItem": "mongetes",
          "targetColor": "verd"
        }
      ]
    },
    {
      "id": "les-botigues-8",
      "type": "fill-sentence",
      "blanks": [
        "pastanaga",
        "tomàquet",
        "enciam",
        "ceba"
      ]
    },
    {
      "id": "les-botigues-9",
      "type": "copy-word",
      "words": [
        "sardina",
        "tonyina",
        "salmó",
        "calamar",
        "gamba",
        "musclo"
      ]
    },
    {
      "id": "les-botigues-10",
      "type": "matching",
      "illustrationMatch": false,
      "pairs": [
        {
          "left": "sardina",
          "right": "sardines"
        },
        {
          "left": "tonyina",
          "right": "tonyines"
        },
        {
          "left": "salmó",
          "right": "salmons"
        },
        {
          "left": "calamar",
          "right": "calamars"
        },
        {
          "left": "gamba",
          "right": "gambes"
        },
        {
          "left": "musclo",
          "right": "musclos"
        }
      ]
    },
    {
      "id": "les-botigues-11",
      "type": "copy-word",
      "words": [
        "pollastre",
        "salsitxa",
        "mandonguilla",
        "hamburguesa",
        "bistec",
        "cansalada"
      ]
    },
    {
      "id": "les-botigues-12",
      "type": "classify-columns",
      "columns": [
        {
          "title": "EL",
          "items": [
            "pollastre",
            "bistec"
          ]
        },
        {
          "title": "LA",
          "items": [
            "salsitxa",
            "mandonguilla",
            "hamburguesa",
            "cansalada"
          ]
        }
      ]
    },
    {
      "id": "les-botigues-14",
      "type": "copy-word",
      "words": [
        "barra de pa",
        "pa rodó",
        "pa de motlle",
        "pastís",
        "croissant",
        "galeta"
      ]
    },
    {
      "id": "les-botigues-15",
      "type": "classify-columns",
      "columns": [
        {
          "title": "Peixeteria",
          "items": [
            "sardina",
            "tonyina",
            "gamba",
            "musclo"
          ]
        },
        {
          "title": "Carnisseria",
          "items": [
            "pollastre",
            "bistec",
            "salsitxa",
            "hamburguesa"
          ]
        },
        {
          "title": "Fleca",
          "items": [
            "barra de pa",
            "croissant",
            "pastís",
            "galeta"
          ]
        },
        {
          "title": "Fruiteria",
          "items": [
            "poma",
            "taronja",
            "pastanaga",
            "tomàquet"
          ]
        }
      ]
    },
    {
      "id": "les-botigues-16",
      "type": "fill-sentence",
      "blanks": [
        "vaig",
        "vaig",
        "aniré",
        "vaig"
      ]
    },
    {
      "id": "les-botigues-17",
      "type": "copy-word",
      "words": [
        "tirita",
        "pastilla",
        "xeringa",
        "termòmetre",
        "cotó",
        "venda"
      ]
    },
    {
      "id": "les-botigues-18",
      "type": "separate-words",
      "items": [
        {
          "joined": "Eltermòmetremesuralatemperatura.",
          "words": [
            "El",
            "termòmetre",
            "mesura",
            "la",
            "temperatura."
          ]
        },
        {
          "joined": "Lainfermeraposaunatirita.",
          "words": [
            "La",
            "infermera",
            "posa",
            "una",
            "tirita."
          ]
        },
        {
          "joined": "Prencculleresdexarop.",
          "words": [
            "Prenc",
            "culleres",
            "de",
            "xarop."
          ]
        },
        {
          "joined": "Lavendaprotegeixlaferida.",
          "words": [
            "La",
            "venda",
            "protegeix",
            "la",
            "ferida."
          ]
        }
      ]
    },
    {
      "id": "les-botigues-19",
      "type": "classify-columns",
      "columns": [
        {
          "title": "Farmàcia",
          "items": [
            "tirita",
            "pastilla",
            "xeringa",
            "termòmetre",
            "venda"
          ]
        },
        {
          "title": "Fruiteria",
          "items": [
            "poma",
            "pastanaga",
            "cirera",
            "pera",
            "tomàquet"
          ]
        },
        {
          "title": "Fleca",
          "items": [
            "barra de pa",
            "croissant",
            "galeta",
            "pastís"
          ]
        }
      ]
    },
    {
      "id": "les-botigues-20",
      "type": "self-assessment"
    },
    {
      "id": "les-botigues-bonus",
      "type": "drawing-canvas"
    }
  ],
  "el-menjar": [
    {
      "id": "el-menjar-1",
      "type": "copy-word",
      "words": [
        "tassa",
        "ampolla",
        "got",
        "copa",
        "ganivet",
        "cullera",
        "forquilla",
        "plat",
        "tovalló"
      ]
    },
    {
      "id": "el-menjar-2",
      "type": "matching",
      "illustrationMatch": false,
      "pairs": [
        {
          "left": "tassa",
          "right": "tasses"
        },
        {
          "left": "ampolla",
          "right": "ampolles"
        },
        {
          "left": "got",
          "right": "gots"
        },
        {
          "left": "copa",
          "right": "copes"
        },
        {
          "left": "ganivet",
          "right": "ganivets"
        },
        {
          "left": "cullera",
          "right": "culleres"
        },
        {
          "left": "forquilla",
          "right": "forquilles"
        },
        {
          "left": "plat",
          "right": "plats"
        },
        {
          "left": "tovalló",
          "right": "tovallons"
        }
      ]
    },
    {
      "id": "el-menjar-4",
      "type": "copy-word",
      "words": [
        "suc",
        "cafè",
        "pa de pessic",
        "te",
        "cereals",
        "llet",
        "galetes",
        "entrepà",
        "fruita"
      ]
    },
    {
      "id": "el-menjar-5",
      "type": "copy-word",
      "words": [
        "verdures",
        "arròs",
        "macarrons",
        "amanida",
        "patates fregides",
        "pollastre",
        "pa",
        "aigua",
        "refresc"
      ]
    },
    {
      "id": "el-menjar-6",
      "type": "copy-word",
      "words": [
        "sandvitx",
        "iogurt",
        "hamburguesa",
        "truita de patates",
        "sopa",
        "pizza",
        "formatge",
        "pernil"
      ]
    },
    {
      "id": "el-menjar-7",
      "type": "fill-sentence",
      "blanks": [
        "cereals",
        "arròs",
        "sandvitx",
        "sopa"
      ]
    },
    {
      "id": "el-menjar-8",
      "type": "multiple-choice",
      "answers": [
        "Cereals amb llet",
        "Ganivet",
        "Al plat",
        "Dinar"
      ]
    },
    {
      "id": "el-menjar-9",
      "type": "classify-columns",
      "columns": [
        {
          "title": "Per menjar",
          "items": [
            "entrepà",
            "pizza",
            "hamburguesa",
            "amanida",
            "macarrons",
            "galetes"
          ]
        },
        {
          "title": "Per beure",
          "items": [
            "suc",
            "cafè",
            "te",
            "llet",
            "aigua",
            "refresc"
          ]
        }
      ]
    },
    {
      "id": "el-menjar-10",
      "type": "matching",
      "illustrationMatch": false,
      "pairs": [
        {
          "left": "Bec el cafè amb...",
          "right": "tassa"
        },
        {
          "left": "Menjo l'amanida amb...",
          "right": "forquilla"
        },
        {
          "left": "Tallo la carn amb...",
          "right": "ganivet"
        },
        {
          "left": "Menjo la sopa amb...",
          "right": "cullera"
        },
        {
          "left": "Poso el menjar al...",
          "right": "plat"
        },
        {
          "left": "Bec aigua amb...",
          "right": "got"
        }
      ]
    },
    {
      "id": "el-menjar-11",
      "type": "separate-words",
      "items": [
        {
          "joined": "Becsucdetaronjaperesmorzar.",
          "words": [
            "Bec",
            "suc",
            "de",
            "taronja",
            "per",
            "esmorzar."
          ]
        },
        {
          "joined": "Menjomacarronsambtomàquet.",
          "words": [
            "Menjo",
            "macarrons",
            "amb",
            "tomàquet."
          ]
        },
        {
          "joined": "Latassaésperbeurecafè.",
          "words": [
            "La",
            "tassa",
            "és",
            "per",
            "beure",
            "cafè."
          ]
        },
        {
          "joined": "Posoelmenjaraldamuntdelplat.",
          "words": [
            "Poso",
            "el",
            "menjar",
            "al",
            "damunt",
            "del",
            "plat."
          ]
        },
        {
          "joined": "Perberenarmenjogaletesambllet.",
          "words": [
            "Per",
            "berenar",
            "menjo",
            "galetes",
            "amb",
            "llet."
          ]
        }
      ]
    },
    {
      "id": "el-menjar-12",
      "type": "classify-columns",
      "columns": [
        {
          "title": "Fred",
          "items": [
            "gelat",
            "suc",
            "amanida",
            "iogurt",
            "refresc",
            "fruita"
          ]
        },
        {
          "title": "Calent",
          "items": [
            "sopa",
            "cafè",
            "te",
            "arròs",
            "pizza",
            "macarrons"
          ]
        }
      ]
    },
    {
      "id": "el-menjar-13",
      "type": "color-by-instruction",
      "instructions": [
        {
          "targetItem": "gelat",
          "targetColor": "blau"
        },
        {
          "targetItem": "sopa",
          "targetColor": "vermell"
        },
        {
          "targetItem": "cafè",
          "targetColor": "vermell"
        },
        {
          "targetItem": "suc",
          "targetColor": "blau"
        },
        {
          "targetItem": "pizza",
          "targetColor": "vermell"
        },
        {
          "targetItem": "iogurt",
          "targetColor": "blau"
        },
        {
          "targetItem": "te",
          "targetColor": "vermell"
        },
        {
          "targetItem": "refresc",
          "targetColor": "blau"
        }
      ]
    },
    {
      "id": "el-menjar-14",
      "type": "fill-sentence",
      "blanks": [
        "nevera",
        "tovalló",
        "estovalles"
      ]
    },
    {
      "id": "el-menjar-15",
      "type": "fill-sentence",
      "blanks": [
        "fred",
        "calenta",
        "calent",
        "freda"
      ]
    },
    {
      "id": "el-menjar-16",
      "type": "classify-columns",
      "columns": [
        {
          "title": "Dolç",
          "items": [
            "pastís de xocolata",
            "gelat",
            "xocolata",
            "galetes",
            "caramels",
            "sucre",
            "plàtan"
          ]
        },
        {
          "title": "Salat",
          "items": [
            "pizza",
            "macarrons",
            "amanida",
            "arròs",
            "entrepà",
            "pernil",
            "sal"
          ]
        }
      ]
    },
    {
      "id": "el-menjar-17",
      "type": "multiple-choice",
      "answers": [
        "Amanida",
        "Hamburguesa amb patates",
        "Fruita amb gelat",
        "Cafè amb llet"
      ]
    },
    {
      "id": "el-menjar-18",
      "type": "fill-sentence",
      "blanks": [
        "dinaràs",
        "berenaràs",
        "esmorzaràs"
      ]
    },
    {
      "id": "el-menjar-20",
      "type": "fill-letters",
      "words": [
        {
          "word": "forquilla",
          "hint": "f_rqu_lla"
        },
        {
          "word": "ganivet",
          "hint": "g_n_v_t"
        },
        {
          "word": "cullera",
          "hint": "c_ll_ra"
        },
        {
          "word": "tovalló",
          "hint": "t_v_lló"
        },
        {
          "word": "ampolla",
          "hint": "_mp_lla"
        },
        {
          "word": "cereals",
          "hint": "c_re_ls"
        },
        {
          "word": "hamburguesa",
          "hint": "h_mb_rgu_sa"
        },
        {
          "word": "macarrons",
          "hint": "m_c_rr_ns"
        }
      ]
    },
    {
      "id": "el-menjar-20b",
      "type": "classify-columns",
      "columns": [
        {
          "title": "Fruita",
          "items": [
            "poma",
            "plàtan",
            "pera",
            "taronja",
            "maduixa",
            "cirera"
          ]
        },
        {
          "title": "Verdura",
          "items": [
            "ceba",
            "pastanaga",
            "enciam",
            "pebrot",
            "tomàquet",
            "patata"
          ]
        }
      ]
    },
    {
      "id": "el-menjar-21",
      "type": "self-assessment"
    },
    {
      "id": "el-menjar-bonus",
      "type": "drawing-canvas"
    }
  ],
  "els-animals": [
    {
      "id": "els-animals-1",
      "type": "copy-word",
      "words": [
        "gallina",
        "gall",
        "pollet",
        "flamenc",
        "cigonya",
        "gavina",
        "pingüí",
        "estruç",
        "mussol"
      ]
    },
    {
      "id": "els-animals-2",
      "type": "fill-sentence",
      "blanks": [
        "plomes",
        "ous",
        "ales",
        "dues",
        "bec"
      ]
    },
    {
      "id": "els-animals-3",
      "type": "copy-word",
      "words": [
        "mosca",
        "formiga",
        "abella",
        "escarabat",
        "papallona",
        "mosquit"
      ]
    },
    {
      "id": "els-animals-4",
      "type": "copy-word",
      "words": [
        "peix",
        "tauró",
        "sardina"
      ]
    },
    {
      "id": "els-animals-4b",
      "type": "copy-word",
      "words": [
        "flamenc",
        "ànec",
        "oca",
        "granota",
        "unicorn"
      ]
    },
    {
      "id": "els-animals-5",
      "type": "copy-word",
      "words": [
        "serp",
        "tortuga",
        "cocodril"
      ]
    },
    {
      "id": "els-animals-6",
      "type": "classify-columns",
      "columns": [
        {
          "title": "Au",
          "items": [
            "gallina",
            "oca",
            "flamenc",
            "ànec"
          ]
        },
        {
          "title": "Insecte",
          "items": [
            "mosca",
            "formiga",
            "abella",
            "papallona"
          ]
        },
        {
          "title": "Peix",
          "items": [
            "sardina",
            "tauró",
            "peix"
          ]
        },
        {
          "title": "Rèptil",
          "items": [
            "serp",
            "tortuga",
            "granota"
          ]
        }
      ]
    },
    {
      "id": "els-animals-6c",
      "type": "classify-columns",
      "columns": [
        {
          "title": "Domèstic",
          "items": [
            "gos",
            "gat",
            "cavall",
            "gallina",
            "ànec",
            "vaca"
          ]
        },
        {
          "title": "Salvatge",
          "items": [
            "lleó",
            "tigre",
            "elefant",
            "girafa",
            "ós",
            "mico"
          ]
        }
      ]
    },
    {
      "id": "els-animals-8",
      "type": "copy-word",
      "words": [
        "gos",
        "gat",
        "conill",
        "cavall",
        "porc",
        "vaca",
        "ratolí",
        "ovella",
        "hipopòtam",
        "goril·la",
        "zebra",
        "ós",
        "lleó",
        "camell",
        "elefant",
        "tigre",
        "llop",
        "guineu"
      ]
    },
    {
      "id": "els-animals-9",
      "type": "matching",
      "illustrationMatch": false,
      "pairs": [
        {
          "left": "gat",
          "right": "mamífer"
        },
        {
          "left": "sardina",
          "right": "peix"
        },
        {
          "left": "flamenc",
          "right": "au"
        },
        {
          "left": "serp",
          "right": "rèptil"
        },
        {
          "left": "papallona",
          "right": "insecte"
        }
      ]
    },
    {
      "id": "els-animals-10",
      "type": "classify-columns",
      "columns": [
        {
          "title": "UN",
          "items": [
            "gos",
            "gat",
            "lleó",
            "dofí",
            "cavall",
            "elefant"
          ]
        },
        {
          "title": "UNA",
          "items": [
            "vaca",
            "zebra",
            "ovella",
            "guineu",
            "serp",
            "tortuga"
          ]
        }
      ]
    },
    {
      "id": "els-animals-11",
      "type": "word-search",
      "gridSize": 10,
      "words": [
        "gos",
        "gat",
        "lleo",
        "vaca",
        "ovella",
        "porc",
        "os",
        "tigre"
      ],
      "grid": [
        [
          "t",
          "i",
          "g",
          "r",
          "e",
          "v",
          "a",
          "c",
          "a",
          "n"
        ],
        [
          "j",
          "r",
          "h",
          "m",
          "e",
          "w",
          "z",
          "f",
          "j",
          "y"
        ],
        [
          "g",
          "a",
          "t",
          "l",
          "l",
          "e",
          "o",
          "h",
          "c",
          "b"
        ],
        [
          "i",
          "s",
          "u",
          "r",
          "z",
          "m",
          "t",
          "e",
          "n",
          "d"
        ],
        [
          "k",
          "w",
          "o",
          "v",
          "e",
          "l",
          "l",
          "a",
          "e",
          "g"
        ],
        [
          "a",
          "l",
          "v",
          "h",
          "f",
          "p",
          "k",
          "g",
          "j",
          "s"
        ],
        [
          "p",
          "o",
          "r",
          "c",
          "a",
          "r",
          "i",
          "a",
          "o",
          "a"
        ],
        [
          "g",
          "o",
          "s",
          "b",
          "h",
          "k",
          "s",
          "c",
          "e",
          "e"
        ],
        [
          "e",
          "n",
          "b",
          "e",
          "q",
          "d",
          "a",
          "u",
          "o",
          "w"
        ],
        [
          "z",
          "m",
          "a",
          "f",
          "n",
          "x",
          "p",
          "r",
          "s",
          "c"
        ]
      ]
    },
    {
      "id": "els-animals-12",
      "type": "color-by-instruction",
      "instructions": [
        {
          "targetItem": "lleó",
          "targetColor": "groc"
        },
        {
          "targetItem": "gavina",
          "targetColor": "blau"
        },
        {
          "targetItem": "cocodril",
          "targetColor": "verd"
        },
        {
          "targetItem": "ratolí",
          "targetColor": "marró"
        },
        {
          "targetItem": "tauró",
          "targetColor": "negre"
        },
        {
          "targetItem": "serp",
          "targetColor": "taronja"
        },
        {
          "targetItem": "conill",
          "targetColor": "rosa"
        },
        {
          "targetItem": "vaca",
          "targetColor": "vermell"
        },
        {
          "targetItem": "tortuga",
          "targetColor": "lila"
        }
      ]
    },
    {
      "id": "els-animals-13",
      "type": "multiple-choice",
      "answers": [
        "ales",
        "bec",
        "plomes",
        "potes",
        "cua"
      ]
    },
    {
      "id": "els-animals-14",
      "type": "matching",
      "illustrationMatch": false,
      "pairs": [
        {
          "left": "gos",
          "right": "gossa"
        },
        {
          "left": "lleó",
          "right": "lleona"
        },
        {
          "left": "gat",
          "right": "gata"
        },
        {
          "left": "ós",
          "right": "óssa"
        },
        {
          "left": "conill",
          "right": "conilla"
        },
        {
          "left": "gall",
          "right": "gallina"
        },
        {
          "left": "tigre",
          "right": "tigressa"
        },
        {
          "left": "elefant",
          "right": "elefanta"
        }
      ]
    },
    {
      "id": "els-animals-15",
      "type": "fill-sentence",
      "blanks": [
        "neda",
        "vola",
        "camina",
        "s'arrossega",
        "camina",
        "neda"
      ]
    },
    {
      "id": "els-animals-16",
      "type": "multiple-choice",
      "answers": [
        "Gran, mamífer, cobert de pel, viu al bosc",
        "Gran, mamífer, cobert de pel, camina",
        "Petit, insecte, vola, té ales de colors",
        "Gran, peix, neda, perillos, viu al mar"
      ]
    },
    {
      "id": "els-animals-17",
      "type": "fill-sentence",
      "blanks": [
        "conills",
        "verd",
        "gran"
      ]
    },
    {
      "id": "els-animals-18",
      "type": "multiple-choice",
      "answers": [
        "No",
        "s'arrossega",
        "rèptil"
      ]
    },
    {
      "id": "els-animals-19",
      "type": "fill-sentence",
      "blanks": [
        "elefant",
        "cocodril",
        "serp",
        "tigre"
      ]
    },
    {
      "id": "els-animals-20",
      "type": "fill-letters",
      "words": [
        {
          "word": "gallina",
          "hint": "g_ll_na"
        },
        {
          "word": "flamenc",
          "hint": "fl_m_nc"
        },
        {
          "word": "papallona",
          "hint": "p_p_ll_na"
        },
        {
          "word": "cocodril",
          "hint": "c_c_dr_l"
        },
        {
          "word": "elefant",
          "hint": "e_ef_nt"
        },
        {
          "word": "hipopòtam",
          "hint": "h_p_p_tam"
        },
        {
          "word": "tortuga",
          "hint": "t_rt_ga"
        },
        {
          "word": "peix",
          "hint": "p_ix"
        }
      ]
    },
    {
      "id": "els-animals-21",
      "type": "self-assessment"
    },
    {
      "id": "els-animals-bonus",
      "type": "drawing-canvas"
    }
  ],
  "la-ciutat": [
    {
      "id": "la-ciutat-1",
      "type": "copy-word",
      "words": [
        "carrer",
        "plaça",
        "parc",
        "hospital",
        "escola",
        "biblioteca",
        "estació",
        "museu",
        "cinema",
        "restaurant",
        "mercat",
        "semàfor"
      ]
    },
    {
      "id": "la-ciutat-2",
      "type": "fill-letters",
      "words": [
        {
          "word": "carrer",
          "hint": "c_rr_r"
        },
        {
          "word": "plaça",
          "hint": "pl_ç_"
        },
        {
          "word": "hospital",
          "hint": "h_sp_t_l"
        },
        {
          "word": "escola",
          "hint": "e_c_la"
        },
        {
          "word": "biblioteca",
          "hint": "b_bl_ot_ca"
        },
        {
          "word": "estació",
          "hint": "e_t_ci_"
        },
        {
          "word": "museu",
          "hint": "m_s_u"
        },
        {
          "word": "cinema",
          "hint": "c_n_ma"
        },
        {
          "word": "semàfor",
          "hint": "s_m_f_r"
        },
        {
          "word": "mercat",
          "hint": "m_rc_t"
        }
      ]
    },
    {
      "id": "la-ciutat-3",
      "type": "unscramble",
      "words": [
        {
          "scrambled": "rracre",
          "correct": "carrer"
        },
        {
          "scrambled": "açalp",
          "correct": "plaça"
        },
        {
          "scrambled": "usmeu",
          "correct": "museu"
        },
        {
          "scrambled": "ocelsa",
          "correct": "escola"
        },
        {
          "scrambled": "tarcme",
          "correct": "mercat"
        }
      ]
    },
    {
      "id": "la-ciutat-4",
      "type": "matching",
      "illustrationMatch": false,
      "pairs": [
        {
          "left": "hospital",
          "right": "curar-se"
        },
        {
          "left": "escola",
          "right": "estudiar"
        },
        {
          "left": "cinema",
          "right": "veure pel·lícules"
        },
        {
          "left": "parc",
          "right": "jugar"
        },
        {
          "left": "restaurant",
          "right": "menjar"
        }
      ]
    },
    {
      "id": "la-ciutat-5",
      "type": "word-search",
      "gridSize": 10,
      "words": [
        "parc",
        "museu",
        "plaça",
        "mercat",
        "cinema"
      ],
      "grid": [
        [
          "p",
          "a",
          "r",
          "c",
          "t",
          "l",
          "q",
          "b",
          "d",
          "k"
        ],
        [
          "g",
          "h",
          "j",
          "n",
          "s",
          "r",
          "e",
          "f",
          "v",
          "t"
        ],
        [
          "p",
          "d",
          "q",
          "e",
          "l",
          "m",
          "u",
          "s",
          "e",
          "u"
        ],
        [
          "l",
          "t",
          "r",
          "g",
          "h",
          "j",
          "n",
          "s",
          "k",
          "b"
        ],
        [
          "a",
          "f",
          "d",
          "g",
          "m",
          "e",
          "r",
          "c",
          "a",
          "t"
        ],
        [
          "ç",
          "r",
          "h",
          "j",
          "k",
          "s",
          "b",
          "d",
          "e",
          "g"
        ],
        [
          "a",
          "l",
          "f",
          "q",
          "n",
          "t",
          "r",
          "d",
          "h",
          "j"
        ],
        [
          "k",
          "d",
          "g",
          "s",
          "t",
          "r",
          "l",
          "f",
          "q",
          "b"
        ],
        [
          "n",
          "h",
          "c",
          "i",
          "n",
          "e",
          "m",
          "a",
          "g",
          "k"
        ],
        [
          "t",
          "r",
          "l",
          "f",
          "q",
          "s",
          "n",
          "h",
          "j",
          "d"
        ]
      ]
    },
    {
      "id": "la-ciutat-6",
      "type": "classify-columns",
      "columns": [
        {
          "title": "Diversió",
          "items": [
            "parc",
            "cinema",
            "teatre",
            "museu"
          ]
        },
        {
          "title": "Serveis",
          "items": [
            "hospital",
            "estació",
            "mercat",
            "ajuntament"
          ]
        }
      ]
    },
    {
      "id": "la-ciutat-7",
      "type": "fill-sentence",
      "blanks": [
        "cinema",
        "mercat",
        "parc",
        "escola"
      ]
    },
    {
      "id": "la-ciutat-8",
      "type": "multiple-choice",
      "answers": [
        "A l'hospital",
        "Al museu",
        "Al semàfor",
        "A l'estació"
      ]
    },
    {
      "id": "la-ciutat-9",
      "type": "self-assessment"
    },
    {
      "id": "la-ciutat-10",
      "type": "matching",
      "illustrationMatch": false,
      "pairs": [
        {
          "left": "hospital",
          "right": "curar-se"
        },
        {
          "left": "escola",
          "right": "estudiar"
        },
        {
          "left": "parc",
          "right": "passejar"
        },
        {
          "left": "mercat",
          "right": "comprar"
        },
        {
          "left": "estació",
          "right": "viatjar"
        },
        {
          "left": "cinema",
          "right": "veure pel·lícules"
        }
      ]
    },
    {
      "id": "la-ciutat-11",
      "type": "fill-sentence",
      "blanks": [
        "mercat",
        "biblioteca",
        "estació",
        "parc"
      ]
    },
    {
      "id": "la-ciutat-12",
      "type": "classify-columns",
      "columns": [
        {
          "title": "Edificis",
          "items": [
            "hospital",
            "escola",
            "cinema",
            "museu",
            "biblioteca",
            "restaurant"
          ]
        },
        {
          "title": "Espais oberts",
          "items": [
            "parc",
            "plaça",
            "carrer",
            "jardí",
            "platja"
          ]
        }
      ]
    },
    {
      "id": "la-ciutat-13",
      "type": "fill-sentence",
      "blanks": [
        "parc",
        "mercat",
        "escola",
        "plaça"
      ]
    },
    {
      "id": "la-ciutat-14",
      "type": "fill-sentence",
      "blanks": [
        "semàfor",
        "pas de vianants",
        "parada d'autobús",
        "fanal"
      ]
    },
    {
      "id": "la-ciutat-bonus",
      "type": "drawing-canvas"
    }
  ],
  "els-vehicles": [
    {
      "id": "els-vehicles-1",
      "type": "copy-word",
      "words": [
        "cotxe",
        "autobús",
        "tren",
        "avió",
        "bicicleta",
        "moto",
        "vaixell",
        "helicòpter",
        "camió",
        "taxi",
        "ambulància",
        "barca"
      ]
    },
    {
      "id": "els-vehicles-2",
      "type": "fill-letters",
      "words": [
        {
          "word": "cotxe",
          "hint": "c_tx_"
        },
        {
          "word": "autobús",
          "hint": "a_tob_s"
        },
        {
          "word": "tren",
          "hint": "tr_n"
        },
        {
          "word": "avió",
          "hint": "av_ó"
        },
        {
          "word": "bicicleta",
          "hint": "b_cicl_ta"
        },
        {
          "word": "moto",
          "hint": "m_t_"
        },
        {
          "word": "vaixell",
          "hint": "v_ix_ll"
        },
        {
          "word": "helicòpter",
          "hint": "h_licò_ter"
        }
      ]
    },
    {
      "id": "els-vehicles-3",
      "type": "unscramble",
      "words": [
        {
          "scrambled": "xetco",
          "correct": "cotxe"
        },
        {
          "scrambled": "nert",
          "correct": "tren"
        },
        {
          "scrambled": "otom",
          "correct": "moto"
        },
        {
          "scrambled": "lleixav",
          "correct": "vaixell"
        },
        {
          "scrambled": "óimac",
          "correct": "camió"
        }
      ]
    },
    {
      "id": "els-vehicles-4",
      "type": "matching",
      "illustrationMatch": false,
      "pairs": [
        {
          "left": "cotxe",
          "right": "carretera"
        },
        {
          "left": "vaixell",
          "right": "mar"
        },
        {
          "left": "avió",
          "right": "cel"
        },
        {
          "left": "tren",
          "right": "vies"
        },
        {
          "left": "metro",
          "right": "sota terra"
        }
      ]
    },
    {
      "id": "els-vehicles-5",
      "type": "word-search",
      "gridSize": 10,
      "words": [
        "cotxe",
        "tren",
        "moto",
        "taxi",
        "avió",
        "barca",
        "camió",
        "vaixell"
      ],
      "grid": [
        [
          "c",
          "o",
          "t",
          "x",
          "e",
          "p",
          "t",
          "r",
          "e",
          "n"
        ],
        [
          "a",
          "h",
          "k",
          "l",
          "f",
          "g",
          "j",
          "d",
          "s",
          "q"
        ],
        [
          "m",
          "r",
          "v",
          "a",
          "i",
          "x",
          "e",
          "l",
          "l",
          "p"
        ],
        [
          "i",
          "t",
          "a",
          "x",
          "i",
          "k",
          "n",
          "h",
          "f",
          "r"
        ],
        [
          "ó",
          "s",
          "d",
          "g",
          "j",
          "l",
          "p",
          "q",
          "k",
          "s"
        ],
        [
          "b",
          "a",
          "r",
          "c",
          "a",
          "f",
          "h",
          "d",
          "g",
          "l"
        ],
        [
          "n",
          "k",
          "p",
          "l",
          "s",
          "r",
          "j",
          "f",
          "h",
          "k"
        ],
        [
          "m",
          "o",
          "t",
          "o",
          "q",
          "g",
          "d",
          "n",
          "p",
          "r"
        ],
        [
          "f",
          "j",
          "h",
          "k",
          "a",
          "v",
          "i",
          "ó",
          "s",
          "l"
        ],
        [
          "d",
          "g",
          "r",
          "s",
          "l",
          "p",
          "k",
          "f",
          "h",
          "j"
        ]
      ]
    },
    {
      "id": "els-vehicles-6",
      "type": "classify-columns",
      "columns": [
        {
          "title": "Terra",
          "items": [
            "cotxe",
            "autobús",
            "tren",
            "moto",
            "bicicleta",
            "taxi"
          ]
        },
        {
          "title": "Mar o aire",
          "items": [
            "vaixell",
            "barca",
            "avió",
            "helicòpter"
          ]
        }
      ]
    },
    {
      "id": "els-vehicles-7",
      "type": "fill-sentence",
      "blanks": [
        "autobús",
        "avió",
        "vaixell",
        "cotxe"
      ]
    },
    {
      "id": "els-vehicles-8",
      "type": "multiple-choice",
      "answers": [
        "Avió",
        "Tren",
        "Bicicleta",
        "Ambulància"
      ]
    },
    {
      "id": "els-vehicles-9",
      "type": "self-assessment"
    },
    {
      "id": "els-vehicles-10",
      "type": "fill-sentence",
      "blanks": [
        "tren",
        "avió",
        "autobús",
        "bicicleta"
      ]
    },
    {
      "id": "els-vehicles-11",
      "type": "classify-columns",
      "columns": [
        {
          "title": "Terra",
          "items": [
            "cotxe",
            "autobús",
            "tren",
            "moto",
            "bicicleta",
            "camió",
            "taxi"
          ]
        },
        {
          "title": "Mar",
          "items": [
            "vaixell",
            "barca",
            "canoa"
          ]
        },
        {
          "title": "Aire",
          "items": [
            "avió",
            "helicòpter",
            "globus"
          ]
        }
      ]
    },
    {
      "id": "els-vehicles-12",
      "type": "unscramble",
      "words": [
        {
          "scrambled": "xe-cot",
          "correct": "cotxe"
        },
        {
          "scrambled": "bús-to-au",
          "correct": "autobús"
        },
        {
          "scrambled": "ó-vi-a",
          "correct": "avió"
        },
        {
          "scrambled": "to-mo",
          "correct": "moto"
        },
        {
          "scrambled": "xell-vai",
          "correct": "vaixell"
        },
        {
          "scrambled": "ó-mi-ca",
          "correct": "camió"
        },
        {
          "scrambled": "xi-ta",
          "correct": "taxi"
        },
        {
          "scrambled": "ta-cle-ci-bi",
          "correct": "bicicleta"
        }
      ]
    },
    {
      "id": "els-vehicles-bonus",
      "type": "drawing-canvas"
    }
  ],
  "els-oficis": [
    {
      "id": "els-oficis-1",
      "type": "copy-word",
      "words": [
        "mestre",
        "metge",
        "bomber",
        "policia",
        "cuiner",
        "infermer",
        "pilot",
        "cambrer",
        "dentista",
        "veterinari",
        "jardiner",
        "pagès"
      ]
    },
    {
      "id": "els-oficis-2",
      "type": "fill-letters",
      "words": [
        {
          "word": "mestre",
          "hint": "m_str_"
        },
        {
          "word": "metge",
          "hint": "m_tg_"
        },
        {
          "word": "bomber",
          "hint": "b_mb_r"
        },
        {
          "word": "policia",
          "hint": "p_lic_a"
        },
        {
          "word": "cuiner",
          "hint": "c_in_r"
        },
        {
          "word": "infermer",
          "hint": "inf_rm_r"
        },
        {
          "word": "pilot",
          "hint": "p_l_t"
        },
        {
          "word": "cambrer",
          "hint": "c_mbr_r"
        },
        {
          "word": "dentista",
          "hint": "d_nt_sta"
        },
        {
          "word": "jardiner",
          "hint": "j_rdi_er"
        }
      ]
    },
    {
      "id": "els-oficis-3",
      "type": "unscramble",
      "words": [
        {
          "scrambled": "egtme",
          "correct": "metge"
        },
        {
          "scrambled": "lotip",
          "correct": "pilot"
        },
        {
          "scrambled": "boemrb",
          "correct": "bomber"
        },
        {
          "scrambled": "nricue",
          "correct": "cuiner"
        },
        {
          "scrambled": "gèspa",
          "correct": "pagès"
        }
      ]
    },
    {
      "id": "els-oficis-4",
      "type": "matching",
      "illustrationMatch": false,
      "pairs": [
        {
          "left": "mestre",
          "right": "escola"
        },
        {
          "left": "metge",
          "right": "hospital"
        },
        {
          "left": "bomber",
          "right": "parc de bombers"
        },
        {
          "left": "cuiner",
          "right": "restaurant"
        },
        {
          "left": "pilot",
          "right": "avió"
        }
      ]
    },
    {
      "id": "els-oficis-5",
      "type": "word-search",
      "gridSize": 10,
      "words": [
        "metge",
        "pilot",
        "bomber",
        "pagès",
        "cuiner",
        "mestre",
        "policia"
      ],
      "grid": [
        [
          "m",
          "e",
          "t",
          "g",
          "e",
          "l",
          "r",
          "k",
          "w",
          "p"
        ],
        [
          "m",
          "e",
          "s",
          "t",
          "r",
          "e",
          "r",
          "w",
          "j",
          "o"
        ],
        [
          "k",
          "d",
          "p",
          "i",
          "l",
          "o",
          "t",
          "h",
          "n",
          "l"
        ],
        [
          "w",
          "t",
          "r",
          "l",
          "k",
          "v",
          "d",
          "f",
          "t",
          "i"
        ],
        [
          "b",
          "o",
          "m",
          "b",
          "e",
          "r",
          "h",
          "n",
          "q",
          "c"
        ],
        [
          "p",
          "v",
          "d",
          "f",
          "k",
          "t",
          "r",
          "w",
          "j",
          "i"
        ],
        [
          "a",
          "q",
          "c",
          "u",
          "i",
          "n",
          "e",
          "r",
          "d",
          "a"
        ],
        [
          "g",
          "t",
          "r",
          "l",
          "k",
          "v",
          "d",
          "f",
          "m",
          "h"
        ],
        [
          "è",
          "w",
          "d",
          "f",
          "n",
          "q",
          "t",
          "r",
          "l",
          "k"
        ],
        [
          "s",
          "v",
          "h",
          "g",
          "m",
          "d",
          "f",
          "n",
          "q",
          "w"
        ]
      ]
    },
    {
      "id": "els-oficis-6",
      "type": "classify-columns",
      "columns": [
        {
          "title": "Dins",
          "items": [
            "mestre",
            "metge",
            "dentista",
            "cuiner",
            "pilot"
          ]
        },
        {
          "title": "Fora",
          "items": [
            "bomber",
            "policia",
            "jardiner",
            "pagès",
            "carter"
          ]
        }
      ]
    },
    {
      "id": "els-oficis-7",
      "type": "fill-sentence",
      "blanks": [
        "bomber",
        "mestre",
        "metge",
        "carter"
      ]
    },
    {
      "id": "els-oficis-8",
      "type": "multiple-choice",
      "answers": [
        "metge",
        "bomber",
        "cuiner",
        "pilot"
      ]
    },
    {
      "id": "els-oficis-9",
      "type": "self-assessment"
    },
    {
      "id": "els-oficis-10",
      "type": "multiple-choice",
      "answers": [
        "Bomber",
        "Policia",
        "Metge",
        "Mestre"
      ]
    },
    {
      "id": "els-oficis-11",
      "type": "fill-sentence",
      "blanks": [
        "veterinari",
        "infermer",
        "pagès",
        "dentista"
      ]
    },
    {
      "id": "els-oficis-12",
      "type": "fill-sentence",
      "blanks": [
        "bomber",
        "metge",
        "mestre",
        "cuiner",
        "pilot"
      ]
    },
    {
      "id": "els-oficis-13",
      "type": "matching",
      "illustrationMatch": false,
      "pairs": [
        {
          "left": "estetoscopi",
          "right": "metge"
        },
        {
          "left": "extintor",
          "right": "bomber"
        },
        {
          "left": "xeringa",
          "right": "infermer"
        },
        {
          "left": "paella",
          "right": "cuiner"
        },
        {
          "left": "pissarra",
          "right": "mestre"
        },
        {
          "left": "tisores",
          "right": "jardiner"
        }
      ]
    },
    {
      "id": "els-oficis-14",
      "type": "fill-sentence",
      "blanks": [
        "metge",
        "mestre",
        "pilot",
        "cuiner"
      ]
    },
    {
      "id": "els-oficis-bonus",
      "type": "drawing-canvas"
    }
  ]
};
