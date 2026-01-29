# CLAUDE.md - Katalonski Project Context

## OBAVEZNO PRAVILO
**Posle svakog zavrsenog zadatka, taska, kartice ili bilo kog koraka razvoja - OBAVEZNO azuriraj ovaj CLAUDE.md fajl (sekciju "Current Status") i ROADMAP.md checkboxove.** Ovo je kriticno da sledeca sesija zna dokle smo stigli. Nikad ne zavrsavaj rad bez azuriranja dokumentacije.

## Project Overview
Interactive Catalan language learning web app for children (ages 5-8). Engine-based architecture renders 12 task types across 12 themes from TypeScript data files. Star mascot provides encouragement in Catalan. Total: 202 tasks.

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
│       └── DrawingCanvas.tsx
├── data/                       # Theme data (12 .ts files + themes.ts + task-data.ts)
│   ├── themes.ts               # All themes metadata
│   ├── task-data.ts            # Aggregator: imports all themes, exports getTaskCount()
│   ├── la-classe.ts            # Theme 1: Classroom (17 tasks)
│   ├── l-escola.ts             # Theme 2: School (17 tasks)
│   ├── el-cos.ts               # Theme 3: Body (19 tasks)
│   ├── la-roba.ts              # Theme 4: Clothing (14 tasks)
│   ├── la-casa.ts              # Theme 5: House (20 tasks)
│   ├── la-familia.ts           # Theme 6: Family (14 tasks)
│   ├── les-botigues.ts         # Theme 7: Shops (15 tasks)
│   ├── el-menjar.ts            # Theme 8: Food (20 tasks)
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
- **12 task types implemented:** copy-word, fill-letters, unscramble, matching, word-search, classify-columns, fill-sentence, multiple-choice, self-assessment, color-by-instruction, label-image, drawing-canvas
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
```

## Current Status

### Completed
- Next.js 16 project setup with TypeScript + Tailwind + Framer Motion
- Home page with 12 theme cards showing dynamic progress
- Task engine with 12 task type components (all implemented)
- 202 tasks total across 12 themes (variable per theme: 14-21)
- Themes 1-9 expanded to match physical workbook exercises
- Themes 10-12 expanded from 9 to 15 tasks each (no workbook source)
- Star mascot with speech bubble feedback
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
- StarCounter shows dynamic total (0/202)
- ILLUSTRATION-PROMPTS.md with ~281 AI image generation prompts

### Not Yet Implemented
- AI-generated illustrations for vocabulary words (prompts ready, images not yet generated)
- Audio system (Web Audio API for sound effects)
- Text-to-Speech (Web Speech API with ca-ES locale)
- Deploy pipeline (Coolify + Docker)
- DNS setup (katalonski.orbitacode.com)
- Adjust themes 1-9 task counts to user's exact workbook numbers (minor differences remain)

## Task Counts Per Theme
| Theme | Slug | Tasks |
|-------|------|-------|
| 1. La classe | la-classe | 17 |
| 2. L'escola | l-escola | 17 |
| 3. El cos | el-cos | 19 |
| 4. La roba | la-roba | 14 |
| 5. La casa | la-casa | 20 |
| 6. La família | la-familia | 14 |
| 7. Les botigues | les-botigues | 15 |
| 8. El menjar | el-menjar | 20 |
| 9. Els animals | els-animals | 21 |
| 10. La ciutat | la-ciutat | 15 |
| 11. Els vehicles | els-vehicles | 15 |
| 12. Els oficis | els-oficis | 15 |
| **Total** | | **202** |

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
