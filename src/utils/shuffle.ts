import { PokemonDetail } from 'types/pokemon';

// Shuffle an array in-place (Fisher–Yates)
function shuffleArray(array: PokemonDetail[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Shuffle, then split the full list evenly
export function randomSplitArray(list: PokemonDetail[]) {
  const arr = shuffleArray([...list]); // work on a copy
  const half = Math.floor(arr.length / 2);
  const first = arr.slice(0, half);
  const second = arr.slice(half);
  return [first, second];
}
