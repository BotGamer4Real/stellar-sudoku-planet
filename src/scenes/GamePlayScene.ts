import Phaser from 'phaser';
import { SudokuBoard } from '../game/SudokuBoard';
import { TopBar } from '../components/TopBar';

export class GamePlayScene extends Phaser.Scene {
  private board!: SudokuBoard;

  constructor() {
    super('GamePlayScene');
  }

  create(): void {
    new TopBar(this);

    this.board = new SudokuBoard(this);

    // Number pad — perfectly aligned under grid columns, placed directly below the grid
    const cellSize = 50;
    const startX = 640 - (9 * cellSize / 2) + 25;   // exact same as SudokuBoard

    for (let i = 1; i <= 9; i++) {
      const btn = this.add.text(
        startX + (i - 1) * cellSize, 
        630, 
        i.toString(), 
        {
          fontSize: '38px',
          color: '#00ff00',
          fontFamily: 'Arial',
          backgroundColor: '#222244',
          padding: { x: 16, y: 8 }
        }
      ).setOrigin(0.5).setInteractive().setDepth(200);

      btn.on('pointerdown', () => {
        this.board.setSelectedNumber(i);
        console.log(`%c🔢 Selected number ${i}`, 'color: lime');
      });
    }

    console.log('%c🎮 GamePlayScene ready — number pad aligned under grid', 'color: cyan; font-size: 14px');
  }
}