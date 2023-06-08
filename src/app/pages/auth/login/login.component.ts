import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  hide = true;
  ngOnInit(): void {}
  constructor(private loginService: LoginService) {}
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);

  Login() {
    const email = this.emailFormControl.value;
    const password = this.passwordFormControl.value;
    if (!this.emailFormControl.invalid && !this.passwordFormControl.invalid)
      return this.loginService.login(email!, password!).subscribe();
    return null;
  }
}
