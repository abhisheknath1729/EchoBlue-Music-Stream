import { Component, inject, OnInit } from '@angular/core';
import { NgFor, NgIf, NgClass, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MusicService } from '../../services/music.service';
import { AudioService } from '../../services/audio.service';
import { UserService } from '../../services/user.service';
import { FilterByGenrePipe } from '../../pipes/filter-by-genre.pipe';
import { FilterByArtistPipe } from '../../pipes/filter-by-artist.pipe';
import { FilterByAlbumPipe } from '../../pipes/filter-by-album.pipe';
import { HighlightPlayingDirective } from '../../directives/highlight-playing.directive';
import { SongDetailDialog } from '../song-detail-dialog/song-detail-dialog';
import type { Song } from '../../models/song.model';
import type { Artist } from '../../models/artist.model';
import type { Album } from '../../models/album.model';
import type { Playlist } from '../../models/playlist.model';

@Component({
    selector: 'app-song-list',
    imports: [
        NgFor, NgIf, NgClass, UpperCasePipe, FormsModule,
        MatCardModule, MatButtonModule, MatIconModule,
        FilterByGenrePipe, FilterByArtistPipe, FilterByAlbumPipe,
        HighlightPlayingDirective,
    ],
    templateUrl: './song-list.html',
    styleUrl: './song-list.css',
})
export class SongList implements OnInit {
    private readonly musicService = inject(MusicService);
    private readonly audioService = inject(AudioService);
    private readonly userService = inject(UserService);
    private readonly dialog = inject(MatDialog);

    songs: Song[] = [];
    artists: Artist[] = [];
    albums: Album[] = [];
    playlists: Playlist[] = [];
    currentSongId: string | null = null;
    isPlaying = false;
    favoriteIds: string[] = [];

    /** Filter state */
    selectedGenre: string | null = null;
    selectedArtistId: string | null = null;
    selectedAlbumId: string | null = null;

    /** Which song's "add to playlist" dropdown is open */
    playlistDropdownSongId: string | null = null;

    ngOnInit(): void {
        this.musicService.getSongs().subscribe((songs) => (this.songs = songs));
        this.musicService.getArtists().subscribe((artists) => (this.artists = artists));
        this.musicService.getAlbums().subscribe((albums) => (this.albums = albums));
        this.musicService.getPlaylists().subscribe((playlists) => (this.playlists = playlists));

        this.audioService.playbackState$.subscribe((state) => {
            this.currentSongId = state.song?.id ?? null;
            this.isPlaying = state.playing;
        });

        this.userService.favorites$.subscribe((ids) => (this.favoriteIds = ids));
    }

    getArtistName(artistId: string): string {
        return this.artists.find((a) => a.id === artistId)?.name ?? 'Unknown';
    }

    formatDuration(seconds: number): string {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
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

    toggleFavorite(songId: string, event: Event): void {
        event.stopPropagation();
        this.userService.toggleFavorite(songId);
    }

    isFavorite(songId: string): boolean {
        return this.favoriteIds.includes(songId);
    }

    isCurrentSong(songId: string): boolean {
        return this.currentSongId === songId;
    }

    togglePlaylistDropdown(songId: string, event: Event): void {
        event.stopPropagation();
        this.playlistDropdownSongId =
            this.playlistDropdownSongId === songId ? null : songId;
    }

    addToPlaylist(playlistId: string, songId: string, event: Event): void {
        event.stopPropagation();
        // In a real app this would persist; for now we update locally
        const playlist = this.playlists.find((p) => p.id === playlistId);
        if (playlist && !playlist.songs.includes(songId)) {
            playlist.songs.push(songId);
        }
        this.playlistDropdownSongId = null;
    }

    /** Dynamic background tint based on genre */
    getGenreStyle(genre: string): Record<string, string> {
        const tints: Record<string, string> = {
            'Hip-Hop': 'rgba(233, 69, 96, 0.06)',
            'R&B': 'rgba(167, 139, 250, 0.06)',
            'Pop': 'rgba(96, 165, 250, 0.06)',
            'Synth-Pop': 'rgba(56, 189, 248, 0.06)',
            'Afrobeat': 'rgba(251, 191, 36, 0.06)',
        };
        return { 'border-left': `3px solid ${tints[genre] ?? 'transparent'}` };
    }

    /** trackBy function for *ngFor performance */
    trackBySongId(_index: number, song: Song): string {
        return song.id;
    }

    /** Unique genres extracted from loaded songs */
    get uniqueGenres(): string[] {
        return [...new Set(this.songs.map((s) => s.genre))];
    }

    /** Unique album objects for filter dropdown */
    get uniqueAlbums(): Album[] {
        return this.albums;
    }

    /** Reset all filters */
    clearFilters(): void {
        this.selectedGenre = null;
        this.selectedArtistId = null;
        this.selectedAlbumId = null;
    }

    getAlbumTitle(albumId: string): string {
        return this.albums.find((a) => a.id === albumId)?.title ?? 'Unknown';
    }

    openSongDetail(song: Song, event: Event): void {
        event.stopPropagation();
        const ref = this.dialog.open(SongDetailDialog, {
            data: {
                song,
                artistName: this.getArtistName(song.artistId),
                albumTitle: this.getAlbumTitle(song.albumId),
            },
            width: '460px',
        });
        ref.afterClosed().subscribe(() => { });
    }

    handleImageError(event: Event): void {
        const img = event.target as HTMLImageElement;
        img.src = 'https://placehold.co/400x400/1a1a2e/e94560?text=EchoBlue';
    }
}
