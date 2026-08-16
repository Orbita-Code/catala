#!/usr/bin/env python3
"""
Detailed analysis of missing words to understand what went wrong
"""

def print_grid_with_coords(grid, name):
    """Print grid with coordinates"""
    print(f"\n{name}")
    print("   ", end="")
    for c in range(len(grid[0])):
        print(f" {c} ", end="")
    print()
    for r in range(len(grid)):
        print(f"{r}: ", end="")
        for c in range(len(grid[0])):
            print(f"[{grid[r][c]}]", end="")
        print()

def check_path(grid, start_row, start_col, dr, dc, length, word):
    """Extract letters from a specific path"""
    letters = ""
    coords = []
    for i in range(length):
        r = start_row + dr * i
        c = start_col + dc * i
        if 0 <= r < len(grid) and 0 <= c < len(grid[0]):
            letters += grid[r][c]
            coords.append(f"({r},{c})={grid[r][c]}")
        else:
            return None, None
    return letters, coords

print("="*80)
print("DETAILED MISSING WORDS ANALYSIS")
print("="*80)

# GRID 1: Missing botes and abric
print("\n" + "="*80)
print("GRID 1: la-roba-5 - Missing: botes, abric")
print("="*80)

grid1 = [
    ["l", "p", "r", "d", "f", "g", "k", "t", "a", "n"],
    ["s", "q", "h", "j", "e", "l", "r", "p", "d", "c"],
    ["b", "t", "n", "r", "f", "g", "k", "s", "q", "a"],
    ["e", "o", "l", "p", "d", "h", "j", "n", "r", "m"],
    ["r", "f", "t", "g", "k", "s", "q", "l", "b", "i"],
    ["d", "j", "h", "e", "n", "p", "r", "f", "r", "s"],
    ["t", "i", "t", "s", "e", "v", "g", "k", "i", "a"],
    ["l", "p", "d", "r", "f", "g", "h", "j", "c", "n"],
    ["g", "o", "r", "r", "a", "s", "q", "l", "p", "e"],
    ["k", "n", "t", "e", "d", "f", "r", "h", "j", "s"],
]

print("\nChecking 'botes' (expected diagonal down-right from (2,0)):")
letters, coords = check_path(grid1, 2, 0, 1, 1, 5, "botes")
if coords:
    print(f"  Path: {' -> '.join(coords)}")
    print(f"  Letters found: '{letters}'")
    print(f"  Expected: 'botes'")
    print(f"  Match: {letters == 'botes'}")

print("\nChecking 'abric' (expected vertical down from (0,8)):")
letters, coords = check_path(grid1, 0, 8, 1, 0, 5, "abric")
if coords:
    print(f"  Path: {' -> '.join(coords)}")
    print(f"  Letters found: '{letters}'")
    print(f"  Expected: 'abric'")
    print(f"  Match: {letters == 'abric'}")

# GRID 2: Missing mare and nebot
print("\n" + "="*80)
print("GRID 2: la-familia-5 - Missing: mare, nebot")
print("="*80)

grid2 = [
    ["l", "q", "d", "p", "f", "m", "r", "j", "k", "s"],
    ["g", "h", "n", "a", "e", "l", "t", "b", "d", "q"],
    ["r", "f", "k", "r", "s", "m", "g", "h", "j", "l"],
    ["d", "q", "n", "e", "t", "l", "a", "p", "f", "g"],
    ["s", "h", "j", "k", "í", "d", "r", "r", "a", "n"],
    ["l", "i", "v", "a", "r", "g", "e", "b", "q", "t"],
    ["p", "t", "f", "d", "n", "h", "k", "s", "l", "r"],
    ["g", "i", "j", "l", "q", "d", "f", "n", "h", "k"],
    ["n", "a", "e", "b", "o", "t", "g", "r", "s", "l"],
    ["d", "f", "h", "j", "k", "p", "q", "r", "t", "n"],
]

print("\nChecking 'mare' (expected diagonal down-right from (2,5)):")
letters, coords = check_path(grid2, 2, 5, 1, 1, 4, "mare")
if coords:
    print(f"  Path: {' -> '.join(coords)}")
    print(f"  Letters found: '{letters}'")
    print(f"  Expected: 'mare'")
    print(f"  Match: {letters == 'mare'}")

print("\nChecking 'nebot' (expected horizontal at row 8):")
letters, coords = check_path(grid2, 8, 0, 0, 1, 5, "nebot")
if coords:
    print(f"  Path: {' -> '.join(coords)}")
    print(f"  Letters found: '{letters}'")
    print(f"  Expected: 'nebot'")
    print(f"  Match: {letters == 'nebot'}")

# Check alternative positions for nebot
print("\n  Checking other positions for 'nebot':")
# Try from (8,3)
letters, coords = check_path(grid2, 8, 3, 0, 1, 5, "nebot")
if coords:
    print(f"    Row 8, starting col 3: {' -> '.join(coords)}")
    print(f"    Letters: '{letters}'")

# GRID 4: Missing jardí, escala, cortina
print("\n" + "="*80)
print("GRID 4: la-casa-2 - Missing: jardí, escala, cortina")
print("="*80)

grid4 = [
    ["f", "a", "n", "t", "e", "n", "a"],
    ["a", "r", "e", "l", "d", "q", "n"],
    ["ç", "s", "s", "g", "h", "k", "t"],
    ["a", "j", "c", "c", "r", "f", "e"],
    ["n", "í", "d", "r", "a", "l", "n"],
    ["a", "r", "a", "j", "l", "d", "a"],
    ["b", "a", "l", "c", "ó", "q", "r"],
]

print_grid_with_coords(grid4, "Grid 4 with coordinates:")

print("\nChecking 'jardí' possibilities:")
# Try horizontal reversed from row 4
print("  Row 4 reversed from col 4 to 0:")
letters, coords = check_path(grid4, 4, 4, 0, -1, 5, "jardí")
if coords:
    print(f"    Path: {' -> '.join(coords)}")
    print(f"    Letters: '{letters}'")

# Try diagonal from (3,1)
print("  Diagonal down-right from (3,1):")
letters, coords = check_path(grid4, 3, 1, 1, 1, 5, "jardí")
if coords:
    print(f"    Path: {' -> '.join(coords)}")
    print(f"    Letters: '{letters}'")

print("\nChecking 'escala' possibilities:")
# Try diagonal from (2,1)
print("  Diagonal down-right from (2,1):")
letters, coords = check_path(grid4, 2, 1, 1, 1, 6, "escala")
if coords:
    print(f"    Path: {' -> '.join(coords)}")
    print(f"    Letters: '{letters}'")

# Try diagonal from (1,2)
print("  Diagonal down-right from (1,2):")
letters, coords = check_path(grid4, 1, 2, 1, 1, 6, "escala")
if coords:
    print(f"    Path: {' -> '.join(coords)}")
    print(f"    Letters: '{letters}'")

print("\nChecking 'cortina' possibilities:")
# Try vertical from col 6
print("  Vertical down from (0,6):")
letters, coords = check_path(grid4, 0, 6, 1, 0, 7, "cortina")
if coords:
    print(f"    Path: {' -> '.join(coords)}")
    print(f"    Letters: '{letters}'")

# Try horizontal row 5 reversed
print("  Row 5 horizontal:")
for start_col in range(len(grid4[0]) - 6):
    letters, coords = check_path(grid4, 5, start_col, 0, 1, 7, "cortina")
    if coords:
        print(f"    From col {start_col}: {' -> '.join(coords)}")
        print(f"    Letters: '{letters}'")

print("\n" + "="*80)
print("ANALYSIS COMPLETE")
print("="*80)
