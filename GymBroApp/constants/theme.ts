/**
 * GymBro – App Theme
 */

import { Platform } from 'react-native';

const tintColorLight = '#E74C3C'; // energetic red
const tintColorDark = '#FF6B6B';

export const Colors = {
  light: {
    text: '#1A1A2E',
    textSecondary: '#6C757D',
    background: '#F8F9FA',
    card: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    accent: '#E74C3C',
    accentLight: '#FADBD8',
    success: '#27AE60',
    successLight: '#D5F5E3',
    border: '#E9ECEF',
    overlay: 'rgba(0,0,0,0.35)',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#0D1117',
    card: '#161B22',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    accent: '#FF6B6B',
    accentLight: '#3D1F1F',
    success: '#2ECC71',
    successLight: '#1A3D2B',
    border: '#30363D',
    overlay: 'rgba(0,0,0,0.55)',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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
});
