import { useEffect } from "react";

export const useHideNostrLoginBanner = () => {
  useEffect(() => {
    document.body.classList.add("hide-nl-banner");

    return () => {
      document.body.classList.remove("hide-nl-banner");
    };
  }, []);
};
