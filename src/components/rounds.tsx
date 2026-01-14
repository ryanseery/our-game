import { StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  root: {
    color: '#dfe0e4',
    fontSize: 14,
    marginVertical: 8,
  },
});

export function Rounds({
  totalRounds,
  roundsPlayed,
}: {
  totalRounds: number;
  roundsPlayed: number;
}) {
  return (
    <Text style={styles.root}>
      Round {Math.min(roundsPlayed + 1, totalRounds)} of {totalRounds}
    </Text>
  );
}
