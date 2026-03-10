import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgFor, NgIf, NgClass, NgStyle } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MusicService } from '../../services/music.service';
import { AudioService } from '../../services/audio.service';
import type { Artist } from '../../models/artist.model';
import type { Song } from '../../models/song.model';
import type { Album } from '../../models/album.model';

@Component({
    selector: 'app-artist-detail',
    imports: [NgFor, NgIf, NgClass, NgStyle, MatIconModule, MatButtonModule, MatCardModule],
    templateUrl: './artist-detail.html',
    styleUrl: './artist-detail.css',
})
export class ArtistDetail implements OnInit, OnChanges {
    private readonly musicService = inject(MusicService);
    private readonly audioService = inject(AudioService);

    /** The artist ID to display — set by a parent or by the page */
    @Input() artistId = '';

    artist: Artist | null = null;
    topSongs: Song[] = [];
    albums: Album[] = [];
    allSongs: Song[] = [];
    currentSongId: string | null = null;
    isPlaying = false;

    ngOnInit(): void {
        this.audioService.playbackState$.subscribe((state) => {
            this.currentSongId = state.song?.id ?? null;
            this.isPlaying = state.playing;
        });

        this.musicService.getSongs().subscribe((s) => {
            this.allSongs = s;
            this.resolveTopSongs();
        });

        if (this.artistId) {
            this.loadArtist();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['artistId'] && !changes['artistId'].firstChange) {
            this.loadArtist();
        }
    }

    playSong(song: Song): void {
        if (this.currentSongId === song.id && this.isPlaying) {
            this.audioService.pause();
        } else if (this.currentSongId === song.id) {
            this.audioService.resume();
        } else {
            this.audioService.play(song);
        }
    }

    isCurrentSong(songId: string): boolean {
        return this.currentSongId === songId;
    }

    formatDuration(seconds: number): string {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    /** Cinematic header style: use the artist image as a background */
    getHeroGradient(): Record<string, string> {
        if (!this.artist) return {};
        return {
            'background-image': `url(${this.artist.image})`,
        };
    }

    handleImageError(event: Event): void {
        const img = event.target as HTMLImageElement;
        img.src = 'https://placehold.co/400x400/1a1a2e/e94560?text=EchoBlue';
    }

    private loadArtist(): void {
        this.musicService.getArtistById(this.artistId).subscribe((a) => {
            this.artist = a ?? null;
            this.resolveTopSongs();
        });

        this.musicService.getAlbums().subscribe((albums) => {
            this.albums = albums.filter((a) => a.artistId === this.artistId);
        });
    }

    private resolveTopSongs(): void {
        if (!this.artist || !this.allSongs.length) return;
        this.topSongs = this.artist.topTracks
            .map((id) => this.allSongs.find((s) => s.id === id))
            .filter((s): s is Song => !!s);
    }
}
