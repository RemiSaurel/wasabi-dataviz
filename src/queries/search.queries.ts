import { createQueryKeys } from "@lukemorales/query-key-factory";
import { fetchArtist } from "../services/artist-service";
import { useQuery } from "@tanstack/vue-query";
import { fetchAlbum } from "../services/album-service";

export const albums = createQueryKeys("albums", {
  albumByID: (artistId, albumId) => ({
    queryKey: [artistId, albumId],
    queryFn: () => fetchAlbum(artistId, albumId),
  }),
});

export function useAlbum(artistId, albumId) {
  return useQuery({ ...albums.albumByID(artistId, albumId) });
}
