import Phaser from 'phaser';
import { getCurrentUser, signUpWithEmail, signInWithEmail, resetPassword } from '../services/supabaseClient';

export class AuthScene extends Phaser.Scene {
  private formContainer!: HTMLDivElement;
  private emailInput!: HTMLInputElement;
  private passwordInput!: HTMLInputElement;

  constructor() {
    super('AuthScene');
  }

  create(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const isTestMode = urlParams.has('test');

    // Create modern HTML form (centered modal-style)
    this.formContainer = document.createElement('div');
    this.formContainer.className = 'auth-form';
    this.formContainer.innerHTML = `
      <h2 style="color:#00ffff; margin-bottom:20px;">Sign in to continue</h2>
      <input type="email" id="email" placeholder="Email address" autocomplete="username" />
      <input type="password" id="password" placeholder="Password" autocomplete="current-password" />
      <button id="signInBtn">SIGN IN WITH EMAIL</button>
      <button id="signUpBtn">CREATE ACCOUNT</button>
      <button id="resetBtn" style="background:#00aaff; color:#ffffff;">FORGOT PASSWORD</button>
      <button id="googleBtn" class="placeholder-btn">CONTINUE WITH GOOGLE (placeholder)</button>
      <button id="xBtn" class="placeholder-btn">CONTINUE WITH X (placeholder)</button>
    `;
    document.getElementById('app')!.appendChild(this.formContainer);

    this.emailInput = this.formContainer.querySelector('#email') as HTMLInputElement;
    this.passwordInput = this.formContainer.querySelector('#password') as HTMLInputElement;

    // Wire buttons
    this.formContainer.querySelector('#signInBtn')!.addEventListener('click', () => this.handleEmailAuth('signIn'));
    this.formContainer.querySelector('#signUpBtn')!.addEventListener('click', () => this.handleEmailAuth('signUp'));
    this.formContainer.querySelector('#resetBtn')!.addEventListener('click', () => this.handlePasswordReset());
    this.formContainer.querySelector('#googleBtn')!.addEventListener('click', () => console.log('%c🔑 Google OAuth placeholder clicked (not implemented yet)', 'color: orange'));
    this.formContainer.querySelector('#xBtn')!.addEventListener('click', () => console.log('%c🔑 X OAuth placeholder clicked (not implemented yet)', 'color: orange'));

    // Session check (respects ?test)
    getCurrentUser().then(user => {
      if (user) {
        if (isTestMode) {
          console.log('%c🧪 TEST MODE (?test) — staying on AuthScene for testing', 'color: orange');
        } else {
          console.log('%c✅ Already signed in — advancing to MainMenuScene', 'color: lime');
          this.scene.start('MainMenuScene');
        }
      } else {
        console.log('%c👤 No active session — ready for login', 'color: orange');
      }
    });

    console.log('%c🔐 AuthScene loaded with modern HTML form (remembers email)', 'color: cyan; font-size: 14px');
  }

  private async handleEmailAuth(mode: 'signIn' | 'signUp'): Promise<void> {
    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value;

    if (!email || !password) {
      window.alert('Please enter both email and password');
      return;
    }

    let result;
    if (mode === 'signUp') {
      result = await signUpWithEmail(email, password);
      if (result.error) {
        console.error('%c❌ Sign-up failed:', 'color: red', result.error.message);
        window.alert('Sign-up failed: ' + result.error.message);
      } else {
        console.log('%c✅ Account created — check your email for verification link', 'color: lime');
        window.alert('Account created! Please check your email to verify before signing in.');
      }
    } else {
      result = await signInWithEmail(email, password);
      if (result.error) {
        console.error('%c❌ Sign-in failed:', 'color: red', result.error.message);
        window.alert('Sign-in failed: ' + result.error.message);
      } else {
        console.log('%c✅ Signed in successfully — advancing to MainMenuScene', 'color: lime');
        window.alert('Signed in successfully!');
        
        // CRITICAL: Remove form from DOM BEFORE switching scenes
        if (this.formContainer && this.formContainer.parentNode) {
          this.formContainer.parentNode.removeChild(this.formContainer);
        }
        
        this.scene.start('MainMenuScene');
      }
    }
  }

  private async handlePasswordReset(): Promise<void> {
    const email = this.emailInput.value.trim();
    if (!email) {
      window.alert('Please enter your email first');
      return;
    }

    const error = await resetPassword(email);
    if (error) {
      console.error('%c❌ Reset failed:', 'color: red', error.message);
      window.alert('Reset failed: ' + error.message);
    } else {
      console.log('%c✅ Password reset email sent', 'color: lime');
      window.alert('Password reset email sent! Check your inbox.');
    }
  }

  destroy(): void {
    if (this.formContainer && this.formContainer.parentNode) {
      this.formContainer.parentNode.removeChild(this.formContainer);
    }
  }
}