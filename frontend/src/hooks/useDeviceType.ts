import { useEffect, useState } from "react";

export function useDeviceType(): "mobile" | "desktop" {
  const [deviceType, setDeviceType] = useState<"mobile" | "desktop">(
    window.innerWidth <= 768 ? "mobile" : "desktop"
  );

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(window.innerWidth <= 768 ? "mobile" : "desktop");
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return deviceType;
}
