import Phaser from 'phaser';
import { getProfile, updateProfile } from '../services/supabaseClient';

export class SettingsModal {
  private scene: Phaser.Scene;
  private container!: HTMLDivElement;
  private blocker!: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  async show(): Promise<void> {
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
      <h2 style="color:#00ffff; margin-bottom:30px;">SETTINGS</h2>
      
      <div style="margin:20px 0; text-align:left;">
        <label style="color:#ffffff; display:block; margin-bottom:8px;">Music Volume</label>
        <input type="range" id="musicVolume" min="0" max="1" step="0.01" value="0.8" style="width:100%;">
      </div>
      
      <div style="margin:20px 0; text-align:left;">
        <label style="color:#ffffff; display:block; margin-bottom:8px;">SFX Volume</label>
        <input type="range" id="sfxVolume" min="0" max="1" step="0.01" value="0.8" style="width:100%;">
      </div>
      
      <div style="margin:20px 0; display:flex; align-items:center; gap:12px;">
        <input type="checkbox" id="darkMode" checked style="width:20px;height:20px;">
        <label for="darkMode" style="color:#ffffff;">Dark Mode</label>
      </div>
      
      <div style="margin:20px 0; display:flex; align-items:center; gap:12px;">
        <input type="checkbox" id="pencilNotes" style="width:20px;height:20px;">
        <label for="pencilNotes" style="color:#ffffff;">Enable Pencil Notes (default OFF)</label>
      </div>
      
      <button id="closeBtn" style="margin-top:30px; padding:14px 40px; background:#00ff00; color:#000; border:none; border-radius:8px; font-size:20px; cursor:pointer;">
        CLOSE
      </button>
    `;
    document.getElementById('app')!.appendChild(this.container);

    // Load current settings from Supabase
    const profile = await getProfile();
    if (profile && profile.settings) {
      (this.container.querySelector('#musicVolume') as HTMLInputElement).value = profile.settings.musicVolume || '0.8';
      (this.container.querySelector('#sfxVolume') as HTMLInputElement).value = profile.settings.sfxVolume || '0.8';
      (this.container.querySelector('#darkMode') as HTMLInputElement).checked = profile.settings.darkMode !== false;
      (this.container.querySelector('#pencilNotes') as HTMLInputElement).checked = profile.settings.pencilNotesEnabled || false;
    }

    this.container.querySelector('#closeBtn')!.addEventListener('click', async () => {
      // Save settings before closing
      const musicVolume = parseFloat((this.container.querySelector('#musicVolume') as HTMLInputElement).value);
      const sfxVolume = parseFloat((this.container.querySelector('#sfxVolume') as HTMLInputElement).value);
      const darkMode = (this.container.querySelector('#darkMode') as HTMLInputElement).checked;
      const pencilNotesEnabled = (this.container.querySelector('#pencilNotes') as HTMLInputElement).checked;

      await updateProfile({
        settings: { musicVolume, sfxVolume, darkMode, pencilNotesEnabled }
      });

      this.hide();
    });
  }

  hide(): void {
    if (this.container && this.container.parentNode) this.container.parentNode.removeChild(this.container);
    if (this.blocker) this.blocker.destroy();
  }
}