import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-feedback-form',
    imports: [FormsModule, NgIf],
    templateUrl: './feedback-form.html',
    styleUrl: './feedback-form.css',
})
export class FeedbackForm {
    /** Template-driven model */
    feedback = {
        name: '',
        email: '',
        rating: 5,
        message: '',
    };

    submitted = false;
    feedbackSent = false;

    onSubmit(form: NgForm): void {
        this.submitted = true;

        if (form.invalid) return;

        console.log('Feedback submitted:', this.feedback);
        this.feedbackSent = true;

        setTimeout(() => {
            this.feedbackSent = false;
            form.resetForm();
            this.submitted = false;
            this.feedback.rating = 5;
        }, 3000);
    }
}
