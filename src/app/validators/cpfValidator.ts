import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export default function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const cleanValue = value.replace(/\D/g, '');

    if (cleanValue.length !== 11) {
      return { cpfInvalidLength: true };
    }

    return null;
  };
}
