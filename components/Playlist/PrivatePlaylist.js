import "react-h5-audio-player/lib/styles.css";
import Head from "next/head";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { PlaylistContent } from "./PlaylistContent";
import { useLikedPlaylist } from "@/hooks/useLikedPlaylist";

export const PrivatePlaylist = ({ pubkey, title, playlistId }) => {
  const baseUrl = getBaseUrl();
  const { data: likedPlaylist } = useLikedPlaylist(Boolean(pubkey));

  return (
    <>
      <Head>
        <meta property="og:title" content={title} />
        <meta
          property="og:url"
          content={`${baseUrl}/private/${pubkey}/playlists/${playlistId}`}
        />
      </Head>
      <PlaylistContent title={title} tracks={likedPlaylist?.tracks} />
    </>
  );
};
