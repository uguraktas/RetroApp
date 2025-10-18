import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/lib/use-color-scheme';
import { useI18n } from '@/contexts/i18n-context';

export function LanguageSelector() {
  const [isVisible, setIsVisible] = useState(false);
  const { isDarkColorScheme } = useColorScheme();
  const { supportedLanguages, currentLanguage, changeLanguage, getCurrentLanguageInfo, t } = useI18n();

  const currentLangInfo = getCurrentLanguageInfo();

  const handleLanguageSelect = async (languageCode: string) => {
    await changeLanguage(languageCode);
    setIsVisible(false);
  };

  return (
    <>
      {/* Language Toggle Button */}
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        className="h-11 w-11 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900"
        activeOpacity={0.7}
      >
        <Ionicons
          name="language"
          size={20}
          color={isDarkColorScheme ? "#a1a1aa" : "#71717a"}
        />
      </TouchableOpacity>

      {/* Language Selection Modal */}
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View className="flex-1 items-center justify-center p-4">
            <TouchableOpacity
              activeOpacity={1}
              className="w-full max-w-sm rounded-2xl bg-zinc-100 p-6 dark:bg-zinc-900"
            >
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="font-bold text-lg text-black dark:text-white">
                  {t('home.selectLanguage')}
                </Text>
                <TouchableOpacity
                  onPress={() => setIsVisible(false)}
                  className="h-8 w-8 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800"
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="close"
                    size={18}
                    color={isDarkColorScheme ? "#ffffff" : "#000000"}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ gap: 8 }}>
                {supportedLanguages.map((language) => (
                  <TouchableOpacity
                    key={language.code}
                    onPress={() => handleLanguageSelect(language.code)}
                    className={`flex-row items-center rounded-lg p-3 ${
                      currentLanguage === language.code
                        ? 'bg-blue-500'
                        : 'bg-zinc-200 dark:bg-zinc-800'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`flex-1 font-medium text-base ${
                        currentLanguage === language.code
                          ? 'text-white'
                          : 'text-black dark:text-white'
                      }`}
                    >
                      {language.name}
                    </Text>
                    {currentLanguage === language.code && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color="#ffffff"
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
