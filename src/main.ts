import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { AuthScene } from './scenes/AuthScene';
import { MainMenuScene } from './scenes/MainMenuScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: '#0a0a2a',
  parent: 'app',
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720
  },
  // All scenes registered so dynamic scene.start() works reliably
  scene: [BootScene, AuthScene, MainMenuScene]
};

new Phaser.Game(config);