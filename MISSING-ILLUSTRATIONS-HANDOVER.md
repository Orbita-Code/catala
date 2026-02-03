# Missing Illustrations Handover

**Created:** 2026-02-03
**Updated:** 2026-02-03 15:20
**Purpose:** Guide for next session to generate all missing illustrations for tasks to be solvable

## PROGRESS: 23/33 COMPLETE

### Completed (saved to public/illustrations/):
- [x] laura-carles.webp
- [x] maria.webp
- [x] carolina.webp
- [x] sergi.webp
- [x] sara.webp
- [x] xavier.webp
- [x] albert-dibuix-1.webp (grandfather)
- [x] albert-dibuix-2.webp (grandmother)
- [x] albert-dibuix-3.webp (father)
- [x] albert-dibuix-4.webp (mother)
- [x] albert-dibuix-5.webp (sister)
- [x] arbre-familiar.webp
- [x] casa-exterior.webp
- [x] classroom-items.webp
- [x] roba-silueta.webp
- [x] aliments.webp
- [x] animals.webp
- [x] a-sobre.webp (preposition: on top of)
- [x] a-sota.webp (preposition: underneath)
- [x] a-dins.webp (preposition: inside)
- [x] a-fora.webp (preposition: outside)
- [x] a-davant.webp (preposition: in front of)
- [x] a-darrere.webp (preposition: behind)

### Remaining (10):
- [ ] arbre-familiar-complet
- [ ] familia-foto
- [ ] pantalons-bruts, jersei-nou, sabates-velles, mitjons-nets (4)
- [ ] 3-llapis, 2-gomes, 4-llibres, 5-retoladors (4)

## ChatGPT Custom GPT URL
https://chatgpt.com/g/g-p-697a9ef9e7fc8191a6f01584dad8ea4d-igrice-katalonski-jezik/c/697a9f6b-f218-8332-a5d0-89b7ed59ec5b

## WORKFLOW FOR EACH ILLUSTRATION

1. Send prompt to ChatGPT (one at a time, wait for response)
2. Click generated image to open modal
3. Click "Save" to download
4. Copy to: `Ilustracije/[name].png`
5. Convert: `cwebp -q 80 Ilustracije/[name].png -o public/illustrations/[name].webp`
6. Add word to `wordsWithIllustrations` set in `src/lib/illustrations.ts`
7. Add `image: "[name]"` property to the relevant task in the data file

If rate limited, wait the FULL time specified + 1 minute buffer.

---

## CATEGORY 1: PEOPLE ILLUSTRATIONS (6)

### 1. laura-carles
**For:** El cos Task 11 (height comparison)
**Prompt:**
```
Two children standing side by side: Laura (girl, taller) and Carles (boy, shorter). Laura has long hair and is visibly taller than Carles who has short hair. Height comparison illustration, 3D cartoon style, white background with decorative hearts and stars, 512x512px, colorful and cheerful, for children ages 5-8.
```

### 2. maria
**For:** El cos Task 14 (appearance questions)
**Prompt:**
```
Young woman named Maria with: big green eyes, small nose, long hair that covers one ear, no visible teeth, has eyebrows, not red hair. 3D cartoon style, white background with decorative hearts and stars, 512x512px, colorful and cheerful, for children ages 5-8.
```

### 3. carolina
**For:** El cos Task 16 (Qui es qui)
**Prompt:**
```
Young woman named Carolina: young, long black hair, wearing glasses. 3D cartoon style, white background with decorative hearts and stars, 512x512px, colorful and cheerful, for children ages 5-8.
```

### 4. sergi
**For:** El cos Task 16 (Qui es qui)
**Prompt:**
```
Boy named Sergi: short boy, short black hair. 3D cartoon style, white background with decorative hearts and stars, 512x512px, colorful and cheerful, for children ages 5-8.
```

### 5. sara
**For:** El cos Task 16 (Qui es qui)
**Prompt:**
```
Very young girl named Sara: brown hair in a ponytail. 3D cartoon style, white background with decorative hearts and stars, 512x512px, colorful and cheerful, for children ages 5-8.
```

### 6. xavier
**For:** El cos Task 16 (Qui es qui)
**Prompt:**
```
Young man named Xavier: tall, young, has mustache (bigoti), short hair. 3D cartoon style, white background with decorative hearts and stars, 512x512px, colorful and cheerful, for children ages 5-8.
```

---

## CATEGORY 2: ALBERT'S FAMILY DRAWINGS (5)

### 7. albert-dibuix-1
**For:** La familia Task 2 (Albert's family - grandfather)
**Prompt:**
```
Simple child's drawing style of a grandfather (avi): elderly man with grey hair. 3D cartoon style, white background with decorative hearts and stars, 512x512px, colorful and cheerful, for children ages 5-8.
```

### 8. albert-dibuix-2
**For:** La familia Task 2 (Albert's family - grandmother)
**Prompt:**
```
Simple child's drawing style of a grandmother (avia): elderly woman with grey hair. 3D cartoon style, white background with decorative hearts and stars, 512x512px, colorful and cheerful, for children ages 5-8.
```

### 9. albert-dibuix-3
**For:** La familia Task 2 (Albert's family - father)
**Prompt:**
```
Simple child's drawing style of a father (pare): adult man. 3D cartoon style, white background with decorative hearts and stars, 512x512px, colorful and cheerful, for children ages 5-8.
```

### 10. albert-dibuix-4
**For:** La familia Task 2 (Albert's family - mother)
**Prompt:**
```
Simple child's drawing style of a mother (mare): adult woman. 3D cartoon style, white background with decorative hearts and stars, 512x512px, colorful and cheerful, for children ages 5-8.
```

### 11. albert-dibuix-5
**For:** La familia Task 2 (Albert's family - sister)
**Prompt:**
```
Simple child's drawing style of a sister (germana): young girl. 3D cartoon style, white background with decorative hearts and stars, 512x512px, colorful and cheerful, for children ages 5-8.
```

---

## CATEGORY 3: SCENE/COMPOSITE IMAGES (6)

### 12. arbre-familiar
**For:** La familia Task 3 (family tree labeling)
**Prompt:**
```
Family tree diagram showing three generations: Top row shows grandparents (avi, avia), middle row shows parents (pare, mare), bottom row shows children (fill, filla). Connected by lines showing relationships. Simple diagram style, 3D cartoon style, white background, 512x512px, colorful and cheerful, for children ages 5-8. Leave space around each person for labels to be added.
```

### 13. casa-exterior
**For:** La casa Task 4 (house exterior labeling)
**Prompt:**
```
House exterior view showing: roof (teulada), chimney (xemeneia) with smoke, TV antenna (antena), balcony (balco), window with blinds (persiana), garden (jardi), garage (garatge). Clear view of all parts with space for labels. 3D cartoon style, white background, 512x512px, colorful and cheerful, for children ages 5-8.
```

### 14. classroom-items
**For:** La classe Task 7 (color by instruction)
**Prompt:**
```
Collection of classroom items on white background: pencil, eraser, sharpener, ruler, pen, scissors, notebook, book, pencil case. Items shown separately in a grid layout, not colored yet (outline style or light grey). 3D cartoon style, 512x512px, for children ages 5-8 to color.
```

### 15. roba-silueta
**For:** La roba Task 12 (clothing labeling/coloring)
**Prompt:**
```
Child wearing various clothing items: shirt (camisa), pants (pantalons), shoes (sabates), socks (mitjons). Full body view with space around each item for labels. 3D cartoon style, white background, 512x512px, colorful and cheerful, for children ages 5-8.
```

### 16. aliments
**For:** El menjar Task 13 (food coloring)
**Prompt:**
```
Collection of food items: ice cream (gelat), soup in bowl (sopa), coffee cup (cafe), juice glass (suc), pizza slice (pizza), yogurt cup (iogurt), tea cup (te), soda can (refresc). Items shown separately in a grid layout for coloring by temperature (blue=cold, red=hot). 3D cartoon style, 512x512px, for children ages 5-8.
```

### 17. animals
**For:** Els animals Task 12 (animal coloring by category)
**Prompt:**
```
Collection of animals: bird (ocell), bee (abella), fish (peix), turtle (tortuga), rabbit (conill), cat (gat). Items shown separately in a grid layout for coloring by category. 3D cartoon style, 512x512px, for children ages 5-8.
```

---

## CATEGORY 4: NAMED FAMILY TREE (1)

### 18. arbre-familiar-complet
**For:** La familia Task 12 (family tree with names)
**Prompt:**
```
Complete family tree with names visible: Top row: Manel (grandfather) and Julia (grandmother). Middle row left: Anna (mother) married to Pol (father). Middle row right: Sara (aunt) married to Pere (uncle). Bottom row left: Marta (daughter of Anna and Pol). Bottom row right: Dafne and Tomas (children of Sara and Pere). All names clearly labeled. Family tree diagram style, 3D cartoon, 512x512px, colorful, for children ages 5-8.
```

---

## CATEGORY 5: FAMILY APPEARANCE (1)

### 19. familia-foto
**For:** La familia Task 10 (family appearance questions - hair, height, shirt colors)
**Prompt:**
```
Family portrait showing: Mother with long hair, Father who is taller than mother with short hair and brown shirt, Son with different hair color than mother, daughter visible. Clear view of their features for questions about appearance. 3D cartoon style, 512x512px, colorful, for children ages 5-8.
```

---

## CATEGORY 6: CLOTHING STATES (4)

### 20. pantalons-bruts
**For:** La roba Task 8 (dirty/clean clothing)
**Prompt:**
```
Dirty pants (pantalons bruts): pants with visible dirt stains and mud. 3D cartoon style, white background with decorative elements, 512x512px, for children ages 5-8. No face on the object.
```

### 21. jersei-nou
**For:** La roba Task 8 (new/old clothing)
**Prompt:**
```
New sweater (jersei nou): brand new, clean, colorful sweater with price tag still attached. 3D cartoon style, white background with decorative elements, 512x512px, for children ages 5-8. No face on the object.
```

### 22. sabates-velles
**For:** La roba Task 8 (old clothing)
**Prompt:**
```
Old shoes (sabates velles): worn out shoes with visible wear, scuffs, and faded color. 3D cartoon style, white background with decorative elements, 512x512px, for children ages 5-8. No face on the object.
```

### 23. mitjons-nets
**For:** La roba Task 8 (clean clothing)
**Prompt:**
```
Clean socks (mitjons nets): bright, clean, freshly washed socks with sparkle effect. 3D cartoon style, white background with decorative elements, 512x512px, for children ages 5-8. No face on the object.
```

---

## CATEGORY 7: COUNTING IMAGES (4)

### 24. 3-llapis
**For:** La classe Task 16 (counting objects)
**Prompt:**
```
Three pencils (3 llapis): exactly 3 pencils arranged clearly for counting. 3D cartoon style, white background with decorative elements, 512x512px, for children ages 5-8. No faces on objects.
```

### 25. 2-gomes
**For:** La classe Task 16 (counting objects)
**Prompt:**
```
Two erasers (2 gomes): exactly 2 erasers arranged clearly for counting. 3D cartoon style, white background with decorative elements, 512x512px, for children ages 5-8. No faces on objects.
```

### 26. 4-llibres
**For:** La classe Task 16 (counting objects)
**Prompt:**
```
Four books (4 llibres): exactly 4 colorful books arranged clearly for counting. 3D cartoon style, white background with decorative elements, 512x512px, for children ages 5-8. No faces on objects.
```

### 27. 5-retoladors
**For:** La classe Task 16 (counting objects)
**Prompt:**
```
Five markers (5 retoladors): exactly 5 colorful markers/felt-tip pens arranged clearly for counting. 3D cartoon style, white background with decorative elements, 512x512px, for children ages 5-8. No faces on objects.
```

---

## CATEGORY 8: PREPOSITION IMAGES (6)

### 28. a-sobre
**For:** L'escola Task 15-16 (prepositions)
**Prompt:**
```
Illustration showing "on top of" (a sobre): a ball ON TOP OF a box. Clear spatial relationship for teaching prepositions. 3D cartoon style, white background, 512x512px, for children ages 5-8.
```

### 29. a-sota
**For:** L'escola Task 15-16 (prepositions)
**Prompt:**
```
Illustration showing "underneath" (a sota): a cat UNDER a table. Clear spatial relationship for teaching prepositions. 3D cartoon style, white background, 512x512px, for children ages 5-8.
```

### 30. a-dins
**For:** L'escola Task 15-16 (prepositions)
**Prompt:**
```
Illustration showing "inside" (a dins): a toy INSIDE a box. Clear spatial relationship for teaching prepositions. 3D cartoon style, white background, 512x512px, for children ages 5-8.
```

### 31. a-fora
**For:** L'escola Task 15-16 (prepositions)
**Prompt:**
```
Illustration showing "outside" (a fora): a dog OUTSIDE a doghouse. Clear spatial relationship for teaching prepositions. 3D cartoon style, white background, 512x512px, for children ages 5-8.
```

### 32. a-davant
**For:** L'escola Task 15-16 (prepositions)
**Prompt:**
```
Illustration showing "in front of" (a davant): a child standing IN FRONT OF a door. Clear spatial relationship for teaching prepositions. 3D cartoon style, white background, 512x512px, for children ages 5-8.
```

### 33. a-darrere
**For:** L'escola Task 15-16 (prepositions)
**Prompt:**
```
Illustration showing "behind" (a darrere): a child hiding BEHIND a tree. Clear spatial relationship for teaching prepositions. 3D cartoon style, white background, 512x512px, for children ages 5-8.
```

---

## TEXT CONTENT NEEDED (Not images - update in data files)

### Restaurant Menu "Tot Bo"
**For:** El menjar Task 17
Update the task to include the menu text or add it as a separate text display.

```
MENÚ DEL DIA - Restaurant Tot Bo

Primer plat:
- Amanida verda
- Sopa de verdures
- Macarrons amb tomàquet

Segon plat:
- Hamburguesa amb patates
- Pollastre al forn
- Peix a la planxa

Postres:
- Fruita amb gelat
- Pastís de xocolata
- Iogurt

Beguda:
- Cafè amb llet
- Aigua
- Refresc
```

### Snake Reading Passage
**For:** Els animals Task 18
Update the task to include the reading passage.

```
LES SERPS

Les serps són rèptils. No tenen potes i es mouen arrossegant-se pel terra.

Les serps no tenen orelles. No poden sentir els sons com nosaltres.

Les serps no poden tancar els ulls perquè no tenen parpelles.

A Catalunya hi ha una serp perillosa: l'escurçó. Si et mossega, has d'anar al metge.
```

### Carlota and Cesc Pet Answers
**For:** La familia Task 15
Update the task to include what pets they have.

```
CARLOTA: Tinc un hàmster i un conill. No tinc gos.

CESC: Tinc un gat i un ocell. Tinc un peix també.
```

---

## AFTER GENERATING ALL ILLUSTRATIONS

1. Run `npm run build` to verify no errors
2. Test affected tasks in the app
3. Update CLAUDE.md "Current Status" section
4. Commit with message: "Add missing illustrations for task solvability"
5. Push to trigger deployment

## TOTAL: 33 illustrations + 3 text content updates
