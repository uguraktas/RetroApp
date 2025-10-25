export type UserInfoFieldType =
  | "text"
  | "date"
  | "radio"
  | "checkbox"
  | "select";

export type UserInfoOption = {
  value: string;
  labelKey: string; // i18n key for the option label
};

export type UserInfoField = {
  id: string;
  type: UserInfoFieldType;
  labelKey: string; // i18n key for the field label
  placeholderKey?: string; // i18n key for placeholder (optional)
  required?: boolean;
  options?: UserInfoOption[]; // For radio, checkbox, select types
  multiple?: boolean; // For checkbox type - allow multiple selections
};

export type UserInfoStep = {
  id: string;
  titleKey: string; // i18n key for step title
  descriptionKey?: string; // i18n key for step description (optional)
  emoji?: string; // Optional emoji icon
  fields: UserInfoField[];
};

export type UserInfoData = Record<string, string | string[] | Date | undefined>;
