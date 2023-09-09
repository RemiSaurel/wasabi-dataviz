import {createQueryKeys} from "@lukemorales/query-key-factory";
import {useQuery} from "@tanstack/vue-query";
import {fetchAllSongs} from "../services/song-service.ts";
import {Ref} from "vue";

export const songKeys = createQueryKeys("Song", {
    songListByStart: (start: Ref<number>) => ({
        queryKey: ["start", start.value],
        queryFn: () => fetchAllSongs(start.value),
    }),
});

export function useSongList(start: Ref<number>) {
    return useQuery({...songKeys.songListByStart(start)});
}
