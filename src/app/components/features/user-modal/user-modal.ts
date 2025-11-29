import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IUserCreateRequest,
  IUserUpdateRequest,
  IUserResponse,
  UserRole,
} from '../../../interfaces/user';
import { PrimaryInput } from '../primary-input/primary-input';
import { PrimaryButton } from '../primary-button/primary-button';
import { Select } from '../select/select';
import cpfValidator from '../../../validators/cpfValidator';
import phoneValidator from '../../../validators/phoneValidator';
import strongPasswordValidator from '../../../validators/strongPasswordValidator';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimaryInput, PrimaryButton, Select],
  templateUrl: './user-modal.html',
  styleUrl: './user-modal.scss',
})
export class UserModal implements OnInit, OnChanges {
  @Input() user: IUserResponse | null = null;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveUser = new EventEmitter<
    IUserCreateRequest | { id: number; data: IUserUpdateRequest }
  >();

  userForm!: FormGroup;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;

  statusOptions = [
    { value: true, label: 'Ativo' },
    { value: false, label: 'Inativo' },
  ];

  roleOptions = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'TEACHER', label: 'Professor' },
    { value: 'STUDENT', label: 'Aluno' },
    { value: 'COORDINATOR', label: 'Coordenador' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.userForm) {
      this.initForm();
    }

    if (changes['user'] || changes['isOpen']) {
      if (this.isOpen && this.user) {
        this.isEditMode = true;
        this.populateForm();
        this.userForm.get('email')?.disable();
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
      } else if (this.isOpen && !this.user) {
        this.isEditMode = false;
        this.resetForm();
        this.userForm.get('email')?.enable();
        this.userForm
          .get('password')
          ?.setValidators(Validators.compose([Validators.required, strongPasswordValidator()]));
        this.userForm.get('password')?.updateValueAndValidity();
      } else if (!this.isOpen) {
        this.resetForm();
        this.isSubmitting = false;
      }
    }
  }

  initForm() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [cpfValidator()]],
      socialName: [''],
      phone: ['', [phoneValidator()]],
      enrollmentId: [''],
      password: ['', [strongPasswordValidator()]],
      dateOfBirth: [''],
      lastUpdate: [''],
      github: [''],
      linkedin: [''],
      role: ['STUDENT' as UserRole, Validators.required],
      isActive: [true, Validators.required],
    });
  }

  populateForm() {
    if (this.user) {
      this.userForm.get('email')?.disable();

      this.userForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        cpf: this.user.CPF,
        phone: this.user.phone,
        enrollmentId: this.user.enrollmentId,
        github: this.user.github || '',
        linkedin: this.user.linkedin || '',
        role: this.user.role,
        isActive: this.user.isActive,
      });
    }
  }

  resetForm() {
    this.userForm.get('email')?.enable();
    this.userForm.reset({
      name: '',
      email: '',
      cpf: '',
      socialName: '',
      phone: '',
      enrollmentId: '',
      dateOfBirth: '',
      lastUpdate: '',
      github: '',
      linkedin: '',
      role: 'STUDENT' as UserRole,
      isActive: true,
      password: '',
    });
    this.userForm.markAsUntouched();
    this.userForm.markAsPristine();
  }

  formatDateForInput(date: string | Date): string {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return '';
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getPasswordError(): string {
    const passwordControl = this.userForm.get('password');
    if (!passwordControl || !passwordControl.errors) return '';

    if (passwordControl.errors['required']) {
      return 'A senha é obrigatória';
    }
    if (passwordControl.errors['weakPassword']) {
      return 'A senha deve ter: mínimo 8 caracteres, 1 letra maiúscula, 1 número e 1 caractere especial';
    }
    return '';
  }

  onSubmit() {
    this.userForm.markAllAsTouched();

    if (!this.userForm.valid) {
      console.warn('Formulário Inválido!', this.userForm.errors);
      console.warn('Erros por campo:', this.getFormErrors());
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const formValue = this.userForm.getRawValue();

    const cleanFormValue = {
      ...formValue,
      cpf: formValue.cpf ? formValue.cpf.replace(/\D/g, '') : '',
      phone: formValue.phone ? formValue.phone.replace(/\D/g, '') : '',
      isActive: formValue.isActive === true || formValue.isActive === 'true',
    };

    if (this.isEditMode && this.user) {
      const updateData: IUserUpdateRequest = {
        name: cleanFormValue.name,
        CPF: cleanFormValue.cpf,
        socialName: cleanFormValue.socialName || undefined,
        phone: cleanFormValue.phone,
        enrollmentId: cleanFormValue.enrollmentId,
        dateOfBirth: cleanFormValue.dateOfBirth,
        github: cleanFormValue.github || undefined,
        linkedin: cleanFormValue.linkedin || undefined,
        role: cleanFormValue.role,
        isActive: cleanFormValue.isActive,
        ...(cleanFormValue.password && { password: cleanFormValue.password }),
      };

      this.saveUser.emit({ id: this.user.id, data: updateData });
    } else {
      const createData: IUserCreateRequest = {
        name: cleanFormValue.name,
        email: cleanFormValue.email,
        password: cleanFormValue.password,
        CPF: cleanFormValue.cpf,
        phone: cleanFormValue.phone,
        enrollmentId: cleanFormValue.enrollmentId,
        github: cleanFormValue.github || undefined,
        linkedin: cleanFormValue.linkedin || undefined,
        role: cleanFormValue.role,
        isActive: cleanFormValue.isActive,
      };

      this.saveUser.emit(createData);
    }
  }

  getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.userForm.controls).forEach((key) => {
      const control = this.userForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  onCancel() {
    this.closeModal.emit();
    this.resetForm();
    this.isSubmitting = false;
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onCancel();
    }
  }
}
