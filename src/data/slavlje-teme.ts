import type { VrstaEfekta } from "@/components/celebracio/EfektiSlavlja";

/**
 * SVAKA TEMA IMA SVOJE SLAVLJE (28.08.2026, zahtev vlasnice).
 *
 * „Još bi bilo sjajno kada bi posle svake teme bio drugačiji celebration ekran…
 *  sa lepim profesionalnim vatrometom, animacijama zanimljivim deci, sa
 *  konfetama, bombonama, balonima."
 *
 * Slavlje se ne pravi za svaku temu iznova nego se SASTAVLJA: efekti (vatromet,
 * konfete, bombone, baloni, iskre, latice), paleta boja i lik koji stoji u
 * sredini. Tako svaka tema ima svoj utisak, a novo slavlje se dodaje jednim
 * redom — bez dvanaest istih fajlova koji se razilaze čim se jedan izmeni.
 *
 * Kombinacija je birana prema onome što tema uči: posle „La casa" gori vatromet
 * nad krovovima, posle „Les botigues" padaju bombone, posle „El menjar" i one i
 * konfete, a posle „Els animals" lete latice i svetlucanje.
 */
export interface SlavljeTeme {
  /** Koji se efekti puštaju. */
  efekti: VrstaEfekta[];
  /** Boje čestica — daju temi njen utisak. */
  boje: string[];
  /** Slika iz igre koja stoji u sredini; mora postojati u `public/illustrations`. */
  junak: string;
  /** Nebo iza svega. */
  pozadina: string;
}

export const SLAVLJE: Record<string, SlavljeTeme> = {
  "la-classe": {
    efekti: ["konfete", "iskre"],
    boje: ["#6C5CE7", "#A29BFE", "#FFD166", "#FF8FA3", "#4ECDC4"],
    junak: "llapis",
    pozadina: "linear-gradient(180deg,#1b1f4b 0%,#3b357f 55%,#6C5CE7 100%)",
  },
  "l-escola": {
    efekti: ["baloni", "konfete"],
    boje: ["#0984E3", "#74B9FF", "#FFEAA7", "#FF7675", "#55EFC4"],
    junak: "escola",
    pozadina: "linear-gradient(180deg,#08243f 0%,#0b4a7a 55%,#0984E3 100%)",
  },
  "el-cos": {
    efekti: ["iskre", "konfete"],
    boje: ["#FF6B9D", "#FFC2D1", "#FFD166", "#7BDFF2", "#B892FF"],
    junak: "cara",
    pozadina: "linear-gradient(180deg,#3a1230 0%,#7a2450 55%,#c2557f 100%)",
  },
  "la-roba": {
    efekti: ["konfete", "baloni"],
    boje: ["#E17055", "#FDCB6E", "#00B894", "#0984E3", "#D63031"],
    junak: "samarreta",
    pozadina: "linear-gradient(180deg,#2c1a3d 0%,#6b3f63 55%,#c1748a 100%)",
  },
  "la-casa": {
    efekti: ["vatromet", "iskre"],
    boje: ["#FFD166", "#FF9F1C", "#EF476F", "#06D6A0", "#FFFFFF"],
    junak: "casa",
    pozadina: "linear-gradient(180deg,#0a1128 0%,#1c2a5e 60%,#3b3f8f 100%)",
  },
  "la-familia": {
    efekti: ["latice", "iskre"],
    boje: ["#FF8FA3", "#FFC2D1", "#FFE5EC", "#FFD166", "#C08497"],
    junak: "familia-foto",
    pozadina: "linear-gradient(180deg,#331b33 0%,#7a3f63 55%,#d08a9e 100%)",
  },
  "les-botigues": {
    efekti: ["bombone", "konfete"],
    boje: ["#EF476F", "#FFD166", "#06D6A0", "#118AB2", "#F78C6B"],
    junak: "supermercat",
    pozadina: "linear-gradient(180deg,#1d1533 0%,#4b2c6b 55%,#8a4f9e 100%)",
  },
  "el-menjar": {
    efekti: ["bombone", "iskre"],
    boje: ["#FF9F1C", "#FFBF69", "#CBF3F0", "#2EC4B6", "#FF6B6B"],
    junak: "pastis",
    pozadina: "linear-gradient(180deg,#2b1508 0%,#7a3d18 55%,#d1873f 100%)",
  },
  "els-animals": {
    efekti: ["latice", "konfete"],
    boje: ["#06D6A0", "#8AC926", "#FFD166", "#F94144", "#4CC9F0"],
    junak: "gat",
    pozadina: "linear-gradient(180deg,#0b2818 0%,#1d5c3a 55%,#4a9e6b 100%)",
  },
  "la-ciutat": {
    efekti: ["vatromet", "konfete"],
    boje: ["#4CC9F0", "#F72585", "#FFD166", "#7209B7", "#FFFFFF"],
    junak: "parc",
    pozadina: "linear-gradient(180deg,#07091f 0%,#1b2050 60%,#3c3f7a 100%)",
  },
  "els-vehicles": {
    efekti: ["baloni", "iskre"],
    boje: ["#118AB2", "#06D6A0", "#FFD166", "#EF476F", "#FFFFFF"],
    junak: "cotxe",
    pozadina: "linear-gradient(180deg,#08203a 0%,#12496e 55%,#2f7fa8 100%)",
  },
  "els-oficis": {
    efekti: ["vatromet", "bombone"],
    boje: ["#F94144", "#F9C74F", "#90BE6D", "#577590", "#FFFFFF"],
    junak: "bomber",
    pozadina: "linear-gradient(180deg,#1a0d0d 0%,#5c2320 55%,#a8493f 100%)",
  },
};

/** Ako tema nema svoj recept (npr. nova), slavlje i dalje radi. */
export const SLAVLJE_PODRAZUMEVANO: SlavljeTeme = {
  efekti: ["konfete", "iskre"],
  boje: ["#FFD166", "#EF476F", "#06D6A0", "#118AB2", "#FFFFFF"],
  junak: "llibre",
  pozadina: "linear-gradient(180deg,#151033 0%,#3b2a6b 55%,#6b4f8f 100%)",
};
