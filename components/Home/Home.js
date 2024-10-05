import styles from "./Home.module.css";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getBaseUrl } from "@/utils/getBaseUrl";

function extractTrackIdFromWavlakeUrl(url) {
  const regex =
    /^https:\/\/wavlake\.com\/playlist\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/;
  const match = url.match(regex);

  return match ? match[1] : null;
}

export const Home = () => {
  const router = useRouter();
  const [error, setError] = useState("");
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
      </main>
    </>
  );
};
