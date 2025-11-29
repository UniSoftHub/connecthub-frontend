import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './textarea.html',
  styleUrl: './textarea.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Textarea),
      multi: true,
    },
  ],
})
export class Textarea {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() rows: number = 4;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() width: string = '100%';

  textareaControl = new FormControl('');

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {
    this.textareaControl.valueChanges.subscribe((value) => {
      this.onChange(value);
      this.onTouched();
    });
  }

  writeValue(value: any): void {
    this.textareaControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.textareaControl.disable() : this.textareaControl.enable();
  }
}
