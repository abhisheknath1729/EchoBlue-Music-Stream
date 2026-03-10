import { Component, inject, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AudioService } from '../../services/audio.service';
import { MusicService } from '../../services/music.service';
import type { PlaybackState } from '../../services/audio.service';
import type { Artist } from '../../models/artist.model';

@Component({
  selector: 'app-now-playing',
  imports: [NgIf, MatCardModule, MatIconModule],
  template: `
    <section class="page">
      <h2 class="page-title">Now Playing</h2>

      <div *ngIf="state.song" class="now-playing">
        <mat-card appearance="outlined" class="np-card">
          <img mat-card-image [src]="state.song.coverImage" [alt]="state.song.title" class="np-cover" 
               (error)="handleImageError($event)" />
          <mat-card-content class="np-info">
            <h1 class="np-title">{{ state.song.title }}</h1>
            <p class="np-artist">{{ artistName }}</p>
            <p class="np-genre">{{ state.song.genre }}</p>
            <div class="np-status">
              <mat-icon>{{ state.playing ? 'equalizer' : 'pause' }}</mat-icon>
              <span>{{ state.playing ? 'Playing' : 'Paused' }}</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div *ngIf="!state.song" class="empty-state">
        <mat-icon class="empty-icon">headphones</mat-icon>
        <p class="empty-msg">No song is playing. Pick a track to start listening!</p>
      </div>
    </section>
  `,
  styles: [`
    .page { padding: 0.5rem 0; }
    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: var(--mat-sys-primary);
    }
    .now-playing { max-width: 400px; }
    .np-card { overflow: hidden; }
    .np-cover {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
    }
    .np-info { padding-top: 1rem !important; }
    .np-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.2rem;
    }
    .np-artist {
      font-size: 0.9rem;
      opacity: 0.6;
      margin: 0 0 0.15rem;
    }
    .np-genre {
      font-size: 0.75rem;
      color: var(--mat-sys-primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 0.8rem;
    }
    .np-status {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.82rem;
      opacity: 0.55;
    }
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4rem 1rem;
      gap: 0.75rem;
      opacity: 0.4;
    }
    .empty-icon { font-size: 48px; width: 48px; height: 48px; }
    .empty-msg { font-size: 0.9rem; text-align: center; }
  `],
})
export default class NowPlaying implements OnInit {
  private readonly audioService = inject(AudioService);
  private readonly musicService = inject(MusicService);

  state: PlaybackState = this.audioService.snapshot;
  artists: Artist[] = [];

  ngOnInit(): void {
    this.audioService.playbackState$.subscribe((s) => (this.state = s));
    this.musicService.getArtists().subscribe((a) => (this.artists = a));
  }

  get artistName(): string {
    if (!this.state.song) return '';
    return this.artists.find((a) => a.id === this.state.song!.artistId)?.name ?? '';
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/400x400/1a1a2e/e94560?text=EchoBlue';
  }
}
