import styles from "./Home.module.css";
import { useEffect, useState } from "react";
import Head from "next/head";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { useQuery } from "@tanstack/react-query";
import { PlaylistSection } from "@/components/Home/PlaylistSection";
import {
  fetchTrendingRock,
  fetchTrendingHipHop,
  fetchPlaylistByPlaylistId,
  PLAYLIST,
  TRENDING_ROCK_PLAYLIST_ID,
  TRENDING_HIPHOP_PLAYLIST_ID,
  TOP_40,
  fetchTop40,
} from "@/utils/fetchPlaylist";
import { useRouter } from "next/router";

const getLibraryPlaylists = async (pubkey) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_WAVLAKE_CATALOG_API_BASE_URL}/v1/playlists/user/${pubkey}`,
  )
    .then((res) => res.json())
    .then((res) => res.data);
};

function extractTrackIdFromWavlakeUrl(url) {
  const regex =
    /^https:\/\/wavlake\.com\/playlist\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/;
  const match = url.match(regex);

  return match ? match[1] : null;
}

const featuredPlaylistId = "8f4cd4a2-1be6-45f7-8d9b-fcf1fc2e4b9f";

export const Home = () => {
  const router = useRouter();
  const [pubkey, setPubkey] = useState(null);
  const { data: featuredPlaylist } = useQuery({
    queryKey: [PLAYLIST, featuredPlaylistId],
    queryFn: () => fetchPlaylistByPlaylistId(featuredPlaylistId),
    staleTime: Infinity,
  });
  const { data: top40Playlist } = useQuery({
    queryKey: [PLAYLIST, TOP_40],
    queryFn: fetchTop40,
    staleTime: Infinity,
  });
  const featuredPlaylists = [featuredPlaylist].filter((p) => p !== undefined);
  const { data: trendingRockPlaylist } = useQuery({
    queryKey: [PLAYLIST, TRENDING_ROCK_PLAYLIST_ID],
    queryFn: fetchTrendingRock,
    staleTime: Infinity,
  });
  const { data: trendingHipHopPlaylist } = useQuery({
    queryKey: [PLAYLIST, TRENDING_HIPHOP_PLAYLIST_ID],
    queryFn: fetchTrendingHipHop,
    staleTime: Infinity,
  });
  const trendingPlaylists = [
    top40Playlist,
    trendingRockPlaylist,
    trendingHipHopPlaylist,
  ].filter((pl) => pl !== undefined);
  const { data: playlists = [] } = useQuery({
    queryKey: ["playlists", pubkey],
    queryFn: () => getLibraryPlaylists(pubkey),
    enabled: Boolean(pubkey),
    staleTime: Infinity,
  });
  const [error, setError] = useState(null);
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const input = form.elements[0];
    const value = input.value.trim();
    const trackId = extractTrackIdFromWavlakeUrl(value);

    if (trackId) {
      return router.push(`/playlists/${trackId}`);
    } else {
      setError("Invalid Wavlake playlist URL");
    }
  };

  const baseUrl = getBaseUrl();
  const ogImage = `${baseUrl}/api/og`;

  useEffect(() => {
    const handleAuthEvent = (event) => {
      if (event.detail.type === "login") {
        setPubkey(event.detail.pubkey);
      }

      if (event.detail.type === "logout") {
        setPubkey(null);
      }
    };

    document.addEventListener("nlAuth", handleAuthEvent);

    return () => {
      document.removeEventListener("nlAuth", handleAuthEvent);
    };
  }, []);

  useEffect(() => {
    import("nostr-login")
      .then(({ init }) =>
        init({
          darkMode: true,
          methods: ["extension", "readOnly"],
        }),
      )
      .catch(console.error);
  }, []);

  return (
    <>
      <Head>
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImage} />
        <meta property="og:url" content={baseUrl} />
      </Head>
      <main className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            autoFocus
            className={styles.input}
            placeholder="Enter Wavlake playlist URL"
          />
          <button className={styles.button} type="submit">
            Start the party 🎉
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        <PlaylistSection title="Featured" playlists={featuredPlaylists} />
        <PlaylistSection title="Trending" playlists={trendingPlaylists} />
        <PlaylistSection title="Library" playlists={playlists} />
      </main>
    </>
  );
};
