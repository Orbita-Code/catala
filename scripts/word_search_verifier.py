#!/usr/bin/env python3
"""
Word Search Grid Verifier
Checks if all expected words can be found in the grids
"""

def find_word_in_grid(grid, word):
    """
    Find a word in the grid in all 8 directions
    Returns list of (start_row, start_col, direction) tuples where word is found
    """
    rows = len(grid)
    cols = len(grid[0])
    word_len = len(word)
    found_positions = []

    # 8 directions: right, left, down, up, diag-down-right, diag-down-left, diag-up-right, diag-up-left
    directions = [
        (0, 1, "horizontal"),           # right
        (0, -1, "horizontal-reversed"), # left
        (1, 0, "vertical-down"),        # down
        (-1, 0, "vertical-up"),         # up
        (1, 1, "diagonal-down-right"),  # diagonal down-right
        (1, -1, "diagonal-down-left"),  # diagonal down-left
        (-1, 1, "diagonal-up-right"),   # diagonal up-right
        (-1, -1, "diagonal-up-left")    # diagonal up-left
    ]

    for row in range(rows):
        for col in range(cols):
            for dr, dc, direction in directions:
                # Check if word fits in this direction
                end_row = row + dr * (word_len - 1)
                end_col = col + dc * (word_len - 1)

                if 0 <= end_row < rows and 0 <= end_col < cols:
                    # Extract letters in this direction
                    letters = ""
                    for i in range(word_len):
                        r = row + dr * i
                        c = col + dc * i
                        letters += grid[r][c]

                    if letters == word:
                        found_positions.append((row, col, direction, f"({row},{col})→({end_row},{end_col})"))

    return found_positions

def verify_grid(grid_name, grid, words, expected_info=""):
    """Verify all words in a grid"""
    print(f"\n{'='*80}")
    print(f"GRID: {grid_name}")
    print(f"{'='*80}")
    if expected_info:
        print(f"Expected placements: {expected_info}\n")

    all_found = True

    for word in words:
        positions = find_word_in_grid(grid, word)
        if positions:
            print(f"✓ FOUND '{word}':")
            for row, col, direction, coords in positions:
                print(f"  - {direction} from {coords}")
        else:
            print(f"✗ NOT FOUND: '{word}'")
            all_found = False

    print(f"\nResult: {'ALL WORDS FOUND' if all_found else 'SOME WORDS MISSING'}")
    return all_found

# Grid 1: la-roba-5
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
words1 = ["botes", "abric", "vestit", "camisa", "gorra"]
expected1 = "botes=diagonal down-right from (2,0), abric=vertical down from (0,8), vestit=horizontal reversed at row 6, camisa=diagonal down-left from (1,9), gorra=horizontal at row 8"

# Grid 2: la-familia-5
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
words2 = ["pare", "mare", "avi", "tia", "nebot"]
expected2 = "pare=vertical down from (0,3), mare=diagonal down-right from (2,5), avi=horizontal reversed at row 5, tia=vertical down from (6,1), nebot=horizontal at row 8"

# Grid 3: les-botigues-5
grid3 = [
    ["f", "l", "q", "d", "r", "g", "h", "c", "k", "n"],
    ["t", "o", "s", "j", "n", "p", "a", "a", "l", "f"],
    ["g", "h", "r", "l", "d", "k", "r", "r", "q", "s"],
    ["j", "n", "f", "n", "g", "p", "h", "n", "t", "l"],
    ["p", "e", "i", "x", "r", "a", "d", "k", "f", "g"],
    ["d", "l", "q", "h", "j", "n", "r", "s", "g", "k"],
    ["r", "f", "g", "k", "l", "d", "q", "h", "j", "n"],
    ["s", "d", "a", "t", "i", "u", "r", "f", "l", "g"],
    ["k", "n", "h", "j", "r", "l", "f", "g", "d", "q"],
    ["t", "r", "l", "f", "g", "s", "n", "h", "j", "k"],
]
words3 = ["forn", "carn", "peix", "fruita", "pa"]
expected3 = "forn=diagonal down-right from (0,0), carn=vertical down from (1,7), peix=horizontal at row 4, fruita=horizontal reversed at row 7, pa=diagonal"

# Grid 4: la-casa-2
grid4 = [
    ["f", "a", "n", "t", "e", "n", "a"],
    ["a", "r", "e", "l", "d", "q", "n"],
    ["ç", "s", "s", "g", "h", "k", "t"],
    ["a", "j", "c", "c", "r", "f", "e"],
    ["n", "í", "d", "r", "a", "l", "n"],
    ["a", "r", "a", "j", "l", "d", "a"],
    ["b", "a", "l", "c", "ó", "q", "r"],
]
words4 = ["balcó", "jardí", "escala", "antena", "cortina", "façana"]
expected4 = "façana=vertical down from (0,0), antena=horizontal at row 0, escala=diagonal, jardí=horizontal reversed?, cortina=vertical col 6?, balcó=horizontal at row 6"

# Grid 5: els-vehicles-5
grid5 = [
    ["l", "c", "r", "p", "g", "d", "t", "f", "k", "s"],
    ["h", "j", "o", "k", "n", "r", "a", "q", "l", "g"],
    ["d", "f", "g", "t", "s", "l", "x", "p", "t", "n"],
    ["q", "r", "l", "h", "x", "j", "i", "k", "r", "f"],
    ["s", "g", "d", "k", "n", "e", "f", "h", "e", "l"],
    ["p", "r", "l", "o", "t", "o", "m", "g", "n", "j"],
    ["k", "f", "n", "d", "q", "r", "l", "g", "h", "s"],
    ["a", "v", "i", "ó", "p", "r", "l", "f", "s", "d"],
    ["h", "j", "g", "k", "f", "s", "q", "r", "n", "e"],
    ["l", "p", "d", "r", "g", "h", "j", "k", "f", "s"],
]
words5 = ["cotxe", "tren", "moto", "taxi", "avió"]
expected5 = "cotxe=diagonal down-right from (0,1), tren=vertical down from (2,8), moto=horizontal reversed at row 5, taxi=diagonal down-left from (1,6), avió=horizontal at row 7"

# Verify all grids
print("\n" + "="*80)
print("WORD SEARCH VERIFICATION REPORT")
print("="*80)

verify_grid("Grid 1: la-roba-5", grid1, words1, expected1)
verify_grid("Grid 2: la-familia-5", grid2, words2, expected2)
verify_grid("Grid 3: les-botigues-5", grid3, words3, expected3)
verify_grid("Grid 4: la-casa-2", grid4, words4, expected4)
verify_grid("Grid 5: els-vehicles-5", grid5, words5, expected5)

print("\n" + "="*80)
print("VERIFICATION COMPLETE")
print("="*80)
