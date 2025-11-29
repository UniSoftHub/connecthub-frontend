import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { PrimaryInput } from '../../components/features/primary-input/primary-input';
import { PrimaryButton } from '../../components/features/primary-button/primary-button';
import { AuthService } from '../../services/auth-service';
import { ErrorHandlerService } from '../../services/error.handler-service';
import strongPasswordValidator from '../../validators/strongPasswordValidator';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimaryInput, PrimaryButton],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  isLoginMode = true;
  loading = false;
  errorMessage = '';
  loginForm: FormGroup;
  registerForm: FormGroup;

  showPasswordStrength = false;
  passwordRequirements = {
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumeric: false,
    hasSpecialChar: false,
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private errorHandler: ErrorHandlerService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), strongPasswordValidator()]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );

    this.registerForm.get('password')?.valueChanges.subscribe((password) => {
      this.updatePasswordRequirements(password);
    });
  }

  private updatePasswordRequirements(password: string): void {
    if (!password) {
      this.passwordRequirements = {
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumeric: false,
        hasSpecialChar: false,
      };
      this.showPasswordStrength = false;
      return;
    }

    this.passwordRequirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumeric: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    this.showPasswordStrength = true;
  }

  passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.loginForm.reset();
    this.registerForm.reset();
    this.showPasswordStrength = false;
    this.updatePasswordRequirements('');
  }

  onLogin() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.loading = false;

        this.errorMessage =
          error.error?.translatedMessage || this.errorHandler.extractErrorMessage(error);
      },
    });
  }

  onRegister() {
    this.registerForm.markAllAsTouched();

    const passwordControl = this.registerForm.get('password');
    if (passwordControl?.value) {
      this.showPasswordStrength = true;
    }

    if (this.registerForm.invalid) {
      if (passwordControl?.hasError('weakPassword')) {
        this.errorMessage = this.getPasswordErrorMessage(passwordControl);
        return;
      }

      if (this.registerForm.hasError('passwordMismatch')) {
        this.errorMessage = 'As senhas não coincidem. Por favor, verifique.';
        return;
      }

      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios corretamente.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.loading = false;

        this.errorMessage =
          error.error?.translatedMessage || this.errorHandler.extractErrorMessage(error);
      },
    });
  }

  private getPasswordErrorMessage(control: AbstractControl): string {
    const errors = control.errors?.['weakPassword'];

    if (!errors) {
      return 'Senha inválida.';
    }

    const missing: string[] = [];

    if (!errors.isValidLength) {
      missing.push('mínimo 8 caracteres');
    }
    if (!errors.hasUpperCase) {
      missing.push('uma letra maiúscula');
    }
    if (!errors.hasLowerCase) {
      missing.push('uma letra minúscula');
    }
    if (!errors.hasNumeric) {
      missing.push('um número');
    }
    if (!errors.hasSpecialChar) {
      missing.push('um caractere especial (!@#$%^&*...)');
    }

    return `A senha deve conter: ${missing.join(', ')}.`;
  }
}
