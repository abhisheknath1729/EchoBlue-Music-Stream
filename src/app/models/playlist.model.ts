/**
 * EchoBlue — Playlist Model
 * Represents a user-curated playlist.
 */
export interface Playlist {
    id: string;
    name: string;
    description: string;
    songs: string[];        // array of Song IDs
}
