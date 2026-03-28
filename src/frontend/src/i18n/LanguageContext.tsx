import { createContext, useContext } from "react";
import type { Translations } from "./translations";
import { translations } from "./translations";

export const LanguageContext = createContext<Translations>(
  translations["en-US"],
);

export function useT() {
  return useContext(LanguageContext);
}
