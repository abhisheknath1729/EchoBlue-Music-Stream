import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { SongList } from '../../components/song-list/song-list';
import { PlaylistManager } from '../../components/playlist-manager/playlist-manager';

@Component({
    selector: 'app-songs',
    imports: [MatTabsModule, SongList, PlaylistManager],
    template: `
    <section class="page">
      <mat-tab-group animationDuration="300ms" dynamicHeight>
        <mat-tab label="Songs">
          <div class="tab-content">
            <app-song-list />
          </div>
        </mat-tab>
        <mat-tab label="Playlists">
          <div class="tab-content">
            <app-playlist-manager />
          </div>
        </mat-tab>
      </mat-tab-group>
    </section>
  `,
    styles: [`
    .page { padding: 0.5rem 0; }
    .tab-content { padding: 1.25rem 0; }
  `],
})
export default class Songs { }
