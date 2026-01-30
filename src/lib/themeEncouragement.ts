/** Per-theme contextual phrases in Catalan.
 *  Shown as fun tips after every 3rd correct answer in a theme. */

const themeContextPhrases: Record<string, string[]> = {
  "la-classe": [
    "Ara mira la teva taula! Com es diu en català?",
    "Saps que 'llapis' ve del llatí?",
    "Demana a algú: em deixes la goma, si us plau?",
    "Compta les cadires de la classe en català!",
  ],
  "l-escola": [
    "Quin és el teu lloc preferit de l'escola?",
    "Saps on és la biblioteca? Digues-ho en català!",
    "Digues: bon dia, mestre! quan entris a classe.",
    "L'escola en català és molt fàcil de recordar!",
  ],
  "el-cos": [
    "Toca't el nas i digues: nas!",
    "Quants dits tens? Compta'ls en català!",
    "Mou els braços i digues: braços!",
    "Saps dir totes les parts de la cara en català?",
  ],
  "la-roba": [
    "Mira la teva samarreta! Com es diu en català?",
    "De quin color són els teus pantalons?",
    "Digues a algú de casa: necessito els meus mitjons!",
    "Quina peça de roba portes ara?",
  ],
  "la-casa": [
    "Quantes habitacions té casa teva?",
    "Digues: la cuina! quan hi entris.",
    "On dorms? Digues-ho en català!",
    "Saps dir les parts de la casa en català?",
  ],
  "la-familia": [
    "Com es diu la teva mare en català? Mare!",
    "Quants germans tens? Digues-ho en català!",
    "Digues: t'estimo, família!",
    "Saps dir avi i àvia?",
  ],
  "les-botigues": [
    "Anem a la botiga! Què vols comprar?",
    "Digues: bon dia! quan entris a una botiga.",
    "Saps on comprem el pa? A la fleca!",
    "Quant costa? Demana-ho en català!",
  ],
  "el-menjar": [
    "Ara digues a algú de casa: si us plau, prepara'm un pastís!",
    "Quin és el teu menjar preferit? Digues-ho en català!",
    "Saps dir fruites en català? Poma, pera, plàtan!",
    "Digues: tinc gana! quan tinguis gana.",
    "Bon profit! Es diu quan comences a menjar.",
  ],
  "els-animals": [
    "Saps quin so fa el gat en català? Meu meu!",
    "Quin és el teu animal preferit?",
    "El gos fa: bup bup! en català.",
    "Quants animals coneixes en català?",
    "Saps que el gall fa: quiquiriquic?",
  ],
  "la-ciutat": [
    "Digues els llocs de la teva ciutat en català!",
    "On és l'hospital? Pregunta-ho en català!",
    "Saps com es diu un parc en català?",
    "Quants carrers coneixes del teu barri?",
  ],
  "els-vehicles": [
    "Quin vehicle et porta a l'escola?",
    "Brum brum! El cotxe fa soroll!",
    "Saps com es diu bicicleta en català?",
    "Digues: vull anar amb tren!",
  ],
  "els-oficis": [
    "Què vols ser de gran? Digues-ho en català!",
    "El metge cura els malalts. I la mestra?",
    "Saps quins oficis hi ha al teu barri?",
    "Digues: gràcies, bomber! si en veus un.",
  ],
};

/** Get a contextual theme phrase. Returns null if no phrases exist for the theme. */
export function getThemePhrase(themeSlug: string): string | null {
  const phrases = themeContextPhrases[themeSlug];
  if (!phrases || phrases.length === 0) return null;
  return phrases[Math.floor(Math.random() * phrases.length)];
}
