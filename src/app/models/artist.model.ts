/**
 * EchoBlue — Artist Model
 * Represents a music artist or band.
 */
export interface Artist {
    id: string;
    name: string;
    bio: string;
    image: string;
    topTracks: string[];    // array of Song IDs
}
