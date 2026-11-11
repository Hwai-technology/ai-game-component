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
  fab: {
    shadowColor: '#2C2049',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  text: {
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  button: (color: string = '#2C2049') => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  }),
};
