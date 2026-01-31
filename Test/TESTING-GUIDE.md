# Testing Guide - Katalonski App

## Overview
This document explains how to test the Katalonski Catalan language learning app.
The app has **209 tasks** across **12 themes** with **12 different task types**.

## Quick Start
```bash
npm run dev        # Start dev server (localhost:3000 or next available port)
npm run build      # Build check - catches TypeScript errors
```

## Task Types & How to Test Each

### 1. copy-word (22 tasks)
**What it does:** Shows a word, child clicks letter tiles in order to spell it.
**How to test:**
- Click letter tiles in the letter bank (bottom area, larger 48px buttons)
- Letters fill the slots (top area, smaller 44px buttons)
- Click "Comprova!" to check
- Correct: confetti + auto-advance to next word
- Wrong: red highlight, auto-clear after 600ms
**Automated:** Type letters via keyboard (accent-insensitive matching)
**Known issues:** None

### 2. fill-letters (15 tasks)
**What it does:** Shows words with missing letters (blanks). Child fills each blank by tapping a letter option.
**How to test:**
- Active blank has green dashed border
- Tap one of the 5 letter options below the word
- When all blanks in a word are filled, auto-checks
- Correct: green ring around word + checkmark
- Wrong: red ring + retry encouragement from star mascot, auto-clears after 2s
- When ALL words correct: task completes
**Automated:** Press letter keys - the component has keyboard support (Tab, Backspace, letter keys)
**Known issues:** Verify hint length matches word length (Bug fixed: retolador hint was 8 chars, word was 9)

### 3. unscramble (12 tasks)
**What it does:** Shows scrambled syllables, child clicks them in order.
**How to test:**
- Click syllable buttons in the correct order
- Filled slots show the placed syllables
- Click a placed syllable to remove it
- Click "Comprova!" to verify
- Correct: confetti + auto-advance
**Automated:** Click syllable buttons by text content

### 4. matching (12 tasks)
**What it does:** Two columns of items, child matches left to right.
**How to test:**
- Click a left item, then click its matching right item (or vice versa)
- Correct match: both turn green
- Wrong match: both flash red, then reset
- Supports drag-and-drop: drag left item to right item
**Automated:** Click left item text, then right item text
**Known issues:** None

### 5. classify-columns (22 tasks)
**What it does:** Shows one word at a time, child taps the correct category column.
**How to test:**
- Current word shown in center
- Two (or three) column buttons below
- Tap correct column or drag word to it
- Correct: confetti + green feedback + advance
- Wrong: red X + advance
- After all items: results view shows which were correct/wrong
- If all correct: auto-completes
**Automated:** Click the column button (has `data-drop-target="col-N"`)
**Known issues:** Verify allItems matches sum of column items (Bug fixed: la-familia-6 had extra "bebe")

### 6. word-search (12 tasks)
**What it does:** Grid of letters with hidden words to find.
**How to test:**
- Click and drag across cells to select a word
- Uses mousedown + mouseenter + mouseup
- Found words: cells turn green, word gets strikethrough
- Progress: "X/Y paraules trobades"
- When all found: auto-completes
**Automated:** Simulate mouse drag from start cell to end cell
**Known issues:** Verify all listed words actually exist in the grid (Bug fixed: la-classe-2 grid didn't contain "pissarra")

### 7. fill-sentence (46 tasks - most common)
**What it does:** Sentences with blanks, child selects correct word from options.
**How to test:**
- Each sentence has a `<select>` dropdown with options
- Select the correct option for each blank
- Click "Comprova!" to verify
- Correct answers: green highlight
- Wrong answers: red highlight
- All correct: auto-completes
**Automated:** Set select element value and dispatch change event

### 8. multiple-choice (12 tasks)
**What it does:** Questions with 4 options, child picks the correct one.
**How to test:**
- Click the correct answer button
- Correct: green highlight + confetti + auto-advance to next question
- Wrong: red highlight
- After all questions: auto-completes if all correct
**Automated:** Click the button at the correct index

### 9. self-assessment (13 tasks)
**What it does:** Shows vocabulary with translations. Child rates each: Yes/Maybe/No.
**How to test:**
- Three buttons per word: Sí (green), Més o menys (yellow), No (red)
- Click any button to rate
- After rating all items, shows summary
- Always completes (no right/wrong)
**Automated:** Click "Sí" button for each item

### 10. label-image (21 tasks)
**What it does:** Slots representing image positions. Child places word labels in correct slots.
**How to test:**
- Click a word from the bank (bottom), then click a slot (top)
- Or drag a word to a slot
- Words in bank turn gray when placed
- Click "Comprova!" when all slots filled
- Row-flexible: same-row labels can be swapped
**Automated:** Click word then click slot, or simulate drag
**Known issues:** None

### 11. color-by-instruction (2 tasks)
**What it does:** Instructions to color items specific colors. Child picks color from palette, then taps items.
**How to test:**
- Read the instruction (e.g., "Pinta el llapis de color blau")
- Click the matching color in the palette
- Click the item emoji/button
- Correct color: green border
- Wrong color: shake animation
**Automated:** Click palette color, then click target item

### 12. drawing-canvas (13 tasks)
**What it does:** Free drawing canvas with color and brush size options.
**How to test:**
- Draw anything on the canvas
- Change colors and brush sizes
- Click "He acabat!" to complete
- Always completes (creative task)
**Automated:** Click "He acabat!" button

## Cross-Cutting Features to Test

### Confetti
- Fires on correct task completion (individual words in copy-word, correct matches, etc.)
- Bigger confetti burst on theme completion
- Multiple waves for perfect theme completion

### Star Mascot
- Bottom-left corner, always visible
- Bounces/dances on correct answers
- Shows confused/dizzy on wrong answers
- Displays encouragement messages in Catalan

### Progress Persistence
- Progress saved to `localStorage` key `catala-progress`
- Tracks: currentTask, completedTasks[], streak, bestStreak, stars, taskErrors
- Star counter on home page shows total completed across all themes
- Returning to a theme restores last position

### Navigation
- "Anterior" (back) and "Seguent" (forward) buttons in footer
- Disabled at boundaries (first/last task)
- Progress bar at top shows completion percentage

### Drag-and-Drop
- Works in: LabelImage, ClassifyColumns, Matching
- Uses pointer events (mouse + touch)
- Visual feedback: ghost overlay follows cursor, drop targets pulse
- Falls back to tap-to-select on touch devices

### Audio
- Speaker buttons on words (plays pronunciation)
- Sound effects: correct, wrong, combo, theme complete
- Mute button in header

### Badges
- 19 badges total on home page
- 12 theme completion badges
- 3 streak badges (3, 5, 10)
- 3 star count badges (10, 50, all)
- 1 master badge (complete all themes)

## Automated Testing with Playwright

### Setup
The app uses Playwright MCP for browser testing. Key patterns:

```javascript
// Navigate to a theme
await page.goto('http://localhost:3002/tema/la-classe');

// Solve copy-word: click letter tiles
const bankTiles = document.querySelectorAll('.w-12.h-12');

// Solve word-search: mouse drag
await page.mouse.move(startX, startY);
await page.mouse.down();
// Move in steps to trigger mouseenter events
for (let i = 1; i <= 10; i++) {
  await page.mouse.move(
    startX + (endX - startX) * (i / 10),
    startY + (endY - startY) * (i / 10)
  );
}
await page.mouse.up();

// Solve fill-letters: keyboard input
await page.keyboard.press('l');  // accent-insensitive

// Solve classify-columns: click drop target
const target = document.querySelector('[data-drop-target="col-0"]');
target.click();

// Solve fill-sentence: set select value
const select = document.querySelector('select');
select.value = 'correct-answer';
select.dispatchEvent(new Event('change', { bubbles: true }));

// Check progress
const progress = JSON.parse(localStorage.getItem('catala-progress'));
```

### Task Type Detection
```javascript
// Detect current task type from DOM
const heading = document.querySelector('h2')?.textContent;
if (heading.includes('copia') || heading.includes('Llegeix')) → copy-word
if (heading.includes('Busca') || heading.includes('sopa')) → word-search
if (heading.includes('Ordena')) → unscramble
if (heading.includes('Classifica') || heading.includes('Posa')) → classify-columns
if (heading.includes('Relaciona') || heading.includes('Uneix')) → matching
if (heading.includes('Completa') && document.querySelector('select')) → fill-sentence
if (heading.includes('Tria')) → multiple-choice
if (heading.includes('Saps dir') || heading.includes('autoavaluac')) → self-assessment
if (heading.includes('Pinta') || heading.includes('Coloreja')) → color-by-instruction
if (heading.includes('Col·loca') || heading.includes('Escriu el nom')) → label-image
if (heading.includes('Dibuixa') || document.querySelector('canvas')) → drawing-canvas
if (heading.includes('Completa') && !document.querySelector('select')) → fill-letters
```

## Data Validation

### Checking Theme Data Files
Each theme's data file is in `src/data/`. Key validations:

1. **Task count matches CLAUDE.md table**
2. **No duplicate IDs** within a theme
3. **fill-letters:** hint length must equal word length
4. **word-search:** all listed words must exist in the grid
5. **classify-columns:** allItems must be the union of all column items (no extras, no missing)
6. **label-image:** all label texts must be in options array
7. **multiple-choice:** correct index must be within options bounds
8. **fill-sentence:** each sentence must have options array with at least the blank value

### Task Counts (209 total)
| Theme | Tasks |
|-------|-------|
| la-classe | 20 |
| l-escola | 17 |
| el-cos | 20 |
| la-roba | 14 |
| la-casa | 23 |
| la-familia | 14 |
| les-botigues | 15 |
| el-menjar | 20 |
| els-animals | 21 |
| la-ciutat | 15 |
| els-vehicles | 15 |
| els-oficis | 15 |

## Bug Report Template
When reporting bugs, include:
- Theme and task number (e.g., "Theme 1, Task 2")
- Task type (e.g., "word-search")
- Expected behavior
- Actual behavior
- Console errors (if any)
- Steps to reproduce

## UX Considerations for Children (Ages 5-8)
- Buttons must be large enough for small fingers (min 44px tap targets)
- Text should be large and readable (font-handwriting for Catalan words)
- Feedback should be immediate and visual (confetti, color changes, star animation)
- Wrong answers should be encouraging, not punishing
- Progress should be clearly visible
- Drag-and-drop must work on both mouse and touch
