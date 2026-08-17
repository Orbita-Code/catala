import { Task } from "@/types/tasks";

export const elCosTasks: Task[] = [

  // ── Task 1: Llegeix i copia (15 body parts) ──
  // Podeljeno 03.08.2026: u svesci je ovo JEDAN zadatak od 15 reči, a to je
  // za dete od 5–8 godina predugačko — traka napretka se ne pomeri ni jednom
  // dok ne uradi svih 15. Nijedna reč nije izbačena, samo su spakovane u 3
  // koraka, redom kao u svesci.
  {
    id: "el-cos-1-1",
    type: "copy-word",
    prompt: "Llegeix i copia les parts del cos (1 de 3).",
    words: [
      { catalan: "boca", image: "boca" },
      { catalan: "ull", image: "ull" },
      { catalan: "nas", image: "nas" },
      { catalan: "dents", image: "dents" },
      { catalan: "cabell", image: "cabell" },
    ],
  },

  // ── Task 2: Escriu-ne les parts (label the head) ──
  {
    id: "el-cos-2",
    type: "label-write",
    prompt: "Escriu les parts del cap.",
    image: "cap",
    // KOORDINATE PREMERENE NA SAMOJ SLICI 17.08.2026 (prijava vlasnice).
    // Bile su postavljene „na oko" i dve su promašile:
    //   • `orella` je stajala na 80% — to je BELA POZADINA desno od glave, uvo
    //     je na 75%. Dete je pisalo ime dela tela koji tamo ne postoji.
    //   • `boca` je na 65% padala na VRAT, pa je vlasnica i pomislila da tražimo
    //     „garganta" (vrat). Reč `coll` se u temi nigde ne uči, pa taj zadatak
    //     dete nikad ne bi prešlo. Usta su na 63%.
    // Mereno preko mreže postavljene na `cap.webp`, ne procenom.
    labels: [
      // Leva strana (x<=50): cabell, ull, nas
      { text: "cabell", x: 45, y: 22 },
      { text: "ull", x: 40, y: 50 },
      { text: "nas", x: 52, y: 54 },
      // Desna strana (x>50): orella, boca
      { text: "orella", x: 75, y: 55 },
      { text: "boca", x: 52, y: 63 },
    ],
  },
  {
    id: "el-cos-1-2",
    type: "copy-word",
    prompt: "Llegeix i copia les parts del cos (2 de 3).",
    words: [
      { catalan: "orella", image: "orella" },
      { catalan: "braç", image: "brac" },
      { catalan: "cama", image: "cama" },
      // `cap` (glava) je odavde IZBAČENA 16.08.2026, prijava vlasnice:
      // slika je dečakova glava, pa dete gleda i kaže „noi" ili „germà" —
      // reč koju traži zadatak („glava") nikad neće pogoditi sa te slike.
      // Umesto nje ide `cara` (lice), koja se ne može pročitati drugačije.
      // `cap` OSTAJE u temi tamo gde se ČITA i PIŠE, a ne pogađa sa slike:
      // u zadatku označavanja delova glave i u slagalici reči.
      { catalan: "cara", image: "cara" },
      { catalan: "colze", image: "colze" },
    ],
  },

  // ── Task 3: Ordena les síl·labes ──
  {
    id: "el-cos-3",
    type: "unscramble",
    prompt: "Ordena les síl·labes per formar paraules.",
    words: [
      { scrambled: "CA-BO", correct: "boca", image: "boca" },
      { scrambled: "XA-PAN", correct: "panxa", image: "panxa" },
      { scrambled: "ZE-COL", correct: "colze", image: "colze" },
      { scrambled: "GLA-UN", correct: "ungla", image: "ungla" },
      { scrambled: "BELL-CA", correct: "cabell", image: "cabell" },
      { scrambled: "RE-O-LLA", correct: "orella", image: "orella" },
    ],
  },
  {
    id: "el-cos-1-3",
    type: "copy-word",
    prompt: "Llegeix i copia les parts del cos (3 de 3).",
    words: [
      { catalan: "panxa", image: "panxa" },
      { catalan: "mà", image: "ma" },
      { catalan: "dit", image: "dit" },
      { catalan: "peu", image: "peu" },
      { catalan: "ungla", image: "ungla" },
    ],
  },

  // ── Task 4: Busca 7 paraules a la sopa de lletres ──
  {
    id: "el-cos-4",
    type: "word-search",
    prompt: "Busca 7 paraules a la sopa de lletres. Poden anar →\u00A0←\u00A0↓\u00A0↑\u00A0↗",
    gridSize: 9,
    words: ["nas", "ull", "boca", "panxa", "orella", "mà", "braç"],
    grid: [
      ["m", "m", "l", "l", "u", "g", "t", "f", "h"],
      ["h", "a", "l", "l", "e", "r", "o", "m", "à"],
      ["e", "y", "c", "i", "x", "m", "q", "v", "w"],
      ["r", "p", "a", "n", "x", "a", "c", "t", "p"],
      ["g", "n", "x", "t", "s", "b", "r", "a", "ç"],
      ["g", "z", "z", "l", "m", "v", "g", "e", "o"],
      ["v", "f", "s", "k", "c", "w", "q", "v", "y"],
      ["n", "a", "s", "c", "p", "k", "m", "b", "i"],
      ["r", "b", "o", "c", "a", "a", "n", "g", "l"],
    ],
  },

  // ── Task 5: Classifica: parts del cap o parts del cos? ──
  {
    id: "el-cos-5",
    type: "classify-columns",
    prompt: "Classifica: és una part del cap o del cos?",
    columns: [
      {
        title: "Parts del cap",
        items: ["cabell", "ull", "nas", "boca", "orella"],
      },
      {
        title: "Parts del cos",
        items: ["braç", "cama", "mà", "peu", "panxa"],
      },
    ],
    allItems: [
      "cabell", "braç", "ull", "cama", "nas", "mà", "boca", "peu", "orella", "panxa",
    ],
    circleMode: true,
  },

  // ── Task 6: Uneix cada part del cos amb la seva funció ──
  {
    id: "el-cos-6",
    type: "matching",
    prompt: "Uneix cada part del cos amb la seva funció.",
    pairs: [
      { left: "ull", right: "veure" },
      { left: "orella", right: "escoltar" },
      { left: "nas", right: "olorar" },
      { left: "boca", right: "parlar" },
      { left: "mà", right: "tocar" },
    ],
  },

  // ── Task 7: Observa i busca les paraules a la sopa de lletres ──
  {
    id: "el-cos-7",
    type: "word-search",
    prompt: "Observa i busca les paraules a la sopa de lletres. Poden anar →\u00A0←\u00A0↓\u00A0↑\u00A0↗",
    gridSize: 9,
    words: ["cap", "cabell", "cama", "colze", "dents", "dit", "peu"],
    grid: [
      ["m", "i", "u", "w", "c", "a", "p", "r", "h"],
      ["v", "t", "i", "d", "k", "y", "y", "b", "h"],
      ["b", "z", "k", "m", "i", "c", "g", "p", "s"],
      ["w", "k", "c", "c", "a", "m", "a", "e", "g"],
      ["u", "p", "a", "m", "u", "o", "e", "u", "i"],
      ["e", "h", "b", "x", "r", "r", "i", "x", "s"],
      ["n", "d", "e", "n", "t", "s", "s", "m", "l"],
      ["h", "e", "l", "q", "p", "c", "y", "b", "d"],
      ["e", "u", "l", "c", "o", "l", "z", "e", "f"],
    ],
  },

  // ── Task 8: Llegeix i copia (verbs dels sentits) ──
  {
    id: "el-cos-8",
    type: "copy-word",
    prompt: "Llegeix i copia els verbs dels sentits.",
    words: [
      { catalan: "escoltar", image: "escoltar" },
      { catalan: "mirar", image: "mirar" },
      { catalan: "cantar", image: "cantar" },
      { catalan: "aplaudir", image: "aplaudir" },
    ],
  },

  // ── Task 9: Relaciona (verbs → body parts) ──
  {
    id: "el-cos-9",
    type: "matching",
    prompt: "Relaciona cada acció amb la part del cos.",
    pairs: [
      { left: "mirem", right: "ulls", leftImage: "mirar" },
      { left: "escoltem", right: "orelles", leftImage: "escoltar" },
      { left: "parlem", right: "boca", leftImage: "parlar" },
      { left: "aplaudim", right: "mans", leftImage: "aplaudir" },
      { left: "caminem", right: "cames", leftImage: "caminar" },
    ],
  },

  // ── Task 10: Observa (jove, vell, alt, baix) ──
  {
    id: "el-cos-10",
    type: "copy-word",
    prompt: "Observa i copia les paraules noves:",
    // SLIKE SU FALILE SVE ČETIRI (17.08.2026, prijava vlasnice).
    // Dete je prepisivalo „jove", „vell", „alt", „baix" bez ijedne slike — a
    // to su reči koje se BEZ slike i ne mogu razumeti: mlad u odnosu na koga,
    // visok u odnosu na koga.
    // Slike već postoje od 14.08. (`scripts/napravi-poredjenje.mjs`) i stajale
    // su neiskorišćene. Onaj o kome je reč stoji levo, sa mekim krugom iza.
    words: [
      { catalan: "jove", image: "noi-jove" },
      { catalan: "vell", image: "noi-vell" },
      { catalan: "alt", image: "noi-alt" },
      { catalan: "baix", image: "noi-baix" },
    ],
  },

  // ── Task 11: Observa y completa (comparisons) ──
  {
    id: "el-cos-11",
    type: "fill-sentence",
    prompt: "Observa i completa les frases.",
    // ZADATAK SE PRE OVOGA POGADJAO (14.08.2026, prijava vlasnice)
    // Stajala je slika `alt-baix` — devojčica i dečak BEZ IMENA. Rečenica pita
    // „La Laura és més ___ que en Carles", a dete nije imalo odakle da zna ko
    // je od njih dvoje Laura. Slika `laura-carles` (sa napisanim imenima, kao
    // u svesci, vežba 11) postojala je od ranije i nikad se nije koristila.
    // Ista greška kao u „Qui és qui?": ilustracija napravljena pa zaboravljena.
    image: "laura-carles",
    sentences: [
      {
        text: "La Laura és més ___ que en Carles.",
        blank: "alta",
        options: ["baixa", "alta", "vella"],
      },
      {
        text: "En Carles és més ___ que la Laura.",
        blank: "baix",
        options: ["alt", "jove", "baix"],
      },
    ],
  },

  // ── Task 14: Observa i pinta SÍ o NO ──
  {
    id: "el-cos-14",
    type: "multiple-choice",
    prompt: "Observa la Maria i contesta SÍ o NO.",
    image: "maria",
    questions: [
      {
        question: "La Maria té els ulls grans?",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        question: "Els seus ulls són verds?",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        question: "Té un nas petit?",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        question: "És una persona jove?",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        // SVESKA PITA „vermell" (crvena), MI PITAMO „negre" (crna) — 16.08.2026.
        //
        // Jedino mesto gde svesno odstupamo od sveske u ovoj temi, i to zbog
        // NAŠE slike: naša Maria je bakarno-riđa. Za riđokose se i kaže da imaju
        // crvenu kosu, pa je tačan odgovor „NO" bio dvosmislen — dete koje dobro
        // gleda sliku odgovori „SÍ" i bude proglašeno netačnim.
        // U svesci je Maria plava, pa tamo dvosmislice nema.
        // „negre" rešava bez dirania slike: njena kosa očigledno nije crna.
        question: "Té el cabell negre?",
        options: ["Sí", "No"],
        correct: 1,
      },
      {
        question: "Se li veuen les dents?",
        options: ["Sí", "No"],
        correct: 1,
      },
      // PITANJE „No té celles?" JE UKLONJENO 16.08.2026 (odluka vlasnice).
      // Reč `cella` (obrva) nije za ovaj uzrast: dete uči katalonski tri godine
      // i ne zna je. Uz to je pitanje bilo u dvostrukoj negaciji („NEMA obrve?"
      // → tačan odgovor je NE), što muči i odraslog.
      // Reč je izbačena iz cele teme, i iz ponuđenih reči u zadatku sa licima.
      {
        question: "El cabell li tapa una orella?",
        options: ["Sí", "No"],
        correct: 0,
      },
      {
        question: "Es diu Maria?",
        options: ["Sí", "No"],
        correct: 0,
      },
    ],
  },

  // ── Task 12: Fixa-t'hi i completa (NOI → NOIA) ──
  {
    id: "el-cos-12",
    type: "fill-sentence",
    prompt: "Fixa-t'hi i completa: noi → noia.",
    // ZAŠTO SVAKA REČENICA IMA SVOJU SLIKU (14.08.2026, zahtev vlasnice):
    // ranije je stajala JEDNA slika („noi-noia") za sve četiri rečenice, pa
    // dete nije imalo odakle da vidi šta znači „alt" a šta „baix". Sada svaka
    // rečenica pokazuje DEČAKA U ODNOSU NA DRUGOG (viši od, niži od, stariji
    // od, mlađi od), a kad dete napiše žensku reč — na tom istom mestu se
    // pojavi DEVOJČICA. Reč i slika se poklope u istom trenutku.
    // Dogovor za slike: onaj o kome je reč stoji LEVO.
    sentences: [
      {
        text: "Un noi vell → Una noia ___.",
        blank: "vella",
        image: "noi-vell",
        imageAfter: "noia-vella",
        options: ["vell", "jove", "vella"],
      },
      {
        text: "Un noi alt → Una noia ___.",
        blank: "alta",
        image: "noi-alt",
        imageAfter: "noia-alta",
        options: ["alt", "alta", "baixa"],
      },
      {
        text: "Un noi baix → Una noia ___.",
        blank: "baixa",
        image: "noi-baix",
        imageAfter: "noia-baixa",
        options: ["baixa", "baix", "alta"],
      },
      {
        text: "Un noi jove → Una noia ___.",
        blank: "jove",
        image: "noi-jove",
        imageAfter: "noia-jove",
        options: ["vella", "alta", "jove"],
      },
    ],
  },

  // ── Task 15: Observa el vocabulari nou (face details) ──
  {
    id: "el-cos-15",
    type: "label-image",
    prompt: "Observa el vocabulari nou i completa les parts que falten.",
    image: "cara-detall",
    // Tačke su namerno na TRI različita lica: brk na prvom, brada na drugom,
    // naočare na trećem, kosa na prvom (najviša tačka, u samoj kosi).
    //
    // ZAŠTO NEMA `arrugues` (14.08.2026): u svesci, vežba 15, strelice pokazuju
    // na kosu, čelo, obrvu, oko, nos, brk i usta — bore se NE pominju
    // nigde u temi. Bila je moja dodatna reč, a uz to je tačka stajala na šiški,
    // ne na borama. Zamenjena je rečju `cabell`, koja u svesci i jeste prva
    // strelica na tom licu.
    labels: [
      { text: "cabell", x: 18, y: 30 },
      { text: "bigoti", x: 18, y: 57 },
      { text: "barba", x: 48, y: 66 },
      { text: "ulleres", x: 77, y: 46 },
    ],
    // `cella` (obrva) je IZBAČENA i odavde 16.08.2026.
    // Vlasnica: dete uči katalonski tri godine i ne zna tu reč — nije za taj
    // uzrast. Ja sam je bio dodao pogrešno: u svesci na tom mestu stoji SAMO
    // STRELICA i prazna crta, a reč nije napisana. Zaključio sam je iz crteža,
    // a to nije sveska nego moja pretpostavka.
    // Ponuđene reči su sada samo one koje dete već zna iz ove teme.
    options: ["cabell", "bigoti", "barba", "ulleres", "nas", "orella"],
  },

  // ── Task 16: Qui és qui? ──
  {
    id: "el-cos-16",
    type: "fill-sentence",
    prompt: "Qui és qui? Llegeix i escriu el nom correcte.",
    // ZADATAK BEZ OVOGA NIJE BIO REŠIV (prijava vlasnice 14.08.2026):
    // dete čita „ima dugu crnu kosu i naočare", a nigde nema slike da vidi ko
    // je ko — moglo je samo da pogađa. U svesci (vežba 16) svi likovi su
    // nacrtani na jednoj slici, sa strelicama na prazna polja.
    // Slike već postoje od ranije, samo se nikad nisu prikazivale.
    // Imena OSTAJU napisana na slikama: dete mora da razume opis da bi znalo
    // KOJI je lik u pitanju, pa tek onda pročita njegovo ime.
    referenceImages: ["carolina", "sergi", "sara", "xavier"],
    // REČENICE SU NAMERNO DRUGIM REDOM OD SLIKA (16.08.2026, prijava vlasnice).
    // Ranije su išle istim redom kao likovi gore, pa je prva rečenica bila prvi
    // lik, druga drugi i tako redom — dete može da reši ceo zadatak po položaju,
    // bez ijedne pročitane reči. Nijedna rečenica sada ne stoji naspram svog
    // lika: slike su Carolina, Sergi, Sara, Xavier — rečenice idu Sara, Xavier,
    // Carolina, Sergi.
    sentences: [
      {
        text: "La ___ és molt jove, amb el cabell marró recollit en una cua.",
        blank: "Sara",
        options: ["Carolina", "Sara", "Sergi"],
      },
      {
        text: "En ___ és jove i alt, té bigoti i el cabell curt.",
        blank: "Xavier",
        options: ["Sergi", "Sara", "Xavier"],
      },
      {
        text: "La ___ és jove, té el cabell llarg i negre. També porta ulleres.",
        blank: "Carolina",
        options: ["Sara", "Carolina", "Xavier"],
      },
      {
        text: "En ___ és un nen baix, amb el cabell curt i negre.",
        blank: "Sergi",
        options: ["Xavier", "Carolina", "Sergi"],
      },
    ],
  },

  // ── Task 18: Autoavaluació ──
  {
    id: "el-cos-18",
    type: "self-assessment",
    prompt: "Autoavaluació: Les parts del cos.",
    items: [
      { catalan: "cara", translation: "lice", image: "cara" },
      { catalan: "ull", translation: "oko", image: "ull" },
      { catalan: "nas", translation: "nos", image: "nas" },
      { catalan: "boca", translation: "usta", image: "boca" },
      { catalan: "orella", translation: "uvo", image: "orella" },
      { catalan: "braç", translation: "ruka", image: "brac" },
      { catalan: "mà", translation: "šaka", image: "ma" },
      { catalan: "dit", translation: "prst", image: "dit" },
      { catalan: "cama", translation: "noga", image: "cama" },
      { catalan: "peu", translation: "stopalo", image: "peu" },
      { catalan: "cabell", translation: "kosa", image: "cabell" },
      { catalan: "dents", translation: "zubi", image: "dents" },
    ],
  },

  // Bonus activity: Fun drawing
  {
    id: "el-cos-bonus",
    type: "drawing-canvas",
    prompt: "Activitat extra! Diverteix-te, activa la creativitat i dibuixa alguna cosa màgica!",
    bonus: true,
  },
];
