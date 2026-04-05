import Phaser from 'phaser';
import { getCampaignProgress } from '../services/supabaseClient';

const LEVEL_NAMES = [
  'Asteroid Belt Outpost',
  'Nebula Drift Station',
  'Star Cluster Frontier',
  'Galaxy Edge Observatory',
  'Supernova Core',
  'Black Hole Abyss'
];

const DIFFICULTY_NAMES = [
  'Asteroid Belt',
  'Nebula Drift',
  'Star Cluster',
  'Galaxy Edge',
  'Supernova',
  'Black Hole'
];

export class CampaignSelectModal {
  private scene: Phaser.Scene;
  private container!: HTMLDivElement;
  private blocker!: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  async show(): Promise<void> {
    const progress = await getCampaignProgress();
    let highestUnlocked = 1;
    for (let i = 1; i <= 6; i++) {
      if ((progress[i] || 0) >= 20) highestUnlocked = i + 1;
    }
    highestUnlocked = Math.min(highestUnlocked, 6);

    this.blocker = this.scene.add.rectangle(640, 360, 1280, 720, 0x000000, 0.9)
      .setDepth(900)
      .setInteractive();

    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: #0a0a2a; border: 6px solid #00ffff; border-radius: 20px;
      padding: 40px; width: 620px; z-index: 1000; text-align: center;
      box-shadow: 0 0 60px rgba(0, 255, 255, 0.6);
    `;
    this.container.innerHTML = `
      <h2 style="color:#00ffff; margin-bottom:30px; font-size:42px;">CAMPAIGN MAP</h2>
      <div style="display:flex; flex-wrap:wrap; gap:20px; justify-content:center;">
        ${LEVEL_NAMES.map((name, i) => {
          const level = i + 1;
          const completed = Math.min(progress[level] || 0, 20);
          const unlocked = level <= highestUnlocked;
          const color = unlocked ? '#00ffff' : '#555577';
          return `
            <div id="level-${level}" style="width:160px; text-align:center; cursor:pointer; opacity:${unlocked ? 1 : 0.4};">
              <div style="font-size:80px; margin-bottom:8px;">🪐</div>
              <div style="color:${color}; font-size:18px; font-weight:bold;">${name}</div>
              <div style="color:#aaaaaa; font-size:14px;">Level ${level}</div>
              <div style="color:#ffff00; font-size:14px;">${completed}/20</div>
            </div>
          `;
        }).join('')}
      </div>
      <button id="closeBtn" style="margin-top:30px; padding:16px 60px; background:#00aaff; color:#ffffff; border:none; border-radius:10px; font-size:24px; cursor:pointer;">
        CLOSE MAP
      </button>
    `;
    document.getElementById('app')!.appendChild(this.container);

    // Click handlers for planets
    for (let i = 1; i <= 6; i++) {
      const el = this.container.querySelector(`#level-${i}`) as HTMLDivElement;
      if (el) {
        el.addEventListener('click', () => {
          if (i > highestUnlocked) return;
          this.hide();
          this.scene.scene.start('GamePlayScene', {
            mode: 'campaign',
            levelId: i,
            difficulty: DIFFICULTY_NAMES[i - 1]
          });
        });
      }
    }

    const closeBtn = this.container.querySelector('#closeBtn') as HTMLButtonElement;
    closeBtn.addEventListener('click', () => this.hide());
  }

  hide(): void {
    if (this.container && this.container.parentNode) this.container.parentNode.removeChild(this.container);
    if (this.blocker) this.blocker.destroy();
  }
}