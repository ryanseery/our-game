type PokemonType = { slot: number; type: { name: string; url: string } };

type PokemonStats = {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
};

export type PokemonDetail = {
  id: number;
  name: string;
  sprites?: { front_default?: string };
  types?: PokemonType[];
  stats: PokemonStats[];
};
