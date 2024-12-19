import { useTheme } from "@/hooks/ThemeContext"; // Import useTheme hook from context
import { Colors } from "@/constants/Colors"; // Assuming Colors has 'light' and 'dark' theme colors

export function useThemeColor(props, colorName) {
  const { theme } = useTheme(); // Get current theme from context
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName]; // Use Colors object for theme colors
  }
}
