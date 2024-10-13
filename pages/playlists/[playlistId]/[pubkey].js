export { PrivatePlaylist as default } from "@/components/Playlist/PrivatePlaylist";

export const getServerSideProps = async ({ params }) => {
  const { pubkey, playlistId } = params;

  return { props: { pubkey, title: "Liked", playlistId } };
};
