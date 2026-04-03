import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: '#0a0a2a', // cosmic dark placeholder
  parent: 'app',
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: [BootScene]
};

new Phaser.Game(config);