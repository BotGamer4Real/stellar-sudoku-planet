import Phaser from 'phaser';
import { TopBar } from '../components/TopBar';
import { SinglePlayerModal } from '../modals/SinglePlayerModal';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create(): void {
    // Persistent TopBar (Profile + Coins + Settings)
    new TopBar(this);

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

    singlePlayerBtn.on('pointerdown', () => {
      console.log('%c🚀 Opening Single Player difficulty modal', 'color: cyan');
      const modal = new SinglePlayerModal(this);
      modal.show();
    });

    campaignBtn.on('pointerdown', () => console.log('%c🏆 Campaign selected (coming soon)', 'color: lime'));
    dailyBtn.on('pointerdown', () => console.log('%c📅 Daily Challenge selected (coming soon)', 'color: lime'));

    console.log('%c🏠 MainMenuScene loaded with Single Player modal', 'color: cyan; font-size: 14px');
  }
}