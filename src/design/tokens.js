export const colors = {
  primary: '#F97316',
  primaryHover: '#EA580C',
  primaryLight: '#FFF7ED',
  primary50: 'rgba(249, 115, 22, 0.08)',
  primary100: 'rgba(249, 115, 22, 0.12)',
  primary200: 'rgba(249, 115, 22, 0.2)',

  bg: '#FAFAFA',
  bgWhite: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceHover: '#F9FAFB',
  surfaceActive: '#F3F4F6',
  surfaceElevated: '#FFFFFF',

  text: '#111827',
  textSecondary: '#374151',
  textMuted: '#6B7280',
  textDim: '#9CA3AF',
  textInverse: '#FFFFFF',

  success: '#22C55E',
  successLight: '#F0FDF4',
  success50: 'rgba(34, 197, 94, 0.08)',

  danger: '#EF4444',
  dangerLight: '#FEF2F2',
  danger50: 'rgba(239, 68, 68, 0.08)',

  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  warning50: 'rgba(245, 158, 11, 0.08)',

  info: '#3B82F6',
  infoLight: '#EFF6FF',
  info50: 'rgba(59, 130, 246, 0.08)',

  border: 'rgba(0, 0, 0, 0.06)',
  borderStrong: 'rgba(0, 0, 0, 0.1)',
  borderFocus: 'rgba(249, 115, 22, 0.4)',
  divider: 'rgba(0, 0, 0, 0.04)',

  overlay: 'rgba(0, 0, 0, 0.4)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',

  // Semantic status colors
  status: {
    pending: '#F59E0B',
    preparing: '#3B82F6',
    ready: '#22C55E',
    delivered: '#22C55E',
    cancelled: '#EF4444',
    accepted: '#3B82F6',
    onTheWay: '#8B5CF6',
  },

  // Role colors
  roles: {
    customer: '#F97316',
    seller: '#22C55E',
    courier: '#3B82F6',
    admin: '#8B5CF6',
  },
};

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
};

export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', monospace",
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontSize: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 15,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 34,
    '6xl': 44,
    '7xl': 56,
  },
  lineHeight: {
    tight: 1.15,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.6,
  },
  letterSpacing: {
    tight: '-0.03em',
    normal: '0',
    wide: '0.02em',
    wider: '0.08em',
  },
};

export const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  '2xl': 28,
  '3xl': 36,
  full: 9999,
  button: 14,
  card: 20,
  modal: 24,
  input: 12,
};

export const shadows = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.03)',
  sm: '0 2px 8px rgba(0, 0, 0, 0.04)',
  md: '0 6px 20px rgba(0, 0, 0, 0.06)',
  lg: '0 12px 40px rgba(0, 0, 0, 0.08)',
  xl: '0 20px 60px rgba(0, 0, 0, 0.1)',
  '2xl': '0 32px 80px rgba(0, 0, 0, 0.12)',
  primary: '0 8px 30px rgba(249, 115, 22, 0.15)',
  primaryHover: '0 12px 40px rgba(249, 115, 22, 0.2)',
  success: '0 8px 30px rgba(34, 197, 94, 0.15)',
  danger: '0 8px 30px rgba(239, 68, 68, 0.15)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
  focus: '0 0 0 3px rgba(249, 115, 22, 0.2)',
};

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
};

export const breakpoints = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const transitions = {
  fast: '120ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  spring: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  springGentle: '400ms cubic-bezier(0.34, 1.2, 0.64, 1)',
};

export const animation = {
  duration: {
    fast: 120,
    normal: 200,
    slow: 300,
  },
  easing: {
    ease: [0.4, 0, 0.2, 1],
    easeOut: [0, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
    spring: [0.34, 1.56, 0.64, 1],
    springGentle: [0.34, 1.2, 0.64, 1],
  },
};

export const blur = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  '2xl': 40,
  glass: 20,
};

export const layout = {
  maxWidth: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1400,
    full: '100%',
  },
  headerHeight: 56,
  bottomNavHeight: 90,
  sidebarWidth: 256,
  sidebarCollapsedWidth: 72,
};