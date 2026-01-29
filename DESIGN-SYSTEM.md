# Dizajn Sistem

## Vizuelni Identitet

### Stil: 3D Cartoon (Modern Kids App)
Inspiracija: Duolingo, Khan Academy Kids, Lingokids, Endless Alphabet

- **3D cartoon ilustracije** sa mekim senkama i zaobljenim oblicima
- **Vibrantne ali harmonicne boje** - ne prenatrpano
- **Konzistentan stil** svih ilustracija (isti autor/set)
- **Unisex dizajn** - privlacan i decacima i devojcicama

### Paleta boja

```
Primary:     #6C5CE7  (ljubicasta - glavna boja brenda)
Secondary:   #00CECE  (tirkizna - akcenti)
Accent:      #FDCB6E  (zlatna/zuta - nagrade, zvezdice)
Success:     #00B894  (zelena - tacno)
Error:       #FF6B6B  (crvena - netacno, blaga)
Background:  #F8F9FF  (svetlo lavanda)
Card BG:     #FFFFFF
Text:        #2D3436  (tamno siva)
Text Light:  #636E72  (svetlija siva)
```

### Tematske boje (svaka tema ima svoju boju)
```
La classe:     #6C5CE7  (ljubicasta)
L'escola:      #0984E3  (plava)
El cos:        #E17055  (koraljna)
La roba:       #E84393  (roze)
La casa:       #FDCB6E  (zuta)
La família:    #00B894  (zelena)
Les botigues:  #00CECE  (tirkizna)
El menjar:     #FF9F43  (narandzasta)
Els animals:   #A29BFE  (lavanda)
La ciutat:     #55A3F5  (nebo plava)
Els vehicles:  #FF6B6B  (crvena)
Els oficis:    #1DD1A1  (mint)
```

### Tipografija

**Headings:** `Nunito` ili `Baloo 2` - zaobljena, vesela, citljiva
**Body:** `Nunito` ili `Quicksand` - cista, moderna
**Sizes:**
- H1: 32px (home naslov)
- H2: 24px (tema naslov)
- H3: 20px (task prompt)
- Body: 18px (tekst zadataka - veci font za decu)
- Small: 14px (labels)

### Ikonice
- **Lucide React** za UI ikonice (hamburger, back, zvuk, itd.)
- **Custom SVG** za tematske ikonice na karticama

### Border Radius
- Kartice: 20px (zaobljene, soft)
- Dugmad: 16px
- Input polja: 12px
- Avatari/bedževi: potpuno okrugli

### Senke
```css
/* Card shadow */
box-shadow: 0 4px 20px rgba(108, 92, 231, 0.1);

/* Elevated card (hover) */
box-shadow: 0 8px 30px rgba(108, 92, 231, 0.2);

/* Button shadow */
box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
```

## Komponente UI

### ThemeCard (Home)
```
┌─────────────────────────┐
│                         │
│     [3D ILUSTRACIJA]    │  ← Animated (blagi bounce/float)
│                         │
│   ★★★★★☆☆☆ 5/12       │  ← Progress stars
│                         │
│     La classe           │  ← Tema naziv
│                         │
│   ┌─────────────────┐   │
│   │    Continua →   │   │  ← CTA dugme u boji teme
│   └─────────────────┘   │
│                         │
└─────────────────────────┘
```

### Task Screen Layout
```
┌─────────────────────────────────┐
│ ← Back    ████████░░░░  8/12   │  ← Header + progress bar
├─────────────────────────────────┤
│                                 │
│  Completa la paraula:           │  ← Prompt
│                                 │
│  ┌─────────────────────────┐   │
│  │                         │   │
│  │    [TASK CONTENT]       │   │  ← Task komponenta
│  │                         │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
│         🐱 "Molt bé!"          │  ← Mascot (pojavljuje se)
│                                 │
│  ┌──────────┐ ┌──────────┐    │
│  │   ←      │ │    →     │    │  ← Navigation
│  └──────────┘ └──────────┘    │
└─────────────────────────────────┘
```

### Celebration Screen (kraj teme)
```
┌─────────────────────────────────┐
│                                 │
│        🎉 CONFETTI 🎉          │
│                                 │
│     ┌─────────────┐            │
│     │   🏆        │            │
│     │   TROPHY    │            │
│     └─────────────┘            │
│                                 │
│   Fantàstic!                   │
│   Has completat "La classe"!   │
│                                 │
│   ★ 12/12 tasques              │
│   🔥 Best streak: 5            │
│   🏅 Badge: Master of La classe│
│                                 │
│  ┌───────────────────────┐     │
│  │   Següent tema →      │     │
│  └───────────────────────┘     │
│                                 │
│  ┌───────────────────────┐     │
│  │   Torna a l'inici     │     │
│  └───────────────────────┘     │
└─────────────────────────────────┘
```

## Animacije (Framer Motion)

### Page transitions
- Slide in from right (nova tema/task)
- Slide out to left (nazad)
- Duration: 300ms, ease: [0.25, 0.46, 0.45, 0.94]

### Card interactions
- Hover: scale(1.03) + shadow increase
- Tap: scale(0.97) → scale(1)
- Enter: staggered fade-in (50ms delay izmedju kartica)

### Task feedback
- Correct: pulse green + confetti burst + mascot appears
- Wrong: gentle shake + red flash (300ms) + mascot encourages
- Complete: slide up celebration overlay

### Mascot
- Enter: slide up from bottom + bounce
- Exit: slide down
- Expressions: morph between states (smooth)
- Idle: subtle breathing animation

### Rewards
- Stars: spin + glow on earn
- Badge: zoom in + golden particles
- Streak: fire emoji scaling animation
- Combo text: bounce + grow + fade

## Zvuk

### Efekti
| Event | Sound | Duration |
|---|---|---|
| Tap/Click | Soft "pop" | 100ms |
| Correct answer | Happy "ding" chime | 300ms |
| Wrong answer | Soft "bonk" | 200ms |
| Combo/Streak | Rising chime | 500ms |
| Task complete | Celebration jingle | 1s |
| Theme complete | Victory fanfare | 2s |
| Badge earned | Magical sparkle | 1s |

### Text-to-Speech
- Web Speech API sa `ca-ES` locale
- Dugme za svaku rec (speaker ikonica)
- Auto-play za uputstva (opciono, moze se iskljuciti)
- Rate: 0.8 (sporije za decu)

## Izvori ilustracija (besplatni, konzistentni)

### Preporuceni setovi (3D cartoon stil)
1. **Storyset (storyset.com)** - besplatne 3D ilustracije, konzistentan stil
2. **Humaaans** - za likove
3. **unDraw** - flat ali moze 3D feel
4. **Icons8 Illustrations** - 3D stil, mnogo varijacija
5. **Blush.design** - custom ilustracije iz istog seta
6. **Freepik (3D pack)** - konkretni 3D objekti

### Za maskotu
- Custom dizajn (Jovana ce napraviti)
- Treba: min 5 izraza (happy, confused, cheering, laughing, thinking)
- Format: SVG ili Lottie za animacije

### Za tematske ikonice
- Jedan set od 12 ikonica u istom stilu
- Svaka ikonica predstavlja temu (olovka za La classe, skola za L'escola, itd.)
