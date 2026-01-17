import { useEffect, useRef, useState } from 'react';
import { PokemonDetail } from 'types/pokemon';

type PokemonListResult = { name: string; url: string };
type PokemonApiListResponse = { results: PokemonListResult[] };

export const usePokemon = (limit = 150) => {
  const isMounted = useRef(true);
  const [data, setData] = useState<PokemonDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = () => setReloadToken((token) => token + 1);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        if (!isMounted.current) return;
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}`,
        );

        const data = (await response.json()) as PokemonApiListResponse;

        // Fetch per-Pokemon details after the list (list endpoint lacks stats/sprites)
        const detailedData = await Promise.all(
          data.results.map(async (pokemon: PokemonListResult) => {
            const detailsResponse = await fetch(pokemon.url);
            return (await detailsResponse.json()) as PokemonDetail;
          }),
        );

        if (isMounted.current) {
          setData(detailedData);
        }
      } catch {
        if (isMounted.current) {
          setError('Something went wrong');
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchPokemon();

    return () => {
      isMounted.current = false;
    };
  }, [limit, reloadToken]);

  return { data, loading, error, refetch };
};
