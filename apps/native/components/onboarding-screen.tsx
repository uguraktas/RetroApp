import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
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
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
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
const DOT_SCALE_INACTIVE = 0.8;
const FADE_DURATION = 800;
const CIRCLE_DURATION_1 = 3000;
const CIRCLE_DURATION_2 = 4000;
const CIRCLE_OPACITY_MIN = 0.1;
const CIRCLE_OPACITY_RANGE = 0.15;
const CIRCLE_SCALE_MIN = 0.8;
const CIRCLE_SCALE_RANGE = 0.4;
const EMOJI_SCALE_INITIAL = 0.5;
const EMOJI_ROTATION_ANGLE = 10;
const EMOJI_ROTATION_DURATION = 200;
const CONTENT_TRANSLATE_Y = 30;
const CONTENT_FADE_DURATION = 600;
const CONTENT_HIDE_DURATION = 300;
const SCALE_ANIM_INITIAL = 0.8;

export const OnboardingScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(SCALE_ANIM_INITIAL);

  useEffect(() => {
    fadeAnim.value = withTiming(1, {
      duration: FADE_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    scaleAnim.value = withSpring(1, { damping: 12, stiffness: 100 });
  }, [fadeAnim, scaleAnim]);

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
        colors={["#1e1b4b", "#312e81", "#4c1d95", "#6b21a8"]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      />

      {/* Decorative background elements */}
      <BackgroundCircles />

      {/* Main content area */}
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          horizontal
          onScroll={handleScroll}
          pagingEnabled
          ref={scrollViewRef}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
        >
          {onboardingSlides.map((slide, slideIndex) => (
            <SlideContent
              isActive={currentIndex === slideIndex}
              key={slide.id}
              slide={slide}
              t={t}
            />
          ))}
        </ScrollView>
      </View>

      {/* Fixed footer with dark background */}
      <View className="bg-black/40 backdrop-blur-xl">
        {/* Pagination dots */}
        <View className="flex-row items-center justify-center gap-2 py-8">
          {onboardingSlides.map((slide, index) => (
            <PaginationDot index={index} key={slide.id} scrollX={scrollX} />
          ))}
        </View>

        {/* Action button */}
        <View className="px-10 pb-10">
          <Pressable
            className="overflow-hidden rounded-full active:scale-95"
            onPress={isLastSlide ? handleGetStarted : handleNext}
          >
            <LinearGradient
              className="px-8 py-5"
              colors={["#a855f7", "#9333ea"]}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
            >
              {/* biome-ignore lint/nursery/useSortedClasses: Biome CSS sorting conflicts with NativeWind */}
              <Text className="text-center text-lg font-bold text-white">
                {isLastSlide ? t("onboarding.getStarted") : t("next")}
              </Text>
            </LinearGradient>
          </Pressable>

          {/* Skip text - only show on non-last slides */}
          {!isLastSlide && (
            <Pressable
              className="mt-5 py-2 active:opacity-70"
              onPress={handleGetStarted}
            >
              {/* biome-ignore lint/nursery/useSortedClasses: Biome CSS sorting conflicts with NativeWind */}
              <Text className="text-center text-base font-medium text-white/60">
                {t("skip")}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

// Background decorative circles
const BackgroundCircles = () => {
  const circle1 = useSharedValue(0);
  const circle2 = useSharedValue(0);

  useEffect(() => {
    circle1.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: CIRCLE_DURATION_1,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: CIRCLE_DURATION_1,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );
    circle2.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: CIRCLE_DURATION_2,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: CIRCLE_DURATION_2,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );
  }, [circle1, circle2]);

  const circle1Style = useAnimatedStyle(() => ({
    opacity: CIRCLE_OPACITY_MIN + circle1.value * CIRCLE_OPACITY_RANGE,
    transform: [
      { scale: CIRCLE_SCALE_MIN + circle1.value * CIRCLE_SCALE_RANGE },
    ],
  }));

  const circle2Style = useAnimatedStyle(() => ({
    opacity: CIRCLE_OPACITY_MIN + circle2.value * CIRCLE_OPACITY_RANGE,
    transform: [
      { scale: CIRCLE_SCALE_MIN + circle2.value * CIRCLE_SCALE_RANGE },
    ],
  }));

  return (
    <>
      <Animated.View
        className="-top-20 -right-20 absolute h-80 w-80 rounded-full bg-purple-400"
        style={circle1Style}
      />
      <Animated.View
        className="-bottom-32 -left-20 absolute h-96 w-96 rounded-full bg-blue-400"
        style={circle2Style}
      />
    </>
  );
};

// Individual slide content with animations
type SlideContentProps = {
  slide: {
    id: string;
    titleKey: string;
    descriptionKey: string;
    emoji: string;
  };
  isActive: boolean;
  t: (key: string) => string;
};

const SlideContent = ({ slide, isActive, t }: SlideContentProps) => {
  const emojiScale = useSharedValue(EMOJI_SCALE_INITIAL);
  const emojiRotate = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(CONTENT_TRANSLATE_Y);

  useEffect(() => {
    if (isActive) {
      emojiScale.value = withSpring(1, { damping: 10, stiffness: 80 });
      emojiRotate.value = withSequence(
        withTiming(EMOJI_ROTATION_ANGLE, { duration: EMOJI_ROTATION_DURATION }),
        withTiming(-EMOJI_ROTATION_ANGLE, {
          duration: EMOJI_ROTATION_DURATION,
        }),
        withTiming(0, { duration: EMOJI_ROTATION_DURATION })
      );
      contentOpacity.value = withTiming(1, {
        duration: CONTENT_FADE_DURATION,
        easing: Easing.out(Easing.cubic),
      });
      contentTranslateY.value = withSpring(0, { damping: 12 });
    } else {
      emojiScale.value = withTiming(EMOJI_SCALE_INITIAL, {
        duration: CONTENT_HIDE_DURATION,
      });
      contentOpacity.value = withTiming(0, { duration: CONTENT_HIDE_DURATION });
      contentTranslateY.value = withTiming(CONTENT_TRANSLATE_Y, {
        duration: CONTENT_HIDE_DURATION,
      });
    }
  }, [isActive, emojiScale, emojiRotate, contentOpacity, contentTranslateY]);

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: emojiScale.value },
      { rotate: `${emojiRotate.value}deg` },
    ],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return (
    <View
      className="flex-1 items-center justify-center px-10"
      style={{ width: SCREEN_WIDTH }}
    >
      {/* Emoji container with glow effect */}
      <View className="mb-16 items-center justify-center">
        <View className="absolute h-64 w-64 rounded-full bg-white/5" />
        <View className="absolute h-56 w-56 rounded-full bg-white/10" />
        <Animated.View
          className="h-48 w-48 items-center justify-center rounded-full bg-white/20"
          style={emojiStyle}
        >
          <Text className="text-9xl">{slide.emoji}</Text>
        </Animated.View>
      </View>

      <Animated.View className="w-full items-center" style={contentStyle}>
        {/* biome-ignore lint/nursery/useSortedClasses: Biome CSS sorting conflicts with NativeWind */}
        <Text className="mb-6 text-center text-5xl font-extrabold text-white leading-tight">
          {t(slide.titleKey)}
        </Text>

        {/* biome-ignore lint/nursery/useSortedClasses: Biome CSS sorting conflicts with NativeWind */}
        <Text className="text-center text-xl leading-8 text-white/80 px-4">
          {t(slide.descriptionKey)}
        </Text>
      </Animated.View>
    </View>
  );
};

type PaginationDotProps = {
  index: number;
  scrollX: ReturnType<typeof useSharedValue<number>>;
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

    const scale = withSpring(isActive ? 1 : DOT_SCALE_INACTIVE, {
      damping: SPRING_DAMPING,
      stiffness: SPRING_STIFFNESS,
    });

    return {
      width,
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View
      className="h-2.5 rounded-full bg-white shadow-lg"
      style={animatedStyle}
    />
  );
};
