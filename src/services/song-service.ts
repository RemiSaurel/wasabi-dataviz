import { API_URL } from "../utils/constants";
import { Ref } from "vue";

export async function fetchAllSongs(start: Ref<number>): Promise<any> {
  const response = await fetch(`${API_URL}/song_all/${start.value}`);
  return response.json();
}

export async function fetchSongDocument(id: Ref<string>): Promise<any> {
  const response = await fetch(`${API_URL}/song/id/${id.value}`);
  return response.json();
}
