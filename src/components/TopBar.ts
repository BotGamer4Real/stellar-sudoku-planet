import Phaser from 'phaser';
import { SettingsModal } from '../modals/SettingsModal';
import { ProfileModal } from '../modals/ProfileModal';
import { getProfile, subscribeToProfile } from '../services/supabaseClient';

export class TopBar {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private coinsDisplay!: Phaser.GameObjects.Text;
  private unsubscribe!: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.create();
  }

  private async create(): Promise<void> {
    this.container = this.scene.add.container(0, 0);

    const bar = this.scene.add.rectangle(640, 40, 1280, 80, 0x0a0a2a, 0.95).setDepth(800);
    this.container.add(bar);

    const profileBtn = this.scene.add.text(160, 40, '👤 PROFILE', {
      fontSize: '24px', color: '#00ffff', fontFamily: 'Arial',
      backgroundColor: '#222244', padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setDepth(810).setInteractive();

    this.coinsDisplay = this.scene.add.text(640, 40, '🪙 0', {
      fontSize: '28px', color: '#ffff00', fontFamily: 'Arial',
      backgroundColor: '#222244', padding: { x: 24, y: 8 }
    }).setOrigin(0.5).setDepth(810);

    const settingsBtn = this.scene.add.text(1180, 40, '⚙️ SETTINGS', {
      fontSize: '24px', color: '#00ffff', fontFamily: 'Arial',
      backgroundColor: '#222244', padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setDepth(810).setInteractive();

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
  }

  destroy(): void {
    if (this.unsubscribe) this.unsubscribe();
    if (this.container) this.container.destroy();
  }
}