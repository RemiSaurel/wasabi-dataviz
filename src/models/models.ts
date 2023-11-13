export interface GlobalData {
  totalNbArtists: number | string;
  totalNbSongs: number | string;
  totalNbAlbums: number | string;
  totalNbDeezerFans: number | string;
  totalNbUniqueGenres: number | string;
}

export const GLOBAL_DATA_KEYS = [
  "artistes",
  "chansons",
  "albums",
  "nb fans Deezer cumulés",
  "genres uniques",
];

/**
 * {"country": "United Kingdom", "artists": [{"artist": "A", "genres": [], "nbAlbums": 6, "nbSongs": 102, "deezerFans": 6519}, ...]}
 */
export interface RemiData {
  country: string;
  artists: RemiArtist[];
}

export interface RemiArtist {
  artist: string;
  genres: string[];
  nbAlbums: number;
  nbSongs: number;
  deezerFans: number;
}
