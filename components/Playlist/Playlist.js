import styles from "./Playlist.module.css";
import { Poppins } from "next/font/google";
import { QRCodeSVG } from "qrcode.react";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import Image from "next/image";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Logo } from "./Logo";
import { useMediaQuery } from "react-responsive";
import Head from "next/head";
import { getBaseUrl } from "@/utils/getBaseUrl";

const poppins = Poppins({ weight: ["400", "700"], subsets: ["latin"] });

const fetchTrackBackgroundImage = (trackId) =>
  fetch(
    `${process.env.NEXT_PUBLIC_WAVLAKE_CATALOG_API_BASE_URL}/v1/tracks/${trackId}`,
  )
    .then((res) => res.json())
    .then((res) => res.data.avatarUrl);

const fetchLnurl = (trackId) =>
  fetch(
    `${process.env.NEXT_PUBLIC_WAVLAKE_DOT_COM_API_BASE_URL}/v1/lnurl?contentId=${trackId}&appId=samskies21`,
  )
    .then((res) => res.json())
    .then((res) => res.lnurl);

export const Playlist = ({ title, tracks, playlistId }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = tracks ? tracks[currentTrackIndex] : null;
  const { data: currentTrackBackgroundImageSrc } = useQuery({
    queryKey: ["trackBackgroundImages", currentTrack?.id],
    queryFn: () => fetchTrackBackgroundImage(currentTrack?.id),
    staleTime: Infinity,
    enabled: Boolean(currentTrack?.id),
  });
  const { data: lnurl } = useQuery({
    queryKey: ["lnurl", currentTrack?.id],
    queryFn: () => fetchLnurl(currentTrack?.id),
    staleTime: Infinity,
    enabled: Boolean(currentTrack?.id),
  });
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
  const isDesktop = useMediaQuery({ query: "(min-width: 1025px)" });
  const isSmallScreen = useMediaQuery({ query: "(max-width: 588px)" });
  const albumActualImageSize = 500;
  const getImageSize = () => {
    if (isSmallScreen) {
      return 140;
    }

    return isDesktop ? 400 : 200;
  };
  const imageSize = getImageSize();
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
      <main className={`${poppins.className} ${styles.main}`}>
        {currentTrackBackgroundImageSrc && (
          <Image
            src={currentTrackBackgroundImageSrc}
            alt="Track background image"
            fill
            style={{ objectFit: "cover" }}
          />
        )}
        <div className={styles.container}>
          {currentTrack && (
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
                    src={currentTrack.albumArtUrl}
                    alt={`artwork for ${currentTrack.title}`}
                    width={albumActualImageSize}
                    height={albumActualImageSize}
                    style={{ width: imageSize, height: imageSize }}
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
                    size={imageSize}
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
                  src={currentTrack.mediaUrl}
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
    </>
  );
};
