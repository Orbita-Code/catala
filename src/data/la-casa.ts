import { Task } from "@/types/tasks";

export const laCasaTasks: Task[] = [

  // ── Task 1: Llegeix i copia (9 parts de la casa) ──
  {
    id: "la-casa-1",
    type: "copy-word",
    prompt: "Llegeix i copia:",
    words: [
      { catalan: "teulada", image: "teulada" },
      { catalan: "xemeneia", image: "xemeneia" },
      { catalan: "antena", image: "antena" },
      { catalan: "balcó", image: "balco" },
      { catalan: "persiana", image: "persiana" },
      { catalan: "cortina", image: "cortina" },
      { catalan: "escala", image: "escala" },
      { catalan: "jardí", image: "jardi" },
      { catalan: "garatge", image: "garatge" },
      // NAPOMENA 17.08.2026: ovde su nakratko stajale reči `façana`, `llar de
      // foc`, `quadre` i `rentaplats`. Dodao sam ih iz dokumenta koji je pisala
      // ranija sesija, pa sam otvorio same fotografije sveske — nijedne od njih
      // nema. Sveska za kamin koristi `xemeneia` (vežba 9), a u kuhinji (vežba
      // 11) stoje escombraries, nevera, foc, armari, forn, aixeta, aigüera,
      // microones, campana. Sve četiri su uklonjene.
    ],
  },

  // ── Task 2: Busca 6 paraules (sopa de lletres) ──
  {
    id: "la-casa-2",
    type: "word-search",
    prompt: "Busca 6 paraules relacionades amb la casa. Poden anar →\u00A0↓",
    gridSize: 10,
    words: ["persiana", "antena", "escala", "cortina", "jardí", "balcó", "garatge", "teulada", "xemeneia"],
    grid: [
      ["b", "e", "g", "t", "e", "u", "l", "a", "d", "a"],
      ["m", "p", "e", "r", "s", "i", "a", "n", "a", "g"],
      ["j", "a", "r", "d", "i", "j", "x", "g", "i", "w"],
      ["c", "n", "h", "m", "i", "b", "e", "a", "z", "o"],
      ["o", "t", "b", "p", "e", "d", "m", "r", "r", "d"],
      ["r", "e", "a", "h", "s", "l", "e", "a", "g", "v"],
      ["t", "n", "l", "n", "c", "m", "n", "t", "l", "f"],
      ["i", "a", "c", "n", "a", "x", "e", "g", "o", "k"],
      ["n", "l", "o", "a", "l", "i", "i", "e", "h", "l"],
      ["a", "a", "n", "h", "a", "w", "a", "g", "v", "m"],
    ],
  },

  // ── Task 3: Classifica (articles LA, EL, LES, ELS) ──
  {
    id: "la-casa-3",
    type: "classify-columns",
    prompt: "Classifica:",
    columns: [
      {
        title: "LA",
        items: ["xemeneia", "teulada", "escala", "cortina"],
      },
      {
        title: "EL",
        items: ["balcó", "jardí"],
      },
      {
        title: "LES",
        items: ["persianes", "antenes"],
      },
      {
        title: "ELS",
        items: ["garatges"],
      },
    ],
    allItems: [
      "xemeneia",
      "balcó",
      "teulada",
      "escala",
      "garatges",
      "persianes",
      "jardí",
      "antenes",
      "cortina",
    ],
  },

  // ── Task 4: Escriu les parts de la casa (label image) ──
  {
    id: "la-casa-4",
    type: "label-image",
    prompt: "Escriu les parts de la casa:",
    image: "casa-exterior",
    // KOORDINATE PREMERENE NA SLICI 17.08.2026 (prijava vlasnice: „sve tačke su
    // otišle tamo gde ne treba, dimnjak i krov su otišli na nebo kao i antena").
    // Bile su postavljene na oko: krov na 10% visine, dimnjak i antena na 5% —
    // a to je čisto nebo iznad kuće. Mereno preko mreže postavljene na sliku.
    labels: [
      { text: "teulada", x: 35, y: 27 },
      { text: "xemeneia", x: 33, y: 15 },
      { text: "antena", x: 78, y: 16 },
      { text: "balcó", x: 30, y: 49 },
      { text: "jardí", x: 14, y: 72 },
      { text: "garatge", x: 68, y: 63 },
    ],
    // `persiana` JE IZBAČENA IZ PONUĐENIH REČI (ista prijava).
    // Kuća je puna prozorskih kapaka, pa je uz tačku za balkon i „persiana"
    // sasvim razuman odgovor — dete koje dobro gleda sliku bilo bi kažnjeno.
    // Pogrešna ponuda mora biti očigledno pogrešna, ne razumna.
    options: [
      "teulada",
      "xemeneia",
      "antena",
      "balcó",
      "jardí",
      "garatge",
      "escala",
      "cuina",
    ],
  },

  // ── Task 5: Completa (fill letters) ──
  {
    id: "la-casa-5",
    type: "fill-letters",
    prompt: "Completa:",
    words: [
      { word: "teulada", hint: "t_ul_d_", image: "teulada" },
      { word: "xemeneia", hint: "x_m_n_ia", image: "xemeneia" },
      { word: "antena", hint: "_nt_n_", image: "antena" },
      { word: "balcó", hint: "b_lc_", image: "balco" },
      { word: "persiana", hint: "p_rs__na", image: "persiana" },
      { word: "cortina", hint: "c_rt_n_", image: "cortina" },
      { word: "escala", hint: "_sc_l_", image: "escala" },
      { word: "jardí", hint: "j_rd_", image: "jardi" },
      { word: "garatge", hint: "g_r_tge", image: "garatge" },
    ],
  },

  // ── Task 6: Relaciona i copia ──
  {
    id: "la-casa-6",
    type: "matching",
    prompt: "Relaciona i copia:",
    pairs: [
      { left: "teulada", right: "per protegir de la pluja" },
      { left: "escala", right: "per pujar al pis de dalt" },
      { left: "antena", right: "per veure la televisió", rightImage: "televisió" },
      { left: "xemeneia", right: "perquè surti el fum" },
      { left: "jardí", right: "per tenir flors" },
      { left: "garatge", right: "per guardar el cotxe", rightImage: "cotxe" },
    ],
  },

  // ── Task 7: Llegeix i copia (habitacions) ──
  {
    id: "la-casa-7",
    type: "copy-word",
    prompt: "Llegeix i copia:",
    words: [
      { catalan: "dormitori", image: "dormitori" },
      { catalan: "cuina", image: "cuina" },
      { catalan: "menjador", image: "menjador" },
      { catalan: "sala d'estar", image: "sala-d-estar" },
      { catalan: "terrassa", image: "terrassa" },
      { catalan: "lavabo", image: "lavabo" },
    ],
  },

  // ── Task 8: Completa (fill letters - habitacions) ──
  {
    id: "la-casa-8",
    type: "fill-letters",
    prompt: "Completa:",
    words: [
      { word: "lavabo", hint: "l_v_b_", image: "lavabo" },
      { word: "dormitori", hint: "d_rm_t_ri", image: "dormitori" },
      { word: "cuina", hint: "c_in_", image: "cuina" },
      { word: "sala d'estar", hint: "s_la d'_st_r", image: "sala-d-estar" },
      { word: "menjador", hint: "m_nj_d_r", image: "menjador" },
      { word: "terrassa", hint: "t_rr_ss_", image: "terrassa" },
    ],
  },

  // ── Task 9: Observa - SALA D'ESTAR (copy-word) ──
  {
    id: "la-casa-9",
    type: "copy-word",
    prompt: "Observa: SALA D'ESTAR. Llegeix i copia:",
    words: [
      { catalan: "televisió", image: "televisio" },
      { catalan: "rellotge", image: "rellotge" },
      { catalan: "prestatge", image: "prestatge" },
      { catalan: "sofà", image: "sofa" },
      { catalan: "llàmpada", image: "llampada" },
      // U DNEVNOJ SOBI `xemeneia` ZNAČI KAMIN, NE DIMNJAK (17.08.2026,
      // prijava vlasnice: „u našoj svesci je xemeneia dimnjak na krovu").
      //
      // Katalonska reč `xemeneia` znači OBOJE — i dimnjak na krovu i kamin u
      // sobi — i sveska je tako i koristi: u vežbi 1 (spolja) to je dimnjak, a
      // u vežbi 9 (SALA D'ESTAR) kamin. Ali SLIKA mora da prati mesto.
      // Ovde je stajala slika dimnjaka sa krova, usred spiska nameštaja —
      // dete je učilo pogrešnu stvar. Slika kamina (`xemeneia2`) postoji od
      // ranije i nije se koristila.
      { catalan: "xemeneia", image: "xemeneia2" },
      { catalan: "butaca", image: "butaca" },
      { catalan: "catifa", image: "catifa" },
      { catalan: "planta", image: "planta" },
    ],
  },

  // ── Task 10: Completa (sentences about sala d'estar) ──
  {
    id: "la-casa-10",
    type: "fill-sentence",
    prompt: "Completa:",
    sentences: [
      {
        // REČENICE VODE KROZ CELU KUĆU, NE SAMO KROZ DNEVNU SOBU
        // (17.08.2026, zahtev vlasnice: „taj zadatak je dosadan, sve se
        // dešava u sala d'estar; neka bude i kuhinja, i kupatilo, i spavaća —
        // tako se prolazi cela tema o kući, a ne samo jedna soba").
        //
        // Sve reči su iz sveske, iz vežbi 7, 9, 11 i 12 (sobe i njihove
        // stvari). Menja se samo raspored: svaka rečenica je druga soba, pa
        // dete mora da se seti gde šta stoji, umesto da četiri puta bira
        // predmet iz iste sobe.
        text: "A la sala d'estar hi ha un ___.",
        blank: "sofà",
        options: ["llit", "sofà", "forn"],
      },
      {
        text: "A la cuina hi ha una ___.",
        blank: "nevera",
        options: ["nevera", "catifa", "banyera"],
      },
      {
        text: "Al lavabo hi ha una ___.",
        blank: "banyera",
        options: ["banyera", "televisió", "taula"],
      },
      {
        text: "Al dormitori hi ha un ___.",
        blank: "llit",
        options: ["mirall", "llit", "sofà"],
      },
      {
        text: "A la sala d'estar hi ha una ___.",
        blank: "televisió",
        options: ["nevera", "televisió", "dutxa"],
      },
    ],
  },

  // ── Task 11: Observa - CUINA (copy-word) ──
  {
    id: "la-casa-11",
    type: "copy-word",
    prompt: "Observa: CUINA. Llegeix i copia:",
    words: [
      { catalan: "escombraries", image: "escombraries" },
      { catalan: "nevera", image: "nevera" },
      { catalan: "foc", image: "foc" },
      { catalan: "armari", image: "armari" },
      { catalan: "forn", image: "forn" },
      { catalan: "aixeta", image: "aixeta" },
      { catalan: "aiguera", image: "aiguera" },
      { catalan: "microones", image: "microones" },
      { catalan: "campana", image: "campana" },
    ],
  },

  // ── Task 11.A: Matching (cuina) ──
  {
    id: "la-casa-12",
    type: "matching",
    prompt: "Relaciona:",
    pairs: [
      { left: "A la nevera", right: "guardem el menjar." },
      { left: "A la cuina", right: "cuinem tot el que mengem." },
      { left: "Al forn", right: "fem pa.", rightImage: "pa" },
      { left: "A les escombraries", right: "tirem allò que ja no serveix." },
      { left: "A l'aiguera", right: "hi ha els plats bruts.", rightImage: "plats" },
    ],
  },

  // ── Task 12: Observa - DORMITORI (copy-word) ──
  {
    id: "la-casa-13",
    type: "copy-word",
    prompt: "Observa: DORMITORI. Llegeix i copia:",
    words: [
      { catalan: "llit", image: "llit" },
      { catalan: "coixí", image: "coixi" },
      { catalan: "llençol", image: "llencol" },
      { catalan: "tauleta de nit", image: "tauleta-de-nit" },
      { catalan: "despertador", image: "despertador" },
      { catalan: "armari", image: "armari" },
      { catalan: "manta", image: "manta" },
      { catalan: "escriptori", image: "escriptori" },
      { catalan: "prestatgeria", image: "prestatgeria" },
    ],
  },

  // ── Task 13: Llegeix i endevina quina part del dormitori és ──
  {
    id: "la-casa-14",
    type: "fill-sentence",
    prompt: "Llegeix i endevina quina part del dormitori és:",
    sentences: [
      {
        text: "On dorms.",
        blank: "llit",
        options: ["coixí", "llit", "manta"],
      },
      {
        text: "On poses el teu cap.",
        blank: "coixí",
        options: ["manta", "llit", "coixí"],
      },
      {
        text: "Te la poses a sobre quan tens fred.",
        blank: "manta",
        options: ["llençol", "manta", "coixí"],
      },
      {
        text: "El configures quan necessites aixecar-te aviat.",
        blank: "despertador",
        options: ["rellotge", "televisió", "despertador"],
      },
      {
        text: "Aquí guardes la teva roba.",
        blank: "armari",
        options: ["armari", "prestatge", "llit"],
      },
      {
        text: "Vesteixes el llit amb elles.",
        blank: "llençols",
        options: ["mantes", "llençols", "coixins"],
      },
    ],
  },

  // ── Task 12 (cont): Observa - LAVABO o BANY (copy-word) ──
  {
    id: "la-casa-15",
    type: "copy-word",
    prompt: "Observa: LAVABO o BANY. Llegeix i copia:",
    words: [
      { catalan: "vàter", image: "vater" },
      { catalan: "paper de vàter", image: "paper-de-vater" },
      { catalan: "lavabo", image: "lavabo" },
      { catalan: "banyera", image: "banyera" },
      { catalan: "dutxa", image: "dutxa" },
      { catalan: "tovallola", image: "tovallola" },
      { catalan: "mirall", image: "mirall" },
      { catalan: "sabó", image: "sabo" },
      { catalan: "esponja", image: "esponja" },
    ],
  },

  // ── Zagonetke o kući (vežba 15 iz sveske) ──
  //
  // ZAMENIO ZADATAK KOJI SE NIJE MOGAO REŠITI (17.08.2026, prijava vlasnice:
  // „16. zadatak je užasan, ništa se ne razume, zameni ga zanimljivim").
  //
  // Ovde je stajalo menjanje glagola `rentar-se` („Jo em rento les ___",
  // „Tu et rentes les ___"…), gde je odgovor bio DEO TELA. Ali oprati se može
  // bilo šta — ruke, lice, zubi — pa dete nije imalo kako da zna šta se traži.
  // Dva puta je čak tačan odgovor bio ista reč. To je bilo čisto pogađanje.
  //
  // Sveska na toj strani ima vežbu 15 — ZAGONETKE o kući, koje mi nismo imali:
  // gde je antena, od čega je sto, koliko ima prozora, čime peremo ruke, gde
  // sadimo cveće. Dete odgovara razmišljanjem, a uči i stvari o kući.
  {
    id: "la-casa-16",
    type: "matching",
    prompt: "Relaciona la pregunta amb la resposta:",
    // SLIKE SE IMENUJU RUČNO (24.08.2026, prijava vlasnice: „zadatak 16 nema
    // nijednu sličicu, a mislim da imamo svaku reč").
    // Bila je u pravu: `teulada`, `sabo`, `jardi` i `garatge` postoje odavno.
    // Nisu se prikazivale iz dva razloga odjednom — odgovor je REČENICA
    // („És a la teulada"), pa traženje slike po celom tekstu ne nađe ništa, a
    // uz to je zadatak bio označen kao `rightTextOnly` (samo tekst).
    // `fusta` (drvo) je dobila sliku 24.08. — naslagane daske sa godovima.
    // Slika stola ne bi valjala: pitanje glasi OD ČEGA je sto napravljen.
    // Slika i dalje iskače TEK KAD je par tačno spojen — nagrada, ne pomoć.
    //
    // SPOJENO SA NEKADAŠNJIM ZADATKOM 19 (24.08.2026, odluka vlasnice).
    // Ta dva zadatka su imala ČETIRI OD PET istih pitanja — dete je u istoj
    // temi dva puta radilo isti zadatak. Zadatak 19 je uklonjen, a njegov
    // jedini drugačiji par („Quantes finestres hi ha?") preuzet je ovde, pa
    // nijedna rečenica iz sveske nije izgubljena.
    rightTextOnly: true,
    pairs: [
      { left: "On és l'antena?", right: "És a la teulada", rightImage: "teulada" },
      { left: "De què està feta la taula?", right: "De fusta", rightImage: "fusta" },
      { left: "Amb què ens rentem les mans?", right: "Amb sabó", rightImage: "sabó" },
      { left: "On plantem flors?", right: "Al jardí", rightImage: "jardí" },
      { left: "On guardem el cotxe?", right: "Al garatge", rightImage: "garatge" },
      // Preuzeto iz nekadašnjeg zadatka 19 (v. napomenu iznad) — jedini par
      // koji ovaj zadatak nije već imao. Ništa iz sveske nije izgubljeno.
      { left: "Quantes finestres hi ha?", right: "Hi ha tres finestres", rightImage: "finestra" },
    ],
  },

  // ── Task 14: Pinta (classify by room - color-code) ──
  {
    id: "la-casa-17",
    type: "classify-columns",
    // ZADATAK PREPRAVLJEN IZ OSNOVA 17.08.2026 — vlasnica je igrajući sa
    // detetom našla ŠEST odvojenih grešaka u njemu:
    //
    // 1. `xemeneia` je stajala u KUHINJI. Kamin nije u kuhinji. Sada je u
    //    dnevnoj sobi, gde je i sveska stavlja (vežba 9).
    // 2. `armari` je stajao u KUHINJI, pa je dete koje ga je stavilo u spavaću
    //    sobu dobilo grešku. Orman je i jedno i drugo — IZBAČEN.
    // 3. `lavabo` je stajao kao stvar koju treba svrstati u sobu `Lavabo`.
    //    Kupatilo se ne stavlja u kupatilo. Izbačen.
    // 4. `mirall` i `cortina` stoje i u dnevnoj i u spavaćoj sobi — dete bi
    //    moralo da nagađa i rizikuje. Izbačeni.
    // 5. `llençols` nije imao sliku; sada ima (složena od jednine).
    // 6. Naslov je pominjao boje („vermell = dormitori…"). To je iz sveske,
    //    gde se BOJI. Kod nas se prevlači u kolone, pa boje ništa ne znače.
    //
    // Ostaju SAMO stvari nedvosmisleno vezane za jednu sobu, po četiri na
    // sobu. Sve su iz sveske (vežbe 9, 11, 12 i 14).
    prompt: "Classifica: on trobem cada cosa?",
    columns: [
      {
        title: "Dormitori",
        items: ["llit", "llençols", "despertador", "tauleta de nit"],
      },
      {
        title: "Sala d'estar",
        items: ["televisió", "sofà", "catifa", "xemeneia"],
      },
      {
        title: "Lavabo",
        items: ["banyera", "dutxa", "tovallola", "rentamans"],
      },
      {
        title: "Cuina",
        items: ["aiguera", "forn", "nevera", "microones"],
      },
    ],
    allItems: [
      "llit",
      "televisió",
      "banyera",
      "aiguera",
      "llençols",
      "sofà",
      "dutxa",
      "forn",
      "despertador",
      "catifa",
      "tovallola",
      "nevera",
      "tauleta de nit",
      "xemeneia",
      "rentamans",
      "microones",
    ],
    // BEZ `circleMode` (24.08.2026). Režim krugova crta tačno dva izbora, a
    // ovaj zadatak ima četiri sobe — `Lavabo` i `Cuina` se nisu ni pojavljivale,
    // pa `banyera`, `dutxa`, `nevera`, `forn` i još četiri reči nisu imale
    // nijedan tačan odgovor. Sada se sve četiri sobe iscrtavaju kao dugmad.
  },

  // ── Task 14 (cont): Completa (on fem cada cosa) ──
  {
    id: "la-casa-18",
    type: "fill-sentence",
    prompt: "Completa:",
    sentences: [
      {
        text: "Dormim a ___.",
        blank: "l'habitació",
        options: ["la cuina", "l'habitació", "el jardí"],
      },
      {
        text: "Mengem a ___.",
        blank: "el menjador",
        options: ["el lavabo", "el garatge", "el menjador"],
      },
      {
        text: "Cuinem a ___.",
        blank: "la cuina",
        options: ["la cuina", "el dormitori", "la terrassa"],
      },
      {
        text: "Ens rentem a ___.",
        blank: "el lavabo",
        options: ["la cuina", "el lavabo", "el menjador"],
      },
      {
        text: "Guardem el cotxe a ___.",
        blank: "el garatge",
        options: ["el jardí", "la terrassa", "el garatge"],
      },
      {
        text: "Prenem el sol a ___.",
        blank: "la terrassa",
        options: ["el dormitori", "la terrassa", "la cuina"],
      },
      {
        text: "Mirem la televisió a ___.",
        blank: "la sala d'estar",
        options: ["el lavabo", "la cuina", "la sala d'estar"],
      },
      {
        text: "Guardem el menjar a ___.",
        blank: "la nevera",
        options: ["la nevera", "l'armari", "el garatge"],
      },
    ],
  },

  // ── Task 16: Escriu el contrari ──
  {
    id: "la-casa-20",
    type: "write-antonym",
    prompt: "Escriu el contrari:",
    pairs: [
      { word: "casa gran", antonym: "casa petita" },
      { word: "menjador gran", antonym: "menjador petit" },
      { word: "cuina petita", antonym: "cuina gran" },
      { word: "dormitoris petits", antonym: "dormitoris grans" },
      { word: "garatge net", antonym: "garatge brut" },
      { word: "lavabo net", antonym: "lavabo brut" },
      { word: "cortines brutes", antonym: "cortines netes" },
      { word: "terrassa bruta", antonym: "terrassa neta" },
      { word: "escales netes", antonym: "escales brutes" },
    ],
  },

  // ── Task 17: Ordena les oracions ──
  {
    id: "la-casa-21",
    type: "order-words",
    prompt: "Ordena les oracions:",
    sentences: [
      {
        scrambled: ["obro", "porta", "la", "Jo"],
        correct: ["Jo", "obro", "la", "porta"],
      },
      {
        scrambled: ["jardí", "El", "surt", "nen", "al"],
        correct: ["El", "nen", "surt", "al", "jardí"],
      },
      {
        scrambled: ["baixa", "escales", "les", "Maria", "La"],
        correct: ["La", "Maria", "baixa", "les", "escales"],
      },
      {
        scrambled: ["cotxe", "el", "al", "garatge", "Ell", "té"],
        correct: ["Ell", "té", "el", "cotxe", "al", "garatge"],
      },
      {
        scrambled: ["cinc", "Mireia", "casa", "té", "La", "finestres", "a"],
        correct: ["La", "Mireia", "té", "cinc", "finestres", "a", "casa"],
      },
      // JÚLIA I EMMA (26.08.2026, zahtev vlasnice: „ja ovo radim za njih, a one
      // će biti posebno ponosne što se nalaze u igrici").
      // Rečenice su DODATE, nijedna iz sveske nije dirnuta. Imena su u
      // katalonskom obliku — `Júlia` i `Ema` — a `Ema` se pise
      // kao i u temi 1 (zadatak 9), gde devojcice vec postoje — igra mora da
      // ih zove isto na svim mestima.
      {
        scrambled: ["puja", "escales", "La", "les", "Júlia"],
        correct: ["La", "Júlia", "puja", "les", "escales"],
      },
      {
        scrambled: ["jardí", "L'Ema", "flors", "al", "planta"],
        correct: ["L'Ema", "planta", "flors", "al", "jardí"],
      },
    ],
  },

  // ── Task 18: Llegeix el text i digues quantes vegades surten les paraules ──
  {
    id: "la-casa-22",
    type: "count-and-write",
    prompt:
      "Llegeix el text: «Cada dia al matí obro la finestra del meu dormitori i pujo la persiana. Avui la persiana s'ha trencat. El meu pare l'ha arreglat, però s'ha tornat a trencar. Això no pot passar a la finestra de la cuina perquè no té persiana. La meva mare ha posat una cortina de color blanc amb flors. Al menjador, també tenim una cortina blanca.» Digues quantes vegades surten les paraules:",
    items: [
      { description: "PERSIANA", count: 3, word: "persiana" },
      { description: "FINESTRA", count: 2, word: "finestra" },
      { description: "CORTINA", count: 2, word: "cortina" },
    ],
  },

  // ── Autoavaluació ──
  {
    id: "la-casa-24",
    type: "self-assessment",
    prompt: "Autoavaluació: La casa",
    items: [
      { catalan: "teulada", translation: "krov", image: "teulada" },
      { catalan: "xemeneia", translation: "dimnjak", image: "xemeneia" },
      { catalan: "antena", translation: "antena", image: "antena" },
      { catalan: "balcó", translation: "balkon", image: "balco" },
      { catalan: "persiana", translation: "roletna", image: "persiana" },
      { catalan: "cortina", translation: "zavesa", image: "cortina" },
      { catalan: "escala", translation: "stepenice", image: "escala" },
      { catalan: "jardí", translation: "bašta", image: "jardi" },
      { catalan: "garatge", translation: "garaža", image: "garatge" },
      { catalan: "dormitori", translation: "spavaća soba", image: "dormitori" },
      { catalan: "cuina", translation: "kuhinja", image: "cuina" },
      { catalan: "menjador", translation: "trpezarija", image: "menjador" },
      { catalan: "sala d'estar", translation: "dnevna soba", image: "sala-d-estar" },
      { catalan: "terrassa", translation: "terasa", image: "terrassa" },
      { catalan: "lavabo", translation: "kupatilo", image: "lavabo" },
    ],
  },


  // ── Slaganje reči iz dva dela (dodato 17.08.2026) ──
  // Vlasnica: „taj tip zadatka joj se svideo, stavi ga i u ostale teme."
  // Postojao je samo u temi 4. Sve reči su iz vokabulara OVE teme — ništa se
  // ne izmišlja, samo se već naučena reč seče na dva dela, po slogu.
  {
    id: "la-casa-slaganje",
    type: "matching",
    prompt: "Relaciona les dues parts per formar paraules:",
    joinParts: true,   // spaja delove jedne reči — izgovara se SPOJENA reč
    rightTextOnly: true,
    pairs: [
      { left: "CUI", right: "NA" },
      { left: "BAL", right: "CÓ" },
      { left: "COR", right: "TINA" },
      { left: "NE", right: "VERA" },
      { left: "MI", right: "RALL" },
      { left: "PER", right: "SIANA" },
    ],
  },

  // Bonus activity: Fun drawing
  {
    id: "la-casa-bonus",
    type: "drawing-canvas",
    prompt: "Activitat extra! Diverteix-te, activa la creativitat i dibuixa alguna cosa màgica!",
    bonus: true,
  },
];
