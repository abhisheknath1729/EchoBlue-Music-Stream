import { Component, inject, OnInit } from '@angular/core';
import { MusicService } from '../../services/music.service';
import { AudioService } from '../../services/audio.service';
import type { Playlist } from '../../models/playlist.model';
import type { Song } from '../../models/song.model';
import type { Artist } from '../../models/artist.model';

@Component({
    selector: 'app-playlist-manager',
    templateUrl: './playlist-manager.html',
    styleUrl: './playlist-manager.css',
})
export class PlaylistManager implements OnInit {
    private readonly musicService = inject(MusicService);
    private readonly audioService = inject(AudioService);

    playlists: Playlist[] = [];
    songs: Song[] = [];
    artists: Artist[] = [];
    expandedPlaylistId: string | null = null;
    currentSongId: string | null = null;
    isPlaying = false;

    ngOnInit(): void {
        this.musicService.getPlaylists().subscribe((p) => (this.playlists = p));
        this.musicService.getSongs().subscribe((s) => (this.songs = s));
        this.musicService.getArtists().subscribe((a) => (this.artists = a));

        this.audioService.playbackState$.subscribe((state) => {
            this.currentSongId = state.song?.id ?? null;
            this.isPlaying = state.playing;
        });
    }

    toggleExpand(playlistId: string): void {
        this.expandedPlaylistId =
            this.expandedPlaylistId === playlistId ? null : playlistId;
    }

    getSongsForPlaylist(playlist: Playlist): Song[] {
        return playlist.songs
            .map((id) => this.songs.find((s) => s.id === id))
            .filter((s): s is Song => !!s);
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

    isCurrentSong(songId: string): boolean {
        return this.currentSongId === songId;
    }
}
