import Phaser from 'phaser';
import { TopBar } from '../components/TopBar';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create(): void {
    // Add persistent TopBar (Settings button at top-right)
    new TopBar(this);   // no stored reference needed

    this.add.text(640, 200, 'MAIN MENU', {
      fontSize: '48px',
      color: '#00ffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(640, 300, 'Welcome to Stellar Sudoku', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    const singlePlayerBtn = this.add.text(640, 400, 'SINGLE PLAYER', {
      fontSize: '32px',
      color: '#00ff00',
      fontFamily: 'Arial',
      backgroundColor: '#222244',
      padding: { x: 40, y: 15 }
    }).setOrigin(0.5).setInteractive();

    const campaignBtn = this.add.text(640, 470, 'CAMPAIGN', {
      fontSize: '32px',
      color: '#00ff00',
      fontFamily: 'Arial',
      backgroundColor: '#222244',
      padding: { x: 40, y: 15 }
    }).setOrigin(0.5).setInteractive();

    const dailyBtn = this.add.text(640, 540, 'DAILY CHALLENGE', {
      fontSize: '32px',
      color: '#00ff00',
      fontFamily: 'Arial',
      backgroundColor: '#222244',
      padding: { x: 40, y: 15 }
    }).setOrigin(0.5).setInteractive();

    singlePlayerBtn.on('pointerdown', () => console.log('%c🎮 Single Player selected', 'color: lime'));
    campaignBtn.on('pointerdown', () => console.log('%c🏆 Campaign selected', 'color: lime'));
    dailyBtn.on('pointerdown', () => console.log('%c📅 Daily Challenge selected', 'color: lime'));

    console.log('%c🏠 MainMenuScene loaded with reusable TopBar', 'color: cyan; font-size: 14px');
  }
}