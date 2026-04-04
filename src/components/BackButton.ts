import Phaser from 'phaser';

export class BackButton {
  private scene: Phaser.Scene;
  private button!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.create();
  }

  private create(): void {
    // Back button at bottom-left, EXACT same y as number pad (630)
    // aligned horizontally with Profile button above
    this.button = this.scene.add.text(160, 630, '← BACK', {
      fontSize: '28px',
      color: '#00ffff',
      fontFamily: 'Arial',
      backgroundColor: '#222244',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setDepth(200).setInteractive();

    this.button.on('pointerdown', () => {
      console.log('%c← Returning to MainMenuScene', 'color: cyan');
      this.scene.scene.start('MainMenuScene');
    });

    // Hover effect
    this.button.on('pointerover', () => {
      this.button.setStyle({ color: '#ffffff' });
    });

    this.button.on('pointerout', () => {
      this.button.setStyle({ color: '#00ffff' });
    });

    console.log('%c← BackButton created (perfectly aligned with number pad)', 'color: cyan; font-size: 14px');
  }
}