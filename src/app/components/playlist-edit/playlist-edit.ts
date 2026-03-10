import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { MusicService } from '../../services/music.service';
import type { Song } from '../../models/song.model';
import type { Playlist } from '../../models/playlist.model';

@Component({
    selector: 'app-playlist-edit',
    imports: [ReactiveFormsModule, NgIf, NgFor, NgClass],
    templateUrl: './playlist-edit.html',
    styleUrl: './playlist-edit.css',
})
export class PlaylistEdit implements OnInit, OnChanges {
    private readonly fb = inject(FormBuilder);
    private readonly musicService = inject(MusicService);

    /** Playlist to edit — passed in by parent or page */
    @Input() playlist: Playlist | null = null;

    songs: Song[] = [];
    selectedSongIds: string[] = [];
    submitted = false;
    saved = false;

    form: FormGroup = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        description: ['', [Validators.required, Validators.minLength(5)]],
    });

    ngOnInit(): void {
        this.musicService.getSongs().subscribe((s) => (this.songs = s));
        this.populateForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['playlist'] && !changes['playlist'].firstChange) {
            this.populateForm();
        }
    }

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
            id: this.playlist?.id ?? '',
            ...this.form.value,
            songs: [...this.selectedSongIds],
        };

        console.log('Playlist updated:', payload);
        this.saved = true;

        setTimeout(() => (this.saved = false), 3000);
    }

    private populateForm(): void {
        if (!this.playlist) return;
        this.form.patchValue({
            name: this.playlist.name,
            description: this.playlist.description,
        });
        this.selectedSongIds = [...this.playlist.songs];
    }
}
