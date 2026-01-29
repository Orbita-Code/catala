# CLAUDE.md - Katalonski Project Context

## OBAVEZNO PRAVILO
**Posle svakog zavrsenog zadatka, taska, kartice ili bilo kog koraka razvoja - OBAVEZNO azuriraj ovaj CLAUDE.md fajl (sekciju "Current Status") i ROADMAP.md checkboxove.** Ovo je kriticno da sledeca sesija zna dokle smo stigli. Nikad ne zavrsavaj rad bez azuriranja dokumentacije.

## Project Overview
Interactive Catalan language learning web app for children (ages 5-8). Engine-based architecture renders 9 task types across 12 themes from JSON data. Star mascot provides encouragement in Catalan.

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
│   └── tasks/                  # 9 task type components
│       ├── TaskRenderer.tsx    # Switch component for task types
│       ├── CopyWord.tsx
│       ├── FillLetters.tsx
│       ├── Unscramble.tsx
│       ├── Matching.tsx
│       ├── ClassifyColumns.tsx
│       ├── WordSearch.tsx
│       ├── FillSentence.tsx
│       ├── MultipleChoice.tsx
│       └── SelfAssessment.tsx
├── data/                       # Theme data (12 .ts files + themes.ts index)
│   ├── themes.ts               # All themes metadata
│   ├── la-classe.ts            # Theme 1: Classroom
│   ├── l-escola.ts             # Theme 2: School
│   ├── el-cos.ts               # Theme 3: Body
│   ├── la-roba.ts              # Theme 4: Clothing
│   ├── la-casa.ts              # Theme 5: House
│   ├── la-familia.ts           # Theme 6: Family
│   ├── les-botigues.ts         # Theme 7: Shops
│   ├── el-menjar.ts            # Theme 8: Food
│   ├── els-animals.ts          # Theme 9: Animals
│   ├── la-ciutat.ts            # Theme 10: City
│   ├── els-vehicles.ts         # Theme 11: Vehicles
│   └── els-oficis.ts           # Theme 12: Professions
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
- **Data as TypeScript:** Theme data lives in `.ts` files (not JSON), each exporting a theme object with 9 tasks
- **9 task types implemented:** copy-word, fill-letters, unscramble, matching, word-search, classify-columns, fill-sentence, multiple-choice, self-assessment
- **3 task types from spec NOT implemented:** ColorByInstruction, LabelImage, DrawingCanvas
- **No shadcn/ui:** Despite docs, project uses custom components with Tailwind only
- **No hooks directory:** Progress logic is in `src/lib/progress.ts`, no custom hooks extracted

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Current Status (as of commit 534ad99)

### Completed
- Next.js 16 project setup with TypeScript + Tailwind + Framer Motion
- Home page with 12 theme cards showing progress
- Task engine with 9 task type components
- All 12 themes with 9 tasks each (108 tasks total)
- Star mascot with speech bubble feedback
- Catalan encouragement phrase system (correct/wrong/streak)
- Confetti celebrations on task completion
- Celebration screen at end of theme
- Streak/combo tracking
- Basic HTTP auth middleware
- localStorage progress persistence
- Theme cards show theme number (1-12)

### Not Yet Implemented
- Audio system (Web Audio API for sound effects)
- Text-to-Speech (Web Speech API with ca-ES locale)
- PWA support (offline, install prompt)
- Badge/trophy system
- ColorByInstruction, LabelImage, DrawingCanvas task types
- Settings page
- Hamburger menu
- Deploy pipeline (Coolify + Docker)
- DNS setup (katalonski.orbitacode.com)

## Important Notes
- Theme slugs match filenames: `la-classe`, `l-escola`, `el-cos`, etc.
- Each theme has exactly 9 tasks in fixed order by type
- Progress is per-theme in localStorage
- **Mascot is Star.png** (star character) - elephant.png and Bubble.png in root are rejected alternatives, NOT used
- `Svi zadaci/` folder contains 37 JPG photos of the physical workbook (source material for tasks)
- `star-mascot.png` in `public/` is the mascot asset used in the app
- Design uses Nunito font with purple primary palette
- Mobile-first responsive design
- Basic auth middleware requires env vars - will block access without credentials
