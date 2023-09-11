import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/vue-query";
import { fetchAlbum, fetchGenre } from "../services/search-service";

export const search = createQueryKeys("search", {
  albumByID: (artistId, albumId) => ({
    queryKey: [artistId, albumId],
    queryFn: () => fetchAlbum(artistId, albumId),
  }),
  genreByName: (genre) => ({
    queryKey: [genre],
    queryFn: () => fetchGenre(genre),
  }),
});

export function useAlbum(artistId, albumId) {
  return useQuery({ ...search.albumByID(artistId, albumId) });
}

export function useGenre(genre) {
  return useQuery({ ...search.genreByName(genre) });
}
