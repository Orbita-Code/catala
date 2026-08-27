/**
 * ŠTA SME DA SE PONUDI DETETU NA VEŽBANJE („Practica paraules").
 *
 * Prijava vlasnice (27.08.2026), na kraju teme „Els animals":
 *   „imam practica paraulas i glas ne izgovara dobro, umesto Amb què čita
 *    amb k, a onda mi ništa nije jasno jer su to neke reči sa postavljanjem
 *    pitanja, a nema nigde odgovora da se klikne nego samo dugmići Znam i
 *    ne znam."
 *
 * Uzrok: zadatak sa ponuđenim odgovorima je kao grešku pamtio CELO PITANJE
 * („Amb què vola l'au?"), a ne reč koja se uči („ales"). Pitanje je onda
 * odlazilo u vežbu, gde se prikazuje samo tekst i dva dugmeta — pa dete vidi
 * pitanje bez ijednog odgovora. Uz to snimak za celo pitanje ne postoji, pa ga
 * je čitao glas uređaja i izgovarao „què" kao „k".
 *
 * Popravka u zadatku važi za NOVE greške. Stari zapisi i dalje stoje u
 * pregledaču deteta, zato se ovde tiho izbacuju — na oba mesta gde greške žive
 * (`errors.ts` i `progress.ts`, nalaz N-26.4).
 *
 * Vežba je za REČI. Izbacuje se sve što nije reč:
 *   • pitanje (ima upitnik),
 *   • opis sa zarezom („Gran, mamífer, cobert de pel, viu al bosc"),
 *   • duže od tri reči,
 *   • slepljena rečenica bez ijednog razmaka koja se završava tačkom
 *     (`Lapeixeteriavenpeix.` — v. `SeparateWords.tsx`).
 */
export function jeRecZaVezbu(x: string): boolean {
  const t = (x ?? "").trim();
  if (!t) return false;
  if (/[?¿]/.test(t)) return false;
  if (t.includes(",")) return false;
  if (t.split(/\s+/).length > 3) return false;
  if (!t.includes(" ") && /[.!?]$/.test(t)) return false;
  return true;
}
