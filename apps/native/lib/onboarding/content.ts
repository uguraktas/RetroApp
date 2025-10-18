export type OnboardingSlide = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  emoji: string;
};

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: "welcome",
    titleKey: "onboarding.welcome.title",
    descriptionKey: "onboarding.welcome.description",
    emoji: "👋",
  },
  {
    id: "features",
    titleKey: "onboarding.features.title",
    descriptionKey: "onboarding.features.description",
    emoji: "✨",
  },
  {
    id: "notifications",
    titleKey: "onboarding.notifications.title",
    descriptionKey: "onboarding.notifications.description",
    emoji: "🔔",
  },
  {
    id: "ready",
    titleKey: "onboarding.ready.title",
    descriptionKey: "onboarding.ready.description",
    emoji: "🚀",
  },
];
