import { API_URL } from "../utils/constants";
import { Ref } from "vue";

export async function fetchArtist(artistName: Ref<string>): Promise<any> {
  const response = await fetch(
    `${API_URL}/artist_all/name/${artistName.value}`,
  );
  return response.json();
}
