/**
 * Bezbedan pristup `localStorage`-u.
 *
 * ZAŠTO POSTOJI: u privatnom prozoru, sa blokiranim kolačićima i u školskim/firmskim
 * pregledačima pristup `localStorage`-u **baca** `SecurityError`. Audit 30.07.2026. je
 * izmerio da je zbog jednog takvog nezaštićenog upisa **cela početna strana padala** —
 * dete je videlo „Application error" i nijedno dugme.
 *
 * Izolovano tada:
 *   samo UPIS baca    → strana pada
 *   samo ČITANJE baca → strana radi (sva čitanja su imala try/catch)
 *
 * Zato: NIJEDAN upis u `localStorage` ne sme da ide direktno. Uvek kroz ovaj modul.
 * Napredak se u najgorem slučaju ne sačuva — ali igrica radi, a to je jedino važno.
 */

/** Upiši vrednost; vrati `true` ako je stvarno upisano. Nikad ne baca. */
export function safeSet(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    // Zabranjeno skladište ili puna kvota — tiho odustani.
    return false;
  }
}

/** Upiši objekat kao JSON. Nikad ne baca. */
export function safeSetJSON(key: string, value: unknown): boolean {
  try {
    return safeSet(key, JSON.stringify(value));
  } catch {
    return false;
  }
}

/** Obriši ključ. Nikad ne baca. */
export function safeRemove(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/** Pročitaj sirovu vrednost. Nikad ne baca. */
export function safeGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Da li je skladište uopšte upotrebljivo (za poruku detetu/roditelju, ako zatreba). */
export function storageAvailable(): boolean {
  const probniKljuc = "catala-proba-skladista";
  if (!safeSet(probniKljuc, "1")) return false;
  safeRemove(probniKljuc);
  return true;
}
