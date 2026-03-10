import { Pipe, PipeTransform } from '@angular/core';
import type { Song } from '../models/song.model';

/**
 * Filters an array of songs by genre.
 *
 * Usage:
 *   *ngFor="let song of songs | filterByGenre:'Hip-Hop'"
 *
 * Pass an empty string or null to skip filtering.
 */
@Pipe({
    name: 'filterByGenre',
    standalone: true,
    pure: true,
})
export class FilterByGenrePipe implements PipeTransform {
    transform(songs: Song[], genre: string | null | undefined): Song[] {
        if (!genre) return songs;
        const lower = genre.toLowerCase();
        return songs.filter((s) => s.genre.toLowerCase() === lower);
    }
}
