import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  root: {
    color: '#f6ae2d',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  tieText: {
    color: '#ffd166',
  },
});

export type Winner = 'one' | 'two' | 'tie' | null;

export function Results({ winner }: { winner: Winner }) {
  if (!winner) return;
  return (
    <Text style={[styles.root, winner === 'tie' && styles.tieText]}>
      {winner === 'tie'
        ? 'Tie! No points awarded.'
        : winner === 'one'
        ? 'Player One wins the duel!'
        : 'Player Two wins the duel!'}
    </Text>
  );
}
