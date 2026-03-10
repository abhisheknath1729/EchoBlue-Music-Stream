import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-login-form',
    imports: [FormsModule, NgIf],
    templateUrl: './login-form.html',
    styleUrl: './login-form.css',
})
export class LoginForm {
    /** Template-driven model */
    credentials = {
        email: '',
        password: '',
    };

    submitted = false;
    loginSuccess = false;

    onSubmit(form: NgForm): void {
        this.submitted = true;

        if (form.invalid) return;

        // Simulate login
        console.log('Login submitted:', this.credentials);
        this.loginSuccess = true;

        setTimeout(() => {
            this.loginSuccess = false;
            form.resetForm();
            this.submitted = false;
        }, 3000);
    }
}
