import Phaser from 'phaser';

export interface Cell {
  value: number;
  given: boolean;
  x: number;
  y: number;
}

export class SudokuBoard {
  private scene: Phaser.Scene;
  private cells: Cell[][] = [];
  private cellTexts: Phaser.GameObjects.Text[][] = [];
  private cellGraphics: Phaser.GameObjects.Rectangle[][] = [];
  private selectedNumber: number = 0;
  private moveHistory: { row: number; col: number; previousValue: number }[] = [];
  private placedCount: { [num: number]: number } = {};

  constructor(scene: Phaser.Scene, initialPuzzle?: number[][]) {
    this.scene = scene;
    this.initBoard(initialPuzzle);
  }

  private initBoard(initialPuzzle?: number[][]): void {
    const puzzle = initialPuzzle || [
      [5,3,0,0,7,0,0,0,0],
      [6,0,0,1,9,5,0,0,0],
      [0,9,8,0,0,0,0,6,0],
      [8,0,0,0,6,0,0,0,3],
      [4,0,0,8,0,3,0,0,1],
      [7,0,0,0,2,0,0,0,6],
      [0,6,0,0,0,0,2,8,0],
      [0,0,0,4,1,9,0,0,5],
      [0,0,0,0,8,0,0,7,9]
    ];

    const cellSize = 50;
    const startX = 640 - (9 * cellSize / 2) + 25;
    const startY = 130;

    for (let row = 0; row < 9; row++) {
      this.cells[row] = [];
      this.cellTexts[row] = [];
      this.cellGraphics[row] = [];
      for (let col = 0; col < 9; col++) {
        const value = puzzle[row][col];
        const given = value !== 0;

        this.cells[row][col] = { value, given, x: col, y: row };

        const gfx = this.scene.add.rectangle(
          startX + col * cellSize, 
          startY + row * cellSize, 
          cellSize - 4, cellSize - 4, 
          given ? 0x222244 : 0x1a1a2e, 
          1
        ).setStrokeStyle(3, 0x00ffff).setDepth(100).setInteractive();

        this.cellGraphics[row][col] = gfx;

        const text = this.scene.add.text(
          startX + col * cellSize, 
          startY + row * cellSize, 
          value === 0 ? '' : value.toString(), 
          { fontSize: '36px', color: given ? '#00ffff' : '#ffffff', fontFamily: 'Arial' }
        ).setOrigin(0.5).setDepth(110);

        this.cellTexts[row][col] = text;

        gfx.on('pointerdown', () => this.selectCell(row, col));
      }
    }

    this.updatePlacedCount();
  }

  private updatePlacedCount(): void {
    this.placedCount = {};
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const v = this.cells[row][col].value;
        if (v > 0) this.placedCount[v] = (this.placedCount[v] || 0) + 1;
      }
    }
  }

  private isValidMove(row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (this.cells[row][i].value === num && i !== col) return false;
      if (this.cells[i][col].value === num && i !== row) return false;
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.cells[boxRow + i][boxCol + j].value === num &&
            (boxRow + i !== row || boxCol + j !== col)) return false;
      }
    }
    return true;
  }

  private isComplete(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.cells[row][col].value === 0) return false;
      }
    }
    return true;
  }

  private solveBoard(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.cells[row][col].value === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isValidMove(row, col, num)) {
              this.cells[row][col].value = num;
              this.cellTexts[row][col].setText(num.toString());
              this.cellTexts[row][col].setColor('#ffffff');
              if (this.solveBoard()) return true;
              this.cells[row][col].value = 0;
              this.cellTexts[row][col].setText('');
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  public autoComplete(): void {
    this.solveBoard();
    this.updatePlacedCount();
    if (this.isComplete()) {
      console.log('%c🚀 Auto-complete triggered (dev only)', 'color: lime; font-weight: bold');
      this.scene.events.emit('puzzleComplete');
    }
  }

  private selectCell(row: number, col: number): void {
    if (this.selectedNumber > 0) {
      this.placeNumber(row, col, this.selectedNumber);
    }
  }

  public setSelectedNumber(num: number): void {
    this.selectedNumber = num;
  }

  public placeNumber(row: number, col: number, num: number): void {
    const cell = this.cells[row][col];
    if (cell.given) return;

    if (num > 0 && !this.isValidMove(row, col, num)) {
      console.log('%c❌ Invalid move!', 'color: red');
      return;
    }

    const previousValue = cell.value;
    cell.value = num;

    this.cellTexts[row][col].setText(num === 0 ? '' : num.toString());
    this.cellTexts[row][col].setColor('#ffffff');

    if (num !== 0) this.moveHistory.push({ row, col, previousValue });

    this.updatePlacedCount();

    if (this.placedCount[num] === 9) {
      console.log(`%c✅ Number ${num} completed — auto-disappear`, 'color: lime');
    }

    if (this.isComplete()) {
      console.log('%c🏆 PUZZLE COMPLETE!', 'color: lime; font-weight: bold');
      this.scene.events.emit('puzzleComplete');
    }

    console.log(`%c📍 Placed ${num} at (${row},${col})`, 'color: lime');
  }

  public undoLastMove(): void {
    const lastMove = this.moveHistory.pop();
    if (!lastMove) return;
    const { row, col, previousValue } = lastMove;
    this.cells[row][col].value = previousValue;
    this.cellTexts[row][col].setText(previousValue === 0 ? '' : previousValue.toString());
    this.updatePlacedCount();
    console.log('%c↩️ Undo performed', 'color: yellow');
  }

  public getBoardState(): Cell[][] {
    return this.cells;
  }

  public destroy(): void {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        this.cellGraphics[r][c].destroy();
        this.cellTexts[r][c].destroy();
      }
    }
  }
}