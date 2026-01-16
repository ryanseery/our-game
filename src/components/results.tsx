import { StyleSheet, Text } from 'react-native';

export type Winner = 'one' | 'two' | 'tie' | null;

const winnerMessages: Record<Exclude<Winner, null>, string> = {
  tie: 'Tie! No points awarded.',
  one: 'Player One wins the duel!',
  two: 'Player Two wins the duel!',
};

export function Results({ winner }: { winner: Winner }) {
  if (!winner) return null;

  const message = winnerMessages[winner];
  const tieStyle = winner === 'tie' ? styles.tieText : null;
  const textStyle = StyleSheet.flatten([styles.root, tieStyle]);

  return <Text style={textStyle}>{message}</Text>;
}

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
