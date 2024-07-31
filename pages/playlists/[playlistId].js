export { Playlist as default } from "@/components/Playlist";

export const getServerSideProps = async ({ params }) => {
  const { playlistId } = params;

  return { props: { playlistId } };
};
