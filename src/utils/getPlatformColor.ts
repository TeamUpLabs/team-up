export const getPlatformColor = (platform: string) => {
    switch (platform) {
        case "Zoom":
            return "bg-blue-500/20 border border-blue-500/50";
        case "Google Meet":
            return "bg-red-500/20 border border-red-500/50";
        case "TeamUp":
            return "bg-purple-500/20 border border-purple-500/50";
        default:
            return "bg-component-secondary-background border border-component-border";
    }
};

export const getPlatformColorName = (platform: string) => {
  switch (platform) {
    case "Zoom":
      return "blue";
    case "Google Meet":
      return "red";
    case "TeamUp":
      return "purple";
    default:
      return "gray";
  }
}