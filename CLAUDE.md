# CLAUDE.md - Katalonski Project Context

## OBAVEZNO PRAVILO #1 - SVESKA JE IZVOR ISTINE (HIGHEST PRIORITY)
**Fizicka radna sveska (folder `Svi zadaci/`) je JEDINI izvor istine za sadrzaj aplikacije.** Sve reci, recenice, zadaci i ilustracije MORAJU da se poklapaju sa sveskom. NE SME da fali nijedna rec, recenica ni ilustracija iz sveske.
- **Pre bilo kakvog rada na sadrzaju:** Uporedi podatke u `src/data/` sa odgovarajucim slikama iz `Svi zadaci/`
- **Prioritet ilustracija:** PRVO se rade SVE ilustracije za reci koje se pojavljuju u svesci. TEK NAKON toga se rade ilustracije za dodatne reci iz zadataka koji nisu u svesci.
- **Ako se rec pojavljuje u svesci ali NE u kodu:** Dodaj je u odgovarajuci data fajl
- **Ako se rec pojavljuje u kodu ali NE u svesci:** Proveri sa korisnikom pre brisanja (mozda je namerno dodata)
- **Svaka nova sesija:** Uvek proveri poklapanje sveska <-> kod pre nastavka rada

## OBAVEZNO PRAVILO #2 - AZURIRANJE DOKUMENTACIJE
**Posle svakog zavrsenog zadatka, taska, kartice ili bilo kog koraka razvoja - OBAVEZNO azuriraj ovaj CLAUDE.md fajl (sekciju "Current Status") i ROADMAP.md checkboxove.** Ovo je kriticno da sledeca sesija zna dokle smo stigli. Nikad ne zavrsavaj rad bez azuriranja dokumentacije.

## Project Overview
Interactive Catalan language learning web app for children (ages 5-8). Engine-based architecture renders 18 task types across 12 themes from TypeScript data files. Star mascot provides encouragement in Catalan. Total: ~270 tasks.

## Tech Stack
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS 4 (no shadcn/ui installed despite docs mentioning it)
- **Animations:** Framer Motion
- **Effects:** canvas-confetti
- **Icons:** lucide-react
- **Auth:** Basic HTTP auth via Next.js middleware
- **State:** localStorage for progress persistence
- **Data:** Static TypeScript files in `src/data/`

## Project Structure
```
src/
├── app/
│   ├── layout.tsx              # Root layout (Nunito font, purple palette)
│   ├── page.tsx                # Home - 12 theme cards grid
│   ├── globals.css
│   └── tema/[slug]/page.tsx    # Lesson flow for a theme
├── components/
│   ├── ui/
│   │   ├── ThemeCard.tsx       # Theme card with progress
│   │   └── StarMascot.tsx      # Star mascot with speech bubble
│   └── tasks/                  # 12 task type components
│       ├── TaskRenderer.tsx    # Switch component for task types
│       ├── CopyWord.tsx
│       ├── FillLetters.tsx
│       ├── Unscramble.tsx
│       ├── Matching.tsx
│       ├── ClassifyColumns.tsx
│       ├── WordSearch.tsx
│       ├── FillSentence.tsx
│       ├── MultipleChoice.tsx
│       ├── SelfAssessment.tsx
│       ├── ColorByInstruction.tsx
│       ├── LabelImage.tsx
│       ├── DrawingCanvas.tsx
│       ├── AddArticle.tsx
│       ├── SeparateWords.tsx
│       ├── CountAndWrite.tsx
│       ├── WriteAntonym.tsx
│       ├── OrderWords.tsx
│       └── DecodeGrid.tsx
├── data/                       # Theme data (12 .ts files + themes.ts + task-data.ts)
│   ├── themes.ts               # All themes metadata
│   ├── task-data.ts            # Aggregator: imports all themes, exports getTaskCount()
│   ├── la-classe.ts            # Theme 1: Classroom (20 tasks)
│   ├── l-escola.ts             # Theme 2: School (20 tasks)
│   ├── el-cos.ts               # Theme 3: Body (20 tasks)
│   ├── la-roba.ts              # Theme 4: Clothing (19 tasks)
│   ├── la-casa.ts              # Theme 5: House (28 tasks)
│   ├── la-familia.ts           # Theme 6: Family (14 tasks)
│   ├── les-botigues.ts         # Theme 7: Shops (21 tasks)
│   ├── el-menjar.ts            # Theme 8: Food (27 tasks)
│   ├── els-animals.ts          # Theme 9: Animals (27 tasks)
│   ├── la-ciutat.ts            # Theme 10: City (15 tasks)
│   ├── els-vehicles.ts         # Theme 11: Vehicles (15 tasks)
│   └── els-oficis.ts           # Theme 12: Professions (15 tasks)
├── lib/
│   ├── progress.ts             # localStorage progress utilities
│   └── encouragement.ts        # Catalan encouragement phrases
├── types/
│   └── tasks.ts                # TypeScript types for all task types
└── middleware.ts                # Basic HTTP auth

public/
├── star-mascot.png             # Star mascot image
└── (default Next.js SVGs)
```

## Key Architecture Decisions
- **Engine pattern:** TaskRenderer switches on `task.type` to render the correct component
- **Data as TypeScript:** Theme data lives in `.ts` files (not JSON), each exporting a tasks array with variable length
- **18 task types implemented:** copy-word, fill-letters, unscramble, matching, word-search, classify-columns, fill-sentence, multiple-choice, self-assessment, color-by-instruction, label-image, drawing-canvas, add-article, separate-words, count-and-write, write-antonym, order-words, decode-grid
- **Dynamic task counts:** Each theme has a different number of tasks (14-21). `getTaskCount()` from `task-data.ts` returns the actual array length.
- **No shadcn/ui:** Project uses custom components with Tailwind only
- **Hint system:** `useHintSystem` hook + `HintDialog` component provide progressive hints for all task types
- **Badges system:** 19 badges (12 theme completion + 3 streak + 3 star count + 1 master)

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npm test         # Run all Playwright E2E tests
npm run test:smoke  # Quick smoke test (home page + theme nav)
npm run test:theme -- la-classe  # Run tests for one theme
npm run test:ui  # Playwright UI mode
```

## Current Status

### Completed
- Next.js 16 project setup with TypeScript + Tailwind + Framer Motion
- Home page with 12 theme cards showing dynamic progress
- Task engine with 12 task type components (all implemented)
- 209 tasks total across 12 themes (variable per theme: 14-23)
- Themes 1-9 rewritten to match physical workbook exercises (exact order, words, structure)
- Themes 10-12 expanded from 9 to 15 tasks each (no workbook source)
- Star mascot with speech bubble feedback
- Animated SVG star mascot (expressions, animations, reactions)
- Catalan encouragement phrase system (correct/wrong/streak)
- Confetti celebrations on task completion
- Celebration screen at end of theme
- Streak/combo tracking
- Basic HTTP auth middleware (default: catala/catala2025)
- localStorage progress persistence
- Theme cards show theme number (1-12)
- Badge/trophy system (19 badges)
- PWA support (offline, install prompt)
- Settings page + Hamburger menu
- Hint system for all task types
- StarCounter shows dynamic total (0/209)
- ILLUSTRATION-PROMPTS.md with ~281 AI image generation prompts
- LabelImage: row-flexible checking (same-row labels interchangeable, e.g. family tree)
- Drag-and-drop for LabelImage, ClassifyColumns, Matching (pointer events for mouse+touch)
- All 209 tasks data-validated (no structural errors, all required fields present)
- Test/ folder with TESTING-GUIDE.md and BUG-REPORT.md for automated and manual testing
- Data quality fixes: answer bias removed from multiple-choice (la-classe-19) and 6 fill-sentence tasks
- Word-search grids regenerated with varied directions (5 grids: la-roba-5, la-familia-5, les-botigues-5, la-casa-2, els-vehicles-5)
- Multi-color WordSearch highlighting (8 colors, each word gets unique color in grid and word list)
- Playwright E2E test infrastructure: config, page objects, 12 task solvers, 209 answer keys, 12 theme specs + smoke test
- **Deploy pipeline:** Multi-stage Dockerfile + standalone Next.js output, deployed via Coolify on Hetzner server (88.198.218.69)
- **Live at:** `catala.orbitacode.com` (Coolify Dockerfile build pack, auto-deploy from GitHub main branch)

### In Progress
- **3D Illustrations:** ~160/~280 done via ChatGPT custom GPT + Bing Image Creator.
  - **COMPLETE themes:** La classe, L'escola, El cos, La roba, La casa, La família, Les botigues, El menjar
  - **Current theme:** Els animals - vec imamo 13 ilustracija (conill, elefant, gat, girafa, gos, lleo, ocell, porc, salmo, serp, tigre, tonyina, tortuga), fali jos ~37
  - **Remaining after:** La ciutat, Els vehicles, Els oficis
  - Full workbook mapping: see `Ilustracije/WORKBOOK-VS-ILLUSTRATIONS.md`

### Illustrations made with Bing Image Creator (may need redo with ChatGPT later for consistency)
- xandall, americana, corbata, banyador, banyador-de-dona, biquini, sandalies, arracades, anell, ulleres, collaret, cinturo, caputxa, pantalons-curts, samarreta-de-tirants

### NEXT SESSION TODO (Priority Order)
1. **Continue Els animals ilustracije via Bing Image Creator** (https://www.bing.com/images/create?FORM=IRPGEN, model: GPT-4o)
   - **Sledeca rec: pollet (pile)** - gallina i gall vec zavrseni
   - **Bing prompt format za zivotinje:** `A realistic [ANIMAL] with [OPIS]. Soft, gentle colors. 3D cartoon style render with accurate proportions. Pure white (#FFFFFF) background with small subtle pastel-colored decorative hearts, circles, dots, and five-pointed stars. 512x512px, cheerful, for children ages 5-8. Output format: PNG.`
   - **VAZNO:** Za zivotinje koristiti realisticniji opis (ne kawaii/chibi stil), ali ZADRZATI nasu dekoraciju (srca, zvezdice, krugovi). Dekoracija MORA biti SUPTILNA i u PASTELNIM bojama, ne jarkim. Zivotinje trebaju imati meke/blage boje.
   - **VAZNO:** Kad Bing generise 4 slike, UVEK prvo pitaj korisnika koju da sacuva pre cuvanja!
   - **VAZNO:** U promptu OBAVEZNO naglasiti "pure white background" ili "clean white #FFFFFF background" - Bing ima tendenciju da pravi krem/bezh pozadinu umesto bele! Proveriti na screenshotu da li je pozadina zaista bela.
   - **VAZNO:** Bing cuva kao JPEG - preimenovati u .png i kopirati u oba foldera (Ilustracije/ i public/illustrations/)
   - **Fale od zivotinja:** gallina, gall, pollet, oreneta, gavina, pingui, estruc, mussol, gorila/mico, zebra, cavall, vaca, camell, rinoceront, ovella, hipopotam, mosca, formiga, abella, escarabat, papallona, mosquit, tauro, peix-espasa, bacalla, cocodril, camaleo, dofi, balena, pop, medusa, os
2. **When ChatGPT resets** - switch back to ChatGPT custom GPT (URL u sekciji Illustration Workflow) for better quality/consistency

### Illustration Workflow
- **ChatGPT chat:** Custom GPT "Igrice katalonski jezik" → chat "AI ilustracije za decu"
  - URL: `https://chatgpt.com/g/g-p-697a9ef9e7fc8191a6f01584dad8ea4d-igrice-katalonski-jezik/c/697a9f6b-f218-8332-a5d0-89b7ed59ec5b`
  - Account: Jovana Jovic (Plus plan) - login via Apple Sign In
- **Save to:** `Ilustracije/` folder, filename = catalan word (e.g. `llapis.png`)
- **Convert:** to WebP for small file size later
- **Covers:** Already done by Jovana, saved in `public/covers/`
- **Deduplication:** 277 unique words total. Many repeat across themes - only ONE illustration per unique word.
- **Integration:** Replace emoji usage in `src/lib/illustrations.ts` `getWordEmoji()` function with actual image paths
- **Total words:** 277 unique (see `Ilustracije/WORD-LIST.md` for full list)

### OBAVEZNO PRAVILO - Bing Image Creator Model
**Na Bing Image Creator OBAVEZNO koristiti GPT-4o model (NE DALL-E 3, NE MAI-Image-1).** GPT-4o ima "Consistent characters & styling" sto je bolje za konzistentnost ilustracija. Pre svake sesije generisanja, PROVERITI da je GPT-4o selektovan u Model dropdown-u. GPT-4o generise 1 sliku po promptu (ne 4 kao DALL-E 3).

### Illustration Design Rules (CRITICAL - follow for EVERY illustration)
1. **NO anthropomorphization:** Objects must NEVER have eyes, mouths, faces, or any human characteristics. A pencil is just a pencil, a book is just a book. NO kawaii faces, NO cartoon eyes on objects.
2. **Single subject + cheerful background:** Each illustration shows ONLY the requested object/word as the main subject. NO other real objects/items around it (e.g. no sharpener next to a pencil). However, abstract decorative elements ARE encouraged: hearts, dots, confetti, sparkles, stars in the background to make it cheerful and kid-friendly. The key distinction: no other OBJECTS that could confuse kids, but decorative/abstract elements are welcome.
3. **Why:** This is for children ages 5-8 learning vocabulary. The illustration must be CLEAR and UNAMBIGUOUS - kids should instantly recognize what the object is. Decorative backgrounds keep it fun without causing confusion.
4. **Style:** 3D cartoon style, colorful, cheerful, realistic proportions (not anthropomorphized)
5. **Format:** 512x512px, white/transparent background, PNG
6. **Consistency:** Use the SAME prompt structure for every word to maintain visual consistency across all 277 illustrations
7. **People/animals exception:** People (pare, mare, nen, nena, avi, àvia) and animals (gos, gat, peix) naturally have faces - that's fine. The "no face" rule is ONLY for inanimate objects.
8. **Color rules:** Use UNISEX colors (green, blue, yellow, orange, red) for ALL items EXCEPT specifically female clothing (skirt/faldilla, dress/vestit, beret/barret) which can be pink/purple. Mix boys and girls in people illustrations.
9. **ChatGPT prompt (MUST include full style every time):** The ChatGPT chat FORGETS style rules over time. NEVER send just the word alone. ALWAYS include the full prompt with every single word:
   ```
   [WORD] - 3D cartoon style illustration, white background with small decorative hearts and stars, 512x512px, PNG, colorful and cheerful, for children ages 5-8. No face or eyes on the object.
   ```
   For people/animals (who naturally have faces), omit the "No face" part. Only add extra description if the word is ambiguous.

### Illustration Automation Rules (CRITICAL - follow ALWAYS)
1. **Auto-reconnect:** When Playwright MCP disconnects or browser crashes, automatically reconnect and resume work WITHOUT asking user for permission. Navigate back to the ChatGPT conversation URL and continue from where you left off.
2. **Rate limit handling:** When ChatGPT says to wait N minutes, STOP COMPLETELY. Do NOT send ANY prompts until the FULL stated time has passed + 1 minute buffer. Each message sent during rate limit RESETS the timer and makes it longer. Rate limit is ACCOUNT-WIDE (new chats don't help).
   - **CRITICAL TIMING RULE:** Note the EXACT current time when the rate limit message appears. Calculate the exact time to resend = current time + N minutes + 1 minute. When that time arrives, IMMEDIATELY resend the SAME prompt that was rate-limited. Do NOT wait longer than necessary - send it as soon as the calculated time passes. Example: if at 4:15 ChatGPT says "wait 22 minutes", calculate 4:15 + 23 = 4:38, and send the prompt at exactly 4:38.
3. **One word at a time:** NEVER send a new word until ChatGPT has fully responded to the previous one (either with an image or a rate limit message).
4. **NO duplicate prompts:** NEVER send the same word/prompt to ChatGPT more than once. If ChatGPT already generated an image for a word, do NOT re-request it unless the user explicitly says to redo it.
5. **Check existing illustrations FIRST:** Before generating ANY illustration, ALWAYS check if the file already exists in `public/illustrations/`. Never generate duplicates of existing files.
6. **Wait for user command:** Do NOT send prompts to ChatGPT autonomously during rate limits or without user's explicit go-ahead. When rate limited, inform the user and WAIT for their command to continue.
4. **Verify every illustration:** After each image is generated, take a screenshot and verify the image matches what was requested. Common ChatGPT mistakes to check for:
   - barret (beret) → might generate a regular cap instead of a French-style beret
   - abric (coat) → might generate a puffy jacket instead of a proper children's coat (longer, button-up)
   - gorra (baseball cap) → might generate a beanie/winter hat
   - Any clothing item → might generate the wrong type of clothing
   If the image is wrong, do NOT save it. Send a clarifying prompt and regenerate.
   - **BLURRINESS CHECK (CRITICAL):** After EVERY generated image, take a screenshot and carefully inspect whether the bottom half of the image is blurry, smudged, or low-resolution compared to the top half. Bing Image Creator is known to produce images where the lower portion is degraded. If the bottom half is blurry/smudged, do NOT save it - regenerate immediately. This check can be done per-image or batched per-theme, but MUST be done before committing.
5. **Pipeline workflow:** Send next word IMMEDIATELY after confirming current image is correct, then save/copy/register the previous one while the next generates. This saves time.
6. **Save workflow per word:**
   - Copy from temp path to both `Ilustracije/[word].png` and `public/illustrations/[word].png`
   - Add word to `wordsWithIllustrations` set in `src/lib/illustrations.ts`
   - Strip accents for filename (e.g. "gimnàs" → "gimnas")
   - **COMPRESS all images** after saving: use `sips` to resize to 512x512 and ensure consistent file size. Target: ~50-150KB per image. Some ChatGPT images are 1.5MB while Bing ones are 100KB - compress all to consistent size. Command: `sips -z 512 512 [file] -s format png --out [file]`
7. **Download method:** Click image → modal opens → find Save button by iterating all buttons → click Save → capture download event → get temp path from download.path()

### Illustration Variants (same word, different meanings)
| Word | File | Description | Theme Usage |
|------|------|-------------|-------------|
| xemeneia | xemeneia.png | Dimnjak (chimney) - chimney on a colorful tiled rooftop with smoke, 3D cartoon style | La casa (chimney meaning) |
| xemeneia | xemeneia2.png | Kamin (fireplace) - cozy stone fireplace with fire burning, flower vase and books on mantel, wood basket, pastel rug | La casa (fireplace meaning) |
| menjador | menjador.png | Školska trpezarija (school dining room) - school cafeteria with tables and chairs | L'escola (school context) |
| menjador | menjador-casa.png | Kućna trpezarija (home dining room) - home dining room with family table | La casa (home context) |

### Recently Completed
- **Full testing of ALL 209 tasks** via Playwright browser automation across all 12 themes
- **Progress persistence bug fixed** (`src/lib/progress.ts` + `TemaContent.tsx`): `completeTask()` now receives the actual next task index instead of blindly incrementing `currentTask` from localStorage. This fixes the issue where navigating with "Següent" caused `currentTask` in localStorage to diverge from the actual UI position, resulting in tasks not being saved as complete.
- All 12 themes verified complete: 209/209 stars, 19/19 badges
- Auto-speak (TTS) on correct answers for ALL 12 task types
- Speaker buttons on CopyWord, LabelImage, SelfAssessment, Unscramble
- 4 data/code bugs fixed (word search grid, hint length, classify-columns, SVG path)
- Test/ folder with comprehensive TESTING-GUIDE.md and BUG-REPORT.md
- All 209 tasks data-validated

### Not Yet Implemented
- 3D illustrations for vocabulary words (word list prepared, emojis to be replaced)

## Task Counts Per Theme
| Theme | Slug | Tasks |
|-------|------|-------|
| 1. La classe | la-classe | 20 |
| 2. L'escola | l-escola | 20 |
| 3. El cos | el-cos | 20 |
| 4. La roba | la-roba | 19 |
| 5. La casa | la-casa | 28 |
| 6. La família | la-familia | 14 |
| 7. Les botigues | les-botigues | 21 |
| 8. El menjar | el-menjar | 27 |
| 9. Els animals | els-animals | 27 |
| 10. La ciutat | la-ciutat | 15 |
| 11. Els vehicles | els-vehicles | 15 |
| 12. Els oficis | els-oficis | 15 |
| **Total** | | **~241** |

## Important Notes
- Theme slugs match filenames: `la-classe`, `l-escola`, `el-cos`, etc.
- Each theme has a variable number of tasks (14-21), derived from data array length
- Progress is per-theme in localStorage
- **Mascot is Star.png** (star character) - elephant.png and Bubble.png in root are rejected alternatives, NOT used
- `Svi zadaci/` folder contains 37+ JPG photos of the physical workbook (source material for tasks)
- `star-mascot.png` in `public/` is the mascot asset used in the app
- `ILLUSTRATION-PROMPTS.md` contains prompts for generating vocabulary illustrations
- Design uses Nunito font with purple primary palette
- Mobile-first responsive design
- Basic auth middleware: default credentials catala/catala2025 (override via BASIC_AUTH_USER/BASIC_AUTH_PASS env vars)
- Cover images are in `public/covers/` (one per theme)
- **Deployment:** Coolify at `panel.orbitacode.com`, Build Pack: Dockerfile, GitHub repo: `Orbita-Code/catala`
- **Server:** Hetzner 88.198.218.69, ~3.7GB RAM + 2GB swap (added manually), 38GB disk. `NODE_OPTIONS=--max-old-space-size=1536` in Dockerfile to prevent OOM during build
