import Phaser from 'phaser';

export class CampaignCompletedModal {
  private scene: Phaser.Scene;
  private container!: HTMLDivElement;
  private blocker!: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  show(levelName: string, tierBonus: number, currentLevelId: number): void {
    const isFinalLevel = currentLevelId === 6;
    const buttonText = isFinalLevel ? 'BACK TO MAIN MENU' : 'CONTINUE TO NEXT LEVEL';

    this.blocker = this.scene.add.rectangle(640, 360, 1280, 720, 0x000000, 0.9)
      .setDepth(900)
      .setInteractive();

    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: #0a0a2a; border: 8px solid #ffff00; border-radius: 24px;
      padding: 60px; width: 560px; z-index: 1000; text-align: center;
      box-shadow: 0 0 80px rgba(255, 255, 0, 0.6);
    `;
    this.container.innerHTML = `
      <h1 style="color:#ffff00; margin:0 0 30px 0; font-size:52px;">LEVEL COMPLETE!</h1>
      <h2 style="color:#00ffff; margin-bottom:40px;">${levelName}</h2>
      
      <div style="margin:30px 0; color:#ffffff; font-size:28px;">
        Tier Bonus Awarded
      </div>
      
      <div style="margin:20px 0; color:#ffff00; font-size:42px; font-weight:bold;">
        +${tierBonus} Cosmic Coins
      </div>
      
      <button id="continueBtn" style="margin-top:40px; padding:18px 80px; background:#00ff00; color:#000; border:none; border-radius:12px; font-size:26px; cursor:pointer;">
        ${buttonText}
      </button>
    `;
    document.getElementById('app')!.appendChild(this.container);

    const continueBtn = this.container.querySelector('#continueBtn') as HTMLButtonElement;
    continueBtn.addEventListener('click', () => {
      this.hide();
      if (isFinalLevel) {
        this.scene.scene.start('MainMenuScene');
      } else {
        const nextLevelId = currentLevelId + 1;
        const difficulties = ['Asteroid Belt', 'Nebula Drift', 'Star Cluster', 'Galaxy Edge', 'Supernova', 'Black Hole'];
        const nextDifficulty = difficulties[nextLevelId - 1];
        this.scene.scene.start('GamePlayScene', { 
          mode: 'campaign', 
          levelId: nextLevelId, 
          difficulty: nextDifficulty 
        });
      }
    });
  }

  hide(): void {
    if (this.container && this.container.parentNode) this.container.parentNode.removeChild(this.container);
    if (this.blocker) this.blocker.destroy();
    console.log('%c🏆 CampaignCompletedModal fully destroyed', 'color: lime');
  }
}