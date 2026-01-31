# Bug Report - Katalonski App Testing

## Date: 2026-01-30

## Fixed Bugs

### BUG-001: Word search grid missing "pissarra" (FIXED)
- **Location:** `src/data/la-classe.ts`, task la-classe-2
- **Severity:** Critical (task unsolvable)
- **Description:** The word "pissarra" was listed as one of 10 words to find in the word search, but it was not present anywhere in the 9x9 grid (not in any row, column, or diagonal).
- **Impact:** Children could only find 9/10 words, making the task impossible to complete. The progress counter showed "9/10 paraules trobades" permanently.
- **Fix:** Expanded grid to 10x10 and added "pissarra" in row 10 (bottom). Updated `gridSize` from 9 to 10. All other words remain in their original positions.

### BUG-002: Fill-letters hint length mismatch for "retolador" (FIXED)
- **Location:** `src/data/la-classe.ts`, task la-classe-3
- **Severity:** High (word unsolvable)
- **Description:** The hint `"r_to_d_r"` was 8 characters but the word `"retolador"` is 9 characters. The FillLetters component generates blanks based on underscore positions in the hint, so the rendered word had fewer positions than the actual word.
- **Fix:** Changed hint from `"r_to_d_r"` to `"r_tol_d_r"` (9 characters, matching the word).

### BUG-003: Classify-columns "bebe" has no valid column (FIXED)
- **Location:** `src/data/la-familia.ts`, task la-familia-6
- **Severity:** Critical (task unsolvable)
- **Description:** The `allItems` array contained "bebe" (15 items total) but the two columns ("Home" and "Dona") only contained 14 items (7+7). The extra item "bebe" appeared in the shuffled item pool but had no correct column to be placed in.
- **Impact:** Children would eventually encounter "bebe" and have no correct column to choose, making the task impossible to complete with all correct answers.
- **Fix:** Removed "bebe" from `allItems`, making it 14 items matching the column totals.

### BUG-004: SVG star mouth path animation error (FIXED)
- **Location:** `src/components/star/StarFace.tsx`, line 235
- **Severity:** Low (cosmetic, console error only)
- **Description:** Framer Motion's `animate={{ d: data.mouthPath }}` attempted to animate the SVG path `d` attribute, which Framer Motion cannot properly morph between different path strings. This caused console errors: `Error: <path> attribute d: Expected moveto`.
- **Fix:** Replaced `<motion.path>` with a plain `<path>` element and added a `key` prop so React remounts it when the expression changes, achieving instant transitions instead of broken animations.

## Data Validation Summary

### All 12 theme data files validated:
- **209 tasks total** across 12 themes
- **No duplicate IDs** found
- **All required fields present** for every task type
- **All multiple-choice `correct` indices** within bounds
- **All label-image labels** are subsets of options
- **All fill-sentence blanks** have matching options
- **No empty arrays** anywhere

### Console Warnings (Non-breaking)
- `You are trying to animate opacity from "initial"` - Framer Motion opacity animation warning. Cosmetic only, caused by AnimatePresence transitions where initial values are CSS strings.
- Font loading errors for Nunito and Nunito Sans - caused by CORS/network issues in development. Not a bug, fonts load from Google Fonts CDN.
- `A bad HTTP response code (401) was received when fetching the script` - Service worker registration fails because of Basic Auth. Not blocking.

## Potential Improvements (UX for Children 5-8)

1. **Audio feedback on word completion** - When a child completes a word in copy-word, the word should be spoken aloud (TTS)
2. **Larger tap targets on mobile** - Some buttons are 44px which meets minimum but could be 48-56px for small fingers
3. **Word search on mobile** - Dragging on small touch screens can be difficult. Consider a tap-to-start, tap-to-end selection mode
4. **Color-by-instruction palette** - Color names should be shown alongside color swatches for pre-readers
5. **Drawing canvas tools** - Add an eraser tool and undo button
