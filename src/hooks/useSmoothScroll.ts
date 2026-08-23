import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function useSmoothScroll() {
  const { pathname } = useLocation();
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: isMobile ? "auto" : "smooth",
    });
  }, [pathname]);
}
