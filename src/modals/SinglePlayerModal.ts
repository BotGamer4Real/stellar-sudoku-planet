import Phaser from 'phaser';
import { SudokuGenerator } from '../game/SudokuGenerator';

const DIFFICULTIES = [
  { name: 'Asteroid Belt', label: 'Easy', color: '#00ff00' },
  { name: 'Nebula Drift', label: 'Medium', color: '#00ccff' },
  { name: 'Star Cluster', label: 'Hard', color: '#ffaa00' },
  { name: 'Galaxy Edge', label: 'Expert', color: '#ff00aa' },
  { name: 'Supernova', label: 'Master', color: '#ff0000' },
  { name: 'Black Hole', label: 'Extreme', color: '#8800ff' }
];

export class SinglePlayerModal {
  private scene: Phaser.Scene;
  private container!: HTMLDivElement;
  private blocker!: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  show(): void {
    this.blocker = this.scene.add.rectangle(640, 360, 1280, 720, 0x000000, 0.85)
      .setDepth(900)
      .setInteractive();

    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: #1a1a2e; border: 4px solid #00ffff; border-radius: 16px;
      padding: 40px; width: 520px; z-index: 1000; text-align: center;
      box-shadow: 0 0 40px rgba(0, 255, 255, 0.4);
    `;
    this.container.innerHTML = `
      <h2 style="color:#00ffff; margin-bottom:30px;">SINGLE PLAYER</h2>
      <h3 style="color:#aaaaaa; margin-bottom:20px;">Choose Difficulty</h3>
    `;

    DIFFICULTIES.forEach(diff => {
      const btn = document.createElement('button');
      btn.style.cssText = `
        display:block; width:100%; margin:8px 0; padding:16px; 
        background:#222244; color:${diff.color}; border:2px solid ${diff.color};
        font-size:22px; border-radius:8px; cursor:pointer;
      `;
      btn.textContent = `${diff.name} — ${diff.label}`;
      btn.addEventListener('click', () => this.selectDifficulty(diff.name));
      this.container.appendChild(btn);
    });

    document.getElementById('app')!.appendChild(this.container);
  }

  private selectDifficulty(difficultyName: string): void {
    console.log(`%c🎯 Single Player selected: ${difficultyName}`, 'color: lime');
    
    const generator = new SudokuGenerator();
    const puzzle = generator.generate(difficultyName);

    this.hide();
    this.scene.scene.start('GamePlayScene', { 
      mode: 'single', 
      difficulty: difficultyName,
      puzzle: puzzle 
    });
  }

  hide(): void {
    if (this.container && this.container.parentNode) this.container.parentNode.removeChild(this.container);
    if (this.blocker) this.blocker.destroy();
  }
}