import { Component } from '@angular/core';
import { LoginForm } from '../../components/login-form/login-form';

@Component({
    selector: 'app-login-page',
    imports: [LoginForm],
    template: `
    <section class="page">
      <app-login-form />
    </section>
  `,
    styles: [`.page { padding: 2rem; }`],
})
export default class LoginPage { }
