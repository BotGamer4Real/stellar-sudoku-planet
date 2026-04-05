import Phaser from 'phaser';
import { TopBar } from '../components/TopBar';
import { SinglePlayerModal } from '../modals/SinglePlayerModal';
import { CampaignSelectModal } from '../modals/CampaignSelectModal';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create(): void {
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
      color: '#00ccff',
      fontFamily: 'Arial',
      backgroundColor: '#222244',
      padding: { x: 40, y: 15 }
    }).setOrigin(0.5).setInteractive();

    const dailyBtn = this.add.text(640, 540, 'DAILY CHALLENGE', {
      fontSize: '32px',
      color: '#ffaa00',
      fontFamily: 'Arial',
      backgroundColor: '#222244',
      padding: { x: 40, y: 15 }
    }).setOrigin(0.5).setInteractive();

    singlePlayerBtn.on('pointerdown', () => {
      const modal = new SinglePlayerModal(this);
      modal.show();
    });

    campaignBtn.on('pointerdown', async () => {
      const modal = new CampaignSelectModal(this);
      await modal.show();
    });

    dailyBtn.on('pointerdown', () => {
      console.log('%c📅 Daily Challenge selected (coming in Step 29)', 'color: orange');
    });

    console.log('%c🏠 MainMenuScene ready with CampaignSelectModal', 'color: cyan; font-size: 14px');
  }
}