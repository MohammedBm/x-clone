import { useContext, useEffect, useState } from "react";

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const { theme } = useContext(ThemeContext); // Use the theme from ThemeContext
  return theme;
}
