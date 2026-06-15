import { useState, useEffect } from "react";

/**
 * Reactive hook that returns true when data-theme="dark" is set on <html>.
 * Updates automatically when the theme toggle changes it.
 */
const useDarkMode = () => {
  const [dark, setDark] = useState(
    () => document.documentElement.getAttribute("data-theme") === "dark"
  );

  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.getAttribute("data-theme") === "dark")
    );
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  return dark;
};

export default useDarkMode;
