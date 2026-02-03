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

## OBAVEZNO PRAVILO #3 - TESTIRANJE ZADATAKA (TASK TESTING)
**Kada testiras aplikaciju kroz Playwright MCP browser, koristi sledece principe za svaki tip zadatka:**

### Principi rada zadataka:
1. **copy-word:** Slova su POMIJESANA u button-ima ispod. Klikni slova u TACNOM redosledu da napises rec. Npr. za "llapis" klikni L→L→A→P→I→S.
2. **fill-letters:** Blanks u reci treba popuniti. Klikom na blank aktiviras ga, zatim klikom na ponudjena slova popunjavas.
3. **classify-columns:** Prevuci (drag) ili klikni na krug kolone da klasifikujes rec. Oba nacina rade.
4. **matching:** Klikni na sliku, zatim na odgovarajucu rec. Ili obrnuto.
5. **word-search:** Klikni na prvo slovo, zatim na poslednje slovo reci u gridu.
6. **fill-sentence:** Klikni na ponudjenu rec da popunis blank u recenici.
7. **multiple-choice:** Klikni na tacan odgovor.
8. **add-article:** Klikni na tacan clan (el/la/un/una/l'/els/les).
9. **unscramble:** Klikni na slogove u tacnom redosledu.
10. **self-assessment:** Klikni na emoji za samoprocenu (ne testira se tacnost).
11. **color-by-instruction:** Klikni na boju, zatim na objekat koji treba obojiti.
12. **label-image:** Prevuci etikete na odgovarajuce pozicije na slici.
13. **separate-words:** Klikni na mesta gde treba razdvojiti spojene reci.
14. **count-and-write:** Unesi broj u input polje.
15. **write-antonym:** Unesi antonim u input polje.
16. **order-words:** Prevuci ili klikni na reci u tacnom redosledu.
17. **decode-grid:** Koristi tabelu kodova da dekodujes poruku.
18. **drawing-canvas:** Crtaj na canvas-u (slobodna aktivnost, nema tacnog odgovora).

### Navigacija izmedju zadataka:
- **"Següent" button:** Prelazi na SLEDECI zadatak u temi (ne na sledecu rec unutar istog zadatka!)
- **"Anterior" button:** Vraca na prethodni zadatak.
- **Unutar copy-word/fill-letters:** Kada popunis sve reci, zadatak se automatski zavrsava i "Següent" vodi na sledeci task.
- **"Comprova!" button:** Proverava odgovor unutar zadatka.

### Vazne napomene za testiranje:
- NE koristi "Següent" da predjes na sledecu rec - to te vodi na DRUGI zadatak!
- Za copy-word, moras ispravno uneti sve reci da bi prosao zadatak.
- Ilustracije se prikazuju iznad reci ako postoje u `wordsWithIllustrations` Set-u.
- Ako ilustracija fali, prazno mesto se prikazuje (NE emoji - `getWordEmoji()` je dead code).

## Project Overview
Interactive Catalan language learning web app for children (ages 5-8). Engine-based architecture renders 18 task types across 12 themes from TypeScript data files. Star mascot provides encouragement in Catalan. Total: ~226 tasks.

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
│   ├── les-botigues.ts         # Theme 7: Shops (20 tasks)
│   ├── el-menjar.ts            # Theme 8: Food (21 tasks)
│   ├── els-animals.ts          # Theme 9: Animals (21 tasks)
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
- **Dynamic task counts:** Each theme has a different number of tasks (15-24). `getTaskCount()` from `task-data.ts` returns the actual array length.
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
- ~226 tasks total across 12 themes (variable per theme: 15-24)
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
- StarCounter shows dynamic total (0/226)
- ILLUSTRATION-PROMPTS.md with ~281 AI image generation prompts
- LabelImage: row-flexible checking (same-row labels interchangeable, e.g. family tree)
- Drag-and-drop for LabelImage, ClassifyColumns, Matching (pointer events for mouse+touch)
- All ~226 tasks data-validated (no structural errors, all required fields present)
- Test/ folder with TESTING-GUIDE.md and BUG-REPORT.md for automated and manual testing
- Data quality fixes: answer bias removed from multiple-choice (la-classe-19) and 6 fill-sentence tasks
- Word-search grids regenerated with varied directions (5 grids: la-roba-5, la-familia-5, les-botigues-5, la-casa-2, els-vehicles-5)
- Multi-color WordSearch highlighting (8 colors, each word gets unique color in grid and word list)
- Playwright E2E test infrastructure: config, page objects, 12 task solvers, answer keys, 12 theme specs + smoke test (answer keys may need update for themes 7-9 rewrite)
- **Deploy pipeline:** Multi-stage Dockerfile + standalone Next.js output, deployed via Coolify on Hetzner server (88.198.218.69)
- **Live at:** `catala.orbitacode.com` (Coolify Dockerfile build pack, auto-deploy from GitHub main branch)

### In Progress
- Nothing in progress

### Recently Completed (Feb 3, 2026)
- **Arracades illustration REDONE** - Replaced blurry Bing earrings with new ChatGPT-generated version (elegant drop earrings with blue gems)
- **WebP conversion COMPLETE** - Converted 434 illustrations from PNG (119MB) to WebP (7.5MB) - 94% size reduction
- **Playwright E2E answer keys updated** - Themes 7-9 (les-botigues, el-menjar, els-animals) updated to match rewritten data files
- **ALL 18 MISSING ILLUSTRATIONS GENERATED** - Les Botigues (7), El Menjar (7), Els Animals (3), Els Vehicles (1)
- **3D Illustrations:** ALL 12 themes COMPLETE via ChatGPT custom GPT + Bing Image Creator.
  - **ALL 12 themes COMPLETE** - La classe, L'escola, El cos, La roba, La casa, La família, Les botigues, El menjar, Els animals, La ciutat, Els vehicles, Els oficis
  - **camaleo (chameleon):** Generated on Bing with alternative prompt (described as "colorful green lizard with curly spiral tail" to bypass content filter)
  - Full workbook mapping: see `Ilustracije/WORKBOOK-VS-ILLUSTRATIONS.md`
- **Days of week illustrations (Bing Image Creator):** ALL 7 COMPLETE
  - All single-line: dilluns (pink heart), dimarts (blue circle), dimecres (yellow star), dijous (orange heart), divendres (purple circle), dissabte (green heart), diumenge (red star)

### Illustrations made with Bing Image Creator (may need redo with ChatGPT later for consistency)
- xandall, americana, corbata, banyador, banyador-de-dona, biquini, sandalies, anell, ulleres, collaret, cinturo, caputxa, pantalons-curts, samarreta-de-tirants

### NEXT SESSION TODO (Priority Order)
1. ✅ ~~Update Playwright answer keys for themes 7-9~~ - DONE (Feb 3, 2026)
2. ✅ ~~WebP conversion~~ - DONE (Feb 3, 2026) - 119MB → 7.5MB (94% reduction)
3. ✅ ~~Deploy~~ - DONE (Feb 3, 2026)
4. ✅ ~~Redo blurry arracades illustration~~ - DONE (Feb 3, 2026) - regenerated on ChatGPT
5. **Optional: Redo 14 Bing illustrations** for consistency with ChatGPT style

### Recently Generated Illustrations (Feb 3, 2026)
All 18 missing illustrations have been generated via ChatGPT custom GPT:
- **Les Botigues (7):** barra-de-pa, cansalada, coto, pa-rodo, salsitxa, venda, verduleria
- **El Menjar (7):** caramels, gelat, pa-de-pessic, pastis-de-xocolata, sal, sucre, truita-de-patates
- **Els Animals (3):** cigonya, llop, ratoli
- **Els Vehicles (1):** ambulancia

### Illustration Workflow
- **ChatGPT chat:** Custom GPT "Igrice katalonski jezik" → chat "AI ilustracije za decu"
  - URL: `https://chatgpt.com/g/g-p-697a9ef9e7fc8191a6f01584dad8ea4d-igrice-katalonski-jezik/c/697a9f6b-f218-8332-a5d0-89b7ed59ec5b`
  - Account: Jovana Jovic (Plus plan) - login via Apple Sign In
- **Save to:** `Ilustracije/` folder, filename = catalan word (e.g. `llapis.png`)
- **Convert:** Use `cwebp -q 80 file.png -o file.webp` to convert to WebP (94% smaller files)
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
5. **Format:** 512x512px, white/transparent background, WebP (converted from PNG for smaller file size)
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
5. **Check existing illustrations FIRST (CRITICAL - NO DUPLICATES):** Before generating ANY illustration, you MUST thoroughly check BOTH `public/illustrations/` AND `Ilustracije/` folders for:
   - The exact filename (e.g. `cireres.png`)
   - The singular form (e.g. `cirera.png` when looking for `cireres`)
   - The plural form (e.g. `botes.png` when looking for `bota`)
   - Variants without accents (e.g. `pressec.png` for `préssec`)
   - Variants with different spelling (e.g. `aigualera.png` for `aiguera`)
   - Use `ls Ilustracije/ | grep -i [root]` to search broadly
   - If ANY similar file exists, do NOT generate a new one. Instead, copy/rename the existing file or update the code reference.
   - **This is a hard rule:** Generating a duplicate illustration wastes ChatGPT quota and the user's time. ALWAYS verify before generating.
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
- **Workbook rewrite themes 7-9:** Les botigues (21→20), El menjar (27→21), Els animals (27→21) - all match workbook exactly
  - Les botigues: shops (fruiteria, verduleria, peixeteria, carnisseria, fleca, farmàcia), fruits(9), vegetables(7), fish(6), meat(6), bakery(6), pharmacy(6)
  - El menjar: tableware(9), breakfast(9), lunch(9), snack+dinner(8), hot/cold, sweet/salty, restaurant menu, masculine/feminine adjectives
  - Els animals: birds(9), insects(6), fish(6), reptiles(3), mammals(18), animal categories, body parts, actions
- **Workbook rewrite themes 1-6:** La classe, L'escola, El cos, La roba, La casa (24 tasks), La familia (16 tasks) - all match workbook exactly
- **La casa rewrite:** 28→24 tasks. Added classify-columns (articles), write-antonym, order-words, count-and-write. Rooms with 9 items each.
- **La familia rewrite:** 14→16 tasks. Added decode-grid, add-article, separate-words. Added pets/animals section (tasks 13-15).
- **363 illustrations** copied to public/illustrations/ from Ilustracije/ folder
- **Full testing of ALL tasks** via Playwright browser automation across all 12 themes (answer keys need update for themes 7-9 after rewrite)
- Auto-speak (TTS) on correct answers for ALL 12 task types
- Speaker buttons on CopyWord, LabelImage, SelfAssessment, Unscramble

### Not Yet Implemented
- 3D illustrations for vocabulary words (word list prepared, emojis to be replaced)

## Task Counts Per Theme
| Theme | Slug | Tasks |
|-------|------|-------|
| 1. La classe | la-classe | 20 |
| 2. L'escola | l-escola | 20 |
| 3. El cos | el-cos | 20 |
| 4. La roba | la-roba | 19 |
| 5. La casa | la-casa | 24 |
| 6. La família | la-familia | 16 |
| 7. Les botigues | les-botigues | 20 |
| 8. El menjar | el-menjar | 21 |
| 9. Els animals | els-animals | 21 |
| 10. La ciutat | la-ciutat | 15 |
| 11. Els vehicles | els-vehicles | 15 |
| 12. Els oficis | els-oficis | 15 |
| **Total** | | **~226** |

## Important Notes
- Theme slugs match filenames: `la-classe`, `l-escola`, `el-cos`, etc.
- Each theme has a variable number of tasks (15-24), derived from data array length
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
