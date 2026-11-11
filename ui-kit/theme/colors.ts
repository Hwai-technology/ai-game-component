/**
 * GameKit Design System - Color Palette & Surface Tokens
 */

export const palette = {
  purple: {
    100: '#EDE4F9',
    300: '#9B6FD0',
    500: '#6B3FA8',
    700: '#4A2C7A',
    900: '#2C2049',
  },
  orange: {
    300: '#FFA94D',
    500: '#F5820D',
    600: '#D96B0B',
  },
  gold: {
    100: '#FFF3D0',
    300: '#FFD873',
    500: '#FFC530',
    600: '#E0A400',
  },
  teal: {
    100: '#E1F2EF',
    300: '#7BC8BD',
    400: '#5FC2B5',
    500: '#35A99B',
    700: '#27857A',
  },
  sky100: '#E4F2FB',
  pink: {
    100: '#FCE4EC',
    400: '#F48FB1',
    600: '#D96E93',
  },
  red: {
    100: '#FDE9EA',
    500: '#E8484D',
  },
  lavenderGrey: {
    200: '#E5DFEE',
    400: '#B7ABCE',
  },
  sky: {
    300: '#A9D9F2',
  },
} as const;

export const surface = {
  white: '#FFFFFF',
  cream: '#FFF8EE',
  lavender: '#EDE8F5',
  overlay: 'rgba(46, 26, 84, 0.55)',
} as const;

export const text = {
  primary: '#3A2B63',
  secondary: '#7A6F99',
  muted: '#B9B0CE',
  onDark: '#FFFFFF',
} as const;

export const gradients = {
  purpleButton: ['#8A5BC4', '#6B3FA8'] as const,
  orangeButton: ['#FFA030', '#F5820D'] as const,
  tealButton: ['#5FC2B5', '#35A99B'] as const,
  goldFill: ['#FFD873', '#FFC530'] as const,
  rewardModal: ['#523C85', '#3D2470'] as const,
  hudBadge: ['#5B3494', '#4A2C7A'] as const,
} as const;

export const disabledTint = {
  purple: '#A692C4',
  orange: '#E0A87E',
  teal: '#84BDB6',
  ghostText: '#B7ABCE',
} as const;

