import Phaser from 'phaser';
import { getCurrentUser, signUpWithEmail, signInWithEmail, resetPassword } from '../services/supabaseClient';

export class AuthScene extends Phaser.Scene {
  private formContainer!: HTMLDivElement;
  private emailInput!: HTMLInputElement;
  private passwordInput!: HTMLInputElement;
  private confirmPasswordInput!: HTMLInputElement | null;
  private isSignUpMode = false;

  constructor() {
    super('AuthScene');
  }

  create(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const isTestMode = urlParams.has('test');

    // Modern centered HTML form
    this.formContainer = document.createElement('div');
    this.formContainer.className = 'auth-form';
    this.formContainer.innerHTML = `
      <h2 id="formTitle" style="color:#00ffff; margin-bottom:20px;">Sign in to continue</h2>
      
      <input type="email" id="email" placeholder="Email address" autocomplete="username" />
      <input type="password" id="password" placeholder="Password" autocomplete="current-password" />
      <input type="password" id="confirmPassword" placeholder="Confirm password" style="display:none;" />

      <button id="mainActionBtn">SIGN IN</button>
      <button id="resetBtn" style="background:#00aaff; color:#ffffff;">FORGOT PASSWORD</button>
      
      <div style="margin-top:20px; color:#aaaaaa; font-size:18px;">
        <span id="toggleLink" style="cursor:pointer; text-decoration:underline;">SIGN UP</span>
      </div>

      <button id="googleBtn" class="placeholder-btn">CONTINUE WITH GOOGLE (placeholder)</button>
      <button id="xBtn" class="placeholder-btn">CONTINUE WITH X (placeholder)</button>
    `;
    document.getElementById('app')!.appendChild(this.formContainer);

    this.emailInput = this.formContainer.querySelector('#email') as HTMLInputElement;
    this.passwordInput = this.formContainer.querySelector('#password') as HTMLInputElement;
    this.confirmPasswordInput = this.formContainer.querySelector('#confirmPassword') as HTMLInputElement;

    const toggleLink = this.formContainer.querySelector('#toggleLink') as HTMLElement;
    const mainActionBtn = this.formContainer.querySelector('#mainActionBtn') as HTMLButtonElement;
    const formTitle = this.formContainer.querySelector('#formTitle') as HTMLElement;

    // Wire buttons
    mainActionBtn.addEventListener('click', () => this.handleMainAction());
    this.formContainer.querySelector('#resetBtn')!.addEventListener('click', () => this.handlePasswordReset());
    this.formContainer.querySelector('#googleBtn')!.addEventListener('click', () => console.log('%c🔑 Google OAuth placeholder clicked', 'color: orange'));
    this.formContainer.querySelector('#xBtn')!.addEventListener('click', () => console.log('%c🔑 X OAuth placeholder clicked', 'color: orange'));

    toggleLink.addEventListener('click', () => {
      this.isSignUpMode = !this.isSignUpMode;
      this.updateFormUI(formTitle, mainActionBtn, toggleLink);
    });

    // Session check
    getCurrentUser().then(user => {
      if (user) {
        if (isTestMode) {
          console.log('%c🧪 TEST MODE (?test) — staying on AuthScene', 'color: orange');
        } else {
          console.log('%c✅ Already signed in — advancing to MainMenuScene', 'color: lime');
          this.cleanupAndTransition();
        }
      } else {
        console.log('%c👤 No active session — ready for login', 'color: orange');
      }
    });

    console.log('%c🔐 AuthScene loaded with toggleable sign-in / sign-up form', 'color: cyan; font-size: 14px');
  }

  private updateFormUI(title: HTMLElement, btn: HTMLButtonElement, link: HTMLElement): void {
    if (this.isSignUpMode) {
      title.textContent = 'Create your account';
      btn.textContent = 'SIGN UP';
      this.confirmPasswordInput!.style.display = 'block';
      link.textContent = 'Back to Sign In';
    } else {
      title.textContent = 'Sign in to continue';
      btn.textContent = 'SIGN IN';
      this.confirmPasswordInput!.style.display = 'none';
      link.textContent = 'SIGN UP';
    }
  }

  private async handleMainAction(): Promise<void> {
    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value;

    if (!email || !password) {
      window.alert('Please enter both email and password');
      return;
    }

    if (this.isSignUpMode) {
      const confirmPassword = this.confirmPasswordInput!.value;
      if (password !== confirmPassword) {
        window.alert('Passwords do not match');
        return;
      }
      const result = await signUpWithEmail(email, password);
      if (result.error) {
        console.error('%c❌ Sign-up failed:', 'color: red', result.error.message);
        window.alert('Sign-up failed: ' + result.error.message);
      } else {
        console.log('%c✅ Account created — check your email', 'color: lime');
        window.alert('Account created! Please check your email to verify.');
      }
    } else {
      const result = await signInWithEmail(email, password);
      if (result.error) {
        console.error('%c❌ Sign-in failed:', 'color: red', result.error.message);
        window.alert('Sign-in failed: ' + result.error.message);
      } else {
        console.log('%c✅ Signed in successfully — advancing to MainMenuScene', 'color: lime');
        this.cleanupAndTransition();
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
      window.alert('Password reset email sent!');
    }
  }

  private cleanupAndTransition(): void {
    if (this.formContainer && this.formContainer.parentNode) {
      this.formContainer.parentNode.removeChild(this.formContainer);
    }
    this.scene.start('MainMenuScene');
  }

  destroy(): void {
    if (this.formContainer && this.formContainer.parentNode) {
      this.formContainer.parentNode.removeChild(this.formContainer);
    }
  }
}