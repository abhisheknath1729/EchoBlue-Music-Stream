import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { Song } from '../models/song.model';

/** Playback state exposed to consumers */
export interface PlaybackState {
    song: Song | null;
    playing: boolean;
    currentTime: number;  // seconds
    duration: number;     // seconds
    volume: number;       // 0 – 1
}

const INITIAL_STATE: PlaybackState = {
    song: null,
    playing: false,
    currentTime: 0,
    duration: 0,
    volume: 0.75,
};

/**
 * EchoBlue — AudioService
 * Controls audio playback: play, pause, stop, seek, volume,
 * and exposes real-time progress as an Observable stream.
 */
@Injectable({ providedIn: 'root' })
export class AudioService {
    private audio = new Audio();
    private state$ = new BehaviorSubject<PlaybackState>({ ...INITIAL_STATE });
    private songEnded$ = new Subject<void>();

    /** Observable of the current playback state (subscribe in components) */
    readonly playbackState$: Observable<PlaybackState> = this.state$.asObservable();

    /** Fires when the current song finishes playing */
    readonly songEnded: Observable<void> = this.songEnded$.asObservable();

    constructor() {
        this.bindAudioEvents();
    }

    /* ── public controls ────────────────────────────────────── */

    /** Load and immediately play a song */
    play(song: Song): void {
        this.audio.src = song.audioUrl;
        this.audio.load();
        this.audio.play().catch(() => { });
        this.patch({ song, playing: true, currentTime: 0 });
    }

    /** Resume the current track */
    resume(): void {
        this.audio.play().catch(() => { });
        this.patch({ playing: true });
    }

    /** Pause the current track */
    pause(): void {
        this.audio.pause();
        this.patch({ playing: false });
    }

    /** Toggle play / pause */
    togglePlayPause(): void {
        if (this.state$.value.playing) {
            this.pause();
        } else if (this.state$.value.song) {
            this.resume();
        }
    }

    /** Stop playback and reset position */
    stop(): void {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.patch({ playing: false, currentTime: 0 });
    }

    /** Seek to a specific time in seconds */
    seek(seconds: number): void {
        this.audio.currentTime = seconds;
        this.patch({ currentTime: seconds });
    }

    /** Set volume (0 – 1) */
    setVolume(volume: number): void {
        const clamped = Math.max(0, Math.min(1, volume));
        this.audio.volume = clamped;
        this.patch({ volume: clamped });
    }

    /** Get the current snapshot of playback state */
    get snapshot(): PlaybackState {
        return this.state$.value;
    }

    /* ── private helpers ────────────────────────────────────── */

    private bindAudioEvents(): void {
        this.audio.addEventListener('timeupdate', () => {
            this.patch({ currentTime: this.audio.currentTime });
        });

        this.audio.addEventListener('loadedmetadata', () => {
            this.patch({ duration: this.audio.duration });
        });

        this.audio.addEventListener('ended', () => {
            this.patch({ playing: false, currentTime: 0 });
            this.songEnded$.next();
        });
    }

    private patch(partial: Partial<PlaybackState>): void {
        this.state$.next({ ...this.state$.value, ...partial });
    }
}
