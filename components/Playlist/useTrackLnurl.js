import { useQuery } from "@tanstack/react-query";

export const createTrackLnurlQueryKey = (trackId) => ["lnurl", trackId];

export const fetchTrackLnurl = (trackId) =>
  fetch(
    `${process.env.NEXT_PUBLIC_WAVLAKE_DOT_COM_API_BASE_URL}/v1/lnurl?contentId=${trackId}&appId=samskies21`,
  )
    .then((res) => res.json())
    .then((res) => res.lnurl);

export const useTrackLnurl = (trackId) =>
  useQuery({
    queryKey: createTrackLnurlQueryKey(trackId),
    queryFn: () => fetchTrackLnurl(trackId),
    staleTime: Infinity,
    enabled: Boolean(trackId),
  });
