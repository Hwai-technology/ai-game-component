export type ComponentCategory =
  | 'core'
  | 'puzzle'
  | 'arcade'
  | 'physics'
  | 'rpg'
  | 'progression'
  | 'services';

export interface ComponentMetadata {
  id: string;
  name: string;
  category: ComponentCategory;
  version: string;
  description: string;
  expoSdk: string;
  reactNativeVersion: string;
  expoGoCompatible: boolean;
  devBuildRequired: boolean;
  platforms: ('ios' | 'android')[];
  tags: string[];
  dependencies: string[];
  peerDependencies?: string[];
  aiContext: string;
  entryPoint: string;
  status: 'stable' | 'experimental' | 'in-development';
}

export class ComponentRegistry {
  private readonly components = new Map<string, ComponentMetadata>();

  public register(meta: ComponentMetadata): void {
    this.components.set(meta.id, meta);
  }

  public get(id: string): ComponentMetadata | undefined {
    return this.components.get(id);
  }

  public list(): ComponentMetadata[] {
    return Array.from(this.components.values());
  }

  public filterByCategory(category: ComponentCategory): ComponentMetadata[] {
    return this.list().filter((c) => c.category === category);
  }

  public search(query: string): ComponentMetadata[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.list();

    return this.list().filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }
}

import { allComponentsMetadata } from './registryData.js';
export * from './registryData.js';

export function createDefaultRegistry(): ComponentRegistry {
  const registry = new ComponentRegistry();
  for (const meta of allComponentsMetadata) {
    registry.register(meta);
  }
  return registry;
}


