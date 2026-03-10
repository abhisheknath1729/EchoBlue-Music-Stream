import { Component } from '@angular/core';
import { PlaylistManager } from '../../components/playlist-manager/playlist-manager';
import { PlaylistCreate } from '../../components/playlist-create/playlist-create';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
    selector: 'app-playlists',
    imports: [MatTabsModule, PlaylistManager, PlaylistCreate],
    template: `
    <section class="page">
      <mat-tab-group animationDuration="300ms" dynamicHeight>
        <mat-tab label="Browse Playlists">
          <div class="tab-content">
            <app-playlist-manager />
          </div>
        </mat-tab>
        <mat-tab label="Create Playlist">
          <div class="tab-content">
            <app-playlist-create />
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
export default class Playlists { }
