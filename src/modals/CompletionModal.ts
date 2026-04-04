import Phaser from 'phaser';

export class CompletionModal {
  private scene: Phaser.Scene;
  private container!: HTMLDivElement;
  private blocker!: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  show(timeTaken: number, coinsEarned: number, _mode: string, _difficulty: string): void {
    // === PREVENT STACKING ===
    // Remove any leftover modal from previous game
    const existing = document.getElementById('completion-modal');
    if (existing) existing.remove();

    // Blocker (same as SinglePlayerModal)
    this.blocker = this.scene.add.rectangle(640, 360, 1280, 720, 0x000000, 0.9)
      .setDepth(900)
      .setInteractive();

    // Modal container
    this.container = document.createElement('div');
    this.container.id = 'completion-modal';   // unique ID for cleanup
    this.container.style.cssText = `
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: #1a1a2e; border: 6px solid #00ffff; border-radius: 20px;
      padding: 50px; width: 520px; z-index: 1000; text-align: center;
      box-shadow: 0 0 50px rgba(0, 255, 255, 0.5);
    `;
    this.container.innerHTML = `
      <h1 style="color:#00ffff; margin:0 0 20px 0; font-size:48px;">PUZZLE COMPLETE!</h1>
      
      <div style="margin:25px 0; color:#ffffff; font-size:24px;">
        Time: <span style="color:#ffff00;">${timeTaken} seconds</span>
      </div>
      
      <div style="margin:25px 0; color:#ffffff; font-size:24px;">
        Coins Earned: <span style="color:#ffff00;">+${coinsEarned}</span>
      </div>
      
      <button id="replayBtn" style="margin:15px; padding:16px 40px; background:#00ff00; color:#000; border:none; border-radius:10px; font-size:24px; cursor:pointer;">
        REPLAY THIS PUZZLE
      </button>
      
      <button id="menuBtn" style="margin:15px; padding:16px 40px; background:#00aaff; color:#ffffff; border:none; border-radius:10px; font-size:24px; cursor:pointer;">
        BACK TO MENU
      </button>
    `;
    document.getElementById('app')!.appendChild(this.container);

    // Buttons – hide immediately, then navigate
    const replayBtn = this.container.querySelector('#replayBtn') as HTMLButtonElement;
    const menuBtn = this.container.querySelector('#menuBtn') as HTMLButtonElement;

    replayBtn.addEventListener('click', () => {
      console.log('%c🔄 Replay clicked — hiding modal instantly', 'color: lime');
      this.hide();
      this.scene.scene.restart();
    });

    menuBtn.addEventListener('click', () => {
      console.log('%c🏠 Menu clicked — hiding modal instantly', 'color: lime');
      this.hide();
      this.scene.scene.start('MainMenuScene');
    });
  }

  hide(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    if (this.blocker) {
      this.blocker.destroy();
    }
    console.log('%c✅ CompletionModal fully destroyed (no stacking)', 'color: lime');
  }
}