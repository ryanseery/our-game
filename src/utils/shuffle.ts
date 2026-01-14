import { PokemonDetail } from 'types/pokemon';

// Function to shuffle an array using the Fisher-Yates algorithm
function shuffleArray(array: PokemonDetail[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    // Swap elements
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}

// Function to randomize an array and split it in half
export function randomSplitArray(array: PokemonDetail[]) {
  // Shuffle the array
  const shuffled = shuffleArray([...array]); // Use a copy to avoid modifying the original
  // Calculate the midpoint
  const midpoint = Math.ceil(shuffled.length / 2); // Use Math.ceil for odd-length arrays
  // Split into two halves
  const firstHalf = shuffled.slice(0, midpoint).slice(0, 12);
  const secondHalf = shuffled.slice(midpoint).slice(0, 12);
  // Return the two halves
  return [firstHalf, secondHalf];
}
