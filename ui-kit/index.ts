/**
 * GleeBoo UI Kit — cartoon game components built on constants/theme/tokens.
 *
 * Screens must compose exclusively from these exports + image assets;
 * no ad-hoc styles or raw hex values.
 */

export { default as AppHeader } from './AppHeader';
export type { AppHeaderAction, AppHeaderProps } from './AppHeader';

export { default as FormField } from './FormField';
export type { FormFieldProps } from './FormField';

export { default as GameButton } from './GameButton';
export type { GameButtonProps, GameButtonSize, GameButtonVariant } from './GameButton';

export { default as GameCard } from './GameCard';
export type { GameCardProps, GameCardVariant } from './GameCard';

export { default as GameModal } from './GameModal';
export type { GameModalProps } from './GameModal';

export { default as ModalContainer } from './ModalContainer';
export type { ModalContainerProps } from './ModalContainer';

export { default as GameTabBar } from './GameTabBar';
export type { GameTabBarProps, GameTabItem } from './GameTabBar';

export { default as IconBadge } from './IconBadge';
export type { IconBadgeFamily, IconBadgeProps } from './IconBadge';

export { default as IconButton } from './IconButton';
export type { IconButtonProps } from './IconButton';

export { default as PlayEntryCard } from './PlayEntryCard';
export type { PlayEntryCardProps } from './PlayEntryCard';

export { default as PodiumTop3 } from './PodiumTop3';
export type { PodiumPlayer, PodiumTop3Props } from './PodiumTop3';

export { default as ProfileStatsCard } from './ProfileStatsCard';
export type { ProfileStatsCardProps } from './ProfileStatsCard';

export { default as LoadingDots } from './LoadingDots';
export type { LoadingDotsProps } from './LoadingDots';

export { LevelProgressBar, StepProgress } from './ProgressBar';
export type { LevelProgressBarProps, StepProgressProps, StepState } from './ProgressBar';

export { default as Ribbon } from './Ribbon';
export type { RibbonProps, RibbonVariant } from './Ribbon';

export { default as ScreenBackground } from './ScreenBackground';
export type { ScreenBackgroundProps } from './ScreenBackground';

export { default as SegmentedTabs } from './SegmentedTabs';
export type { SegmentedTabsProps } from './SegmentedTabs';

export { CoinChip, CoinEarnedChip, LevelPill, LivesChip, ScoreBadge } from './StatBadge';
export type {
  CoinChipProps,
  CoinEarnedChipProps,
  LevelPillProps,
  LivesChipProps,
  ScoreBadgeProps,
} from './StatBadge';

export { default as StarCoin } from './StarCoin';
export type { StarCoinProps } from './StarCoin';

export { default as SubPageHeader } from './SubPageHeader';
export type { SubPageHeaderAction, SubPageHeaderProps } from './SubPageHeader';

export { default as Toggle } from './Toggle';
export type { ToggleProps } from './Toggle';

export { default as MarkdownViewer } from './MarkdownViewer';
export type { MarkdownViewerProps } from './MarkdownViewer';

// GameKit Design System & Theme Tokens
export * from './theme';

// General Mobile Game Ready-Made Components
export { default as GameHUD } from './GameHUD';
export type { GameHUDProps } from './GameHUD';

export { default as PauseMenu } from './PauseMenu';
export type { PauseMenuProps } from './PauseMenu';

export { default as VictoryModal } from './VictoryModal';
export type { VictoryModalProps } from './VictoryModal';

export { default as GameOverModal } from './GameOverModal';
export type { GameOverModalProps } from './GameOverModal';

export { default as InventoryGrid } from './InventoryGrid';
export type { InventoryGridProps, InventoryItemSlot, ItemRarity } from './InventoryGrid';

export { default as VirtualJoystick } from './VirtualJoystick';
export type { VirtualJoystickProps } from './VirtualJoystick';

export { default as SkillButton } from './SkillButton';
export type { SkillButtonProps } from './SkillButton';

export { default as LeaderboardList } from './LeaderboardList';
export type { LeaderboardListProps, LeaderboardEntry } from './LeaderboardList';

export { default as ShopCard } from './ShopCard';
export type { ShopCardProps } from './ShopCard';

export { default as FloatingCombatText } from './FloatingCombatText';
export type { FloatingCombatTextProps, CombatTextType } from './FloatingCombatText';



