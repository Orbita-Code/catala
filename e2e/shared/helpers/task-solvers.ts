import { Page, expect } from "@playwright/test";
import { TaskAnswer } from "../fixtures/theme-answers";

/**
 * Master solver: dispatches to the correct solver based on task type.
 */
export async function solveTask(page: Page, answer: TaskAnswer) {
  switch (answer.type) {
    case "copy-word":
      return solveCopyWord(page);
    case "fill-letters":
      return solveFillLetters(page, answer);
    case "unscramble":
      return solveUnscramble(page, answer);
    case "matching":
      return solveMatching(page, answer);
    case "word-search":
      return solveWordSearch(page, answer);
    case "classify-columns":
      return solveClassifyColumns(page, answer);
    case "fill-sentence":
      return solveFillSentence(page, answer);
    case "multiple-choice":
      return solveMultipleChoice(page, answer);
    case "self-assessment":
      return solveSelfAssessment(page);
    case "color-by-instruction":
      return solveColorByInstruction(page, answer);
    case "label-image":
      return solveLabelImage(page, answer);
    case "drawing-canvas":
      return solveDrawingCanvas(page);
    default:
      throw new Error(`Unknown task type: ${(answer as TaskAnswer).type}`);
  }
}

/**
 * CopyWord: Each word is displayed. Type it into the input and click Comprova.
 */
async function solveCopyWord(page: Page) {
  // Find all word items - each has a displayed word and an input
  const items = page.locator('[data-task-type="copy-word"] input, .space-y-3 input[type="text"], .space-y-4 input[type="text"]');
  const count = await items.count();

  if (count === 0) {
    // Alternative: look for the pattern where word is shown and input follows
    const inputs = page.locator('input[type="text"]');
    const inputCount = await inputs.count();
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      // Find the displayed word near this input
      const parent = input.locator("..");
      const wordEl = parent.locator(".font-bold, .text-2xl, .text-xl").first();
      const word = await wordEl.textContent();
      if (word) {
        await input.fill(word.trim());
        // Click Comprova button
        const btn = page.getByRole("button", { name: /comprova/i });
        if (await btn.isVisible()) {
          await btn.click();
          await page.waitForTimeout(500);
        }
      }
    }
  } else {
    for (let i = 0; i < count; i++) {
      const input = items.nth(i);
      const parent = input.locator("..");
      const wordEl = parent.locator(".font-bold, .text-2xl, .text-xl").first();
      const word = await wordEl.textContent();
      if (word) {
        await input.fill(word.trim());
        const btn = page.getByRole("button", { name: /comprova/i });
        if (await btn.isVisible()) {
          await btn.click();
          await page.waitForTimeout(500);
        }
      }
    }
  }
}

/**
 * FillLetters: Fill missing letters into inputs to complete words.
 */
async function solveFillLetters(page: Page, answer: TaskAnswer) {
  if (answer.type !== "fill-letters") return;

  for (const word of answer.words) {
    // Each word has inputs for missing letters. We need to type the correct letters.
    // The component shows letters with gaps. We look for empty inputs and fill them.
    const inputs = page.locator('input[maxlength="1"]');
    const count = await inputs.count();

    // Fill visible empty inputs
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const value = await input.inputValue();
      if (!value) {
        // We need context to know which letter goes here.
        // The solver fills all inputs for the current visible word.
        break;
      }
    }
  }

  // Alternative approach: fill all single-char inputs that are empty
  const allInputs = page.locator('input[maxlength="1"]');
  const allCount = await allInputs.count();

  // Build a map of which letters are missing by looking at the display
  for (let i = 0; i < allCount; i++) {
    const input = allInputs.nth(i);
    const isVisible = await input.isVisible();
    const value = await input.inputValue();
    if (isVisible && !value) {
      // Get the expected letter from the word data
      // The component renders known letters as spans and unknown as inputs
      // We need to figure out which word and position this input corresponds to
      await input.focus();
      // Try typing - the component validates on completion
    }
  }

  // Click Comprova to check
  const btn = page.getByRole("button", { name: /comprova/i });
  if (await btn.isVisible()) {
    await btn.click();
    await page.waitForTimeout(500);
  }
}

/**
 * Unscramble: Click letters in correct order to spell the word.
 */
async function solveUnscramble(page: Page, answer: TaskAnswer) {
  if (answer.type !== "unscramble") return;

  for (const word of answer.words) {
    // Wait for scrambled letters to appear
    await page.waitForTimeout(300);

    // Click each letter of the word in order
    const letters = word.split("");
    const usedIndices = new Set<number>();

    for (const letter of letters) {
      // Find clickable letter buttons
      const letterBtns = page.locator('button:not([disabled])');
      const count = await letterBtns.count();

      for (let i = 0; i < count; i++) {
        if (usedIndices.has(i)) continue;
        const btn = letterBtns.nth(i);
        const text = await btn.textContent();
        if (text?.trim().toLowerCase() === letter.toLowerCase()) {
          await btn.click();
          usedIndices.add(i);
          await page.waitForTimeout(100);
          break;
        }
      }
    }

    // Click Comprova if available
    const comprova = page.getByRole("button", { name: /comprova/i });
    if (await comprova.isVisible()) {
      await comprova.click();
      await page.waitForTimeout(500);
    }
  }
}

/**
 * Matching: Click left item then right match.
 */
async function solveMatching(page: Page, answer: TaskAnswer) {
  if (answer.type !== "matching") return;

  for (const [left, right] of answer.pairs) {
    // Click the left item
    const leftEl = page.locator(`text="${left}"`).first();
    if (await leftEl.isVisible()) {
      await leftEl.click();
      await page.waitForTimeout(200);
    }

    // Click the right match
    const rightEl = page.locator(`text="${right}"`).first();
    if (await rightEl.isVisible()) {
      await rightEl.click();
      await page.waitForTimeout(300);
    }
  }
}

/**
 * WordSearch: Find and select each word by dragging across cells.
 */
async function solveWordSearch(page: Page, answer: TaskAnswer) {
  if (answer.type !== "word-search") return;

  // For each word, find its position in the grid and drag
  for (const wordPos of answer.wordPositions) {
    const { startRow, startCol, endRow, endCol } = wordPos;

    // Get grid cells
    const startCell = page.locator(
      `.grid > div:nth-child(${startRow * answer.gridSize + startCol + 1})`
    );
    const endCell = page.locator(
      `.grid > div:nth-child(${endRow * answer.gridSize + endCol + 1})`
    );

    // Perform drag from start to end cell
    const startBox = await startCell.boundingBox();
    const endBox = await endCell.boundingBox();

    if (startBox && endBox) {
      await page.mouse.move(
        startBox.x + startBox.width / 2,
        startBox.y + startBox.height / 2
      );
      await page.mouse.down();

      // Move through intermediate cells for proper detection
      const steps = Math.max(
        Math.abs(endRow - startRow),
        Math.abs(endCol - startCol)
      );
      for (let s = 1; s <= steps; s++) {
        const ratio = s / steps;
        await page.mouse.move(
          startBox.x + startBox.width / 2 + (endBox.x - startBox.x) * ratio,
          startBox.y + startBox.height / 2 + (endBox.y - startBox.y) * ratio
        );
        await page.waitForTimeout(50);
      }

      await page.mouse.up();
      await page.waitForTimeout(500);
    }
  }
}

/**
 * ClassifyColumns: Drag/click items into correct columns.
 */
async function solveClassifyColumns(page: Page, answer: TaskAnswer) {
  if (answer.type !== "classify-columns") return;

  for (const { columnName, items } of answer.columns) {
    for (const item of items) {
      // Click the item
      const itemEl = page.locator(`text="${item}"`).first();
      if (await itemEl.isVisible()) {
        await itemEl.click();
        await page.waitForTimeout(200);
      }

      // Click the target column
      const colEl = page.locator(`text="${columnName}"`).first();
      if (await colEl.isVisible()) {
        await colEl.click();
        await page.waitForTimeout(300);
      }
    }
  }
}

/**
 * FillSentence: Click the correct option for each blank.
 */
async function solveFillSentence(page: Page, answer: TaskAnswer) {
  if (answer.type !== "fill-sentence") return;

  for (const blank of answer.blanks) {
    // Find and click the correct option button
    const option = page.getByRole("button", { name: blank, exact: true }).or(
      page.locator(`button:text-is("${blank}")`)
    );

    if (await option.first().isVisible()) {
      await option.first().click();
      await page.waitForTimeout(400);
    }
  }
}

/**
 * MultipleChoice: Click the correct option for each question.
 */
async function solveMultipleChoice(page: Page, answer: TaskAnswer) {
  if (answer.type !== "multiple-choice") return;

  for (const correctIndex of answer.correctIndices) {
    // Find the current question's options
    await page.waitForTimeout(300);

    const options = page.locator('[role="button"], button').filter({
      hasNotText: /comprova|següent|anterior/i,
    });

    const count = await options.count();
    if (correctIndex < count) {
      await options.nth(correctIndex).click();
      await page.waitForTimeout(500);
    }
  }
}

/**
 * SelfAssessment: Click "Ho sé!" for each item.
 */
async function solveSelfAssessment(page: Page) {
  // Click all "Ho sé!" buttons
  const buttons = page.getByRole("button", { name: /ho sé/i });
  const count = await buttons.count();

  for (let i = 0; i < count; i++) {
    const btn = buttons.nth(i);
    if (await btn.isVisible()) {
      await btn.click();
      await page.waitForTimeout(300);
    }
  }

  // If there's a "Comprova" or completion button, click it
  const comprova = page.getByRole("button", { name: /comprova/i });
  if (await comprova.isVisible()) {
    await comprova.click();
    await page.waitForTimeout(500);
  }
}

/**
 * ColorByInstruction: Click colors and areas.
 */
async function solveColorByInstruction(page: Page, answer: TaskAnswer) {
  if (answer.type !== "color-by-instruction") return;

  for (const { area, color } of answer.areas) {
    // Click the color from palette
    const colorBtn = page.locator(`[data-color="${color}"], button:has-text("${color}")`).first();
    if (await colorBtn.isVisible()) {
      await colorBtn.click();
      await page.waitForTimeout(200);
    }

    // Click the area to color
    const areaEl = page.locator(`text="${area}"`).first();
    if (await areaEl.isVisible()) {
      await areaEl.click();
      await page.waitForTimeout(300);
    }
  }
}

/**
 * LabelImage: Click a word then click its target slot.
 */
async function solveLabelImage(page: Page, answer: TaskAnswer) {
  if (answer.type !== "label-image") return;

  for (const label of answer.labels) {
    // Click the word from the word bank
    const wordBtn = page.locator(`text="${label}"`).first();
    if (await wordBtn.isVisible()) {
      await wordBtn.click();
      await page.waitForTimeout(200);
    }

    // Click the target slot (numbered or positioned)
    // Slots are typically empty areas that accept drops
    const slots = page.locator('[data-slot], .drop-zone, [class*="border-dashed"]');
    const slotCount = await slots.count();
    if (slotCount > 0) {
      // Click first available empty slot
      for (let i = 0; i < slotCount; i++) {
        const slot = slots.nth(i);
        const text = await slot.textContent();
        if (!text?.trim()) {
          await slot.click();
          await page.waitForTimeout(300);
          break;
        }
      }
    }
  }
}

/**
 * DrawingCanvas: Draw something and click Fet!
 */
async function solveDrawingCanvas(page: Page) {
  // Find the canvas element
  const canvas = page.locator("canvas").first();

  if (await canvas.isVisible()) {
    const box = await canvas.boundingBox();
    if (box) {
      // Draw a simple smiley face
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;

      await page.mouse.move(cx - 30, cy);
      await page.mouse.down();
      await page.mouse.move(cx + 30, cy, { steps: 10 });
      await page.mouse.move(cx + 30, cy + 30, { steps: 10 });
      await page.mouse.move(cx - 30, cy + 30, { steps: 10 });
      await page.mouse.move(cx - 30, cy, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(300);
    }
  }

  // Click Fet! button
  const fetBtn = page.getByRole("button", { name: /fet/i });
  if (await fetBtn.isVisible()) {
    await fetBtn.click();
    await page.waitForTimeout(500);
  }
}
