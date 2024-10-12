import "@/styles/globals.css";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // With SSR, we usually want to set some default staleTime
      // above 0 to avoid refetching immediately on the client
      staleTime: 60 * 1000,
    },
  },
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Wavlake Playlist Party</title>
        <meta property="og:type" content="music.playlist" />
        <meta
          name="description"
          content="Play any Wavlake playlist in party mode 🎉"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}
