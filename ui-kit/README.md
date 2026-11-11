# GameKit Mobile UI Kit

A comprehensive collection of cartoon-styled, tactile mobile game UI components built for React Native and Expo SDK 58.

---

## 🎨 Design System Characteristics
- **3D Chunky Buttons:** Solid offset bottom borders simulating physical tactile buttons.
- **Cartoon Color Palette:** Deep purples, punchy teals, warm golds, and vibrant oranges.
- **Friendly Radii:** Generously rounded corners and pill-shaped badges.
- **Haptic Tactility:** Integrated light impacts via `expo-haptics`.
- **Fluid Animation:** Spring pop-in, press depression, and floating sparkles via `react-native-reanimated`.

---

## 📦 Component Library (31 Components)

### 1. In-Game HUD & Controls
- **`GameHUD`**: Docked top HUD showing lives/hearts, level, score counter, countdown timer, coins, and pause button.
- **`VirtualJoystick`**: Directional touch controller with base plate and 3D thumbstick knob.
- **`SkillButton`**: Circular ability button with radial cooldown overlay and mana cost badge.
- **`GameButton`**: Tactile 3D button with primary, secondary, success, and ghost variants.
- **`IconButton`**: Circular icon button with optional unread notification badges.
- **`Toggle`**: Playful cartoon switch toggle.

### 2. Dialogs & Overlays
- **`PauseMenu`**: Complete in-game pause dialog with Resume, Restart, Main Menu, and SFX/Music/Haptics toggles.
- **`VictoryModal`**: Stage clear dialog with 1 to 3 animated stars, high score announcement, coin reward chips, and Next Level button.
- **`GameOverModal`**: Defeat dialog with final score, revive with gems, and try-again button.
- **`GameModal`**: Deep purple night panel with sparkles for rewards and gifts.
- **`ModalContainer`**: Slide-in or pop-in backdrop container for custom popups.

### 3. Inventory, Items & Economy
- **`InventoryGrid`**: Square slot grid with rarity borders (Common, Rare, Epic, Legendary) and stack counters.
- **`ShopCard`**: Virtual economy purchase card with icon preview, description, coin/gem price badge, and Buy/Equip states.
- **`PlayEntryCard`**: Game mode selection card with energy / ticket requirements.
- **`ProfileStatsCard`**: Player overview displaying trophies, win rate, and total matches.
- **`StarCoin`**: Animated golden star-coin icon with sparkle effects.
- **`CoinChip` / `CoinEarnedChip`**: Polished coin balance chip.
- **`LivesChip`**: Heart lives counter with plus button.
- **`LevelPill`**: Player level status badge.
- **`ScoreBadge`**: High-contrast score counter.

### 4. Progression & Feedback
- **`LeaderboardList`**: Ranking list highlighting top 3 medalists (#1 Gold, #2 Silver, #3 Bronze) and current player.
- **`PodiumTop3`**: 3D podium stage displaying the top 3 championship players.
- **`LevelProgressBar`**: Chunky filled progress bar with percentage and milestone stars.
- **`StepProgress`**: Linear stepped checkpoint indicator.
- **`FloatingCombatText`**: Animated floating hit damage, combo announcements, and level-up popups.
- **`Ribbon`**: 3D folded banner ribbon for titles and announcements.
- **`LoadingDots`**: Bouncing cartoon loading indicators.

### 5. Layout & Navigation
- **`AppHeader`**: Main navigation header with profile avatar, coin counter, and settings trigger.
- **`SubPageHeader`**: Secondary screen header with back chevron and action slot.
- **`GameTabBar`**: Bottom navigation tab bar with floating icons and animated selection indicator.
- **`SegmentedTabs`**: Pill-shaped segmented tabs for filtering shop categories or game modes.
- **`ScreenBackground`**: Decorative gradient background with floating cloud/bubble accents.
- **`FormField`**: Themed text input field with error feedback.
- **`MarkdownViewer`**: Stylized markdown text reader for lore, patch notes, and dialogue.

---

## 🚀 Quick Usage Example

```

---

## 🏛️ Clean Architecture Component Convention

Every component follows a clean 4-file modular pattern:

```text
ui-kit/<ComponentName>/
├── index.tsx      # Main functional component logic and React Native layout
├── types.ts       # Public TypeScript prop types, models, and interfaces
├── styles.ts      # Dedicated StyleSheet definitions with token bindings
└── helper.ts      # Pure domain calculation, formatting, and validation helpers
```

### Self-Contained Design Token Imports
All components import design tokens directly from the localized theme system:
```typescript
import { palette, radius, spacing, surface, chunky } from '../theme';
```
This ensures `ui-kit` is completely decoupled, self-contained, and portable into any React Native / Expo application without external path dependencies.
tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import {
  GameHUD,
  PauseMenu,
  VictoryModal,
  VirtualJoystick,
  SkillButton,
} from '@/ui-kit';

export function GamePlayScreen() {
  const [paused, setPaused] = useState(false);
  const [won, setWon] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {/* Heads-up display at the top */}
      <GameHUD
        score={12500}
        lives={3}
        coins={450}
        level={5}
        timeRemaining="01:45"
        onPause={() => setPaused(true)}
      />

      {/* Action controls at bottom */}
      <View style={{ position: 'absolute', bottom: 40, left: 30 }}>
        <VirtualJoystick size={120} />
      </View>

      <View style={{ position: 'absolute', bottom: 50, right: 30 }}>
        <SkillButton
          iconName="flash"
          color="#35A99B"
          manaCost={20}
          onPress={() => console.log('Skill cast!')}
        />
      </View>

      {/* Overlays */}
      {paused && (
        <PauseMenu
          onResume={() => setPaused(false)}
          onRestart={() => console.log('Restart game')}
        />
      )}

      {won && (
        <VictoryModal
          stars={3}
          score={12500}
          highScore={10000}
          coinsEarned={150}
          isNewHighScore
          onNextLevel={() => console.log('Next Level')}
        />
      )}
    </View>
  );
}
```

---

## 🏛️ Clean Architecture Component Convention

Every component follows a clean 4-file modular pattern:

```text
ui-kit/<ComponentName>/
├── index.tsx      # Main functional component logic and React Native layout
├── types.ts       # Public TypeScript prop types, models, and interfaces
├── styles.ts      # Dedicated StyleSheet definitions with token bindings
└── helper.ts      # Pure domain calculation, formatting, and validation helpers
```

### Self-Contained Design Token Imports
All components import design tokens directly from the localized theme system:
```typescript
import { palette, radius, spacing, surface, chunky } from '../theme';
```
This ensures `ui-kit` is completely decoupled, self-contained, and portable into any React Native / Expo application without external path dependencies.


