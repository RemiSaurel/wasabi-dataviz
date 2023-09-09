import {API_URL} from '../utils/constants.ts';

export async function fetchAllSongs(start: number): Promise<any> {
    console.log('fetching all songs, start = ' + start)
    const response = await fetch(`${API_URL}/song_all/${start}`);
    return response.json();
}