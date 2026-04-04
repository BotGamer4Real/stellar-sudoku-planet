import Phaser from 'phaser';
import { SudokuBoard } from '../game/SudokuBoard';
import { TopBar } from '../components/TopBar';
import { BackButton } from '../components/BackButton';
import { CompletionModal } from '../modals/CompletionModal';
import { getProfile } from '../services/supabaseClient';
import { addCoins, isFirstCompletion, markPuzzleCompleted } from '../services/supabaseClient';
import { SudokuGenerator } from '../game/SudokuGenerator';

export class GamePlayScene extends Phaser.Scene {
  private board!: SudokuBoard;
  private ghostText: Phaser.GameObjects.Text | null = null;
  private startTime: number = 0;
  private timerText!: Phaser.GameObjects.Text;
  private completionModal!: CompletionModal;
  private difficulty: string = 'Asteroid Belt';
  private puzzleHash: string = '';
  private currentPuzzleData: any = {};

  constructor() {
    super('GamePlayScene');
  }

  create(data?: any): void {
    new TopBar(this);
    new BackButton(this);

    this.difficulty = data?.difficulty || 'Asteroid Belt';
    this.currentPuzzleData = data || { difficulty: this.difficulty };

    let generatedPuzzle: number[][] | undefined = data?.puzzle;
    let generatedHash: string = data?.hash || '';
    if (!generatedPuzzle) {
      const generator = new SudokuGenerator();
      const { puzzle, hash } = generator.generate(this.difficulty);
      generatedPuzzle = puzzle;
      generatedHash = hash;
      this.currentPuzzleData = { mode: 'single', difficulty: this.difficulty, puzzle, hash };
    }

    this.puzzleHash = generatedHash;
    this.board = new SudokuBoard(this, generatedPuzzle);

    const cellSize = 50;
    const startX = 640 - (9 * cellSize / 2) + 25;
    const startY = 130;

    // Number pad
    for (let i = 1; i <= 9; i++) {
      const btn = this.add.text(
        startX + (i - 1) * cellSize, 
        630, 
        i.toString(), 
        {
          fontSize: '38px',
          color: '#00ff00',
          fontFamily: 'Arial',
          backgroundColor: '#222244',
          padding: { x: 16, y: 8 }
        }
      ).setOrigin(0.5).setDepth(200);

      btn.setInteractive({ draggable: true });

      btn.on('dragstart', (pointer: Phaser.Input.Pointer) => {
        this.board.setSelectedNumber(i);
        if (this.ghostText) this.ghostText.destroy();
        this.ghostText = this.add.text(pointer.x, pointer.y, i.toString(), 
          { fontSize: '48px', color: '#00ffff', fontFamily: 'Arial' }
        ).setOrigin(0.5).setDepth(300);
      });

      btn.on('drag', (pointer: Phaser.Input.Pointer) => {
        if (this.ghostText) this.ghostText.setPosition(pointer.x, pointer.y);
      });

      btn.on('dragend', (pointer: Phaser.Input.Pointer) => {
        if (this.ghostText) {
          this.ghostText.destroy();
          this.ghostText = null;
        }
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const col = Math.round((worldPoint.x - startX) / cellSize);
        const row = Math.round((worldPoint.y - startY) / cellSize);
        if (col >= 0 && col < 9 && row >= 0 && row < 9) {
          this.board.placeNumber(row, col, i);
        }
        this.board.setSelectedNumber(0);
      });
    }

    this.startTime = Date.now();
    this.timerText = this.add.text(640, 80, '0:00', {
      fontSize: '32px',
      color: '#ffff00',
      fontFamily: 'Arial'
    }).setOrigin(0.5).setDepth(200);

    const undoBtn = this.add.text(280, 380, '↩️', {
      fontSize: '42px',
      color: '#00ffff',
      fontFamily: 'Arial',
      backgroundColor: '#222244',
      padding: { x: 12, y: 8 }
    }).setOrigin(0.5).setDepth(200).setInteractive();

    undoBtn.on('pointerdown', () => this.board.undoLastMove());

    this.checkForDevAutoCompleteButton();

    // Use once to prevent multiple completion events (this was the source of the 40-coin bug)
    this.events.once('puzzleComplete', () => this.showCompletionModal());

    console.log(`%c🎮 GamePlayScene started with difficulty: ${this.difficulty}`, 'color: cyan; font-size: 14px');
  }

  private async checkForDevAutoCompleteButton(): Promise<void> {
    const profile = await getProfile();
    if (profile?.username === 'BotGamer4Real') {
      const autoBtn = this.add.text(160, 570, 'AUTO', {
        fontSize: '28px',
        color: '#ffff00',
        fontFamily: 'Arial',
        backgroundColor: '#222244',
        padding: { x: 20, y: 10 }
      }).setOrigin(0.5).setDepth(200).setInteractive();

      autoBtn.on('pointerdown', () => {
        console.log('%c🚀 Dev auto-complete activated', 'color: yellow; font-weight: bold');
        this.board.autoComplete();
      });
    }
  }

  update(): void {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    this.timerText.setText(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
  }

  private async showCompletionModal(): Promise<void> {
    const elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);

    const coinMap: { [key: string]: number } = {
      'Asteroid Belt': 10,
      'Nebula Drift': 25,
      'Star Cluster': 50,
      'Galaxy Edge': 80,
      'Supernova': 150,
      'Black Hole': 250
    };
    const coinsEarned = coinMap[this.difficulty] || 10;

    console.log(`%cCoin calculation - Difficulty: "${this.difficulty}", Coins to award: ${coinsEarned}`, 'color: yellow');

    let actualCoins = 0;
    if (this.puzzleHash && await isFirstCompletion(this.puzzleHash)) {
      actualCoins = coinsEarned;
      const { error } = await addCoins(actualCoins);
      if (error) console.error('Coin update error:', error);
      await markPuzzleCompleted(this.puzzleHash);
      console.log(`%c💰 First completion — awarded ${actualCoins} coins for ${this.difficulty}`, 'color: lime');
    } else {
      console.log('%c🔄 Replay — no coins awarded (already completed)', 'color: orange');
    }

    this.completionModal = new CompletionModal(this);
    this.completionModal.show(elapsedSeconds, actualCoins, 'single', this.difficulty, this.currentPuzzleData);
  }
}