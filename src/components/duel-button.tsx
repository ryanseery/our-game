import { Pressable, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  root: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: '#f26419',
    borderRadius: 12,
    boxShadow: '0px 4px 12px rgba(0,0,0,0.25)',
    elevation: 4,
  },
  disabled: {
    backgroundColor: '#8b4520',
  },
  label: {
    color: '#0b132b',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});

interface Props {
  totalRounds: number;
  roundsPlayed: number;
  handleReset: () => void;
  handleDuel: () => void;
}

export function DuelButton({
  totalRounds,
  roundsPlayed,
  handleReset,
  handleDuel,
}: Props) {
  const onPress = roundsPlayed >= totalRounds ? handleReset : handleDuel;

  const text = roundsPlayed >= totalRounds ? 'New Game' : 'Duel';
  return (
    <Pressable
      style={[styles.root, !totalRounds && styles.disabled]}
      disabled={!totalRounds}
      onPress={onPress}
    >
      <Text style={styles.label}>{text}</Text>
    </Pressable>
  );
}
