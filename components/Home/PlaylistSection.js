import styles from "./PlaylistSection.module.css";
import Image from "next/image";

export const PlaylistSection = ({ title, playlists }) => {
  return (
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
    </div>
  );
};
