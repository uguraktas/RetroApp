import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useI18n } from "@/contexts/i18n-context";
import { onboardingSlides } from "@/lib/onboarding/content";
import { setOnboardingCompleted } from "@/lib/onboarding/storage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SPRING_DAMPING = 15;
const SPRING_STIFFNESS = 150;
const ACTIVE_DOT_WIDTH = 32;
const INACTIVE_DOT_WIDTH = 8;
const DOT_OPACITY_INACTIVE = 0.4;

export const OnboardingScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      scrollX.value = offsetX;
      const index = Math.round(offsetX / SCREEN_WIDTH);
      setCurrentIndex(index);
    },
    [scrollX]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < onboardingSlides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: SCREEN_WIDTH * (currentIndex + 1),
        animated: true,
      });
    }
  }, [currentIndex]);

  const handleGetStarted = useCallback(async () => {
    try {
      await setOnboardingCompleted();
      router.replace("/sign-in");
    } catch {
      router.replace("/sign-in");
    }
  }, [router]);

  const isLastSlide = currentIndex === onboardingSlides.length - 1;

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        className="absolute inset-0"
        colors={["#8B5CF6", "#6366F1", "#3B82F6"]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      />

      <ScrollView
        className="flex-1"
        horizontal
        onScroll={handleScroll}
        pagingEnabled
        ref={scrollViewRef}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      >
        {onboardingSlides.map((slide) => (
          <View
            className="flex-1 items-center justify-center px-8"
            key={slide.id}
            style={{ width: SCREEN_WIDTH }}
          >
            <View className="mb-12 h-48 w-48 items-center justify-center rounded-full bg-white/10">
              <Text className="text-8xl">{slide.emoji}</Text>
            </View>

            {/* biome-ignore lint/nursery/useSortedClasses: Biome CSS sorting conflicts with NativeWind */}
            <Text className="mb-4 text-center text-4xl font-bold text-white">
              {t(slide.titleKey)}
            </Text>

            {/* biome-ignore lint/nursery/useSortedClasses: Biome CSS sorting conflicts with NativeWind */}
            <Text className="text-center text-lg leading-7 text-white/90">
              {t(slide.descriptionKey)}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View className="pt-8 pb-12">
        <View className="mb-8 flex-row items-center justify-center gap-2">
          {onboardingSlides.map((slide, index) => (
            <PaginationDot index={index} key={slide.id} scrollX={scrollX} />
          ))}
        </View>

        <View className="px-8">
          <Pressable
            className="overflow-hidden rounded-2xl active:opacity-90"
            onPress={isLastSlide ? handleGetStarted : handleNext}
          >
            <LinearGradient
              className="px-8 py-5"
              colors={["#A78BFA", "#8B5CF6"]}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
            >
              {/* biome-ignore lint/nursery/useSortedClasses: Biome CSS sorting conflicts with NativeWind */}
              <Text className="text-center text-lg font-semibold text-white">
                {isLastSlide ? t("skip") : t("next")}
              </Text>
            </LinearGradient>
          </Pressable>

          {!isLastSlide && (
            <Pressable
              className="mt-4 py-3 active:opacity-70"
              onPress={handleGetStarted}
            >
              {/* biome-ignore lint/nursery/useSortedClasses: Biome CSS sorting conflicts with NativeWind */}
              <Text className="text-center text-base font-medium text-white/80">
                {t("skip")}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

type PaginationDotProps = {
  index: number;
  scrollX: Animated.SharedValue<number>;
};

const PaginationDot = ({ index, scrollX }: PaginationDotProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const isActive =
      scrollX.value >= index * SCREEN_WIDTH - SCREEN_WIDTH / 2 &&
      scrollX.value <= index * SCREEN_WIDTH + SCREEN_WIDTH / 2;

    const width = withSpring(isActive ? ACTIVE_DOT_WIDTH : INACTIVE_DOT_WIDTH, {
      damping: SPRING_DAMPING,
      stiffness: SPRING_STIFFNESS,
    });

    const opacity = withSpring(isActive ? 1 : DOT_OPACITY_INACTIVE, {
      damping: SPRING_DAMPING,
      stiffness: SPRING_STIFFNESS,
    });

    return {
      width,
      opacity,
    };
  });

  return (
    <Animated.View
      className="h-2 rounded-full bg-white"
      style={animatedStyle}
    />
  );
};
