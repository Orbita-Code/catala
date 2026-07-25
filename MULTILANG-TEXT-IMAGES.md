# Slike sa tekstom — MORAJU se regenerisati po jeziku

> Napravljeno 25.07.2026. Pravilo #0 u `CLAUDE.md`: ilustracije NE smeju imati tekst,
> jer se dele za sve jezike. Neke slike ipak MORAJU imati tekst (tekst = sadržaj učenja).
> Kad se pravi verzija igrice za **drugi jezik** (engleski, španski…), OVE slike se moraju
> generisati ponovo sa tekstom na tom jeziku. Sve ostale ilustracije ostaju iste (bez teksta).

## 1. Dani u nedelji (7) — OBAVEZNO nova slika po jeziku
Tekst dana je na katalonskom, na samoj slici. Za drugi jezik → nov tekst.

| Ključ (webp) | Katalonski | Engleski | Španski |
|---|---|---|---|
| `dilluns`   | DILLUNS   | Monday    | Lunes     |
| `dimarts`   | DIMARTS   | Tuesday   | Martes    |
| `dimecres`  | DIMECRES  | Wednesday | Miércoles |
| `dijous`    | DIJOUS    | Thursday  | Jueves    |
| `divendres` | DIVENDRES | Friday    | Viernes   |
| `dissabte`  | DISSABTE  | Saturday  | Sábado    |
| `diumenge`  | DIUMENGE  | Sunday    | Domingo   |

## 2. Slike sa imenima osoba — proveriti po jeziku
Ime je upisano na slici. Imena su vlastita pa se često NE prevode, ali ako se za drugo
tržište koriste druga imena — regenerisati. Trenutno u kodu se koristi: `maria`.
(U folderu postoje i `laura`, `carles`, `carolina`, `sara`, `sergi`, `xavier` — proveriti upotrebu.)

## 3. Eventualni tekstualni kolaži zadataka
Ako neki zadatak ima sliku-kolaž sa upisanim rečima (npr. meni, natpisi), i ona ide na spisak.
Trenutno nema aktivnih pod poznatim imenima; proveriti pri lokalizaciji.

## NE spada ovde (ostaje isto za sve jezike)
- **Brojevi 11–20** (`11`…`20`): cifre su univerzalne (12 = 12 svuda). Ne dirati.
- **`classroom-items`**: crno-bela skica za „color-by-instruction" zadatak (deca je boje) — NEMA teksta, namerno je linijska. NE menjati.
- Sve ostale ilustracije (predmeti, životinje, prodavnice) su BEZ teksta i dele se za sve jezike.
