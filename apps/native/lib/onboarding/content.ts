export type OnboardingSlide = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  emoji: string;
};

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: "welcome",
    titleKey: "welcome",
    descriptionKey: "welcome_subtitle",
    emoji: "👋",
  },
  {
    id: "features",
    titleKey: "features",
    descriptionKey: "features_subtitle",
    emoji: "✨",
  },
  {
    id: "notifications",
    titleKey: "notifications",
    descriptionKey: "notifications_subtitle",
    emoji: "🔔",
  },
  {
    id: "ready",
    titleKey: "ready",
    descriptionKey: "ready_subtitle",
    emoji: "🚀",
  },
];
