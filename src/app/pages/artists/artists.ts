import { Component, inject, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MusicService } from '../../services/music.service';
import type { Artist } from '../../models/artist.model';

@Component({
    selector: 'app-artists',
    imports: [NgFor, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
    template: `
    <section class="page">
      <h2 class="page-title">Artists</h2>
      <div class="artist-grid">
        <mat-card
          *ngFor="let artist of artists"
          appearance="outlined"
          class="artist-card"
          [routerLink]="['/artists', artist.id]"
        >
          <img mat-card-image [src]="artist.image" [alt]="artist.name" class="artist-img" />
          <mat-card-content>
            <h3 class="artist-name">{{ artist.name }}</h3>
            <p class="artist-bio">{{ artist.bio }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">
              <mat-icon>visibility</mat-icon> View
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </section>
  `,
    styles: [`
    .page { padding: 0.5rem 0; }
    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
      color: var(--mat-sys-primary);
    }
    .artist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1rem;
    }
    .artist-card {
      cursor: pointer;
      transition: transform 0.25s ease;
    }
    .artist-card:hover {
      transform: translateY(-3px);
    }
    .artist-img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
    }
    .artist-name {
      font-weight: 600;
      font-size: 1rem;
      margin: 0.25rem 0 0.2rem;
    }
    .artist-bio {
      font-size: 0.75rem;
      opacity: 0.55;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `],
})
export default class Artists implements OnInit {
    private readonly musicService = inject(MusicService);
    artists: Artist[] = [];

    ngOnInit(): void {
        this.musicService.getArtists().subscribe((a) => (this.artists = a));
    }
}
