import { Platform } from 'react-native';

// GymBro brand colors
export const GymBroColors = {
  primary: '#1B3C2D',       // Dark green for headers/text
  secondary: '#2E5A45',     // Slightly lighter green
  accent: '#2B4C8C',        // Blue for buttons/bubbles
  accentDark: '#1E3A6E',    // Darker blue
  white: '#FFFFFF',
  black: '#000000',
  grey: '#F5F5F5',
  greyText: '#888888',
  greyBorder: '#E0E0E0',
  cardBg: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.5)',
  headerBg: '#1B1B1B',
};

const tintColorLight = GymBroColors.primary;
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
}) as { sans: string; serif: string; rounded: string; mono: string };
