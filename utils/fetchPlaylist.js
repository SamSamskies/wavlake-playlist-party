export async function fetchPlaylist(playlistId) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WAVLAKE_DOT_COM_API_BASE_URL}/v1/content/playlist/${playlistId}`,
  );
  if (!response.ok) {
    const error = new Error(
      `Failed to fetch album covers: ${response.statusText}`,
    );
    error.status = response.status;
    throw error;
  }
  return await response.json();
}
