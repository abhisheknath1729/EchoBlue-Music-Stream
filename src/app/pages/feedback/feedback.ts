import { Component } from '@angular/core';
import { FeedbackForm } from '../../components/feedback-form/feedback-form';

@Component({
    selector: 'app-feedback-page',
    imports: [FeedbackForm],
    template: `
    <section class="page">
      <app-feedback-form />
    </section>
  `,
    styles: [`.page { padding: 2rem; }`],
})
export default class FeedbackPage { }
