import { getToken } from "nostr-tools/nip98";

export const PLAYLIST = "playlist";
export const TRENDING_ROCK_PLAYLIST_ID = "trending-rock";
export const TRENDING_HIPHOP_PLAYLIST_ID = "trending-hiphop";
export const TOP_40 = "top-40";
export const LIKED = "liked";

export const fetchPlaylist = async (playlistId) => {
  switch (playlistId) {
    case TOP_40:
      return fetchTop40();
    case TRENDING_ROCK_PLAYLIST_ID:
      return fetchTrendingRock();
    case TRENDING_HIPHOP_PLAYLIST_ID:
      return fetchTrendingHipHop();
    default:
      return fetchPlaylistByPlaylistId(playlistId);
  }
};

export const fetchPlaylistByPlaylistId = async (playlistId) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WAVLAKE_DOT_COM_API_BASE_URL}/v1/content/playlist/${playlistId}`,
  );
  if (!response.ok) {
    const error = new Error(`Failed to fetch playlist: ${response.statusText}`);
    error.status = response.status;
    throw error;
  }
  return { id: playlistId, ...(await response.json()) };
};

export const fetchTrendingPlaylistByGenre = async (genre) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_WAVLAKE_DOT_COM_API_BASE_URL}/v1/content/rankings?sort=sats&days=7&genre=${genre}&limit=40`,
  )
    .then((res) => res.json())
    .then((res) => res);
};

export const fetchTrendingRock = async () => {
  const playlist = await fetchTrendingPlaylistByGenre("rock");

  return { id: TRENDING_ROCK_PLAYLIST_ID, title: "Rock", tracks: playlist };
};

export const fetchTrendingHipHop = async () => {
  const playlist = await fetchTrendingPlaylistByGenre("hip-hop");

  return {
    id: TRENDING_HIPHOP_PLAYLIST_ID,
    title: "Hip-Hop",
    tracks: playlist,
  };
};

export const fetchTop40 = async () => {
  return fetch(
    `${process.env.NEXT_PUBLIC_WAVLAKE_DOT_COM_API_BASE_URL}/v1/content/rankings?sort=sats&days=7&limit=40`,
  )
    .then((res) => res.json())
    .then((res) => ({ id: TOP_40, title: "Top 40", tracks: res }));
};

export const fetchLibraryPlaylists = async (pubkey) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_WAVLAKE_CATALOG_API_BASE_URL}/v1/playlists/user/${pubkey}`,
  )
    .then((res) => res.json())
    .then((res) => res.data);
};

export const fetchLikedPlaylist = async () => {
  const url = `${process.env.NEXT_PUBLIC_WAVLAKE_CATALOG_API_BASE_URL}/v1/library/tracks`;
  const res = await fetch(url, {
    headers: {
      Authorization: await getToken(
        url,
        "get",
        (event) => window.nostr.signEvent(event),
        true,
      ),
    },
  });
  const tracks = await res.json().then((res) => res.data.tracks);

  return {
    id: LIKED,
    title: "Liked",
    tracks,
    isPrivate: true,
  };
};
