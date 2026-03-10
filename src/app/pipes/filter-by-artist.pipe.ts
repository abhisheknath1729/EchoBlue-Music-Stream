import { Pipe, PipeTransform } from '@angular/core';
import type { Song } from '../models/song.model';

/**
 * Filters an array of songs by artistId.
 *
 * Usage:
 *   *ngFor="let song of songs | filterByArtist:'artist-1'"
 *
 * Pass an empty string or null to skip filtering.
 */
@Pipe({
    name: 'filterByArtist',
    standalone: true,
    pure: true,
})
export class FilterByArtistPipe implements PipeTransform {
    transform(songs: Song[], artistId: string | null | undefined): Song[] {
        if (!artistId) return songs;
        return songs.filter((s) => s.artistId === artistId);
    }
}
