import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/** User preferences persisted in localStorage */
export interface UserPreferences {
    darkMode: boolean;
    volume: number;    // 0 – 1
}

const STORAGE_KEYS = {
    favorites: 'echoblue_favorites',
    preferences: 'echoblue_preferences',
} as const;

const DEFAULT_PREFERENCES: UserPreferences = {
    darkMode: true,
    volume: 0.75,
};

/**
 * EchoBlue — UserService
 * Manages favorite songs and user preferences.
 * Data is persisted to localStorage so it survives page reloads.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
    /* ── favorites ──────────────────────────────────────────── */
    private favoriteSongIds$ = new BehaviorSubject<string[]>(this.loadFavorites());

    /** Observable list of favorited song IDs */
    readonly favorites$: Observable<string[]> = this.favoriteSongIds$.asObservable();

    /** Check whether a song is currently favorited */
    isFavorite(songId: string): boolean {
        return this.favoriteSongIds$.value.includes(songId);
    }

    /** Add a song to favorites */
    addFavorite(songId: string): void {
        if (!this.isFavorite(songId)) {
            const updated = [...this.favoriteSongIds$.value, songId];
            this.favoriteSongIds$.next(updated);
            this.saveFavorites(updated);
        }
    }

    /** Remove a song from favorites */
    removeFavorite(songId: string): void {
        const updated = this.favoriteSongIds$.value.filter((id) => id !== songId);
        this.favoriteSongIds$.next(updated);
        this.saveFavorites(updated);
    }

    /** Toggle a song's favorite status and return the new state */
    toggleFavorite(songId: string): boolean {
        if (this.isFavorite(songId)) {
            this.removeFavorite(songId);
            return false;
        } else {
            this.addFavorite(songId);
            return true;
        }
    }

    /* ── preferences ────────────────────────────────────────── */
    private preferences$ = new BehaviorSubject<UserPreferences>(this.loadPreferences());

    /** Observable of user preferences */
    readonly userPreferences$: Observable<UserPreferences> = this.preferences$.asObservable();

    /** Get the current preferences snapshot */
    get preferences(): UserPreferences {
        return this.preferences$.value;
    }

    /** Merge partial updates into the current preferences */
    updatePreferences(partial: Partial<UserPreferences>): void {
        const updated = { ...this.preferences$.value, ...partial };
        this.preferences$.next(updated);
        this.savePreferences(updated);
    }

    /* ── localStorage helpers ───────────────────────────────── */

    private loadFavorites(): string[] {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.favorites);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    private saveFavorites(ids: string[]): void {
        localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(ids));
    }

    private loadPreferences(): UserPreferences {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.preferences);
            return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : { ...DEFAULT_PREFERENCES };
        } catch {
            return { ...DEFAULT_PREFERENCES };
        }
    }

    private savePreferences(prefs: UserPreferences): void {
        localStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(prefs));
    }
}
