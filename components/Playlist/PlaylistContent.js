import styles from "./Playlist.module.css";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import Image from "next/image";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Logo } from "./Logo";
import { useTrackBackgroundImage } from "./useTrackBackgroundImage";
import { poppins } from "./fonts";
import { useHideNostrLoginBanner } from "@/components/Playlist/useHideNostrLoginBanner";
import { usePrefetchTrackAssets } from "@/components/Playlist/usePrefetchTrackAssets";
import { useTrackLnurl } from "@/components/Playlist/useTrackLnurl";

export const PlaylistContent = ({ title, tracks = [] }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = tracks[currentTrackIndex];
  const nextTrack = tracks[currentTrackIndex + 1];
  const { data: currentTrackBackgroundImageSrc } = useTrackBackgroundImage(
    currentTrack?.id,
  );
  const { data: lnurl } = useTrackLnurl(currentTrack?.id);
  const playerRef = useRef(null);
  const playNext = () => {
    setCurrentTrackIndex((currentTrack) =>
      currentTrack < tracks.length - 1 ? currentTrack + 1 : 0,
    );
  };
  const playPrevious = () => {
    if (playerRef.current && currentTrackIndex === 0) {
      const audio = playerRef.current.audio.current;

      audio.currentTime = 0;
      audio.play();

      return;
    }

    setCurrentTrackIndex((currentTrack) => currentTrack - 1);
  };
  const albumActualImageSize = 500;

  useHideNostrLoginBanner();
  usePrefetchTrackAssets(nextTrack?.id);

  return tracks.length > 0 ? (
    <main className={`${poppins.className} ${styles.main}`}>
      {currentTrackBackgroundImageSrc && (
        <img
          src={currentTrackBackgroundImageSrc}
          alt="Track background image"
          style={{
            objectFit: "cover",
            width: "100vw",
            height: "100vh",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      )}
      <div className={styles.container}>
        <>
          <div className={styles.topLeftCorner}>
            <Logo
              style={{
                flexBasis: 108,
                filter: "drop-shadow(1px 1px 1px black)",
              }}
            />
            <div>
              <p>PLAYING FROM PLAYLIST</p>
              <p className={styles.boldText}>{title}</p>
            </div>
          </div>
          <div className={styles.bottomLeftCorner}>
            <div>
              <Image
                src={currentTrack.albumArtUrl ?? currentTrack.artworkUrl}
                alt={`artwork for ${currentTrack.title}`}
                width={albumActualImageSize}
                height={albumActualImageSize}
                className={styles.responsiveSquares}
                priority
              />
              <div>
                <p className={styles.boldText}>{currentTrack.title}</p>
                <p>{currentTrack.artist}</p>
              </div>
            </div>
            <div>
              <QRCodeSVG
                value={`lightning:${lnurl}`}
                includeMargin
                className={styles.responsiveSquares}
              />
              <div>
                <p className={styles.boldText}>Boost and support this artist</p>
                <p>
                  Scan this QR code from any lightning wallet to send sats
                  directly to the artist.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.audioControlsContainer}>
            <AudioPlayer
              ref={playerRef}
              autoPlay
              src={currentTrack.mediaUrl ?? currentTrack?.liveUrl}
              showSkipControls
              onClickPrevious={playPrevious}
              onClickNext={playNext}
              onEnded={playNext}
              style={{ backgroundColor: "transparent", boxShadow: "none" }}
            />
          </div>
        </>
      </div>
    </main>
  ) : null;
};
