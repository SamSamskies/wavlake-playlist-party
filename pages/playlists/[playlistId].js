import { fetchPlaylist } from "@/utils/fetchPlaylist";

export { Playlist as default } from "@/components/Playlist";

export const getServerSideProps = async ({ params }) => {
  const { playlistId } = params;
  const { title, tracks } = await fetchPlaylist(playlistId);

  return { props: { title, tracks, playlistId } };
};
