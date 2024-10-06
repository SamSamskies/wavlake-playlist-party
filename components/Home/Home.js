import styles from "./Home.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

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

export const Home = () => {
  const router = useRouter();
  const [pubkey, setPubkey] = useState(null);
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
      <main>
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
        <div className={styles.playlistsContainer}>
          {playlists.map(({ id, title: playlistTitle, tracks }) => (
            <div
              key={id}
              className={styles.playlistRow}
              onClick={() => router.push(`/playlists/${id}`)}
            >
              <div className={styles.playlistArt}>
                {tracks
                  .slice(0, 4)
                  .map(({ id, artworkUrl, title: trackTitle }) => (
                    <Image
                      key={id}
                      src={artworkUrl}
                      alt={`${trackTitle} art`}
                      width={500}
                      height={500}
                    />
                  ))}
              </div>
              <div className={styles.playlistMetadata}>
                <p>{playlistTitle}</p>
                <p>{tracks.length} tracks</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};
