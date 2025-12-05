export interface RawItemResponse {
  id: number;
  name: string;
  cost: number | null;
  fling_power: number | null;
  fling_effect: NamedAPIResource | null;
  attributes: NamedAPIResource[];
  category: NamedAPIResource;
  effect_entries: EffectEntry[];
  flavor_text_entries: VersionGroupFlavorText[];
  game_indices: GenerationGameIndex[];
  names: Name[];
  sprites: ItemSprites;
  held_by_pokemon: ItemHolderPokemon[];
  baby_trigger_for: NamedAPIResource | null;
  machines: MachineVersionDetail[];
}

interface NamedAPIResource {
  name: string;
  url: string;
}

interface EffectEntry {
  effect: string;
  short_effect: string;
  language: NamedAPIResource;
}

interface VersionGroupFlavorText {
  text: string;
  version_group: NamedAPIResource;
  language: NamedAPIResource;
}

interface GenerationGameIndex {
  game_index: number;
  generation: NamedAPIResource;
}

interface Name {
  name: string;
  language: NamedAPIResource;
}

interface ItemSprites {
  default: string;
}

interface ItemHolderPokemon {
  pokemon: NamedAPIResource;
  version_details: {
    rarity: number;
    version: NamedAPIResource;
  }[];
}

interface MachineVersionDetail {
  machine: NamedAPIResource;
  version_group: NamedAPIResource;
}
