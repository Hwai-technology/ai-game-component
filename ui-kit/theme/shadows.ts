/**
 * GameKit Design System - Shadows & Chunky 3D Border Tokens
 */

export const chunky = {
  edge: { lg: 6, md: 5, sm: 4 },
  pressTravel: 3,
  pressDurationMs: 90,
} as const;

export const shadows = {
  card: {
    shadowColor: '#2C2049',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardSoft: {
    shadowColor: '#2C2049',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
} as const;

