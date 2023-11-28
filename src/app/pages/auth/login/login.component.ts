import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { check } from 'src/app/modules/face-api/face-api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  hide = true;
  token: string = '';
  displayLogin = false;

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    if (this.token) {
      this.loginService.authInfo().pipe().subscribe();
    } else {
      this.displayLogin = true;
    }
  }

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
