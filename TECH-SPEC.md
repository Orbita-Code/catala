# Tehnicka Specifikacija

## Arhitektura

### Tech Stack
| Komponenta | Tehnologija |
|---|---|
| Framework | Next.js 15 (App Router) |
| Jezik | TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Animacije | Framer Motion |
| Efekti | Canvas Confetti / Lottie |
| Audio | Web Audio API |
| TTS | Web Speech API (ca-ES locale) |
| State | React Context + localStorage |
| Data | Static JSON files |
| Auth | Next.js Middleware (basic auth) |
| Deploy | GitHub → Coolify |
| Domain | katalonski.orbitacode.com |

## Struktura projekta

```
katalonski/
├── public/
│   ├── images/
│   │   ├── themes/          # Ikonice za teme
│   │   ├── tasks/           # Ilustracije za zadatke
│   │   │   ├── la-classe/
│   │   │   ├── l-escola/
│   │   │   └── ...
│   │   └── mascot/          # Maskota varijacije
│   ├── sounds/              # Zvucni efekti
│   │   ├── correct.mp3
│   │   ├── wrong.mp3
│   │   ├── combo.mp3
│   │   ├── complete.mp3
│   │   └── click.mp3
│   └── lottie/              # Lottie animacije (konfete, itd.)
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx         # Home - grid tema
│   │   └── tema/
│   │       └── [slug]/
│   │           └── page.tsx # Lesson flow za temu
│   ├── components/
│   │   ├── ui/              # shadcn/ui komponente
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── HamburgerMenu.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── NavigationButtons.tsx
│   │   ├── home/
│   │   │   ├── ThemeGrid.tsx
│   │   │   └── ThemeCard.tsx
│   │   ├── tasks/           # Task komponente (engine)
│   │   │   ├── TaskRenderer.tsx
│   │   │   ├── CopyWord.tsx
│   │   │   ├── FillLetters.tsx
│   │   │   ├── Unscramble.tsx
│   │   │   ├── Matching.tsx
│   │   │   ├── ClassifyColumns.tsx
│   │   │   ├── WordSearch.tsx
│   │   │   ├── ColorByInstruction.tsx
│   │   │   ├── FillSentence.tsx
│   │   │   ├── LabelImage.tsx
│   │   │   ├── MultipleChoice.tsx
│   │   │   ├── DrawingCanvas.tsx
│   │   │   └── SelfAssessment.tsx
│   │   ├── rewards/
│   │   │   ├── ConfettiEffect.tsx
│   │   │   ├── StreakCounter.tsx
│   │   │   ├── BadgeDisplay.tsx
│   │   │   └── CelebrationScreen.tsx
│   │   └── mascot/
│   │       ├── Mascot.tsx
│   │       └── MascotMessage.tsx
│   ├── content/             # JSON sadrzaj za svaku temu
│   │   ├── themes.json      # Lista svih tema
│   │   ├── la-classe.json
│   │   ├── l-escola.json
│   │   ├── el-cos.json
│   │   ├── la-roba.json
│   │   ├── la-casa.json
│   │   ├── la-familia.json
│   │   ├── les-botigues.json
│   │   ├── el-menjar.json
│   │   ├── els-animals.json
│   │   ├── la-ciutat.json
│   │   ├── els-vehicles.json
│   │   └── els-oficis.json
│   ├── hooks/
│   │   ├── useProgress.ts    # localStorage progress
│   │   ├── useAudio.ts       # Zvucni efekti
│   │   ├── useTTS.ts         # Text-to-Speech
│   │   ├── useStreak.ts      # Streak/combo sistem
│   │   └── useBadges.ts      # Badge/nagrada sistem
│   ├── lib/
│   │   ├── types.ts          # TypeScript tipovi
│   │   ├── constants.ts      # Konstante
│   │   └── utils.ts          # Utility funkcije
│   └── context/
│       ├── ProgressContext.tsx
│       ├── AudioContext.tsx
│       └── RewardsContext.tsx
├── middleware.ts              # Basic auth
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── Dockerfile                # Za Coolify deploy
```

## Routing

| Ruta | Opis |
|---|---|
| `/` | Home - Grid sa 12 tema |
| `/tema/[slug]` | Lesson flow za odredjenu temu |
| `/nagrade` | Kolekcija nagrada/bedjeva (later) |
| `/podesavanja` | Podesavanja zvuka, itd. (later) |

## Data Flow

### Task JSON Format
Svaka tema ima JSON fajl sa nizom zadataka. Svaki zadatak ima `type` polje koje odredjuje koju komponentu renderujemo.

```typescript
interface BaseTask {
  id: string;
  type: TaskType;
  prompt: string;        // Uputstvo za zadatak
  hint?: string;         // Opcioni hint
  points?: number;       // Bodovi (default: 1)
}

type TaskType =
  | 'copy-word'
  | 'fill-letters'
  | 'unscramble'
  | 'matching'
  | 'classify-columns'
  | 'word-search'
  | 'color-by-instruction'
  | 'fill-sentence'
  | 'label-image'
  | 'multiple-choice'
  | 'drawing-canvas'
  | 'self-assessment';
```

### TaskRenderer
```tsx
function TaskRenderer({ task, onComplete }: { task: Task; onComplete: (correct: boolean) => void }) {
  switch (task.type) {
    case 'copy-word': return <CopyWord task={task} onComplete={onComplete} />;
    case 'fill-letters': return <FillLetters task={task} onComplete={onComplete} />;
    // ... itd.
  }
}
```

### Progress Storage (localStorage)
```typescript
interface UserProgress {
  themes: {
    [themeSlug: string]: {
      currentTask: number;
      completedTasks: string[];
      score: number;
      completed: boolean;
    }
  };
  badges: string[];
  totalStars: number;
  streak: {
    current: number;
    best: number;
  };
  settings: {
    soundEnabled: boolean;
    ttsEnabled: boolean;
  };
}
```

## Authentication
Basic HTTP authentication preko Next.js middleware:
- Username i password se cuvaju u environment varijablama
- Middleware proverava `Authorization` header
- Korisnik unosi credentials samo jednom (browser cuva)

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (!auth) {
    return new NextResponse('Auth required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Katalonski"' }
    });
  }
  // Verify credentials...
}
```

## Audio System
- **Zvucni efekti:** Pre-loaded audio sprites (correct, wrong, combo, click, complete)
- **TTS:** Web Speech API sa `ca-ES` locale za izgovor katalonskih reci
- **Kontrole:** Global mute toggle u headeru, per-feature toggle u podesavanjima

## Responsive Design
- **Mobile first** (320px+)
- **Tablet optimized** (768px+) - primarni target
- **Desktop** (1024px+) - grid layout
- Touch-friendly: minimum tap target 44x44px
- Nema skrolovanja unutar zadatka - sve staje na jedan ekran

## Deploy (Coolify)
1. GitHub repo: `orbitacode/katalonski` (ili slicno)
2. Coolify project sa auto-deploy na push to main
3. Docker build (Next.js standalone output)
4. Domain: katalonski.orbitacode.com (Cloudflare DNS → Coolify)
5. ENV vars: `AUTH_USER`, `AUTH_PASSWORD`
