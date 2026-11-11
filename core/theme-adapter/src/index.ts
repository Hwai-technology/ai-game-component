/**
 * Game Theme Adapter - Clean Design Tokens Contract
 *
 * Bridges cartoon game styling (palette, radii, chunky 3D effects, gradients)
 * without coupling core game engines to React Native or UI Kit internals.
 */

export const gamePalette = {
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

export const gameSurface = {
  white: '#FFFFFF',
  cream: '#FFF8EE',
  lavender: '#EDE8F5',
  overlay: 'rgba(46, 26, 84, 0.55)',
} as const;

export const gameText = {
  primary: '#3A2B63',
  secondary: '#7A6F99',
  muted: '#B9B0CE',
  onDark: '#FFFFFF',
} as const;

export const gameGradients = {
  purpleButton: ['#8A5BC4', '#6B3FA8'] as const,
  orangeButton: ['#FFA030', '#F5820D'] as const,
  tealButton: ['#5FC2B5', '#35A99B'] as const,
  goldFill: ['#FFD873', '#FFC530'] as const,
  rewardModal: ['#523C85', '#3D2470'] as const,
  hudBadge: ['#5B3494', '#4A2C7A'] as const,
} as const;

export const gameRadius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

export const gameSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 100,
} as const;

export const gameChunky = {
  edge: { lg: 6, md: 5, sm: 4 },
  pressTravel: 3,
  pressDurationMs: 90,
} as const;

export const gameMotion = {
  pressScale: 0.98,
  popIn: { fromScale: 0.6, damping: 12, stiffness: 180 },
  floatAmplitude: 6,
  floatDurationMs: 3000,
} as const;

export interface GameThemeContract {
  palette: typeof gamePalette;
  surface: typeof gameSurface;
  text: typeof gameText;
  gradients: typeof gameGradients;
  radius: typeof gameRadius;
  spacing: typeof gameSpacing;
  chunky: typeof gameChunky;
  motion: typeof gameMotion;
}

export const defaultGameTheme: GameThemeContract = {
  palette: gamePalette,
  surface: gameSurface,
  text: gameText,
  gradients: gameGradients,
  radius: gameRadius,
  spacing: gameSpacing,
  chunky: gameChunky,
  motion: gameMotion,
};

export const gleebooThemeTokens = defaultGameTheme;

export function createCartoonBoxStyle(
  colorKey: keyof typeof gamePalette | 'surfaceWhite' | 'surfaceCream',
  size: keyof typeof gameRadius = 'md'
) {
  let bg = '#6B3FA8';
  if (colorKey === 'surfaceWhite') bg = gameSurface.white;
  else if (colorKey === 'surfaceCream') bg = gameSurface.cream;
  else if (colorKey === 'purple') bg = gamePalette.purple[500];
  else if (colorKey === 'orange') bg = gamePalette.orange[500];
  else if (colorKey === 'gold') bg = gamePalette.gold[500];
  else if (colorKey === 'teal') bg = gamePalette.teal[500];
  else if (colorKey === 'pink') bg = gamePalette.pink[400];
  else if (colorKey === 'red') bg = gamePalette.red[500];

  return {
    backgroundColor: bg,
    borderRadius: gameRadius[size],
    borderBottomWidth: gameChunky.edge.md,
    borderBottomColor: 'rgba(0,0,0,0.25)',
  };
}

