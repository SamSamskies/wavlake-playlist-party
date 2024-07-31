import styles from "./Playlist.module.css";
import { Poppins } from "next/font/google";
import { QRCodeSVG } from "qrcode.react";
import { bech32 } from "bech32";
import { utf8ToBytes } from "@noble/hashes/utils";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import Image from "next/image";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Logo } from "./Logo";

const poppins = Poppins({ weight: ["400", "700"], subsets: ["latin"] });

const encodeTrackLnurl = (trackId) => {
  const url = `${process.env.NEXT_PUBLIC_WAVLAKE_DOT_COM_API_BASE_URL}/lnurl/track/${trackId}`;
  const words = bech32.toWords(utf8ToBytes(url));

  return bech32.encode("lnurl", words, 1023).toUpperCase();
};

const fetchPlaylist = (playlistId) =>
  fetch(
    `${process.env.NEXT_PUBLIC_WAVLAKE_CATALOG_API_BASE_URL}/v1/playlists/${playlistId}`,
  )
    .then((res) => res.json())
    .then((res) => res.data);

const fetchTrackBackgroundImage = (trackId) =>
  fetch(
    `${process.env.NEXT_PUBLIC_WAVLAKE_CATALOG_API_BASE_URL}/v1/tracks/${trackId}`,
  )
    .then((res) => res.json())
    .then((res) => res.data.avatarUrl);

export const Playlist = ({ playlistId }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const { data: playlist } = useQuery({
    queryKey: ["playlists", playlistId],
    queryFn: () => fetchPlaylist(playlistId),
    staleTime: Infinity,
  });
  const currentTrack = playlist?.tracks
    ? playlist.tracks[currentTrackIndex]
    : null;
  const { data: currentTrackBackgrounImageSrc } = useQuery({
    queryKey: ["trackBackgroundImages", currentTrack?.id],
    queryFn: () => fetchTrackBackgroundImage(currentTrack?.id),
    staleTime: Infinity,
    enabled: Boolean(currentTrack?.id),
  });
  const playerRef = useRef(null);
  const playNext = () => {
    setCurrentTrackIndex((currentTrack) =>
      currentTrack < playlist.tracks.length - 1 ? currentTrack + 1 : 0,
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

  return (
    <main className={`${poppins.className} ${styles.main}`}>
      {currentTrackBackgrounImageSrc && (
        <Image
          src={currentTrackBackgrounImageSrc}
          alt="Track background image"
          fill
          style={{ objectFit: "cover" }}
        />
      )}
      <div className={styles.container}>
        {currentTrack && (
          <>
            <div className={styles.topLeftCorner}>
              <Logo style={{ flexBasis: 108 }} />
              <div>
                <p>PLAYING FROM PLAYLIST</p>
                <p className={styles.boldText}>{playlist.title}</p>
              </div>
            </div>
            <div className={styles.bottomLeftCorner}>
              <div>
                <Image
                  src={currentTrack.artworkUrl}
                  alt={`artwork for ${currentTrack.title}`}
                  width={400}
                  height={400}
                  priority
                />
                <div>
                  <p className={styles.boldText}>{currentTrack.title}</p>
                  <p>{currentTrack.artist}</p>
                </div>
              </div>
              <div>
                <QRCodeSVG
                  value={`lightning:${encodeTrackLnurl(currentTrack.id)}`}
                  includeMargin
                  size={400}
                  className={styles.responsiveSquares}
                />
                <div>
                  <p className={styles.boldText}>
                    Boost and support this artist
                  </p>
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
                src={currentTrack.liveUrl}
                showSkipControls
                onClickPrevious={playPrevious}
                onClickNext={playNext}
                onEnded={playNext}
                style={{ backgroundColor: "transparent", boxShadow: "none" }}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
};
