import { Pressable, StyleSheet, Text } from 'react-native';

interface Props {
  matchFinished: boolean;
  onPress: () => void;
}

export function DuelButton({ matchFinished, onPress }: Props) {
  const text = matchFinished ? 'New Game' : 'Duel';

  return (
    <Pressable style={styles.root} onPress={onPress}>
      <Text style={styles.label}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: '#f26419',
    borderRadius: 12,
    boxShadow: '0px 4px 12px rgba(0,0,0,0.25)',
    elevation: 4,
  },
  label: {
    color: '#0b132b',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
