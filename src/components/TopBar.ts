import Phaser from 'phaser';
import { SettingsModal } from '../modals/SettingsModal';
import { ProfileModal } from '../modals/ProfileModal';
import { getProfile, subscribeToProfile } from '../services/supabaseClient';

export class TopBar {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private coinsDisplay!: Phaser.GameObjects.Text;
  private unsubscribe!: () => void;

  constructor(scene: Phaser.Scene, title: string = '') {
    this.scene = scene;
    this.create(title);
  }

  private async create(title: string): Promise<void> {
    this.container = this.scene.add.container(0, 0);

    // Taller bar to fit Profile + Coins + Level title
    const bar = this.scene.add.rectangle(640, 65, 1280, 160, 0x0a0a2a, 0.95).setDepth(800);
    this.container.add(bar);

    // Profile button (top-left)
    const profileBtn = this.scene.add.text(160, 40, '👤 PROFILE', {
      fontSize: '24px', color: '#00ffff', fontFamily: 'Arial',
      backgroundColor: '#222244', padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setDepth(810).setInteractive();

    // Cosmic coins directly below Profile (left side)
    this.coinsDisplay = this.scene.add.text(160, 88, '🪙 0', {
      fontSize: '28px', color: '#ffff00', fontFamily: 'Arial',
      backgroundColor: '#222244', padding: { x: 24, y: 8 }
    }).setOrigin(0.5).setDepth(810);

    // Settings button (top-right)
    const settingsBtn = this.scene.add.text(1180, 40, '⚙️ SETTINGS', {
      fontSize: '24px', color: '#00ffff', fontFamily: 'Arial',
      backgroundColor: '#222244', padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setDepth(810).setInteractive();

    // Level indicator centered inside TopBar
    if (title) {
      const titleText = this.scene.add.text(640, 125, title, {
        fontSize: '28px',
        color: '#ffff00',
        fontFamily: 'Arial',
        fontStyle: 'bold'
      }).setOrigin(0.5).setDepth(810);
      this.container.add(titleText);
    }

    this.container.add(profileBtn);
    this.container.add(this.coinsDisplay);
    this.container.add(settingsBtn);

    // Initial load
    const profile = await getProfile();
    if (profile) this.coinsDisplay.setText(`🪙 ${profile.coins || 0}`);

    // Realtime updates
    this.unsubscribe = subscribeToProfile((updatedProfile) => {
      if (updatedProfile) this.coinsDisplay.setText(`🪙 ${updatedProfile.coins || 0}`);
    });

    profileBtn.on('pointerdown', () => {
      const modal = new ProfileModal(this.scene);
      modal.show();
    });

    settingsBtn.on('pointerdown', () => {
      const modal = new SettingsModal(this.scene);
      modal.show();
    });

    this.scene.events.once('shutdown', () => this.destroy());
  }

  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = () => {};
    }
    if (this.container) this.container.destroy();
    console.log('%c✅ TopBar realtime subscription cleaned up', 'color: lime');
  }
}