/**
 * Answer keys for all ~241 tasks across 12 themes.
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
  | { type: "drawing-canvas" }
  | { type: "add-article" }
  | { type: "separate-words" }
  | { type: "count-and-write" }
  | { type: "write-antonym" }
  | { type: "order-words" }
  | { type: "decode-grid" };

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
  // Theme 2: L'Escola (19 tasks)
  // ═══════════════════════════════════════════
  "l-escola": [
    // 1. copy-word (school places)
    { type: "copy-word" },
    // 2. fill-letters (school places)
    { type: "fill-letters", words: ["aula", "biblioteca", "pati", "menjador", "gimnàs", "despatx", "lavabo", "passadís", "entrada", "escales"] },
    // 3. unscramble
    { type: "unscramble", words: ["aula", "pati", "lavabo", "menjador", "escales"] },
    // 4. matching (place-activity)
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
    // 5. word-search
    {
      type: "word-search",
      gridSize: 10,
      wordPositions: [
        { word: "aula", startRow: 0, startCol: 0, endRow: 0, endCol: 3 },
        { word: "pati", startRow: 2, startCol: 0, endRow: 2, endCol: 3 },
        { word: "gimnàs", startRow: 2, startCol: 8, endRow: 2, endCol: 3 },
        { word: "lavabo", startRow: 4, startCol: 0, endRow: 4, endCol: 5 },
        { word: "escales", startRow: 6, startCol: 0, endRow: 6, endCol: 6 },
      ],
    },
    // 6. classify-columns (dins vs fora)
    {
      type: "classify-columns",
      columns: [
        { columnName: "Dins", items: ["aula", "biblioteca", "menjador", "gimnàs", "lavabo", "despatx"] },
        { columnName: "Fora", items: ["pati", "entrada", "escales"] },
      ],
    },
    // 7. fill-sentence
    { type: "fill-sentence", blanks: ["pati", "menjador", "biblioteca", "gimnàs"] },
    // 8. multiple-choice
    { type: "multiple-choice", correctIndices: [0, 2, 1, 3] },
    // 9. self-assessment
    { type: "self-assessment" },
    // 10. fill-sentence
    { type: "fill-sentence", blanks: ["menjador", "biblioteca", "gimnàs", "lavabo"] },
    // 11. label-image
    { type: "label-image", labels: ["aula", "biblioteca", "menjador", "lavabo", "pati", "gimnàs"] },
    // 12. fill-sentence (què fem a cada lloc)
    { type: "fill-sentence", blanks: ["estudiem", "juguem", "mengem", "llegim"] },
    // 13. copy-word (subjects) — was old task 14
    { type: "copy-word" },
    // 14. copy-word (days of week) — was old task 15
    { type: "copy-word" },
    // 15. fill-letters (subjects) — was old task 16
    { type: "fill-letters", words: ["matemàtiques", "llengües", "música", "dibuix", "anglès", "informàtica", "ciències"] },
    // 16. matching (subjects) — was old task 17
    {
      type: "matching",
      pairs: [
        ["matemàtiques", "números"],
        ["llengües", "paraules"],
        ["música", "cançons"],
        ["dibuix", "colors"],
        ["educació física", "esport"],
      ],
    },
    // 17. classify-columns (subjects vs days) — was old task 18
    {
      type: "classify-columns",
      columns: [
        { columnName: "Assignatures", items: ["matemàtiques", "llengües", "música", "dibuix", "anglès", "ciències"] },
        { columnName: "Dies de la setmana", items: ["dilluns", "dimarts", "dimecres", "dijous", "divendres"] },
      ],
    },
    // 18. fill-sentence (horari) — was old task 19
    { type: "fill-sentence", blanks: ["matemàtiques", "llengües", "música", "educació física"] },
    // 19. drawing-canvas — was old task 20
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
  // Theme 4: La Roba (19 tasks)
  // ═══════════════════════════════════════════
  "la-roba": [
    // 1. copy-word
    { type: "copy-word" },
    // 2. fill-letters
    { type: "fill-letters", words: ["texans", "camisa", "samarreta", "jaqueta", "pantalons", "sabatilles", "faldilla", "bufanda"] },
    // 3. unscramble
    { type: "unscramble", words: ["vestit", "camisa", "sabates", "faldilla", "texans"] },
    // 4. matching
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
    // 5. word-search
    {
      type: "word-search",
      gridSize: 10,
      wordPositions: [
        { word: "botes", startRow: 0, startCol: 3, endRow: 0, endCol: 7 },
        { word: "camisa", startRow: 0, startCol: 9, endRow: 5, endCol: 9 },
        { word: "vestit", startRow: 6, startCol: 5, endRow: 6, endCol: 0 },
        { word: "gorra", startRow: 8, startCol: 0, endRow: 8, endCol: 4 },
        { word: "abric", startRow: 4, startCol: 8, endRow: 8, endCol: 8 },
      ],
    },
    // 6. classify-columns (estiu vs hivern)
    {
      type: "classify-columns",
      columns: [
        { columnName: "Estiu", items: ["samarreta", "faldilla", "sabatilles", "vestit"] },
        { columnName: "Hivern", items: ["abric", "bufanda", "guants", "botes"] },
      ],
    },
    // 7. fill-sentence
    { type: "fill-sentence", blanks: ["samarreta", "abric", "sabates", "gorra"] },
    // 8. multiple-choice
    { type: "multiple-choice", correctIndices: [0, 1, 2, 3] },
    // 9. self-assessment
    { type: "self-assessment" },
    // 10. fill-sentence
    { type: "fill-sentence", blanks: ["abric", "botes", "samarreta", "gorra"] },
    // 11. fill-sentence
    { type: "fill-sentence", blanks: ["vermell", "noves", "calenta"] },
    // 12. label-image
    { type: "label-image", labels: ["samarreta", "pantalons", "sabates", "mitjons", "gorra", "jaqueta"] },
    // 13. classify-columns (estiu vs hivern expanded)
    {
      type: "classify-columns",
      columns: [
        { columnName: "Roba d'estiu", items: ["samarreta", "pantalons curts", "vestit", "faldilla", "sandàlies"] },
        { columnName: "Roba d'hivern", items: ["abric", "bufanda", "guants", "botes", "jaqueta", "barret"] },
      ],
    },
    // 14. copy-word (accessories)
    { type: "copy-word" },
    // 15. copy-word (summer clothes)
    { type: "copy-word" },
    // 16. fill-letters (new clothing)
    { type: "fill-letters", words: ["banyador", "cinturó", "arracades", "collaret", "ulleres", "sandàlies", "xandall", "caputxa"] },
    // 17. matching (occasion)
    {
      type: "matching",
      pairs: [
        ["banyador", "platja"],
        ["xandall", "esport"],
        ["corbata", "festa"],
        ["pijama", "dormir"],
        ["abric", "fred"],
      ],
    },
    // 18. classify-columns (summer vs winter vs accessories)
    {
      type: "classify-columns",
      columns: [
        { columnName: "Roba d'estiu", items: ["banyador", "biquini", "sandàlies", "pantalons curts", "samarreta de tirants"] },
        { columnName: "Roba d'hivern", items: ["abric", "bufanda", "guants", "botes", "xandall", "caputxa"] },
        { columnName: "Complements", items: ["arracades", "anell", "collaret", "ulleres", "corbata", "cinturó"] },
      ],
    },
    // 19. drawing-canvas
    { type: "drawing-canvas" },
  ],

  // ═══════════════════════════════════════════
  // Theme 5: La Casa (28 tasks)
  // ═══════════════════════════════════════════
  "la-casa": [
    // 1. copy-word
    { type: "copy-word" },
    // 2. word-search
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
    // 3. label-image
    { type: "label-image", labels: ["façana", "xemeneia", "balcó", "jardí", "garatge", "antena"] },
    // 4. fill-letters
    { type: "fill-letters", words: ["façana", "xemeneia", "balcó", "persiana", "cortina", "escala", "jardí", "garatge"] },
    // 5. classify-columns
    {
      type: "classify-columns",
      columns: [
        { columnName: "Parts exteriors", items: ["façana", "balcó", "jardí", "garatge", "antena", "xemeneia"] },
        { columnName: "Parts interiors", items: ["cortina", "persiana", "escala"] },
      ],
    },
    // 6. matching
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
    // 7. copy-word
    { type: "copy-word" },
    // 8. fill-letters
    { type: "fill-letters", words: ["dormitori", "menjador", "terrassa", "lavabo", "saló", "cuina"] },
    // 9. copy-word
    { type: "copy-word" },
    // 10. fill-sentence
    { type: "fill-sentence", blanks: ["televisió", "sofà", "nevera", "llit"] },
    // 11. copy-word
    { type: "copy-word" },
    // 12. copy-word
    { type: "copy-word" },
    // 13. fill-sentence
    { type: "fill-sentence", blanks: ["coixí", "armari", "despertador", "llit"] },
    // 14. copy-word
    { type: "copy-word" },
    // 15. fill-sentence (prepositions)
    { type: "fill-sentence", blanks: ["a sobre", "a sota", "a dins", "al davant"] },
    // 16. fill-sentence
    { type: "fill-sentence", blanks: ["menjador", "cuina", "saló", "biblioteca"] },
    // 17. fill-sentence
    { type: "fill-sentence", blanks: ["Obra", "pati", "cuina"] },
    // 18. fill-sentence
    { type: "fill-sentence", blanks: ["tres", "una", "dues"] },
    // 19. drawing-canvas
    { type: "drawing-canvas" },
    // 20. self-assessment
    { type: "self-assessment" },
    // 21. drawing-canvas
    { type: "drawing-canvas" },
    // 22. multiple-choice
    { type: "multiple-choice", correctIndices: [0, 1, 2, 3] },
    // 23. classify-columns
    {
      type: "classify-columns",
      columns: [
        { columnName: "Cuina", items: ["nevera", "taula", "cadira", "rentaplats"] },
        { columnName: "Dormitori", items: ["llit", "armari", "coixí"] },
        { columnName: "Bany", items: ["banyera", "mirall", "vàter"] },
      ],
    },
    // 24. copy-word (kitchen)
    { type: "copy-word" },
    // 25. copy-word (bathroom)
    { type: "copy-word" },
    // 26. fill-letters (new house words)
    { type: "fill-letters", words: ["taulada", "llar de foc", "butaca", "planta", "aigualera", "escorreplats", "fogons", "dutxa", "esponja"] },
    // 27. matching (object-room)
    {
      type: "matching",
      pairs: [
        ["butaca", "sala d'estar"],
        ["dutxa", "bany"],
        ["fogons", "cuina"],
        ["llit", "dormitori"],
        ["escorreplats", "cuina"],
      ],
    },
    // 28. fill-sentence
    { type: "fill-sentence", blanks: ["aigualera", "dutxa", "fogons", "taulada"] },
  ],

  // ═══════════════════════════════════════════
  // Theme 6: La Família (14 tasks)
  // ═══════════════════════════════════════════
  "la-familia": [
    // 1. copy-word
    { type: "copy-word" },
    // 2. fill-letters
    { type: "fill-letters", words: ["pare", "mare", "germà", "germana", "avi", "àvia", "oncle", "marit", "tieta", "cosí", "cosina", "fill", "filla", "bebè", "nebot", "neboda"] },
    // 3. unscramble
    { type: "unscramble", words: ["mare", "germà", "oncle", "nebot", "filla"] },
    // 4. matching
    {
      type: "matching",
      pairs: [
        ["pare", "mare"],
        ["avi", "àvia"],
        ["germà", "germana"],
        ["oncle", "tieta"],
        ["nebot", "neboda"],
      ],
    },
    // 5. word-search
    {
      type: "word-search",
      gridSize: 10,
      wordPositions: [
        { word: "pare", startRow: 0, startCol: 3, endRow: 3, endCol: 3 },
        { word: "mare", startRow: 5, startCol: 4, endRow: 5, endCol: 7 },
        { word: "avi", startRow: 1, startCol: 0, endRow: 3, endCol: 2 },
        { word: "tieta", startRow: 7, startCol: 7, endRow: 7, endCol: 3 },
        { word: "nebot", startRow: 3, startCol: 8, endRow: 7, endCol: 8 },
      ],
    },
    // 6. classify-columns
    {
      type: "classify-columns",
      columns: [
        { columnName: "Home", items: ["pare", "germà", "avi", "oncle", "marit", "cosí", "fill", "nebot"] },
        { columnName: "Dona", items: ["mare", "germana", "àvia", "tieta", "cosina", "filla", "neboda"] },
      ],
    },
    // 7. fill-sentence
    { type: "fill-sentence", blanks: ["avi", "tieta", "cosí", "àvia"] },
    // 8. multiple-choice
    { type: "multiple-choice", correctIndices: [1, 2, 3, 1] },
    // 9. self-assessment
    { type: "self-assessment" },
    // 10. label-image
    { type: "label-image", labels: ["avi", "àvia", "pare", "mare", "germà", "germana"] },
    // 11. fill-sentence
    { type: "fill-sentence", blanks: ["avi", "tieta", "cosí", "àvia"] },
    // 12. fill-sentence
    { type: "fill-sentence", blanks: ["germà", "mare", "pare", "àvia"] },
    // 13. self-assessment
    { type: "self-assessment" },
    // 14. drawing-canvas
    { type: "drawing-canvas" },
  ],

  // ═══════════════════════════════════════════
  // Theme 7: Les Botigues (21 tasks)
  // ═══════════════════════════════════════════
  "les-botigues": [
    // 1. copy-word
    { type: "copy-word" },
    // 2. fill-letters
    { type: "fill-letters", words: ["supermercat", "fleca", "peixateria", "carnisseria", "farmàcia", "llibreria", "pastisseria", "fruiteria", "joguineria"] },
    // 3. unscramble
    { type: "unscramble", words: ["fleca", "farmàcia", "fruiteria", "llibreria", "joguineria"] },
    // 4. matching
    {
      type: "matching",
      pairs: [
        ["fleca", "pa"],
        ["peixateria", "peix"],
        ["carnisseria", "carn"],
        ["farmàcia", "medicaments"],
        ["fruiteria", "fruita"],
      ],
    },
    // 5. word-search
    {
      type: "word-search",
      gridSize: 10,
      wordPositions: [
        { word: "fleca", startRow: 0, startCol: 0, endRow: 0, endCol: 4 },
        { word: "carn", startRow: 3, startCol: 0, endRow: 3, endCol: 3 },
        { word: "peix", startRow: 4, startCol: 0, endRow: 4, endCol: 3 },
        { word: "fruita", startRow: 7, startCol: 5, endRow: 7, endCol: 0 },
        { word: "pa", startRow: 1, startCol: 5, endRow: 1, endCol: 6 },
      ],
    },
    // 6. classify-columns
    {
      type: "classify-columns",
      columns: [
        { columnName: "Menjar", items: ["fleca", "peixateria", "carnisseria", "pastisseria", "fruiteria", "supermercat"] },
        { columnName: "No menjar", items: ["farmàcia", "llibreria", "joguineria", "botiga de roba"] },
      ],
    },
    // 7. fill-sentence
    { type: "fill-sentence", blanks: ["fleca", "peixateria", "fruiteria", "joguineria"] },
    // 8. multiple-choice
    { type: "multiple-choice", correctIndices: [0, 1, 2, 3] },
    // 9. self-assessment
    { type: "self-assessment" },
    // 10. label-image (fruits)
    { type: "label-image", labels: ["poma", "pera", "plàtan", "taronja", "maduixa", "cirera"] },
    // 11. label-image (vegetables)
    { type: "label-image", labels: ["pastanaga", "ceba", "tomàquet", "pebrot", "enciam"] },
    // 12. fill-letters
    { type: "fill-letters", words: ["pastanaga", "tomàquet", "pollastre", "sardina", "maduixa", "plàtan"] },
    // 13. label-image (meat/fish)
    { type: "label-image", labels: ["pollastre", "porc", "peix", "gamba"] },
    // 14. classify-columns
    {
      type: "classify-columns",
      columns: [
        { columnName: "Fruites", items: ["poma", "pera", "plàtan", "taronja", "maduixa"] },
        { columnName: "Verdures", items: ["pastanaga", "ceba", "tomàquet", "pebrot", "enciam"] },
        { columnName: "Carn i peix", items: ["pollastre", "porc", "peix", "gamba"] },
      ],
    },
    // 15. copy-word (pharmacy)
    { type: "copy-word" },
    // 16. copy-word (fruits/veg)
    { type: "copy-word" },
    // 17. fill-letters (new products)
    { type: "fill-letters", words: ["tirita", "pastilla", "xarop", "termòmetre", "crema", "mongetes", "préssec", "cireres", "fleca"] },
    // 18. matching (product-shop)
    {
      type: "matching",
      pairs: [
        ["tirita", "farmàcia"],
        ["préssec", "fruiteria"],
        ["sardina", "peixateria"],
        ["pa", "fleca"],
        ["pastís", "pastisseria"],
      ],
    },
    // 19. classify-columns (by shop)
    {
      type: "classify-columns",
      columns: [
        { columnName: "Farmàcia", items: ["tirita", "pastilla", "xarop", "termòmetre", "crema"] },
        { columnName: "Fruiteria", items: ["préssec", "cireres", "mongetes", "poma", "taronja"] },
        { columnName: "Fleca", items: ["pa", "croissant", "barra de pa"] },
      ],
    },
    // 20. fill-sentence
    { type: "fill-sentence", blanks: ["fleca", "farmàcia", "fruiteria", "pastilla"] },
    // 21. drawing-canvas
    { type: "drawing-canvas" },
  ],

  // ═══════════════════════════════════════════
  // Theme 8: El Menjar (27 tasks)
  // ═══════════════════════════════════════════
  "el-menjar": [
    // 1. copy-word
    { type: "copy-word" },
    // 2. fill-letters
    { type: "fill-letters", words: ["poma", "pera", "plàtan", "taronja", "maduixa", "tomàquet", "pastanaga", "llet", "formatge", "peix"] },
    // 3. unscramble
    { type: "unscramble", words: ["poma", "pera", "peix", "llet", "ceba"] },
    // 4. matching (meal-food)
    {
      type: "matching",
      pairs: [
        ["esmorzar", "cereals"],
        ["dinar", "sopa"],
        ["berenar", "fruita"],
        ["sopar", "amanida"],
      ],
    },
    // 5. word-search
    {
      type: "word-search",
      gridSize: 10,
      wordPositions: [
        { word: "poma", startRow: 0, startCol: 0, endRow: 0, endCol: 3 },
        { word: "pera", startRow: 2, startCol: 5, endRow: 2, endCol: 8 },
        { word: "pa", startRow: 2, startCol: 0, endRow: 2, endCol: 1 },
        { word: "llet", startRow: 3, startCol: 0, endRow: 3, endCol: 3 },
        { word: "ou", startRow: 7, startCol: 6, endRow: 7, endCol: 7 },
      ],
    },
    // 6. classify-columns (fruit vs vegetable)
    {
      type: "classify-columns",
      columns: [
        { columnName: "Fruita", items: ["poma", "pera", "plàtan", "taronja", "maduixa"] },
        { columnName: "Verdura", items: ["tomàquet", "pastanaga", "ceba", "enciam", "patata"] },
      ],
    },
    // 7. fill-sentence
    { type: "fill-sentence", blanks: ["llet", "sopa", "fruita", "amanida"] },
    // 8. multiple-choice
    { type: "multiple-choice", correctIndices: [1, 2, 3, 1] },
    // 9. self-assessment
    { type: "self-assessment" },
    // 10. label-image (breakfast)
    { type: "label-image", labels: ["cereals", "suc", "llet", "torrada", "fruita"] },
    // 11. fill-sentence
    { type: "fill-sentence", blanks: ["cereals", "arròs", "entrepà", "sopa"] },
    // 12. label-image (food items)
    { type: "label-image", labels: ["pa", "formatge", "ou", "pizza", "pasta", "hamburguesa"] },
    // 13. classify-columns (meals)
    {
      type: "classify-columns",
      columns: [
        { columnName: "Esmorzar", items: ["cereals", "torrada", "llet", "suc", "fruita"] },
        { columnName: "Dinar", items: ["arròs", "carn", "peix", "amanida", "pasta"] },
        { columnName: "Sopar", items: ["sopa", "entrepà", "ou", "formatge"] },
      ],
    },
    // 14. fill-sentence
    { type: "fill-sentence", blanks: ["llet", "amanida", "ou", "pa"] },
    // 15. fill-letters
    { type: "fill-letters", words: ["hamburguesa", "entrepà", "formatge", "amanida", "cereals", "torrada"] },
    // 16. classify-columns (sweet vs salty)
    {
      type: "classify-columns",
      columns: [
        { columnName: "Dolç", items: ["xocolata", "pastís", "galeta", "melmelada", "fruita"] },
        { columnName: "Salat", items: ["formatge", "pernil", "entrepà", "pizza", "sopa"] },
      ],
    },
    // 17. fill-sentence
    { type: "fill-sentence", blanks: ["pizza", "peix", "xocolata"] },
    // 18. label-image (dinner)
    { type: "label-image", labels: ["sopa", "pa", "formatge", "fruita"] },
    // 19. label-image (lunch)
    { type: "label-image", labels: ["amanida", "arròs", "peix", "suc"] },
    // 20. copy-word (drinks)
    { type: "copy-word" },
    // 21. copy-word (proteins)
    { type: "copy-word" },
    // 22. copy-word (carbs)
    { type: "copy-word" },
    // 23. fill-letters (new food)
    { type: "fill-letters", words: ["cafè", "tonyina", "salmó", "calamar", "macarrons", "sandvitx", "croissant", "iogurt"] },
    // 24. matching (food-meal)
    {
      type: "matching",
      pairs: [
        ["croissant", "esmorzar"],
        ["bistec", "dinar"],
        ["sopa", "sopar"],
        ["sandvitx", "berenar"],
        ["cafè", "esmorzar"],
      ],
    },
    // 25. classify-columns (drinks vs proteins)
    {
      type: "classify-columns",
      columns: [
        { columnName: "Begudes", items: ["cafè", "te", "refresc", "aigua", "llet", "suc"] },
        { columnName: "Proteïnes", items: ["tonyina", "salmó", "calamar", "musclo", "bistec", "mandonguilles"] },
      ],
    },
    // 26. fill-sentence
    { type: "fill-sentence", blanks: ["cafè", "calamar", "sandvitx", "ampolla"] },
    // 27. drawing-canvas
    { type: "drawing-canvas" },
  ],

  // ═══════════════════════════════════════════
  // Theme 9: Els Animals (27 tasks)
  // ═══════════════════════════════════════════
  "els-animals": [
    // 1. copy-word
    { type: "copy-word" },
    // 2. fill-letters
    { type: "fill-letters", words: ["conill", "tigre", "elefant", "tortuga", "girafa", "dofí", "ocell", "serp", "lleó", "gos"] },
    // 3. unscramble
    { type: "unscramble", words: ["conill", "tigre", "peix", "girafa", "lleó"] },
    // 4. matching (animal-sound)
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
    // 5. word-search
    {
      type: "word-search",
      gridSize: 10,
      wordPositions: [
        { word: "gos", startRow: 0, startCol: 0, endRow: 0, endCol: 2 },
        { word: "gat", startRow: 2, startCol: 0, endRow: 2, endCol: 2 },
        { word: "lleo", startRow: 6, startCol: 0, endRow: 6, endCol: 3 },
        { word: "peix", startRow: 4, startCol: 0, endRow: 4, endCol: 3 },
        { word: "serp", startRow: 0, startCol: 9, endRow: 3, endCol: 9 },
      ],
    },
    // 6. classify-columns (domestic vs wild)
    {
      type: "classify-columns",
      columns: [
        { columnName: "Domèstics", items: ["gos", "gat", "conill", "hàmster", "tortuga"] },
        { columnName: "Salvatges", items: ["lleó", "tigre", "elefant", "girafa", "serp"] },
      ],
    },
    // 7. fill-sentence
    { type: "fill-sentence", blanks: ["gos", "tigre", "elefant", "peix"] },
    // 8. multiple-choice
    { type: "multiple-choice", correctIndices: [1, 2, 3, 0] },
    // 9. self-assessment
    { type: "self-assessment" },
    // 10. label-image (bird parts)
    { type: "label-image", labels: ["bec", "ales", "plomes", "cua", "potes"] },
    // 11. copy-word (marine)
    { type: "copy-word" },
    // 12. fill-letters (marine)
    { type: "fill-letters", words: ["dofí", "balena", "tauró", "medusa", "pop", "tortuga"] },
    // 13. copy-word (wild)
    { type: "copy-word" },
    // 14. classify-columns (farm vs wild)
    {
      type: "classify-columns",
      columns: [
        { columnName: "Animals de granja", items: ["gos", "gat", "conill", "cavall", "vaca", "ovella", "gallina", "ànec", "porc"] },
        { columnName: "Animals salvatges", items: ["lleó", "tigre", "elefant", "girafa", "zebra", "ós", "mico"] },
      ],
    },
    // 15. fill-sentence
    { type: "fill-sentence", blanks: ["lleó", "vaca", "gallina", "dofí", "elefant"] },
    // 16. label-image (farm)
    { type: "label-image", labels: ["gos", "gat", "vaca", "cavall", "gallina", "ovella"] },
    // 17. classify-columns (sea vs land vs air)
    {
      type: "classify-columns",
      columns: [
        { columnName: "Mar", items: ["dofí", "balena", "tauró", "pop", "medusa"] },
        { columnName: "Terra", items: ["lleó", "elefant", "gos", "gat", "conill"] },
        { columnName: "Aire", items: ["àguila", "oreneta", "mussol", "gaviota", "papallona"] },
      ],
    },
    // 18. fill-sentence (animal sounds)
    { type: "fill-sentence", blanks: ["borda", "miola", "mugeix", "canta"] },
    // 19. label-image (insects)
    { type: "label-image", labels: ["formiga", "papallona", "abella", "aranya"] },
    // 20. fill-sentence (describe pet)
    { type: "fill-sentence", blanks: ["gos", "quatre", "marró", "casa"] },
    // 21. copy-word (farm + insects)
    { type: "copy-word" },
    // 22. copy-word (exotic)
    { type: "copy-word" },
    // 23. copy-word (sea animals)
    { type: "copy-word" },
    // 24. fill-letters (new animals)
    { type: "fill-letters", words: ["gorila", "camell", "lince", "guineu", "mosquit", "pingüí", "bacallà", "estruç"] },
    // 25. matching (animal-habitat)
    {
      type: "matching",
      pairs: [
        ["camell", "desert"],
        ["pingüí", "gel"],
        ["gorila", "selva"],
        ["bacallà", "mar"],
        ["guineu", "bosc"],
      ],
    },
    // 26. classify-columns (farm vs wild vs marine)
    {
      type: "classify-columns",
      columns: [
        { columnName: "Animals de granja", items: ["gall", "pollet", "gallina", "vaca", "ovella", "porc"] },
        { columnName: "Animals salvatges", items: ["gorila", "camell", "lince", "guineu", "estruç"] },
        { columnName: "Animals marins", items: ["peix espasa", "bacallà", "pingüí", "dofí", "balena"] },
      ],
    },
    // 27. drawing-canvas
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
