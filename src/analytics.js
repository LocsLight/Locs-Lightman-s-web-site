export const GA_MEASUREMENT_ID = "G-GBGZPQRCK8";

export const trackPageView = (path) => {
  if (typeof window.gtag !== "function") return;
  window.gtag("config", GA_MEASUREMENT_ID, { page_path: path });
};

export const trackEvent = (name, params = {}) => {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
};