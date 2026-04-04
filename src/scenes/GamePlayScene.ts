import Phaser from 'phaser';
import { SudokuBoard } from '../game/SudokuBoard';
import { TopBar } from '../components/TopBar';

export class GamePlayScene extends Phaser.Scene {
  private board!: SudokuBoard;
  private ghostText: Phaser.GameObjects.Text | null = null;

  constructor() {
    super('GamePlayScene');
  }

  create(): void {
    new TopBar(this);

    this.board = new SudokuBoard(this);

    const cellSize = 50;
    const startX = 640 - (9 * cellSize / 2) + 25;
    const startY = 130;

    // Number pad — draggable with ghost preview
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
      ).setOrigin(0.5).setDepth(200);

      btn.setInteractive({ draggable: true });

      btn.on('dragstart', (pointer: Phaser.Input.Pointer) => {
        this.board.setSelectedNumber(i);

        if (this.ghostText) this.ghostText.destroy();
        this.ghostText = this.add.text(
          pointer.x, pointer.y, i.toString(), 
          { fontSize: '48px', color: '#00ffff', fontFamily: 'Arial' }
        ).setOrigin(0.5).setDepth(300);
      });

      btn.on('drag', (pointer: Phaser.Input.Pointer) => {
        if (this.ghostText) this.ghostText.setPosition(pointer.x, pointer.y);
      });

      btn.on('dragend', (pointer: Phaser.Input.Pointer) => {
        if (this.ghostText) {
          this.ghostText.destroy();
          this.ghostText = null;
        }

        // Improved drop detection with tolerance and Math.round
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const col = Math.round((worldPoint.x - startX) / cellSize);
        const row = Math.round((worldPoint.y - startY) / cellSize);

        if (col >= 0 && col < 9 && row >= 0 && row < 9) {
          this.board.placeNumber(row, col, i);
        }
        this.board.setSelectedNumber(0);
      });
    }

    this.add.text(640, 710, 'Drag numbers onto the grid or click to place', {
      fontSize: '18px',
      color: '#aaaaaa',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    console.log('%c🎮 GamePlayScene ready with improved drag-and-drop precision', 'color: cyan; font-size: 14px');
  }
}