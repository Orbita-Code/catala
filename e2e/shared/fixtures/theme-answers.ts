/**
 * Answer keys for all 209 tasks across 12 themes.
 * Used by E2E test solvers to programmatically complete each task.
 */

export type TaskAnswer =
  | { type: "copy-word" }
  | { type: "fill-letters"; words: string[] }
  | { type: "unscramble"; words: string[] }
  | { type: "matching"; pairs: [string, string][] }
  | {
      type: "word-search";
      gridSize: number;
      wordPositions: {
        word: string;
        startRow: number;
        startCol: number;
        endRow: number;
        endCol: number;
      }[];
    }
  | {
      type: "classify-columns";
      columns: { columnName: string; items: string[] }[];
    }
  | { type: "fill-sentence"; blanks: string[] }
  | { type: "multiple-choice"; correctIndices: number[] }
  | { type: "self-assessment" }
  | {
      type: "color-by-instruction";
      areas: { area: string; color: string }[];
    }
  | { type: "label-image"; labels: string[] }
  | { type: "drawing-canvas" };

export const themeAnswers: Record<string, TaskAnswer[]> = {
  // ═══════════════════════════════════════════
  // Theme 1: La Classe (20 tasks)
  // ═══════════════════════════════════════════
  "la-classe": [
    // 1. copy-word
    { type: "copy-word" },
    // 2. word-search
    {
      type: "word-search",
      gridSize: 10,
      wordPositions: [
        { word: "tisores", startRow: 0, startCol: 0, endRow: 0, endCol: 6 },
        { word: "estoig", startRow: 1, startCol: 0, endRow: 1, endCol: 5 },
        { word: "llapis", startRow: 2, startCol: 0, endRow: 2, endCol: 5 },
        { word: "regle", startRow: 3, startCol: 0, endRow: 3, endCol: 4 },
        { word: "retolador", startRow: 4, startCol: 0, endRow: 4, endCol: 8 },
        { word: "goma", startRow: 5, startCol: 0, endRow: 5, endCol: 3 },
        { word: "motxilla", startRow: 6, startCol: 0, endRow: 6, endCol: 7 },
        { word: "bolígraf", startRow: 7, startCol: 0, endRow: 7, endCol: 7 },
        { word: "llibreta", startRow: 8, startCol: 0, endRow: 8, endCol: 7 },
        { word: "pissarra", startRow: 9, startCol: 0, endRow: 9, endCol: 7 },
      ],
    },
    // 3. fill-letters
    {
      type: "fill-letters",
      words: [
        "llapis", "goma", "llibre", "bolígraf", "llibreta",
        "retolador", "carpeta", "estoig", "maquineta",
      ],
    },
    // 4. classify-columns
    {
      type: "classify-columns",
      columns: [
        { columnName: "Femení (una)", items: ["goma", "llibreta", "carpeta", "maquineta", "motxilla", "tisores"] },
        { columnName: "Masculí (un)", items: ["llapis", "bolígraf", "retolador", "llibre", "estoig", "regle"] },
      ],
    },
    // 5. matching
    {
      type: "matching",
      pairs: [
        ["llapis", "escriure"],
        ["goma", "esborrar"],
        ["tisores", "tallar"],
        ["maquineta", "fer punta"],
        ["motxilla", "portar coses"],
        ["pissarra", "escriure amb guix"],
        ["regle", "mesurar"],
        ["ordinador", "treballar"],
      ],
    },
    // 6. classify-columns
    {
      type: "classify-columns",
      columns: [
        { columnName: "UN (singular)", items: ["llapis", "goma", "llibre", "estoig", "regle"] },
        { columnName: "MOLTS (plural)", items: ["bolígrafs", "retoladors", "llibretes", "carpetes", "maquinetes", "motxilles", "tisores"] },
      ],
    },
    // 7. color-by-instruction
    {
      type: "color-by-instruction",
      areas: [
        { area: "✏️", color: "blau" },
        { area: "🟩", color: "verd" },
        { area: "💻", color: "negre" },
        { area: "✂️", color: "vermell" },
        { area: "🔧", color: "groc" },
        { area: "📖", color: "blanc" },
        { area: "🎒", color: "lila" },
        { area: "📦", color: "verd" },
        { area: "📏", color: "taronja" },
        { area: "🖊️", color: "marró" },
      ],
    },
    // 8. fill-sentence
    { type: "fill-sentence", blanks: ["blava", "groc", "bolígraf", "pinzell", "clip", "barra", "tisores"] },
    // 9. copy-word
    { type: "copy-word" },
    // 10. unscramble
    { type: "unscramble", words: ["llapis", "goma", "estoig", "motxilla", "tisores", "ordinador", "guix"] },
    // 11. copy-word
    { type: "copy-word" },
    // 12. fill-sentence
    { type: "fill-sentence", blanks: ["pissarra", "guix", "cadira", "porta"] },
    // 13. fill-sentence
    { type: "fill-sentence", blanks: ["pissarra", "cadira", "paperera", "finestra"] },
    // 14. fill-sentence
    { type: "fill-sentence", blanks: ["regle", "motxilla", "guix", "estoig"] },
    // 15. label-image
    { type: "label-image", labels: ["llapis", "goma", "tisores", "estoig", "motxilla", "llibre"] },
    // 16. self-assessment
    { type: "self-assessment" },
    // 17. drawing-canvas
    { type: "drawing-canvas" },
    // 18. fill-sentence
    { type: "fill-sentence", blanks: ["llapis", "goma", "tisores", "motxilla"] },
    // 19. multiple-choice
    { type: "multiple-choice", correctIndices: [2, 1, 3, 0, 2] },
    // 20. classify-columns
    {
      type: "classify-columns",
      columns: [
        { columnName: "Coses grans", items: ["pissarra", "ordinador", "taula", "cadira", "porta", "finestra", "paperera"] },
        { columnName: "Coses petites", items: ["llapis", "goma", "bolígraf", "estoig", "maquineta", "regle", "guix"] },
      ],
    },
  ],

  // ═══════════════════════════════════════════
  // Theme 2: L'Escola (17 tasks)
  // ═══════════════════════════════════════════
  "l-escola": [
    { type: "copy-word" },
    { type: "fill-letters", words: ["aula", "biblioteca", "pati", "menjador", "gimnàs", "despatx", "lavabo", "passadís", "entrada", "escales"] },
    { type: "unscramble", words: ["aula", "pati", "lavabo", "menjador", "escales"] },
    {
      type: "matching",
      pairs: [
        ["aula", "estudiar"],
        ["pati", "jugar"],
        ["menjador", "dinar"],
        ["gimnàs", "fer esport"],
        ["biblioteca", "llegir"],
      ],
    },
    {
      type: "word-search",
      gridSize: 10,
      wordPositions: [
        { word: "aula", startRow: 0, startCol: 0, endRow: 0, endCol: 3 },
        { word: "pati", startRow: 1, startCol: 0, endRow: 1, endCol: 3 },
        { word: "gimnàs", startRow: 2, startCol: 0, endRow: 2, endCol: 5 },
        { word: "lavabo", startRow: 3, startCol: 0, endRow: 3, endCol: 5 },
        { word: "escales", startRow: 4, startCol: 0, endRow: 4, endCol: 6 },
      ],
    },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Dins", items: ["aula", "biblioteca", "menjador", "gimnàs", "lavabo", "despatx"] },
        { columnName: "Fora", items: ["pati", "entrada", "escales"] },
      ],
    },
    { type: "fill-sentence", blanks: ["pati", "menjador", "biblioteca", "gimnàs"] },
    { type: "multiple-choice", correctIndices: [0, 2, 1, 3] },
    { type: "self-assessment" },
    { type: "fill-sentence", blanks: ["menjador", "biblioteca", "gimnàs", "lavabo"] },
    { type: "label-image", labels: ["aula", "biblioteca", "menjador", "lavabo", "pati", "gimnàs"] },
    { type: "copy-word" },
    { type: "fill-sentence", blanks: ["estudiem", "juguem", "mengem", "llegim"] },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Espais de l'escola", items: ["aula", "biblioteca", "menjador", "lavabo", "pati", "gimnàs", "despatx"] },
        { columnName: "Persones de l'escola", items: ["mestre", "directora", "conserge", "secretari", "cuinera", "monitor"] },
      ],
    },
    { type: "label-image", labels: ["mestre", "directora", "conserge", "cuinera"] },
    { type: "fill-sentence", blanks: ["mestre", "directora", "conserge", "cuinera"] },
    { type: "drawing-canvas" },
  ],

  // ═══════════════════════════════════════════
  // Theme 3: El Cos (20 tasks)
  // ═══════════════════════════════════════════
  "el-cos": [
    { type: "copy-word" },
    { type: "unscramble", words: ["boca", "panxa", "orella", "cabell", "ungla", "colze"] },
    { type: "label-image", labels: ["cap", "braç", "mà", "panxa", "cama", "peu"] },
    {
      type: "word-search",
      gridSize: 8,
      wordPositions: [
        { word: "boca", startRow: 0, startCol: 0, endRow: 0, endCol: 3 },
        { word: "cap", startRow: 1, startCol: 0, endRow: 1, endCol: 2 },
        { word: "nas", startRow: 2, startCol: 0, endRow: 2, endCol: 2 },
        { word: "ull", startRow: 3, startCol: 0, endRow: 3, endCol: 2 },
        { word: "peu", startRow: 4, startCol: 0, endRow: 4, endCol: 2 },
        { word: "orella", startRow: 5, startCol: 0, endRow: 5, endCol: 5 },
        { word: "braç", startRow: 6, startCol: 0, endRow: 6, endCol: 3 },
      ],
    },
    { type: "label-image", labels: ["ull", "nas", "boca", "orella", "cabell"] },
    { type: "fill-sentence", blanks: ["taronja", "negre", "ros", "marró"] },
    {
      type: "word-search",
      gridSize: 7,
      wordPositions: [
        { word: "front", startRow: 0, startCol: 0, endRow: 0, endCol: 4 },
        { word: "galtes", startRow: 1, startCol: 0, endRow: 1, endCol: 5 },
        { word: "orelles", startRow: 2, startCol: 0, endRow: 2, endCol: 6 },
        { word: "ulls", startRow: 3, startCol: 0, endRow: 3, endCol: 3 },
        { word: "celles", startRow: 4, startCol: 0, endRow: 4, endCol: 5 },
      ],
    },
    { type: "copy-word" },
    {
      type: "matching",
      pairs: [
        ["ulls", "mirar"],
        ["orelles", "escoltar"],
        ["boca", "cantar"],
        ["mans", "aplaudir"],
        ["cames", "caminar"],
        ["nas", "olorar"],
      ],
    },
    { type: "fill-sentence", blanks: ["llarg", "marrons", "alta"] },
    { type: "fill-sentence", blanks: ["ulls", "orelles", "dits", "nas"] },
    { type: "fill-sentence", blanks: ["ulls", "orelles", "peus", "mans"] },
    { type: "drawing-canvas" },
    { type: "multiple-choice", correctIndices: [0, 1, 0, 1] },
    { type: "label-image", labels: ["barba", "bigoti", "arrugues", "dentadura"] },
    { type: "fill-sentence", blanks: ["Carla", "Dani", "Laura"] },
    { type: "self-assessment" },
    { type: "drawing-canvas" },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Cap", items: ["ull", "nas", "boca", "orella", "cabell"] },
        { columnName: "Cos", items: ["braç", "mà", "cama", "genoll", "peu"] },
      ],
    },
    {
      type: "color-by-instruction",
      areas: [
        { area: "🟡", color: "groc" },
        { area: "💪", color: "blau" },
        { area: "🦵", color: "verd" },
        { area: "⭕", color: "taronja" },
        { area: "🤚", color: "rosa" },
      ],
    },
  ],

  // ═══════════════════════════════════════════
  // Theme 4: La Roba (14 tasks)
  // ═══════════════════════════════════════════
  "la-roba": [
    { type: "copy-word" },
    { type: "fill-letters", words: ["texans", "camisa", "samarreta", "jaqueta", "pantalons", "sabatilles", "faldilla", "bufanda"] },
    { type: "unscramble", words: ["vestit", "camisa", "sabates", "faldilla", "texans"] },
    {
      type: "matching",
      pairs: [
        ["gorra", "cap"],
        ["guants", "mans"],
        ["sabates", "peus"],
        ["bufanda", "coll"],
        ["pantalons", "cames"],
      ],
    },
    {
      type: "word-search",
      gridSize: 10,
      wordPositions: [
        { word: "botes", startRow: 0, startCol: 3, endRow: 0, endCol: 7 },
        { word: "abric", startRow: 4, startCol: 8, endRow: 8, endCol: 8 },
        { word: "vestit", startRow: 6, startCol: 5, endRow: 6, endCol: 0 },
        { word: "camisa", startRow: 0, startCol: 9, endRow: 5, endCol: 9 },
        { word: "gorra", startRow: 8, startCol: 0, endRow: 8, endCol: 4 },
      ],
    },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Estiu", items: ["samarreta", "faldilla", "sabatilles", "vestit"] },
        { columnName: "Hivern", items: ["abric", "bufanda", "guants", "botes"] },
      ],
    },
    { type: "fill-sentence", blanks: ["samarreta", "abric", "sabates", "gorra"] },
    { type: "multiple-choice", correctIndices: [0, 1, 2, 3] },
    { type: "self-assessment" },
    { type: "fill-sentence", blanks: ["abric", "botes", "samarreta", "gorra"] },
    { type: "fill-sentence", blanks: ["vermell", "noves", "calenta"] },
    { type: "label-image", labels: ["samarreta", "pantalons", "sabates", "mitjons", "gorra", "jaqueta"] },
    { type: "drawing-canvas" },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Roba d'estiu", items: ["samarreta", "pantalons curts", "vestit", "faldilla", "sandàlies"] },
        { columnName: "Roba d'hivern", items: ["abric", "bufanda", "guants", "botes", "jaqueta", "barret"] },
      ],
    },
  ],

  // ═══════════════════════════════════════════
  // Theme 5: La Casa (23 tasks)
  // ═══════════════════════════════════════════
  "la-casa": [
    { type: "copy-word" },
    {
      type: "word-search",
      gridSize: 7,
      wordPositions: [
        { word: "escala", startRow: 0, startCol: 0, endRow: 0, endCol: 5 },
        { word: "cortina", startRow: 1, startCol: 0, endRow: 1, endCol: 6 },
        { word: "antena", startRow: 2, startCol: 0, endRow: 2, endCol: 5 },
        { word: "jardí", startRow: 4, startCol: 0, endRow: 4, endCol: 4 },
        { word: "façana", startRow: 0, startCol: 6, endRow: 5, endCol: 6 },
        { word: "balcó", startRow: 6, startCol: 2, endRow: 6, endCol: 6 },
      ],
    },
    { type: "label-image", labels: ["façana", "xemeneia", "balcó", "jardí", "garatge", "antena"] },
    { type: "fill-letters", words: ["façana", "xemeneia", "balcó", "persiana", "cortina", "escala", "jardí", "garatge"] },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Parts exteriors", items: ["façana", "balcó", "jardí", "garatge", "antena", "xemeneia"] },
        { columnName: "Parts interiors", items: ["cortina", "persiana", "escala"] },
      ],
    },
    {
      type: "matching",
      pairs: [
        ["passadís", "per anar d'una habitació a una altra"],
        ["sala d'estar", "per mirar la televisió"],
        ["dormitori", "per dormir"],
        ["menjador", "per menjar"],
        ["cuina", "per cuinar"],
        ["garatge", "per guardar el cotxe"],
        ["lavabo", "per banyar-se"],
      ],
    },
    { type: "copy-word" },
    { type: "fill-letters", words: ["dormitori", "menjador", "terrassa", "lavabo", "saló", "cuina"] },
    { type: "copy-word" },
    { type: "fill-sentence", blanks: ["televisió", "sofà", "nevera", "llit"] },
    { type: "copy-word" },
    { type: "copy-word" },
    { type: "fill-sentence", blanks: ["coixí", "armari", "despertador", "llit"] },
    { type: "copy-word" },
    { type: "fill-sentence", blanks: ["a sobre", "a sota", "a dins", "al davant"] },
    { type: "fill-sentence", blanks: ["menjador", "cuina", "saló", "biblioteca"] },
    { type: "fill-sentence", blanks: ["Obra", "pati", "cuina"] },
    { type: "fill-sentence", blanks: ["tres", "una", "dues"] },
    { type: "drawing-canvas" },
    { type: "self-assessment" },
    { type: "drawing-canvas" },
    { type: "multiple-choice", correctIndices: [0, 1, 2, 3] },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Cuina", items: ["nevera", "taula", "cadira", "rentaplats"] },
        { columnName: "Dormitori", items: ["llit", "armari", "coixí"] },
        { columnName: "Bany", items: ["banyera", "mirall", "vàter"] },
      ],
    },
  ],

  // ═══════════════════════════════════════════
  // Theme 6: La Família (14 tasks)
  // ═══════════════════════════════════════════
  "la-familia": [
    { type: "copy-word" },
    { type: "fill-letters", words: ["pare", "mare", "germà", "germana", "avi", "àvia", "oncle", "tia", "cosí", "cosina", "fill", "filla", "bebè", "nebot", "neboda"] },
    { type: "unscramble", words: ["mare", "germà", "oncle", "nebot", "filla"] },
    {
      type: "matching",
      pairs: [
        ["pare", "mare"],
        ["avi", "àvia"],
        ["germà", "germana"],
        ["oncle", "tia"],
        ["nebot", "neboda"],
      ],
    },
    {
      type: "word-search",
      gridSize: 10,
      wordPositions: [
        { word: "pare", startRow: 0, startCol: 3, endRow: 3, endCol: 3 },
        { word: "mare", startRow: 5, startCol: 4, endRow: 5, endCol: 7 },
        { word: "avi", startRow: 1, startCol: 0, endRow: 3, endCol: 2 },
        { word: "tia", startRow: 7, startCol: 7, endRow: 7, endCol: 5 },
        { word: "nebot", startRow: 3, startCol: 8, endRow: 7, endCol: 8 },
      ],
    },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Home", items: ["pare", "germà", "avi", "oncle", "cosí", "fill", "nebot"] },
        { columnName: "Dona", items: ["mare", "germana", "àvia", "tia", "cosina", "filla", "neboda"] },
      ],
    },
    { type: "fill-sentence", blanks: ["avi", "tia", "cosí", "àvia"] },
    { type: "multiple-choice", correctIndices: [1, 2, 3, 1] },
    { type: "self-assessment" },
    { type: "label-image", labels: ["avi", "àvia", "pare", "mare", "germà", "germana"] },
    { type: "fill-sentence", blanks: ["avi", "tia", "cosí", "àvia"] },
    { type: "fill-sentence", blanks: ["germà", "mare", "pare", "àvia"] },
    { type: "self-assessment" },
    { type: "drawing-canvas" },
  ],

  // ═══════════════════════════════════════════
  // Theme 7: Les Botigues (15 tasks)
  // ═══════════════════════════════════════════
  "les-botigues": [
    { type: "copy-word" },
    { type: "fill-letters", words: ["supermercat", "forn", "peixateria", "carnisseria", "farmàcia", "llibreria", "pastisseria", "fruiteria", "joguineria"] },
    { type: "unscramble", words: ["forn", "farmàcia", "fruiteria", "llibreria", "joguineria"] },
    {
      type: "matching",
      pairs: [
        ["forn", "pa"],
        ["peixateria", "peix"],
        ["carnisseria", "carn"],
        ["farmàcia", "medicaments"],
        ["fruiteria", "fruita"],
      ],
    },
    {
      type: "word-search",
      gridSize: 10,
      wordPositions: [
        { word: "forn", startRow: 0, startCol: 0, endRow: 3, endCol: 3 },
        { word: "carn", startRow: 0, startCol: 7, endRow: 3, endCol: 7 },
        { word: "peix", startRow: 4, startCol: 0, endRow: 4, endCol: 3 },
        { word: "fruita", startRow: 7, startCol: 5, endRow: 7, endCol: 0 },
        { word: "pa", startRow: 1, startCol: 5, endRow: 1, endCol: 6 },
      ],
    },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Menjar", items: ["forn", "peixateria", "carnisseria", "pastisseria", "fruiteria", "supermercat"] },
        { columnName: "No menjar", items: ["farmàcia", "llibreria", "joguineria", "botiga de roba"] },
      ],
    },
    { type: "fill-sentence", blanks: ["forn", "peixateria", "fruiteria", "joguineria"] },
    { type: "multiple-choice", correctIndices: [0, 1, 2, 3] },
    { type: "self-assessment" },
    { type: "label-image", labels: ["poma", "pera", "plàtan", "taronja", "maduixa", "cirera"] },
    { type: "label-image", labels: ["pastanaga", "ceba", "tomàquet", "pebrot", "enciam"] },
    { type: "fill-letters", words: ["pastanaga", "tomàquet", "pollastre", "sardina", "maduixa", "plàtan"] },
    { type: "label-image", labels: ["pollastre", "porc", "peix", "gamba"] },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Fruites", items: ["poma", "pera", "plàtan", "taronja", "maduixa"] },
        { columnName: "Verdures", items: ["pastanaga", "ceba", "tomàquet", "pebrot", "enciam"] },
        { columnName: "Carn i peix", items: ["pollastre", "porc", "peix", "gamba"] },
      ],
    },
    { type: "drawing-canvas" },
  ],

  // ═══════════════════════════════════════════
  // Theme 8: El Menjar (20 tasks)
  // ═══════════════════════════════════════════
  "el-menjar": [
    { type: "copy-word" },
    { type: "fill-letters", words: ["poma", "pera", "plàtan", "taronja", "maduixa", "tomàquet", "pastanaga", "llet", "formatge", "peix"] },
    { type: "unscramble", words: ["poma", "pera", "peix", "llet", "ceba"] },
    {
      type: "matching",
      pairs: [
        ["esmorzar", "cereals"],
        ["dinar", "sopa"],
        ["berenar", "fruita"],
        ["sopar", "amanida"],
      ],
    },
    {
      type: "word-search",
      gridSize: 10,
      wordPositions: [
        { word: "poma", startRow: 0, startCol: 0, endRow: 0, endCol: 3 },
        { word: "pera", startRow: 1, startCol: 0, endRow: 1, endCol: 3 },
        { word: "pa", startRow: 2, startCol: 0, endRow: 2, endCol: 1 },
        { word: "llet", startRow: 3, startCol: 0, endRow: 3, endCol: 3 },
        { word: "ou", startRow: 4, startCol: 0, endRow: 4, endCol: 1 },
      ],
    },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Fruita", items: ["poma", "pera", "plàtan", "taronja", "maduixa"] },
        { columnName: "Verdura", items: ["tomàquet", "pastanaga", "ceba", "enciam", "patata"] },
      ],
    },
    { type: "fill-sentence", blanks: ["llet", "sopa", "fruita", "amanida"] },
    { type: "multiple-choice", correctIndices: [1, 2, 3, 1] },
    { type: "self-assessment" },
    { type: "label-image", labels: ["cereals", "suc", "llet", "torrada", "fruita"] },
    { type: "fill-sentence", blanks: ["cereals", "arròs", "entrepà", "sopa"] },
    { type: "label-image", labels: ["pa", "formatge", "ou", "pizza", "pasta", "hamburguesa"] },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Esmorzar", items: ["cereals", "torrada", "llet", "suc", "fruita"] },
        { columnName: "Dinar", items: ["arròs", "carn", "peix", "amanida", "pasta"] },
        { columnName: "Sopar", items: ["sopa", "entrepà", "ou", "formatge"] },
      ],
    },
    { type: "fill-sentence", blanks: ["llet", "amanida", "ou", "pa"] },
    { type: "fill-letters", words: ["hamburguesa", "entrepà", "formatge", "amanida", "cereals", "torrada"] },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Dolç", items: ["xocolata", "pastís", "galeta", "melmelada", "fruita"] },
        { columnName: "Salat", items: ["formatge", "pernil", "entrepà", "pizza", "sopa"] },
      ],
    },
    { type: "fill-sentence", blanks: ["pizza", "peix", "xocolata"] },
    { type: "label-image", labels: ["sopa", "pa", "formatge", "fruita"] },
    { type: "label-image", labels: ["amanida", "arròs", "peix", "suc"] },
    { type: "drawing-canvas" },
  ],

  // ═══════════════════════════════════════════
  // Theme 9: Els Animals (21 tasks)
  // ═══════════════════════════════════════════
  "els-animals": [
    { type: "copy-word" },
    { type: "fill-letters", words: ["conill", "tigre", "elefant", "tortuga", "girafa", "dofí", "ocell", "serp", "lleó", "gos"] },
    { type: "unscramble", words: ["conill", "tigre", "peix", "girafa", "lleó"] },
    {
      type: "matching",
      pairs: [
        ["gos", "bup bup"],
        ["gat", "meu meu"],
        ["lleó", "grr"],
        ["ocell", "piu piu"],
        ["serp", "sss"],
      ],
    },
    {
      type: "word-search",
      gridSize: 10,
      wordPositions: [
        { word: "gos", startRow: 0, startCol: 0, endRow: 0, endCol: 2 },
        { word: "gat", startRow: 1, startCol: 0, endRow: 1, endCol: 2 },
        { word: "lleo", startRow: 2, startCol: 0, endRow: 2, endCol: 3 },
        { word: "peix", startRow: 3, startCol: 0, endRow: 3, endCol: 3 },
        { word: "serp", startRow: 4, startCol: 0, endRow: 4, endCol: 3 },
      ],
    },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Domèstics", items: ["gos", "gat", "conill", "hàmster", "tortuga"] },
        { columnName: "Salvatges", items: ["lleó", "tigre", "elefant", "girafa", "serp"] },
      ],
    },
    { type: "fill-sentence", blanks: ["gos", "tigre", "elefant", "peix"] },
    { type: "multiple-choice", correctIndices: [1, 2, 3, 0] },
    { type: "self-assessment" },
    { type: "label-image", labels: ["bec", "ales", "plomes", "cua", "potes"] },
    { type: "copy-word" },
    { type: "fill-letters", words: ["dofí", "balena", "tauró", "medusa", "pop", "tortuga"] },
    { type: "copy-word" },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Animals de granja", items: ["gos", "gat", "conill", "cavall", "vaca", "ovella", "gallina", "ànec", "porc"] },
        { columnName: "Animals salvatges", items: ["lleó", "tigre", "elefant", "girafa", "zebra", "ós", "mico"] },
      ],
    },
    { type: "fill-sentence", blanks: ["lleó", "vaca", "gallina", "dofí", "elefant"] },
    { type: "label-image", labels: ["gos", "gat", "vaca", "cavall", "gallina", "ovella"] },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Mar", items: ["dofí", "balena", "tauró", "pop", "medusa"] },
        { columnName: "Terra", items: ["lleó", "elefant", "gos", "gat", "conill"] },
        { columnName: "Aire", items: ["àguila", "oreneta", "mussol", "gavina", "papallona"] },
      ],
    },
    { type: "fill-sentence", blanks: ["borda", "miola", "mugeix", "canta"] },
    { type: "label-image", labels: ["formiga", "papallona", "abella", "aranya"] },
    { type: "fill-sentence", blanks: ["gos", "quatre", "marró", "casa"] },
    { type: "drawing-canvas" },
  ],

  // ═══════════════════════════════════════════
  // Theme 10: La Ciutat (15 tasks)
  // ═══════════════════════════════════════════
  "la-ciutat": [
    { type: "copy-word" },
    { type: "fill-letters", words: ["carrer", "plaça", "hospital", "escola", "biblioteca", "estació", "museu", "cinema", "semàfor", "mercat"] },
    { type: "unscramble", words: ["carrer", "plaça", "museu", "escola", "mercat"] },
    {
      type: "matching",
      pairs: [
        ["hospital", "curar-se"],
        ["escola", "estudiar"],
        ["cinema", "veure pel·lícules"],
        ["parc", "jugar"],
        ["restaurant", "menjar"],
      ],
    },
    {
      type: "word-search",
      gridSize: 10,
      wordPositions: [
        { word: "parc", startRow: 0, startCol: 0, endRow: 0, endCol: 3 },
        { word: "museu", startRow: 1, startCol: 0, endRow: 1, endCol: 4 },
        { word: "plaça", startRow: 2, startCol: 0, endRow: 2, endCol: 4 },
        { word: "mercat", startRow: 3, startCol: 0, endRow: 3, endCol: 5 },
        { word: "cinema", startRow: 4, startCol: 0, endRow: 4, endCol: 5 },
      ],
    },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Diversió", items: ["parc", "cinema", "teatre", "museu", "restaurant"] },
        { columnName: "Serveis", items: ["hospital", "escola", "estació", "mercat", "ajuntament"] },
      ],
    },
    { type: "fill-sentence", blanks: ["cinema", "mercat", "parc", "escola"] },
    { type: "multiple-choice", correctIndices: [1, 2, 0, 3] },
    { type: "self-assessment" },
    { type: "label-image", labels: ["hospital", "escola", "parc", "mercat", "estació", "cinema"] },
    { type: "fill-sentence", blanks: ["mercat", "biblioteca", "estació", "parc"] },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Edificis", items: ["hospital", "escola", "cinema", "museu", "biblioteca", "restaurant"] },
        { columnName: "Espais oberts", items: ["parc", "plaça", "carrer", "jardí", "platja"] },
      ],
    },
    { type: "fill-sentence", blanks: ["parc", "mercat", "escola", "plaça"] },
    { type: "label-image", labels: ["semàfor", "pas de vianants", "parada d'autobús", "fanal"] },
    { type: "drawing-canvas" },
  ],

  // ═══════════════════════════════════════════
  // Theme 11: Els Vehicles (15 tasks)
  // ═══════════════════════════════════════════
  "els-vehicles": [
    { type: "copy-word" },
    { type: "fill-letters", words: ["cotxe", "autobús", "tren", "avió", "bicicleta", "moto", "vaixell", "helicòpter"] },
    { type: "unscramble", words: ["cotxe", "tren", "moto", "vaixell", "camió"] },
    {
      type: "matching",
      pairs: [
        ["cotxe", "carretera"],
        ["vaixell", "mar"],
        ["avió", "cel"],
        ["tren", "vies"],
        ["metro", "sota terra"],
      ],
    },
    {
      type: "word-search",
      gridSize: 10,
      wordPositions: [
        { word: "cotxe", startRow: 0, startCol: 1, endRow: 4, endCol: 5 },
        { word: "tren", startRow: 2, startCol: 8, endRow: 5, endCol: 8 },
        { word: "moto", startRow: 5, startCol: 6, endRow: 5, endCol: 3 },
        { word: "taxi", startRow: 0, startCol: 6, endRow: 3, endCol: 6 },
        { word: "avió", startRow: 7, startCol: 0, endRow: 7, endCol: 3 },
      ],
    },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Terra", items: ["cotxe", "autobús", "tren", "moto", "bicicleta", "taxi"] },
        { columnName: "Mar o aire", items: ["vaixell", "barca", "avió", "helicòpter"] },
      ],
    },
    { type: "fill-sentence", blanks: ["autobús", "avió", "vaixell", "cotxe"] },
    { type: "multiple-choice", correctIndices: [0, 1, 2, 3] },
    { type: "self-assessment" },
    { type: "label-image", labels: ["cotxe", "autobús", "tren", "avió", "vaixell", "bicicleta"] },
    { type: "fill-sentence", blanks: ["tren", "avió", "autobús", "bicicleta"] },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Terra", items: ["cotxe", "autobús", "tren", "moto", "bicicleta", "camió", "taxi"] },
        { columnName: "Mar", items: ["vaixell", "barca", "canoa"] },
        { columnName: "Aire", items: ["avió", "helicòpter", "globus"] },
      ],
    },
    { type: "label-image", labels: ["roda", "porta", "volant", "mirall", "far"] },
    { type: "fill-sentence", blanks: ["quatre", "dues", "hospital", "pesades"] },
    { type: "drawing-canvas" },
  ],

  // ═══════════════════════════════════════════
  // Theme 12: Els Oficis (15 tasks)
  // ═══════════════════════════════════════════
  "els-oficis": [
    { type: "copy-word" },
    { type: "fill-letters", words: ["mestre", "metge", "bomber", "policia", "cuiner", "infermer", "pilot", "cambrer", "dentista", "jardiner"] },
    { type: "unscramble", words: ["metge", "pilot", "bomber", "cuiner", "pagès"] },
    {
      type: "matching",
      pairs: [
        ["mestre", "escola"],
        ["metge", "hospital"],
        ["bomber", "parc de bombers"],
        ["cuiner", "restaurant"],
        ["pilot", "avió"],
      ],
    },
    {
      type: "word-search",
      gridSize: 10,
      wordPositions: [
        { word: "metge", startRow: 0, startCol: 0, endRow: 0, endCol: 4 },
        { word: "pilot", startRow: 1, startCol: 0, endRow: 1, endCol: 4 },
        { word: "bomber", startRow: 2, startCol: 0, endRow: 2, endCol: 5 },
        { word: "pagès", startRow: 3, startCol: 0, endRow: 3, endCol: 4 },
        { word: "cuiner", startRow: 4, startCol: 0, endRow: 4, endCol: 5 },
      ],
    },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Dins", items: ["mestre", "metge", "dentista", "cuiner", "pilot"] },
        { columnName: "Fora", items: ["bomber", "policia", "jardiner", "pagès", "carter"] },
      ],
    },
    { type: "fill-sentence", blanks: ["bomber", "mestre", "metge", "carter"] },
    { type: "multiple-choice", correctIndices: [1, 2, 1, 3] },
    { type: "self-assessment" },
    { type: "label-image", labels: ["bomber", "policia", "metge", "mestre", "cuiner", "jardiner"] },
    { type: "fill-sentence", blanks: ["veterinari", "infermer", "pagès", "dentista"] },
    {
      type: "classify-columns",
      columns: [
        { columnName: "Salut", items: ["metge", "infermer", "dentista", "veterinari", "farmacèutic"] },
        { columnName: "Seguretat", items: ["bomber", "policia", "socorrista"] },
        { columnName: "Altres", items: ["mestre", "cuiner", "pilot", "jardiner", "pagès"] },
      ],
    },
    { type: "label-image", labels: ["estetoscopi", "extintor", "xeringa", "paella"] },
    { type: "fill-sentence", blanks: ["metge", "mestre", "pilot", "cuiner"] },
    { type: "drawing-canvas" },
  ],
};
