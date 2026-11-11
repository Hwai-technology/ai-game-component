import { MatchThreeEngine, GridPosition } from '../../../components/12-match-three-engine/src/index.js';
import { ScoringEngine } from '../../../components/44-scoring-engine/src/index.js';
import { VirtualEconomyEngine } from '../../../components/45-virtual-economy/src/index.js';
import { AchievementSystem } from '../../../components/46-achievement-system/src/index.js';
import { gleebooThemeTokens, gamePalette } from '../../../core/theme-adapter/src/index.js';

export interface MatchThreeGameConfig {
  rows?: number;
  cols?: number;
  tileTypes?: number;
}

export class MatchThreeGame {
  public readonly board: MatchThreeEngine;
  public readonly scoring: ScoringEngine;
  public readonly economy: VirtualEconomyEngine;
  public readonly achievements: AchievementSystem;

  private _movesCount = 0;

  constructor(config: MatchThreeGameConfig = {}) {
    this.board = new MatchThreeEngine({
      rows: config.rows ?? 8,
      columns: config.cols ?? 8,
      tileTypesCount: config.tileTypes ?? 5,
    });

    this.scoring = new ScoringEngine({
      maxMultiplier: 10,
      comboTimeoutSeconds: 5.0,
    });

    this.economy = new VirtualEconomyEngine({
      initialBalances: {
        coins: 100,
        gems: 10,
      },
    });

    this.achievements = new AchievementSystem();
    this.registerAchievements();
  }

  private registerAchievements(): void {
    this.achievements.register({
      id: 'first_match',
      title: 'First Match!',
      description: 'Make your very first tile match',
      maxProgress: 1,
      rewardCoins: 50,
    });

    this.achievements.register({
      id: 'combo_master',
      title: 'Combo Master',
      description: 'Trigger a cascading 3x combo chain',
      maxProgress: 3,
      rewardCoins: 100,
    });

    this.achievements.register({
      id: 'score_millionaire',
      title: 'Score Millionaire',
      description: 'Reach 10,000 points in a single match session',
      maxProgress: 10000,
    });
  }

  public get movesCount(): number {
    return this._movesCount;
  }

  /**
   * Attempts to swap two adjacent tiles, resolve cascading matches,
   * award points, currency rewards, and achievement progress.
   */
  public swap(posA: GridPosition, posB: GridPosition): boolean {
    const move = { from: posA, to: posB };
    if (!this.board.canSwap(move)) {
      return false;
    }

    this._movesCount++;

    // Swap automatically executes cascades in MatchThreeEngine
    const cascadeSteps = this.board.swap(move);
    const totalMatched = cascadeSteps.reduce(
      (acc, step) => acc + step.matches.reduce((mAcc, m) => mAcc + m.positions.length, 0),
      0
    );

    if (totalMatched > 0) {
      const basePoints = totalMatched * 100;
      this.scoring.addPoints(basePoints, 'match');

      // Reward player with economy coins (1 coin per 10 points)
      const earnedCoins = Math.max(1, Math.floor(basePoints / 10));
      this.economy.earn('coins', earnedCoins, 'match_reward');

      // Update achievements
      this.achievements.addProgress('first_match', 1);
      if (cascadeSteps.length >= 3) {
        this.achievements.addProgress('combo_master', cascadeSteps.length);
      }
      this.achievements.addProgress('score_millionaire', basePoints);
    }

    return true;
  }

  /**
   * Styling mapping for cartoon match-3 gems based on theme-adapter tokens
   */
  public getTileTheme(tileType: number) {
    const gemColors = [
      gamePalette.red[500],
      gamePalette.teal[500],
      gamePalette.gold[500],
      gamePalette.purple[500],
      gamePalette.orange[500],
      gamePalette.pink[400],
    ];

    const color = gemColors[tileType % gemColors.length];

    return {
      tokens: gleebooThemeTokens,
      backgroundColor: color,
      borderRadius: gleebooThemeTokens.radius.md,
      borderBottomWidth: gleebooThemeTokens.chunky.edge.md,
      borderBottomColor: 'rgba(0,0,0,0.3)',
      shadowColor: color,
    };
  }
}
