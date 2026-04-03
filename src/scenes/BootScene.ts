import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    // Minimal placeholder assets only — no real artwork yet
    this.load.image('placeholder', 'https://picsum.photos/id/1015/64/64');
  }

  create(): void {
    // Core-first minimal visuals
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

    this.add.text(640, 450, 'Loading Auth Scene...', {
      fontSize: '18px',
      color: '#aaaaaa',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    console.log('%c🚀 BootScene complete — advancing to AuthScene', 'color: cyan; font-size: 14px');

    // Auto-advance to real AuthScene
    this.scene.start('AuthScene');
  }
}