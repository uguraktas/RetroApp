# User Info Collection Feature

A flexible, step-by-step user information collection system for React Native applications. This feature allows you to gather user data before they reach the login screen, helping you personalize the user experience.

## Overview

The User Info feature is designed with the same architecture as the Onboarding feature, making it:
- **Fully customizable** - Add/remove steps and fields easily
- **Type-safe** - Full TypeScript support
- **i18n ready** - Multi-language support out of the box
- **Feature-flagged** - Enable/disable without removing code
- **Secure** - Uses expo-secure-store for data persistence

## Flow

```
App Start → Onboarding (if enabled) → User Info (if enabled) → Login Screen → App
```

The user info collection happens after onboarding is completed but before the login screen is shown.

## File Structure

```
apps/native/lib/user-info/
├── README.md           # This file
├── types.ts            # TypeScript type definitions
├── content.ts          # Configurable steps and fields
├── storage.ts          # Secure storage utilities
└── use-user-info.ts    # React hook for state management
```

## Quick Start

### 1. Enable/Disable the Feature

Edit `packages/config/index.ts`:

```typescript
mobile: {
  features: {
    onboarding: true,
    userInfo: true,  // Set to false to disable
  },
}
```

### 2. Customize Steps and Fields

Edit `apps/native/lib/user-info/content.ts`:

```typescript
export const userInfoSteps: UserInfoStep[] = [
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
        required: true,
      },
    ],
  },
  // Add more steps here...
];
```

### 3. Add i18n Translations

Edit translation files in `packages/i18n/translations/`:

```json
{
  "userInfo": {
    "birthday": {
      "title": "When's your birthday?",
      "label": "Birthday"
    }
  }
}
```

## Field Types

### Text Input
```typescript
{
  id: "name",
  type: "text",
  labelKey: "userInfo.name.label",
  placeholderKey: "userInfo.name.placeholder",
  required: true,
}
```

### Date Picker
```typescript
{
  id: "birthDate",
  type: "date",
  labelKey: "userInfo.birthday.label",
  placeholderKey: "userInfo.birthday.placeholder",
  required: true,
}
```

### Radio Buttons (Single Choice)
```typescript
{
  id: "gender",
  type: "radio",
  labelKey: "userInfo.gender.label",
  required: true,
  options: [
    { value: "male", labelKey: "userInfo.gender.options.male" },
    { value: "female", labelKey: "userInfo.gender.options.female" },
  ],
}
```

### Checkboxes (Multiple Choice)
```typescript
{
  id: "interests",
  type: "checkbox",
  labelKey: "userInfo.interests.label",
  required: false,
  multiple: true,  // Allow multiple selections
  options: [
    { value: "sports", labelKey: "userInfo.interests.options.sports" },
    { value: "music", labelKey: "userInfo.interests.options.music" },
  ],
}
```

## Accessing User Data

### In React Components

```typescript
import { useUserInfo } from "@/lib/user-info/use-user-info";

function MyComponent() {
  const { userData, isUserInfoComplete } = useUserInfo();

  if (!isUserInfoComplete) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>Birthday: {userData?.birthDate}</Text>
      <Text>Interest: {userData?.primaryInterest}</Text>
    </View>
  );
}
```

### Direct Storage Access

```typescript
import { getUserInfoData } from "@/lib/user-info/storage";

const data = await getUserInfoData();
console.log(data);
// {
//   birthDate: Date,
//   primaryInterest: "technology",
//   notifications: ["email", "push"],
// }
```

## API Reference

### Storage Functions

```typescript
// Check if user completed the flow
hasCompletedUserInfo(): Promise<boolean>

// Mark as completed
setUserInfoCompleted(): Promise<void>

// Save user data
saveUserInfoData(data: UserInfoData): Promise<void>

// Retrieve user data
getUserInfoData(): Promise<UserInfoData | null>

// Reset for testing
resetUserInfo(): Promise<void>
```

### Hook

```typescript
const {
  isUserInfoComplete,  // boolean
  isLoading,           // boolean
  userData,            // UserInfoData | null
  completeUserInfo,    // (data: UserInfoData) => Promise<void>
} = useUserInfo();
```

## Customization Examples

### Adding a New Step

1. Add the step to `content.ts`:

```typescript
{
  id: "location",
  titleKey: "userInfo.location.title",
  emoji: "📍",
  fields: [
    {
      id: "country",
      type: "text",
      labelKey: "userInfo.location.country",
      required: true,
    },
  ],
}
```

2. Add translations to all language files:

```json
{
  "userInfo": {
    "location": {
      "title": "Where are you from?",
      "country": "Country"
    }
  }
}
```

### Changing Validation

Edit `apps/native/components/user-info-screen.tsx`:

```typescript
const validateCurrentStep = useCallback(() => {
  for (const field of currentStep.fields) {
    if (field.required) {
      const value = formData[field.id];

      // Add custom validation
      if (field.id === "email" && !isValidEmail(value)) {
        Alert.alert("Invalid email");
        return false;
      }

      if (!value) {
        Alert.alert("Field required");
        return false;
      }
    }
  }
  return true;
}, [currentStep, formData]);
```

### Syncing Data with Backend

After login, send the collected data to your backend:

```typescript
// In your login success handler
import { getUserInfoData } from "@/lib/user-info/storage";

const handleLoginSuccess = async () => {
  const userInfo = await getUserInfoData();

  if (userInfo) {
    // Send to your backend
    await fetch("/api/user/preferences", {
      method: "POST",
      body: JSON.stringify(userInfo),
    });
  }
};
```

## Testing

### Reset User Info Collection

For testing purposes, you can reset the user info state:

```typescript
import { resetUserInfo } from "@/lib/user-info/storage";

// This will show the user info screens again
await resetUserInfo();
```

### Disable Feature Temporarily

Set `userInfo: false` in config to skip the flow without losing code.

## Best Practices

1. **Keep steps focused** - Each step should collect related information
2. **Use clear labels** - Make sure i18n keys are descriptive
3. **Mark required fields** - Use `required: true` for essential data
4. **Validate inputs** - Add custom validation in the screen component
5. **Sync with backend** - Send collected data after successful login
6. **Respect privacy** - Only collect data you actually need

## Styling

The UserInfoScreen uses the same styling approach as OnboardingScreen:
- Purple gradient theme
- Dark/light mode support
- Animated transitions
- Progress indicator

To customize styling, edit `apps/native/components/user-info-screen.tsx`.

## Troubleshooting

### User info screen not showing

1. Check that `userInfo: true` in config
2. Verify onboarding is completed first
3. Check console for errors

### Data not persisting

1. Ensure `expo-secure-store` is installed
2. Check storage permissions
3. Verify `completeUserInfo()` is called

### Translation keys not working

1. Verify keys exist in all language files
2. Check i18n context is properly initialized
3. Restart development server

## Support

For issues or questions about this feature:
1. Check the onboarding implementation for similar patterns
2. Review TypeScript types in `types.ts`
3. Consult the main project README
