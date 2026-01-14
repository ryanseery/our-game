import { randomSplitArray } from '@/util/shuffle';
import { useEffect, useState } from 'react';

type PokemonListResult = { name: string; url: string };
type PokemonApiListResponse = { results: PokemonListResult[] };
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

export const usePokemon = (limit = 150) => {
  const [pokemonList, setPokemonList] = useState<PokemonDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPokemon = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
        );

        const data = (await response.json()) as PokemonApiListResponse;

        const detailedData = await Promise.all(
          data.results.map(async (pokemon: PokemonListResult) => {
            const detailsResponse = await fetch(pokemon.url);
            return (await detailsResponse.json()) as PokemonDetail;
          })
        );

        if (isMounted) {
          setPokemonList(detailedData);
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
            ? err
            : 'Something went wrong';
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPokemon();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  const [playerOne, playerTwo] = randomSplitArray(pokemonList);

  return { playerOne, playerTwo, loading, error };
};
