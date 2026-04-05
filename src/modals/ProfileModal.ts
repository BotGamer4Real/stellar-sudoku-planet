import Phaser from 'phaser';
import { getProfile, resetCampaignProgress } from '../services/supabaseClient';

export class ProfileModal {
  private scene: Phaser.Scene;
  private container!: HTMLDivElement;
  private blocker!: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  async show(): Promise<void> {
    const profile = await getProfile();

    this.blocker = this.scene.add.rectangle(640, 360, 1280, 720, 0x000000, 0.85)
      .setDepth(900)
      .setInteractive();

    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: #1a1a2e; border: 4px solid #00ffff; border-radius: 16px;
      padding: 40px; width: 480px; z-index: 1000; text-align: center;
      box-shadow: 0 0 40px rgba(0, 255, 255, 0.4);
    `;
    this.container.innerHTML = `
      <h2 style="color:#00ffff; margin-bottom:30px;">PROFILE</h2>
      <div style="margin:20px 0; color:#ffffff; font-size:22px;">
        Username: <span style="color:#ffff00;">${profile?.username || 'Unknown'}</span>
      </div>
      <div style="margin:20px 0; color:#ffffff; font-size:22px;">
        Cosmic Coins: <span style="color:#ffff00;">${profile?.coins || 0}</span>
      </div>
      
      <button id="resetCampaignBtn" style="margin:20px; padding:14px 40px; background:#ff4444; color:#ffffff; border:none; border-radius:10px; font-size:20px; cursor:pointer;">
        RESET CAMPAIGN PROGRESS (TESTING)
      </button>
      
      <button id="closeBtn" style="margin-top:30px; padding:14px 60px; background:#00aaff; color:#ffffff; border:none; border-radius:10px; font-size:22px; cursor:pointer;">
        CLOSE PROFILE
      </button>
    `;
    document.getElementById('app')!.appendChild(this.container);

    const resetBtn = this.container.querySelector('#resetCampaignBtn') as HTMLButtonElement;
    const closeBtn = this.container.querySelector('#closeBtn') as HTMLButtonElement;

    resetBtn.addEventListener('click', async () => {
      if (confirm('Reset ALL Campaign progress to 0/20?\n\nThis is for testing only.')) {
        const { error } = await resetCampaignProgress();
        if (error) {
          console.error('Reset error:', error);
          alert('Reset failed');
        } else {
          alert('Campaign progress has been reset');
          this.hide();
          // Refresh the modal with updated data
          const newModal = new ProfileModal(this.scene);
          newModal.show();
        }
      }
    });

    closeBtn.addEventListener('click', () => this.hide());
  }

  hide(): void {
    if (this.container && this.container.parentNode) this.container.parentNode.removeChild(this.container);
    if (this.blocker) this.blocker.destroy();
  }
}