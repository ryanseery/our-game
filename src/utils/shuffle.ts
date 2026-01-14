import { PokemonDetail } from 'types/pokemon';

// Shuffle an array in-place (Fisher–Yates)
function shuffleArray(array: PokemonDetail[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Shuffle, then split into two capped halves
export function randomSplitArray(list: PokemonDetail[], cap = 12) {
  const arr = shuffleArray([...list]); // work on a copy
  const first = arr.slice(0, cap);
  const second = arr.slice(cap, cap * 2);
  return [first, second];
}
