import { Pipe, PipeTransform } from '@angular/core';
import type { Song } from '../models/song.model';

/**
 * Filters an array of songs by albumId.
 *
 * Usage:
 *   *ngFor="let song of songs | filterByAlbum:'album-5'"
 *
 * Pass an empty string or null to skip filtering.
 */
@Pipe({
    name: 'filterByAlbum',
    standalone: true,
    pure: true,
})
export class FilterByAlbumPipe implements PipeTransform {
    transform(songs: Song[], albumId: string | null | undefined): Song[] {
        if (!albumId) return songs;
        return songs.filter((s) => s.albumId === albumId);
    }
}
