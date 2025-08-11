/**
 * StyleGuide.ts
 * Central design system for the Sardina Bay Horse Trail App
 * Defines consistent styling for colors, typography, spacing, and components
 * to ensure a uniform look and feel across the application.
 */

import { Colors } from './colors';

// Color Palette - Extending from Colors.ts for light and dark themes
export const ColorPalette = {
  light: {
    ...Colors.light,
    error: '#E74C3C', // Red for errors
    success: '#2ECC71', // Green for success
    warning: '#F39C12', // Orange for warnings
  },
  dark: {
    ...Colors.dark,
    error: '#C0392B', // Darker red for errors
    success: '#27AE60', // Darker green for success
    warning: '#E67E22', // Darker orange for warnings
  },
};

// Typography - Font sizes, weights, and line heights for consistent text styling
export const Typography = {
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 22,
    letterSpacing: -0.1,
  },
  caption: {
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 18,
    letterSpacing: -0.05,
  },
  link: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 22,
    letterSpacing: -0.1,
  },
  button: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    lineHeight: 20,
  },
};

// Spacing - Consistent padding, margins, and gaps for layout harmony
export const Spacing = {
  xs: 4,   // Extra small spacing for tight areas
  sm: 8,   // Small spacing for minor gaps
  md: 16,  // Medium spacing for standard padding/margins
  lg: 24,  // Large spacing for section separation
  xl: 32,  // Extra large spacing for major layout divisions
  xxl: 48, // Double extra large for significant separation
};

// Border Radius - Consistent corner rounding for UI elements
export const BorderRadius = {
  sm: 4,  // Small radius for minor elements
  md: 8,  // Medium radius for cards and buttons
  lg: 12, // Large radius for containers and modals
  xl: 16, // Extra large for special elements
};

// Shadows - Consistent elevation and shadow styles for depth
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Component Styles - Reusable styles for common UI components
export const ComponentStyles = {
  button: {
    primary: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: 48,
    },
    secondary: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: 48,
    },
  },
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  input: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    fontSize: Typography.body.fontSize,
    minHeight: 48,
  },
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  header: {
    padding: Spacing.md,
    minHeight: 56,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
};

// Breakpoints for responsive design
export const Breakpoints = {
  phone: 0,
  tablet: 768,
};

// Utility for consistent border widths
export const Borders = {
  thin: 1,
  medium: 2,
  thick: 3,
};

// Animation and Transition Durations
export const Animations = {
  fast: 200,
  medium: 300,
  slow: 500,
};

// Usage Guidelines
export const DesignGuidelines = {
  colorUsage: {
    primary: 'Use for primary actions, highlights, and branding elements.',
    secondary: 'Use for secondary actions or less prominent elements.',
    accent: 'Use sparingly for emphasis or to draw attention.',
    text: 'Ensure sufficient contrast with background for readability.',
  },
  typography: {
    title: 'Use for main headings and screen titles.',
    subtitle: 'Use for subheadings or secondary titles.',
    body: 'Use for general content and paragraphs.',
    caption: 'Use for small explanatory text or labels.',
    button: 'Use for text on buttons.',
  },
  spacing: {
    xs: 'Use for very tight spacing between closely related elements.',
    sm: 'Use for small gaps, like between icon and text.',
    md: 'Use for standard padding inside components or between elements.',
    lg: 'Use for separating sections or larger UI blocks.',
    xl: 'Use for major layout spacing or top-level containers.',
  },
};