import styles from "./Playlist.module.css";
import { Poppins } from "next/font/google";
import { QRCodeSVG } from "qrcode.react";
import { bech32 } from "bech32";
import { utf8ToBytes } from "@noble/hashes/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

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

export const Playlist = ({ playlistId }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const { data } = useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: () => fetchPlaylist(playlistId),
  });
  const currentTrack = data?.tracks ? data.tracks[currentTrackIndex] : null;

  return (
    <main className={`${poppins.className} ${styles.main}`}>
      <h1>WAVLAKE</h1>
      {currentTrack && (
        <>
          <h2>{data.title}</h2>
          <div className={styles.container}>
            <div>
              <img
                src={currentTrack.artworkUrl}
                alt={`artwork for ${currentTrack.title}`}
                className={styles.responsiveSquares}
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
                size={500}
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
        </>
      )}
    </main>
  );
};
