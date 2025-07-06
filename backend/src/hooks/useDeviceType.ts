import { useEffect, useState } from "react";

export function useDeviceType(): "mobile" | "desktop" {
  const [deviceType, setDeviceType] = useState<"mobile" | "desktop">("desktop");

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(window.innerWidth <= 768 ? "mobile" : "desktop");
    };

    handleResize(); // on load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return deviceType;
}
