export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Wave Pulse",
  description: "Provides insights about a WaveMaker React Native app.",
  navItems: [
    {
      label: "Main",
      href: "/",
    },
    {
      label: "Waiting For Connection",
      href: "/wfc"
    },
    {
      label: "Check Pulse",
      href: "/pulse"
    }
  ]
};
