import { API_URL } from "../utils/constants";
import { Ref } from "vue";

export async function fetchAlbum(
  artistId: Ref<string>,
  albumId: Ref<string>,
): Promise<any> {
  const response = await fetch(
    `${API_URL}/search/artist_id/${artistId.value}/album_id/${albumId.value}`,
  );
  return response.json();
}

export async function fetchGenre(genre: Ref<string>): Promise<any> {
  const response = await fetch(`${API_URL}/search/genre/${genre.value}`);
  return response.json();
}
