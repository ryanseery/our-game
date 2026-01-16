import { StyleSheet, Text } from 'react-native';

export function Rounds({
  totalRounds,
  roundsPlayed,
}: {
  totalRounds: number;
  roundsPlayed: number;
}) {
  const currentRound = Math.min(roundsPlayed + 1, totalRounds);
  return (
    <Text style={styles.root}>
      Round {currentRound} of {totalRounds}
    </Text>
  );
}

const styles = StyleSheet.create({
  root: {
    color: '#dfe0e4',
    fontSize: 14,
    marginVertical: 8,
  },
});
