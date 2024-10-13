import "react-h5-audio-player/lib/styles.css";
import Head from "next/head";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { PlaylistContent } from "./PlaylistContent";

export const Playlist = ({ title, tracks = [], playlistId }) => {
  const baseUrl = getBaseUrl();
  const ogImage = `${baseUrl}/api/og/${playlistId}`;

  return (
    <>
      <Head>
        <meta property="og:title" content={title} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImage} />
        <meta
          property="og:url"
          content={`${baseUrl}/playlists/${playlistId}`}
        />
      </Head>
      <PlaylistContent title={title} tracks={tracks} />
    </>
  );
};
