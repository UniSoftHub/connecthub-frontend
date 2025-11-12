import { Component } from '@angular/core';
import { PrimaryButton } from '../../components/features/primary-button/primary-button';
import { PrimaryInput } from '../../components/features/primary-input/primary-input';

@Component({
  selector: 'app-login',
  imports: [PrimaryInput, PrimaryButton],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {}
