import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    // Minimal placeholder assets only — no real artwork yet
    this.load.image('placeholder', 'https://picsum.photos/id/1015/64/64'); // temporary cosmic placeholder
  }

  create(): void {
    // Core-first minimal visuals — direct add (no unused variables)
    this.add.text(640, 300, 'STELLAR SUDOKU PLANET', {
      fontSize: '48px',
      color: '#00ffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(640, 380, 'Core Gameplay Loop - DevGROK Phase', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(640, 450, 'Drag-and-drop Sudoku ready for implementation', {
      fontSize: '18px',
      color: '#aaaaaa',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Click anywhere to advance (future main menu)
    this.input.on('pointerdown', () => {
      console.log('%c✅ Core Phaser scene loaded and interactive', 'color: lime; font-weight: bold');
    });

    console.log('%c🚀 Stellar Sudoku Planet - BootScene ready (minimal visuals only)', 'color: cyan; font-size: 14px');
  }
}