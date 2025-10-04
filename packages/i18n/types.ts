import type { Locale as ConfigLocale } from "@repo/config";
import type messages from "./translations/en.json";

export type Messages = typeof messages;

export type Locale = ConfigLocale;
