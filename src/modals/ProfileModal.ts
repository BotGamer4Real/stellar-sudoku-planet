import Phaser from 'phaser';
import { getProfile } from '../services/supabaseClient';

export class ProfileModal {
  private scene: Phaser.Scene;
  private container!: HTMLDivElement;
  private blocker!: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  async show(): Promise<void> {
    // Blocker (dark overlay)
    this.blocker = this.scene.add.rectangle(640, 360, 1280, 720, 0x000000, 0.85)
      .setDepth(900)
      .setInteractive();

    // Modal container
    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: #1a1a2e; border: 4px solid #00ffff; border-radius: 16px;
      padding: 40px; width: 480px; z-index: 1000; text-align: center;
      box-shadow: 0 0 40px rgba(0, 255, 255, 0.4);
    `;
    this.container.innerHTML = `
      <h2 style="color:#00ffff; margin-bottom:30px;">PROFILE</h2>
      
      <div style="margin:20px 0; color:#ffffff; font-size:20px;">
        Username: <span id="usernameDisplay" style="color:#00ffaa; font-weight:bold;">Loading...</span>
      </div>
      
      <div style="margin:20px 0; color:#ffffff; font-size:20px;">
        Cosmic Coins: <span id="coinsDisplay" style="color:#ffff00;">0</span>
      </div>
      
      <div style="margin:30px 0; text-align:left; color:#aaaaaa;">
        <strong>Stats</strong><br>
        Total Solves: <span id="solvesDisplay">0</span><br>
        Best Time (Easy): <span id="bestTimeDisplay">—</span>
      </div>
      
      <button id="closeBtn" style="margin-top:30px; padding:14px 40px; background:#00ff00; color:#000; border:none; border-radius:8px; font-size:20px; cursor:pointer;">
        CLOSE
      </button>
    `;
    document.getElementById('app')!.appendChild(this.container);

    // Load real profile data (username is now display-only)
    const profile = await getProfile();
    if (profile) {
      (this.container.querySelector('#usernameDisplay') as HTMLElement).textContent = profile.username || 'BotGamer4Real';
      (this.container.querySelector('#coinsDisplay') as HTMLElement).textContent = profile.coins || '0';
    }

    this.container.querySelector('#closeBtn')!.addEventListener('click', () => this.hide());
  }

  hide(): void {
    if (this.container && this.container.parentNode) this.container.parentNode.removeChild(this.container);
    if (this.blocker) this.blocker.destroy();
  }
}