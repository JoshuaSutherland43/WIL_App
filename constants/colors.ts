export const Colors = {
  light: {
    // Existing brand colors
    primary: '#4A90E2', // Blue for login
    primary_signup: '#F5A623', // Orange for signup
    white: '#FFFFFF',
    black: '#000000',
    lightGrey: '#D3D3D3',
    darkGrey: '#333333',
    error: '#D0021B',
    link: '#4A90E2',
    inactiveTab: '#F8F8F8',
    activeTab: '#FFFFFF',
    text: '#333333',
    placeholder: '#A9A9A9',
    backgroundLight: '#F4F7FE',
    socialButtonBorder: '#E0E0E0',

    // Neutralized palette
    tint: '#4A90E2',
    icon: '#555555',
    tabIconDefault: '#999999',
    tabIconSelected: '#4A90E2',
    cardBackground: 'rgba(255, 255, 255, 0.85)',
    border: '#E0E0E0',
    primaryGradientEnd: '#6FA8DC',
    secondary: '#A0A0A0',
    accent: '#6FA8DC',
    tabBarGradientStart: '#FFFFFF',
    tabBarGradientMiddle: '#F8F8F8',
    tabBarGradientEnd: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.1)',
    activeBorder: '#4A90E2',
    surface: '#FFFFFF',
    surfaceVariant: '#F4F4F4',
    onPrimary: '#FFFFFF',
    primaryContainer: '#E0E0E0',
    onPrimaryContainer: '#000000',
    onSurface: '#333333',
    onSurfaceVariant: '#555555',

    // Profile stats tokens
    profileStatRidesBox: '#FFE2E5',
    profileStatRidesCircle: '#FA5A7D',
    profileStatKmBox: '#FFF4DE',
    profileStatKmCircle: '#FF947A',
    profileStatHoursBox: '#DCFCE7',
    profileStatHoursCircle: '#2E7D32',
    profileStatPointsBox: '#F3E8FF',
    profileStatPointsCircle: '#BF83FF',
  },

  dark: {
    // Existing brand colors
    primary: '#4A90E2',
    primary_signup: '#F5A623',
    white: '#000000', // swapped for dark mode
    black: '#FFFFFF',
    lightGrey: '#555555',
    darkGrey: '#CCCCCC',
    error: '#FF5C5C',
    link: '#4A90E2',
    inactiveTab: '#1E1E1E',
    activeTab: '#2C2C2C',
    text: '#E0E0E0',
    placeholder: '#888888',
    backgroundLight: '#121212',
    socialButtonBorder: '#444444',

    // Neutralized palette
    tint: '#4A90E2',
    icon: '#CCCCCC',
    tabIconDefault: '#888888',
    tabIconSelected: '#4A90E2',
    cardBackground: 'rgba(40, 40, 40, 0.85)',
    border: '#333333',
    primaryGradientEnd: '#6FA8DC',
    secondary: '#AAAAAA',
    accent: '#6FA8DC',
    tabBarGradientStart: '#1E1E1E',
    tabBarGradientMiddle: '#121212',
    tabBarGradientEnd: '#1E1E1E',
    shadow: 'rgba(0, 0, 0, 0.3)',
    activeBorder: '#4A90E2',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    onPrimary: '#FFFFFF',
    primaryContainer: '#333333',
    onPrimaryContainer: '#FFFFFF',
    onSurface: '#E0E0E0',
    onSurfaceVariant: '#AAAAAA',

    // Profile stats tokens (dark-adapted)
    profileStatRidesBox: '#3B2F31',
    profileStatRidesCircle: '#FA5A7D',
    profileStatKmBox: '#3A352A',
    profileStatKmCircle: '#FF947A',
    profileStatHoursBox: '#203026',
    profileStatHoursCircle: '#66BB6A',
    profileStatPointsBox: '#2D2540',
    profileStatPointsCircle: '#BF83FF',
  },
};

// Safe palette resolver to avoid undefined theme crashes
export function resolvePalette(scheme: string | null | undefined) {
  const key = (scheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
  return (Colors as any)[key] || Colors.light;
}
