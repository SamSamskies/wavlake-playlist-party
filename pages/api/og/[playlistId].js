import { ImageResponse } from "@vercel/og";
import { fetchPlaylist } from "@/utils/fetchPlaylist";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const playlistId = searchParams.get("playlistId");
  const ogSize = 630;
  const imageSize = Math.floor(ogSize / 2); // Size of each image

  try {
    const { tracks } = await fetchPlaylist(playlistId);

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to right, #2E0854, #7B2CBF, #2E0854)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: `${ogSize}px`,
              height: `${ogSize}px`,
            }}
          >
            {tracks.slice(0, 4).map(({ id, title, albumArtUrl }) => (
              <img
                key={id}
                src={albumArtUrl}
                style={{
                  width: `${imageSize}px`,
                  height: `${imageSize}px`,
                }}
                alt={`album are for ${title}`}
              />
            ))}
          </div>
        </div>
      ),
      {
        width: ogSize,
        height: ogSize,
      },
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate OG image",
        details: error.message,
      }),
      {
        status: error.status || 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
