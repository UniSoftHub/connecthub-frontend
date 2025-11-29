import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export default function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const cleanValue = value.replace(/\D/g, '');

    if (cleanValue.length < 10 || cleanValue.length > 11) {
      return { phoneInvalidLength: true };
    }

    return null;
  };
}
