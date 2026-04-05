import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    console.log('%c🚀 BootScene loaded - forcing transition to AuthScene', 'color: cyan; font-size: 18px; font-weight: bold');

    // Minimal placeholder background
    this.add.rectangle(640, 360, 1280, 720, 0x001133).setOrigin(0.5);

    this.add.text(640, 200, 'STELLAR SUDOKU PLANET', {
      fontSize: '48px',
      color: '#00ffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(640, 320, 'Loading Auth Scene...', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Force transition with safety
    try {
      this.scene.start('AuthScene');
      console.log('%c✅ Transition to AuthScene called', 'color: lime');
    } catch (e) {
      console.error('🚨 BootScene transition failed:', e);
    }
  }
}