export class SudokuGenerator {
  private board: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));

  private solve(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isValid(row, col, num)) {
              this.board[row][col] = num;
              if (this.solve()) return true;
              this.board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  private isValid(row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (this.board[row][i] === num || this.board[i][col] === num) return false;
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[boxRow + i][boxCol + j] === num) return false;
      }
    }
    return true;
  }

  public generate(difficulty: string): { puzzle: number[][], hash: string } {
    this.board = Array.from({ length: 9 }, () => Array(9).fill(0));
    this.solve();

    let puzzle = this.board.map(row => row.slice());

    let minClues = 44;
    let maxClues = 48;
    if (difficulty === 'Nebula Drift') { minClues = 38; maxClues = 43; }
    else if (difficulty === 'Star Cluster') { minClues = 34; maxClues = 37; }
    else if (difficulty === 'Galaxy Edge') { minClues = 29; maxClues = 33; }
    else if (difficulty === 'Supernova') { minClues = 24; maxClues = 28; }
    else if (difficulty === 'Black Hole') { minClues = 20; maxClues = 23; }

    const clues = Math.floor(Math.random() * (maxClues - minClues + 1)) + minClues;
    let cellsToRemove = 81 - clues;
    while (cellsToRemove > 0) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
        cellsToRemove--;
      }
    }

    // Deterministic hash for uniqueness
    const hash = btoa(JSON.stringify(puzzle));
    console.log(`%c🎲 Generated ${difficulty} puzzle with ${clues} clues (hash: ${hash.slice(0,8)}...)`, 'color: lime');

    return { puzzle, hash };
  }
}