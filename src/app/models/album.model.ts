/**
 * EchoBlue — Album Model
 * Represents a music album.
 */
export interface Album {
    id: string;
    title: string;
    artistId: string;
    releaseDate: string;    // ISO 8601 date string (e.g. "2025-06-15")
    coverImage: string;
}
