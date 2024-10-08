import styles from "./PlaylistSection.module.css";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";

export const PlaylistSection = ({ title, playlists }) => {
  const router = useRouter();
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
  const handlePlaylistClick = (id) => {
    if (isLoadingPlaylist) {
      return;
    }

    setIsLoadingPlaylist(true);
    router.push(`/playlists/${id}`);
  };

  return playlists.length > 0 ? (
    <div className={styles.playlistSection}>
      <h2>{title}</h2>
      <div className={styles.playlistsContainer}>
        {playlists.map(({ id, title: playlistTitle, tracks }) => (
          <div
            key={id}
            className={styles.playlist}
            onClick={() => handlePlaylistClick(id)}
          >
            <div className={styles.playlistArt}>
              {tracks
                .slice(0, 4)
                .map(({ id, artworkUrl, albumArtUrl, title: trackTitle }) => (
                  <Image
                    key={id}
                    src={artworkUrl ?? albumArtUrl}
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
    </div>
  ) : null;
};
