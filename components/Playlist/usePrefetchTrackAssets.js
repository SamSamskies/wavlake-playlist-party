import { useEffect } from "react";
import {
  createTrackBackgroundImageQueryKey,
  fetchTrackBackgroundImage,
} from "@/components/Playlist/useTrackBackgroundImage";
import {
  createTrackLnurlQueryKey,
  fetchTrackLnurl,
} from "@/components/Playlist/useTrackLnurl";
import { useQueryClient } from "@tanstack/react-query";

// eager load next track assets
export const usePrefetchTrackAssets = (trackId) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (trackId) {
      queryClient.prefetchQuery({
        queryKey: createTrackBackgroundImageQueryKey(trackId),
        queryFn: () => fetchTrackBackgroundImage(trackId),
      });
      queryClient.prefetchQuery({
        queryKey: createTrackLnurlQueryKey(trackId),
        queryFn: () => fetchTrackLnurl(trackId),
      });
    }
  }, [queryClient, trackId]);
};
