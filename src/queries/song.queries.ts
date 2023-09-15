import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQueries, useQuery } from "@tanstack/vue-query";
import { fetchAllSongs, fetchSongDocument } from "../services/song-service";
import { Ref } from "vue";

export const ALL_SONG_STEP = 200;

export const songs = createQueryKeys("songs", {
  songListByStart: (start) => ({
    queryKey: [start],
    queryFn: () => fetchAllSongs(start),
  }),
  songDocument: (id) => ({
    queryKey: [id],
    queryFn: () => fetchSongDocument(id),
  }),
});

export function useSongList(start: Ref<number>) {
  return useQuery({ ...songs.songListByStart(start) });
}

export function useSongDocument(id: Ref<string>) {
  return useQuery({ ...songs.songDocument(id) });
}

// CHECK IF THERE IS ANOTHER WAY TO GET SONG INFO
export function useSongListOnAlbum(songIdList: Ref<Array<string>>) {
  return useQueries({
    queries: songIdList
      ? songIdList.value.map((songId) => ({
          ...songs.songDocument(songId),
        }))
      : [],
  });
}
