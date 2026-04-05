import Phaser from 'phaser';

export class CompletionModal {
  private scene: Phaser.Scene;
  private container!: HTMLDivElement;
  private blocker!: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  show(timeTaken: number, coinsEarned: number, mode: string, difficulty: string, replayData: any): void {
    this.blocker = this.scene.add.rectangle(640, 360, 1280, 720, 0x000000, 0.9)
      .setDepth(900)
      .setInteractive();

    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: #0a0a2a; border: 8px solid #00ffff; border-radius: 24px;
      padding: 60px; width: 560px; z-index: 1000; text-align: center;
      box-shadow: 0 0 80px rgba(0, 255, 255, 0.6);
    `;
    this.container.innerHTML = `
      <h1 style="color:#00ffff; margin:0 0 30px 0; font-size:52px;">PUZZLE COMPLETE!</h1>
      <div style="margin:20px 0; color:#ffffff; font-size:28px;">
        Time: $$   {Math.floor(timeTaken / 60)}:   $${(timeTaken % 60).toString().padStart(2, '0')}
      </div>
      <div style="margin:20px 0; color:#ffff00; font-size:28px;">
        +${coinsEarned} Cosmic Coins
      </div>
      
      <button id="replayBtn" style="margin:20px; padding:18px 60px; background:#00ff00; color:#000; border:none; border-radius:12px; font-size:26px; cursor:pointer;">
        REPLAY THIS PUZZLE
      </button>
      
      <button id="newPuzzleBtn" style="margin:20px; padding:18px 60px; background:#00aaff; color:#000; border:none; border-radius:12px; font-size:26px; cursor:pointer;">
        NEXT PUZZLE
      </button>
      
      <button id="menuBtn" style="margin:20px; padding:18px 60px; background:#ffaa00; color:#000; border:none; border-radius:12px; font-size:26px; cursor:pointer;">
        BACK TO MENU
      </button>
    `;
    document.getElementById('app')!.appendChild(this.container);

    const replayBtn = this.container.querySelector('#replayBtn') as HTMLButtonElement;
    const newPuzzleBtn = this.container.querySelector('#newPuzzleBtn') as HTMLButtonElement;
    const menuBtn = this.container.querySelector('#menuBtn') as HTMLButtonElement;

    replayBtn.addEventListener('click', () => {
      this.hide();
      this.scene.scene.restart(replayData);
    });

    newPuzzleBtn.addEventListener('click', () => {
      this.hide();   // ← immediate hide
      if (mode === 'campaign') {
        const currentLevelId = replayData.levelId || 1;
        const nextLevelId = currentLevelId + 1;
        const difficulties = ['Asteroid Belt', 'Nebula Drift', 'Star Cluster', 'Galaxy Edge', 'Supernova', 'Black Hole'];
        const nextDifficulty = difficulties[nextLevelId - 1] || 'Black Hole';
        this.scene.scene.start('GamePlayScene', { 
          mode: 'campaign', 
          levelId: nextLevelId, 
          difficulty: nextDifficulty 
        });
      } else {
        this.scene.scene.start('GamePlayScene', { mode: 'single', difficulty: difficulty });
      }
    });

    menuBtn.addEventListener('click', () => {
      this.hide();
      this.scene.scene.start('MainMenuScene');
    });
  }

  hide(): void {
    if (this.container && this.container.parentNode) this.container.parentNode.removeChild(this.container);
    if (this.blocker) this.blocker.destroy();
    console.log('%c✅ CompletionModal fully destroyed', 'color: lime');
  }
}