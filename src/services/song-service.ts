import {API_URL} from '../utils/constants.ts';
import {Ref} from "vue";

export async function fetchAllSongs(start: Ref<number>): Promise<any> {
    const response = await fetch(`${API_URL}/song_all/${start.value}`);
    return response.json();
}