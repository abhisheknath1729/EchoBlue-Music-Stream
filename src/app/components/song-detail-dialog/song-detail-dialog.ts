import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import type { Song } from '../../models/song.model';

export interface SongDetailData {
  song: Song;
  artistName: string;
  albumTitle: string;
}

@Component({
  selector: 'app-song-detail-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{ data.song.title }}</h2>
    <mat-dialog-content class="dialog-content">
      <img class="dialog-cover" [src]="data.song.coverImage" [alt]="data.song.title" 
           (error)="handleImageError($event)" />
      <div class="dialog-info">
        <p><strong>Artist:</strong> {{ data.artistName }}</p>
        <p><strong>Album:</strong> {{ data.albumTitle }}</p>
        <p><strong>Genre:</strong> {{ data.song.genre }}</p>
        <p><strong>Duration:</strong> {{ formatDuration(data.song.duration) }}</p>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
      <button mat-flat-button color="primary" mat-dialog-close>
        <mat-icon>play_arrow</mat-icon> Play
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-content {
      display: flex;
      gap: 1.25rem;
      padding-top: 0.5rem;
    }
    .dialog-cover {
      width: 140px;
      height: 140px;
      border-radius: 8px;
      object-fit: cover;
      flex-shrink: 0;
    }
    .dialog-info {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .dialog-info p {
      margin: 0;
      font-size: 0.85rem;
    }
  `],
})
export class SongDetailDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: SongDetailData) { }

  formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/400x400/1a1a2e/e94560?text=EchoBlue';
  }
}
