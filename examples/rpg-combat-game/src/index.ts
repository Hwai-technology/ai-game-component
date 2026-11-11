import { InventorySystem, InventoryItem } from '../../../components/35-inventory-system/src/index.js';
import { EquipmentSystem, EquipmentItem } from '../../../components/36-equipment-system/src/index.js';
import { CharacterStatsEngine } from '../../../components/37-character-stats/src/index.js';
import { HealthDamageSystem } from '../../../components/38-health-damage/src/index.js';
import { SkillAbilitySystem } from '../../../components/39-skill-ability/src/index.js';
import { TurnBasedCombatEngine, Combatant, CombatTurnResult } from '../../../components/43-turn-based-combat/src/index.js';
import { gleebooThemeTokens, createCartoonBoxStyle, gamePalette } from '../../../core/theme-adapter/src/index.js';

export interface RpgHeroConfig {
  name: string;
  maxHealth?: number;
  strength?: number;
  agility?: number;
}

export class RpgCombatGame {
  public readonly inventory: InventorySystem;
  public readonly equipment: EquipmentSystem;
  public readonly stats: CharacterStatsEngine;
  public readonly heroHealth: HealthDamageSystem;
  public readonly skills: SkillAbilitySystem;
  public combat: TurnBasedCombatEngine;

  public readonly heroId = 'hero';
  public readonly enemyId = 'goblin_boss';

  constructor(heroConfig: RpgHeroConfig = { name: 'GleeBoo Knight' }) {
    this.inventory = new InventorySystem({
      capacity: 20,
    });

    this.equipment = new EquipmentSystem();

    this.stats = new CharacterStatsEngine({
      basePrimary: {
        strength: heroConfig.strength ?? 15,
        agility: heroConfig.agility ?? 12,
        intelligence: 10,
        vitality: 14,
      },
    });

    const maxHp = heroConfig.maxHealth ?? 100;
    this.heroHealth = new HealthDamageSystem({
      maxHealth: maxHp,
      baseArmor: 5,
    });

    this.skills = new SkillAbilitySystem({
      currentMana: 50,
      maxMana: 50,
    });

    // Register starting skills
    this.skills.learnSkill({
      id: 'slash',
      name: 'Power Slash',
      manaCost: 15,
      cooldownSeconds: 2.0,
      damageMultiplier: 1.8,
    });

    // Populate starting inventory
    this.inventory.addItem({
      id: 'potion_hp',
      name: 'Health Potion',
      type: 'consumable',
      quantity: 3,
      maxStack: 10,
    });

    // Initialize turn-based combat with hero and enemy
    const heroCombatant: Combatant = {
      id: this.heroId,
      name: heroConfig.name,
      team: 'player',
      hp: maxHp,
      maxHp,
      attack: 25,
      defense: 8,
      speed: 14,
    };

    const enemyCombatant: Combatant = {
      id: this.enemyId,
      name: 'Goblin Boss',
      team: 'enemy',
      hp: 80,
      maxHp: 80,
      attack: 18,
      defense: 4,
      speed: 10,
    };

    this.combat = new TurnBasedCombatEngine([heroCombatant, enemyCombatant]);
  }

  public equipWeapon(item: EquipmentItem): void {
    this.equipment.equip(item);
    // Apply stat modifiers to CharacterStatsEngine
    const mods = this.equipment.getAggregatedModifiers();
    for (const [stat, val] of Object.entries(mods)) {
      this.stats.setModifier(`equip_${stat}`, stat as any, val);
    }
  }

  public useHealthPotion(): boolean {
    const count = this.inventory.getItemCount('potion_hp');
    if (count <= 0) return false;

    this.inventory.removeItem('potion_hp', 1);
    this.heroHealth.heal(40);
    return true;
  }

  public heroAttack(): CombatTurnResult {
    const actor = this.combat.getActiveCombatant();
    if (!actor || actor.id !== this.heroId) {
      throw new Error(`Not hero's turn (active: ${actor?.name ?? 'none'})`);
    }

    return this.combat.executeAction({
      actorId: this.heroId,
      type: 'attack',
      targetId: this.enemyId,
    });
  }

  public heroCastSkill(skillId: string): { turnResult: CombatTurnResult; skillUsed: boolean } {
    const canCast = this.skills.canCast(skillId);
    if (!canCast) {
      return { turnResult: this.heroAttack(), skillUsed: false };
    }

    this.skills.cast(skillId);
    const turnResult = this.combat.executeAction({
      actorId: this.heroId,
      type: 'attack',
      targetId: this.enemyId,
    });

    return { turnResult, skillUsed: true };
  }

  public enemyAutoTurn(): CombatTurnResult | null {
    const actor = this.combat.getActiveCombatant();
    if (!actor || actor.team !== 'enemy') return null;

    return this.combat.executeAction({
      actorId: actor.id,
      type: 'attack',
      targetId: this.heroId,
    });
  }

  public getCombatUiTheme() {
    return {
      tokens: gleebooThemeTokens,
      heroHpBar: {
        background: gamePalette.purple[100],
        fill: gamePalette.teal[500],
        borderRadius: gleebooThemeTokens.radius.pill,
      },
      enemyHpBar: {
        background: gamePalette.red[100],
        fill: gamePalette.red[500],
        borderRadius: gleebooThemeTokens.radius.pill,
      },
      actionCard: createCartoonBoxStyle('purple', 'md'),
      potionCard: createCartoonBoxStyle('teal', 'sm'),
    };
  }
}
