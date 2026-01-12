import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    marginVertical: 8,
  },
  score: {
    color: '#f6ae2d',
    fontSize: 42,
    fontWeight: '700',
  },
  label: {
    color: '#dfe0e4',
    fontSize: 18,
    letterSpacing: 0.5,
    marginTop: 2,
  },
});

export function PlayerInfo({ name, score }: { name: string; score: number }) {
  return (
    <View style={styles.root}>
      <Text style={styles.score}>{score}</Text>
      <Text style={styles.label}>Player One</Text>
    </View>
  );
}
