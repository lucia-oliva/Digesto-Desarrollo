import { useEffect, useState } from "react";

export default function useIsSmallScreen(max = 1024) {
  const [isSmall, setIsSmall] = useState(
    typeof window !== "undefined" ? window.innerWidth <= max : false
  );

  useEffect(() => {
    const handler = () => setIsSmall(window.innerWidth <= max);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [max]);

  return isSmall;
}
