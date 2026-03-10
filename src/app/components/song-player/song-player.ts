import { Component, inject, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AudioService } from '../../services/audio.service';
import { MusicService } from '../../services/music.service';
import { UserService } from '../../services/user.service';
import type { PlaybackState } from '../../services/audio.service';
import type { Artist } from '../../models/artist.model';

@Component({
    selector: 'app-song-player',
    imports: [NgIf, MatSliderModule, MatIconModule, MatButtonModule],
    templateUrl: './song-player.html',
    styleUrl: './song-player.css',
})
export class SongPlayer implements OnInit {
    private readonly audioService = inject(AudioService);
    private readonly musicService = inject(MusicService);
    private readonly userService = inject(UserService);

    state: PlaybackState = this.audioService.snapshot;
    artists: Artist[] = [];
    favoriteIds: string[] = [];

    ngOnInit(): void {
        this.audioService.playbackState$.subscribe((s) => (this.state = s));
        this.musicService.getArtists().subscribe((a) => (this.artists = a));
        this.userService.favorites$.subscribe((ids) => (this.favoriteIds = ids));
    }

    get artistName(): string {
        if (!this.state.song) return '';
        return this.artists.find((a) => a.id === this.state.song!.artistId)?.name ?? '';
    }

    get progressPercent(): number {
        if (!this.state.duration) return 0;
        return (this.state.currentTime / this.state.duration) * 100;
    }

    get isFavorite(): boolean {
        return !!this.state.song && this.favoriteIds.includes(this.state.song.id);
    }

    togglePlayPause(): void {
        this.audioService.togglePlayPause();
    }

    stop(): void {
        this.audioService.stop();
    }

    onProgressChange(value: number): void {
        this.audioService.seek((value / 100) * this.state.duration);
    }

    onVolumeChange(value: number): void {
        this.audioService.setVolume(value / 100);
    }

    toggleFavorite(): void {
        if (this.state.song) {
            this.userService.toggleFavorite(this.state.song.id);
        }
    }

    formatTime(seconds: number): string {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    handleImageError(event: Event): void {
        const img = event.target as HTMLImageElement;
        img.src = 'https://placehold.co/400x400/1a1a2e/e94560?text=EchoBlue';
    }
}
