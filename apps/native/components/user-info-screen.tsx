import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useI18n } from "@/contexts/i18n-context";
import { userInfoSteps } from "@/lib/user-info/content";
import type { UserInfoData, UserInfoField } from "@/lib/user-info/types";
import { useUserInfo } from "@/lib/user-info/use-user-info";
import { useColorScheme } from "@/lib/use-color-scheme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SPRING_DAMPING = 15;
const SPRING_STIFFNESS = 150;
const ACTIVE_DOT_WIDTH = 32;
const INACTIVE_DOT_WIDTH = 8;
const DOT_OPACITY_INACTIVE = 0.4;
const DOT_SCALE_INACTIVE = 0.8;

export const UserInfoScreen = () => {
  const { t } = useI18n();
  const router = useRouter();
  const { isDarkColorScheme } = useColorScheme();
  const { completeUserInfo } = useUserInfo();
  const scrollViewRef = useRef<ScrollView>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState<UserInfoData>({});
  const [showDatePicker, setShowDatePicker] = useState<string | null>(null);
  const [tempDate, setTempDate] = useState<Date>(new Date());

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

  const handleFieldChange = useCallback(
    (fieldId: string, value: string | string[] | Date) => {
      setFormData((prev) => ({
        ...prev,
        [fieldId]: value,
      }));
    },
    []
  );

  const handleOpenDatePicker = useCallback(
    (fieldId: string) => {
      const currentValue = formData[fieldId] as Date;
      setTempDate(currentValue || new Date());
      setShowDatePicker(fieldId);
    },
    [formData]
  );

  const handleConfirmDate = useCallback(() => {
    if (showDatePicker) {
      handleFieldChange(showDatePicker, tempDate);
    }
    setShowDatePicker(null);
  }, [showDatePicker, tempDate, handleFieldChange]);

  const handleCancelDate = useCallback(() => {
    setShowDatePicker(null);
  }, []);

  const validateCurrentStep = useCallback(() => {
    const currentStep = userInfoSteps[currentIndex];
    for (const field of currentStep.fields) {
      if (field.required) {
        const value = formData[field.id];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          Alert.alert(
            t("userInfo.validation.required.title"),
            t("userInfo.validation.required.message")
          );
          return false;
        }
      }
    }
    return true;
  }, [currentIndex, formData, t]);

  const handleNext = useCallback(() => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentIndex < userInfoSteps.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: SCREEN_WIDTH * (currentIndex + 1),
        animated: true,
      });
    }
  }, [currentIndex, validateCurrentStep]);

  const handleComplete = useCallback(async () => {
    if (!validateCurrentStep()) {
      return;
    }

    try {
      await completeUserInfo(formData);
      router.replace("/sign-in");
    } catch (error) {
      Alert.alert(t("userInfo.error.title"), t("userInfo.error.message"));
    }
  }, [validateCurrentStep, formData, completeUserInfo, router, t]);

  const isLastSlide = currentIndex === userInfoSteps.length - 1;

  const gradientColors = isDarkColorScheme
    ? (["#1e1b4b", "#312e81", "#4c1d95", "#6b21a8"] as const)
    : (["#f0f9ff", "#e0f2fe", "#bae6fd", "#7dd3fc"] as const);

  const footerBg = isDarkColorScheme ? "bg-black/40" : "bg-white/80";
  const dotColor = isDarkColorScheme ? "bg-white" : "bg-purple-600";

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        className="absolute inset-0"
        colors={gradientColors}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
      />

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
          {userInfoSteps.map((step) => (
            <StepContent
              formData={formData}
              isDark={isDarkColorScheme}
              key={step.id}
              onFieldChange={handleFieldChange}
              onOpenDatePicker={handleOpenDatePicker}
              step={step}
              t={t}
            />
          ))}
        </ScrollView>
      </View>

      {/* Date Picker Modal */}
      <DatePickerModal
        isDark={isDarkColorScheme}
        onCancel={handleCancelDate}
        onConfirm={handleConfirmDate}
        onDateChange={setTempDate}
        t={t}
        value={tempDate}
        visible={showDatePicker !== null}
      />

      {/* Fixed footer with adaptive background */}
      <View className={`${footerBg} backdrop-blur-xl`}>
        {/* Pagination dots */}
        <View className="flex-row items-center justify-center gap-2 py-8">
          {userInfoSteps.map((step, index) => (
            <PaginationDot
              dotColor={dotColor}
              index={index}
              key={step.id}
              scrollX={scrollX}
            />
          ))}
        </View>

        {/* Action button */}
        <View className="px-10 pb-10">
          <Pressable
            className="overflow-hidden rounded-full active:scale-95"
            onPress={isLastSlide ? handleComplete : handleNext}
          >
            <LinearGradient
              className="px-8 py-5"
              colors={["#a855f7", "#9333ea"]}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
            >
              {/* biome-ignore lint/nursery/useSortedClasses: Biome CSS sorting conflicts with NativeWind */}
              <Text className="text-center text-lg font-bold text-white p-3">
                {isLastSlide ? t("userInfo.complete") : t("userInfo.next")}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

// Custom Date Picker Modal
type DatePickerModalProps = {
  visible: boolean;
  value: Date;
  onDateChange: (date: Date) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isDark: boolean;
  t: (key: string) => string;
};

const DatePickerModal = ({
  visible,
  value,
  onDateChange,
  onConfirm,
  onCancel,
  isDark,
  t,
}: DatePickerModalProps) => {
  if (!visible) return null;

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <Pressable
        className="flex-1 items-center justify-center bg-black/60 px-6"
        onPress={onCancel}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View
            className={`w-full max-w-md rounded-3xl px-8 pb-10 pt-8 ${isDark ? "bg-zinc-900" : "bg-white"}`}
            style={{ minHeight: 450 }}
          >
            {/* Header */}
            <View className="mb-8 flex-row items-center justify-between">
              <Text
                className={`font-bold text-2xl ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {t("userInfo.birthday.label")}
              </Text>
              <Pressable
                className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 dark:bg-zinc-800 dark:active:bg-zinc-700"
                onPress={onCancel}
              >
                <Text
                  className={`font-bold text-xl ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  ✕
                </Text>
              </Pressable>
            </View>

            {/* Date Picker */}
            <View className="mb-10" style={{ height: 250 }}>
              <DateTimePicker
                display="spinner"
                mode="date"
                onChange={(_, selectedDate) => {
                  if (selectedDate) {
                    onDateChange(selectedDate);
                  }
                }}
                style={{ height: 250, width: "100%" }}
                textColor={isDark ? "#ffffff" : "#000000"}
                value={value}
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-4">
              <Pressable
                className="flex-1 items-center justify-center rounded-2xl border-2 border-gray-300 py-5 active:bg-gray-50 dark:border-zinc-700 dark:active:bg-zinc-800"
                onPress={onCancel}
              >
                <Text
                  className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {t("userInfo.back")}
                </Text>
              </Pressable>

              <Pressable
                className="flex-1 items-center justify-center rounded-2xl bg-purple-600 py-5 active:bg-purple-700"
                onPress={onConfirm}
              >
                <Text className="font-bold text-base text-white">
                  {t("userInfo.complete")}
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// Individual step content
type StepContentProps = {
  step: {
    id: string;
    titleKey: string;
    descriptionKey?: string;
    emoji?: string;
    fields: UserInfoField[];
  };
  isDark: boolean;
  t: (key: string) => string;
  formData: UserInfoData;
  onFieldChange: (fieldId: string, value: string | string[] | Date) => void;
  onOpenDatePicker: (fieldId: string) => void;
};

const StepContent = ({
  step,
  isDark,
  t,
  formData,
  onFieldChange,
  onOpenDatePicker,
}: StepContentProps) => {
  const titleColor = isDark ? "text-white" : "text-gray-900";
  const descColor = isDark ? "text-white/80" : "text-gray-700";

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="items-center justify-center px-10 pb-10 pt-24"
      showsVerticalScrollIndicator={false}
      style={{ width: SCREEN_WIDTH }}
    >
      {/* Emoji */}
      {step.emoji && (
        <View className="mb-8 items-center justify-center">
          <Text className="text-8xl">{step.emoji}</Text>
        </View>
      )}

      <View className="w-full items-center">
        {/* biome-ignore lint/nursery/useSortedClasses: Dynamic color classes */}
        <Text
          className={`mb-4 text-center font-extrabold text-4xl leading-tight ${titleColor}`}
        >
          {t(step.titleKey)}
        </Text>

        {step.descriptionKey && (
          /* biome-ignore lint/nursery/useSortedClasses: Dynamic color classes */
          <Text className={`mb-6 px-4 text-center text-lg leading-7 ${descColor}`}>
            {t(step.descriptionKey)}
          </Text>
        )}

        {/* Form Fields */}
        <View className="w-full gap-4">
          {step.fields.map((field) => (
            <FieldRenderer
              field={field}
              formData={formData}
              isDark={isDark}
              key={field.id}
              onFieldChange={onFieldChange}
              onOpenDatePicker={onOpenDatePicker}
              t={t}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

// Field renderer component
type FieldRendererProps = {
  field: UserInfoField;
  formData: UserInfoData;
  isDark: boolean;
  onFieldChange: (fieldId: string, value: string | string[] | Date) => void;
  onOpenDatePicker: (fieldId: string) => void;
  t: (key: string) => string;
};

const FieldRenderer = ({
  field,
  formData,
  isDark,
  onFieldChange,
  onOpenDatePicker,
  t,
}: FieldRendererProps) => {
  const labelColor = isDark ? "text-white" : "text-gray-900";
  const fieldBg = isDark ? "bg-white/20" : "bg-white/80";
  const fieldBorder = isDark ? "border-white/30" : "border-gray-300";
  const fieldText = isDark ? "text-white" : "text-gray-900";
  const placeholderColor = isDark
    ? "rgba(255, 255, 255, 0.5)"
    : "rgba(0, 0, 0, 0.4)";

  switch (field.type) {
    case "text":
      return (
        <View>
          {/* biome-ignore lint/nursery/useSortedClasses: Dynamic color classes */}
          <Text className={`mb-2 font-semibold text-base ${labelColor}`}>
            {t(field.labelKey)}
            {field.required && <Text className="text-purple-500"> *</Text>}
          </Text>
          <TextInput
            className={`rounded-xl px-4 py-4 text-base backdrop-blur-xl ${fieldBg} ${fieldText}`}
            onChangeText={(value) => onFieldChange(field.id, value)}
            placeholder={field.placeholderKey ? t(field.placeholderKey) : ""}
            placeholderTextColor={placeholderColor}
            value={(formData[field.id] as string) || ""}
          />
        </View>
      );

    case "date":
      return (
        <View>
          {/* biome-ignore lint/nursery/useSortedClasses: Dynamic color classes */}
          <Text className={`mb-2 font-semibold text-base ${labelColor}`}>
            {t(field.labelKey)}
            {field.required && <Text className="text-purple-500"> *</Text>}
          </Text>
          <Pressable
            className={`rounded-xl px-4 py-4 backdrop-blur-xl ${fieldBg}`}
            onPress={() => onOpenDatePicker(field.id)}
          >
            {/* biome-ignore lint/nursery/useSortedClasses: Dynamic color classes */}
            <Text
              className={`text-base ${
                formData[field.id]
                  ? fieldText
                  : isDark
                    ? "text-white/50"
                    : "text-gray-400"
              }`}
            >
              {formData[field.id]
                ? (formData[field.id] as Date).toLocaleDateString()
                : field.placeholderKey
                  ? t(field.placeholderKey)
                  : t("userInfo.selectDate")}
            </Text>
          </Pressable>
        </View>
      );

    case "radio":
      return (
        <View>
          {/* biome-ignore lint/nursery/useSortedClasses: Dynamic color classes */}
          <Text className={`mb-3 font-semibold text-base ${labelColor}`}>
            {t(field.labelKey)}
            {field.required && <Text className="text-purple-500"> *</Text>}
          </Text>
          <View className="gap-3">
            {field.options?.map((option) => {
              const isSelected = formData[field.id] === option.value;
              return (
                <Pressable
                  className={`flex-row items-center gap-3 rounded-xl px-4 py-4 backdrop-blur-xl active:opacity-80 ${
                    isSelected
                      ? isDark
                        ? "bg-purple-500/30"
                        : "bg-purple-200"
                      : fieldBg
                  }`}
                  key={option.value}
                  onPress={() => onFieldChange(field.id, option.value)}
                >
                  <View
                    className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                      isSelected ? "border-purple-600 bg-purple-600" : fieldBorder
                    }`}
                  >
                    {isSelected && (
                      <View className="h-3 w-3 rounded-full bg-white" />
                    )}
                  </View>
                  {/* biome-ignore lint/nursery/useSortedClasses: Dynamic color classes */}
                  <Text className={`flex-1 text-base ${fieldText}`}>
                    {t(option.labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      );

    case "checkbox":
      return (
        <View>
          {/* biome-ignore lint/nursery/useSortedClasses: Dynamic color classes */}
          <Text className={`mb-3 font-semibold text-base ${labelColor}`}>
            {t(field.labelKey)}
            {field.required && <Text className="text-purple-500"> *</Text>}
          </Text>
          <View className="gap-3">
            {field.options?.map((option) => {
              const currentValues = (formData[field.id] as string[]) || [];
              const isSelected = currentValues.includes(option.value);

              return (
                <Pressable
                  className={`flex-row items-center gap-3 rounded-xl px-4 py-4 backdrop-blur-xl active:opacity-80 ${
                    isSelected
                      ? isDark
                        ? "bg-purple-500/30"
                        : "bg-purple-200"
                      : fieldBg
                  }`}
                  key={option.value}
                  onPress={() => {
                    if (field.multiple) {
                      const newValues = isSelected
                        ? currentValues.filter((v) => v !== option.value)
                        : [...currentValues, option.value];
                      onFieldChange(field.id, newValues);
                    } else {
                      onFieldChange(
                        field.id,
                        isSelected ? [] : [option.value]
                      );
                    }
                  }}
                >
                  <View
                    className={`h-6 w-6 items-center justify-center rounded border-2 ${
                      isSelected ? "border-purple-600 bg-purple-600" : fieldBorder
                    }`}
                  >
                    {isSelected && (
                      <Text className="font-bold text-sm text-white">✓</Text>
                    )}
                  </View>
                  {/* biome-ignore lint/nursery/useSortedClasses: Dynamic color classes */}
                  <Text className={`flex-1 text-base ${fieldText}`}>
                    {t(option.labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      );

    default:
      return null;
  }
};

type PaginationDotProps = {
  index: number;
  scrollX: ReturnType<typeof useSharedValue<number>>;
  dotColor: string;
};

const PaginationDot = ({ index, scrollX, dotColor }: PaginationDotProps) => {
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
      className={`h-2.5 rounded-full ${dotColor} shadow-lg`}
      style={animatedStyle}
    />
  );
};
