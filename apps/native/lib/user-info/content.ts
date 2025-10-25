import type { UserInfoStep } from "./types";

/**
 * User Information Collection Steps
 *
 * Configure the steps to collect user information before showing the login screen.
 * Each step can contain multiple fields of different types.
 *
 * Developers can customize:
 * - Add/remove steps
 * - Add/remove fields in each step
 * - Change field types (text, date, radio, checkbox, select)
 * - Modify validation rules
 * - Update i18n keys for translations
 *
 * Field Types:
 * - text: Simple text input
 * - date: Date picker input
 * - radio: Single choice from options
 * - checkbox: Multiple choices from options
 * - select: Dropdown selection
 */

export const userInfoSteps: UserInfoStep[] = [
  // Step 1: Birthday
  {
    id: "birthday",
    titleKey: "userInfo.birthday.title",
    descriptionKey: "userInfo.birthday.description",
    emoji: "🎂",
    fields: [
      {
        id: "birthDate",
        type: "date",
        labelKey: "userInfo.birthday.label",
        placeholderKey: "userInfo.birthday.placeholder",
        required: true,
      },
    ],
  },

  // Step 2: Interests (Radio buttons)
  {
    id: "interests",
    titleKey: "userInfo.interests.title",
    descriptionKey: "userInfo.interests.description",
    emoji: "🎯",
    fields: [
      {
        id: "primaryInterest",
        type: "radio",
        labelKey: "userInfo.interests.label",
        required: true,
        options: [
          {
            value: "technology",
            labelKey: "userInfo.interests.options.technology",
          },
          {
            value: "business",
            labelKey: "userInfo.interests.options.business",
          },
          {
            value: "health",
            labelKey: "userInfo.interests.options.health",
          },
          {
            value: "education",
            labelKey: "userInfo.interests.options.education",
          },
          {
            value: "entertainment",
            labelKey: "userInfo.interests.options.entertainment",
          },
        ],
      },
    ],
  },

  // Step 3: Preferences (Checkboxes)
  {
    id: "preferences",
    titleKey: "userInfo.preferences.title",
    descriptionKey: "userInfo.preferences.description",
    emoji: "⚙️",
    fields: [
      {
        id: "notifications",
        type: "checkbox",
        labelKey: "userInfo.preferences.notifications.label",
        required: false,
        multiple: true,
        options: [
          {
            value: "email",
            labelKey: "userInfo.preferences.notifications.options.email",
          },
          {
            value: "push",
            labelKey: "userInfo.preferences.notifications.options.push",
          },
          {
            value: "sms",
            labelKey: "userInfo.preferences.notifications.options.sms",
          },
        ],
      },
      {
        id: "newsletter",
        type: "checkbox",
        labelKey: "userInfo.preferences.newsletter.label",
        required: false,
        options: [
          {
            value: "subscribe",
            labelKey: "userInfo.preferences.newsletter.options.subscribe",
          },
        ],
      },
    ],
  },
];
