import { useQuery } from "@tanstack/react-query";
import { fetchLikedPlaylist, LIKED, PLAYLIST } from "@/utils/fetchPlaylist";

export const useLikedPlaylist = (isEnabled) =>
  useQuery({
    queryKey: [PLAYLIST, LIKED],
    queryFn: fetchLikedPlaylist,
    enabled: isEnabled,
    staleTime: Infinity,
  });
