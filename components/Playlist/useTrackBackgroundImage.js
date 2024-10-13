import { useQuery } from "@tanstack/react-query";

export const createTrackBackgroundImageQueryKey = (trackId) => [
  "trackBackgroundImage",
  trackId,
];

export const fetchTrackBackgroundImage = (trackId) =>
  fetch(
    `${process.env.NEXT_PUBLIC_WAVLAKE_CATALOG_API_BASE_URL}/v1/tracks/${trackId}`,
  )
    .then((res) => res.json())
    .then((res) => res.data.avatarUrl);

export const useTrackBackgroundImage = (trackId) =>
  useQuery({
    queryKey: createTrackBackgroundImageQueryKey(trackId),
    queryFn: () => fetchTrackBackgroundImage(trackId),
    staleTime: Infinity,
    enabled: Boolean(trackId),
  });
