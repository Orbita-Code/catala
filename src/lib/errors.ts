import { safeSetJSON } from "./storage";
/**
 * Error Tracking System
 *
 * Tracks mistakes made by children during tasks.
 * Errors are stored silently (no stress for kids) and can be reviewed later.
 *
 * Structure:
 * {
 *   "la-classe": {
 *     "la-classe-1": ["llapis", "goma"],  // words they got wrong
 *     "la-classe-5": ["El gat està ___ la cadira."]  // sentences
 *   }
 * }
 */

const ERRORS_KEY = "catala-errors";

export interface ThemeErrors {
  [taskId: string]: string[];
}

export interface AllErrors {
  [themeSlug: string]: ThemeErrors;
}

/**
 * Get all errors from localStorage
 */
/**
 * SLEPLJENE REČENICE SE VIŠE NE VEŽBAJU (27.08.2026).
 *
 * Do danas je zadatak „Separa i copia" pamtio grešku kao SLEPLJENU rečenicu
 * (`Lapeixeteriavenpeix.`) — v. objašnjenje u `SeparateWords.tsx`. Takva
 * „reč" se nudila detetu na vežbanje i izgovarala se glasom uređaja, jer
 * snimak za nju ne postoji.
 *
 * Popravka u zadatku važi za nove greške. Ali u pregledaču deteta STARI zapisi
 * i dalje stoje, i vežba bi ih i dalje čitala. Zato se ovde tiho izbacuju.
 *
 * Prepoznaju se pouzdano: nemaju NIJEDAN RAZMAK, a ZAVRŠAVAJU SE TAČKOM.
 * Nijedna katalonska reč u igrici ne izgleda tako — tačka postoji samo na kraju
 * rečenice, a rečenica uvek ima razmake.
 */
function jeSlepljenaRecenica(x: string): boolean {
  return !x.includes(" ") && /[.!?]$/.test(x);
}

export function getAllErrors(): AllErrors {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(ERRORS_KEY);
    const sve: AllErrors = data ? JSON.parse(data) : {};
    // očisti stare slepljene zapise (v. objašnjenje gore)
    for (const tema of Object.keys(sve)) {
      for (const zadatak of Object.keys(sve[tema])) {
        sve[tema][zadatak] = sve[tema][zadatak].filter((x) => !jeSlepljenaRecenica(x));
        if (sve[tema][zadatak].length === 0) delete sve[tema][zadatak];
      }
      if (Object.keys(sve[tema]).length === 0) delete sve[tema];
    }
    return sve;
  } catch {
    return {};
  }
}

/**
 * Get errors for a specific theme
 */
export function getThemeErrors(themeSlug: string): ThemeErrors {
  const all = getAllErrors();
  return all[themeSlug] || {};
}

/**
 * Get total error count for a theme
 */
export function getThemeErrorCount(themeSlug: string): number {
  const themeErrors = getThemeErrors(themeSlug);
  let count = 0;
  for (const items of Object.values(themeErrors)) {
    count += items.length;
  }
  return count;
}

/**
 * Add an error for a task
 * @param themeSlug - Theme slug (e.g., "la-classe")
 * @param taskId - Task ID (e.g., "la-classe-1")
 * @param item - The item that was wrong (word, sentence, etc.)
 */
export function addError(themeSlug: string, taskId: string, item: string): void {
  if (typeof window === "undefined") return;

  const all = getAllErrors();

  if (!all[themeSlug]) {
    all[themeSlug] = {};
  }
  if (!all[themeSlug][taskId]) {
    all[themeSlug][taskId] = [];
  }

  // Don't add duplicates
  if (!all[themeSlug][taskId].includes(item)) {
    all[themeSlug][taskId].push(item);
    safeSetJSON(ERRORS_KEY, all);
  }
}

/**
 * Remove an error when the child gets it right in review
 */
export function removeError(themeSlug: string, taskId: string, item: string): void {
  if (typeof window === "undefined") return;

  const all = getAllErrors();

  if (all[themeSlug]?.[taskId]) {
    all[themeSlug][taskId] = all[themeSlug][taskId].filter(i => i !== item);

    // Clean up empty arrays
    if (all[themeSlug][taskId].length === 0) {
      delete all[themeSlug][taskId];
    }
    if (Object.keys(all[themeSlug]).length === 0) {
      delete all[themeSlug];
    }

    safeSetJSON(ERRORS_KEY, all);
  }
}

/**
 * Clear all errors for a theme (e.g., when they complete review)
 */
export function clearThemeErrors(themeSlug: string): void {
  if (typeof window === "undefined") return;

  const all = getAllErrors();
  delete all[themeSlug];
  safeSetJSON(ERRORS_KEY, all);
}

/**
 * Obriši sve greške JEDNOG zadatka.
 *
 * POSTOJALA JE OD RANIJE I NIJE SE ZVALA NIOTKUD (16.08.2026). Zato je greška
 * zapisana usput ostajala zauvek: dete koje je zadatak završilo tačno i dalje
 * je nosilo tu reč u spisku „za vežbanje". Sada je zove `TemaContent` čim se
 * zadatak završi sa svime tačnim.
 */
export function clearTaskErrors(themeSlug: string, taskId: string): void {
  if (typeof window === "undefined") return;

  const all = getAllErrors();
  if (all[themeSlug]) {
    delete all[themeSlug][taskId];
    if (Object.keys(all[themeSlug]).length === 0) {
      delete all[themeSlug];
    }
    safeSetJSON(ERRORS_KEY, all);
  }
}

/**
 * Get a flat list of all errored items for a theme (for review mode)
 */
export function getErroredItemsList(themeSlug: string): { taskId: string; item: string }[] {
  const themeErrors = getThemeErrors(themeSlug);
  const list: { taskId: string; item: string }[] = [];

  for (const [taskId, items] of Object.entries(themeErrors)) {
    for (const item of items) {
      list.push({ taskId, item });
    }
  }

  return list;
}
