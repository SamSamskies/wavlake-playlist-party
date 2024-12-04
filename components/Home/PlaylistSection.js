import styles from "./PlaylistSection.module.css";
import { useState } from "react";
import { useRouter } from "next/router";
import { LIKED } from "@/utils/fetchPlaylist";

export const PlaylistSection = ({ pubkey, title, playlists }) => {
  const router = useRouter();
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
  const handlePlaylistClick = (id) => {
    if (isLoadingPlaylist) {
      return;
    }

    setIsLoadingPlaylist(true);

    if (Boolean(pubkey) && id === LIKED) {
      router.push(`/private/${pubkey}/playlists/${id}`);
    } else {
      router.push(`/playlists/${id}`);
    }
  };

  return playlists.length > 0 ? (
    <div className={styles.playlistSection}>
      <h2>{title}</h2>
      <div className={styles.playlistsContainer}>
        {playlists.map(({ id, title: playlistTitle, tracks, isPrivate }) => (
          <div
            key={id}
            className={styles.playlist}
            onClick={() => handlePlaylistClick(id)}
          >
            <div className={styles.playlistArt}>
              {tracks
                .slice(0, 4)
                .map(({ id, artworkUrl, albumArtUrl, title: trackTitle }) => (
                  <img
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
              {isPrivate && (
                <small>
                  Private (must be logged in with nip-07 ext to play)
                </small>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null;
};
