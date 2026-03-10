import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { MusicService } from '../../services/music.service';
import type { Song } from '../../models/song.model';

@Component({
    selector: 'app-playlist-create',
    imports: [ReactiveFormsModule, NgIf, NgFor, NgClass],
    templateUrl: './playlist-create.html',
    styleUrl: './playlist-create.css',
})
export class PlaylistCreate {
    private readonly fb = inject(FormBuilder);
    private readonly musicService = inject(MusicService);

    songs: Song[] = [];
    selectedSongIds: string[] = [];
    submitted = false;
    created = false;

    /** Reactive form with validators */
    form: FormGroup = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        description: ['', [Validators.required, Validators.minLength(5)]],
    });

    constructor() {
        this.musicService.getSongs().subscribe((s) => (this.songs = s));
    }

    /** Convenience getter for template error checks */
    get f() {
        return this.form.controls;
    }

    toggleSong(songId: string): void {
        const idx = this.selectedSongIds.indexOf(songId);
        if (idx === -1) {
            this.selectedSongIds.push(songId);
        } else {
            this.selectedSongIds.splice(idx, 1);
        }
    }

    isSongSelected(songId: string): boolean {
        return this.selectedSongIds.includes(songId);
    }

    onSubmit(): void {
        this.submitted = true;

        if (this.form.invalid || this.selectedSongIds.length === 0) return;

        const payload = {
            ...this.form.value,
            songs: [...this.selectedSongIds],
        };

        console.log('Playlist created:', payload);
        this.created = true;

        setTimeout(() => {
            this.created = false;
            this.form.reset();
            this.selectedSongIds = [];
            this.submitted = false;
        }, 3000);
    }
}
