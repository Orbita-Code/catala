# Plural Family Illustrations (la-familia-7)

**Status:** Pending
**Priority:** Medium
**Context:** Task la-familia-7 (UI position 6, prompt "Completa amb LA, EL, LES o ELS:") uses plural family words but only singular illustrations exist, so plural entries display the word with no image.

## Words missing illustrations

| Plural word | Article | Singular (exists) |
|-------------|---------|-------------------|
| tietes | les | tieta ✅ |
| germanes | les | germana ✅ |
| cosins | els | cosi ✅ |
| germans | els | germa ✅ |
| nét (singular but no image) | el | — |

## Two paths to fix

### Option A — Generate plural illustrations (preferred)

Use the ChatGPT custom GPT (see CLAUDE.md for URL) and the standard prompt:
```
[WORD] - 3D cartoon style illustration, white background with small decorative hearts and stars, 512x512px, PNG, colorful and cheerful, for children ages 5-8. Two or more [SUBJECT] together.
```

Generate:
- `tietes.webp` — two or three smiling aunts together
- `germanes.webp` — two girls (sisters) together
- `cosins.webp` — two or three boys (boy cousins) together
- `germans.webp` — two boys (brothers) together
- `nets.webp` — two boys (grandsons) together OR just `net.webp` for the singular

Then:
1. Save PNG to `Ilustracije/[word].png`
2. Convert: `cwebp -q 80 Ilustracije/[word].png -o public/illustrations/[word].webp`
3. Add each word key to `wordsWithIllustrations` set in `src/lib/illustrations.ts`

### Option B — Plural→singular fallback in getWordIllustration

Add Catalan plural-stripping logic to `getWordIllustration()` in `src/lib/illustrations.ts`:
- `-es` → `-a` (feminine plural → singular: tietes → tieta)
- `-ns` → restore `à`/`í` (germans → germà, cosins → cosí)
- `-s` → strip (gats → gat)

Pros: instant fix, no new images needed
Cons: shows singular image for plural word (one tieta when text says "tietes"), slightly misleading

## Recommendation

Go with Option A — clearer for kids. About 5 new illustrations, ~15 min of ChatGPT generation.
