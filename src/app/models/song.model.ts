/**
 * EchoBlue — Song Model
 * Represents an individual music track.
 */
export interface Song {
    id: string;
    title: string;
    artistId: string;
    albumId: string;
    duration: number;       // duration in seconds
    genre: string;
    audioUrl: string;
    coverImage: string;
}
