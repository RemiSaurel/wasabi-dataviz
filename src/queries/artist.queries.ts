import { createQueryKeys } from "@lukemorales/query-key-factory";
import { fetchArtist } from "../services/artist-service";
import { useQuery } from "@tanstack/vue-query";

export const artists = createQueryKeys("artists", {
  artistByName: (name) => ({
    queryKey: [name],
    queryFn: () => fetchArtist(name),
  }),
});

export function useArtist(name) {
  return useQuery({ ...artists.artistByName(name) });
}
