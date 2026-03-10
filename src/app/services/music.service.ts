import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

import type { Song } from '../models/song.model';
import type { Artist } from '../models/artist.model';
import type { Album } from '../models/album.model';
import type { Playlist } from '../models/playlist.model';

/**
 * EchoBlue — MusicService
 * Fetches songs, artists, albums, and playlists from local JSON assets.
 * Responses are cached with shareReplay so the HTTP request fires only once.
 */
@Injectable({ providedIn: 'root' })
export class MusicService {
    private readonly http = inject(HttpClient);
    private readonly basePath = 'assets/data';

    /* ── cached streams ─────────────────────────────────────── */
    private songs$?: Observable<Song[]>;
    private artists$?: Observable<Artist[]>;
    private albums$?: Observable<Album[]>;
    private playlists$?: Observable<Playlist[]>;

    /* ── public API ─────────────────────────────────────────── */

    /** Fetch all songs */
    getSongs(): Observable<Song[]> {
        if (!this.songs$) {
            this.songs$ = this.http
                .get<Song[]>(`${this.basePath}/songs.json`)
                .pipe(shareReplay(1));
        }
        return this.songs$;
    }

    /** Fetch all artists */
    getArtists(): Observable<Artist[]> {
        if (!this.artists$) {
            this.artists$ = this.http
                .get<Artist[]>(`${this.basePath}/artists.json`)
                .pipe(shareReplay(1));
        }
        return this.artists$;
    }

    /** Fetch all albums */
    getAlbums(): Observable<Album[]> {
        if (!this.albums$) {
            this.albums$ = this.http
                .get<Album[]>(`${this.basePath}/albums.json`)
                .pipe(shareReplay(1));
        }
        return this.albums$;
    }

    /** Fetch all playlists */
    getPlaylists(): Observable<Playlist[]> {
        if (!this.playlists$) {
            this.playlists$ = this.http
                .get<Playlist[]>(`${this.basePath}/playlists.json`)
                .pipe(shareReplay(1));
        }
        return this.playlists$;
    }

    /** Lookup a single song by ID */
    getSongById(id: string): Observable<Song | undefined> {
        return new Observable((subscriber) => {
            this.getSongs().subscribe((songs) => {
                subscriber.next(songs.find((s) => s.id === id));
                subscriber.complete();
            });
        });
    }

    /** Lookup a single artist by ID */
    getArtistById(id: string): Observable<Artist | undefined> {
        return new Observable((subscriber) => {
            this.getArtists().subscribe((artists) => {
                subscriber.next(artists.find((a) => a.id === id));
                subscriber.complete();
            });
        });
    }

    /** Lookup a single album by ID */
    getAlbumById(id: string): Observable<Album | undefined> {
        return new Observable((subscriber) => {
            this.getAlbums().subscribe((albums) => {
                subscriber.next(albums.find((a) => a.id === id));
                subscriber.complete();
            });
        });
    }
}
