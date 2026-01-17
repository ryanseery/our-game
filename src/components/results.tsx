import { Text, StyleSheet } from 'react-native';

import { Winner } from 'hooks/use-game-state';

const winnerMessages: Record<Exclude<Winner, null>, string> = {
  tie: 'Tie! No points awarded.',
  one: 'Player One wins the duel!',
  two: 'Player Two wins the duel!',
};

type Props =
  | { winner: Winner; matchFinished?: never; matchWinner?: never }
  | { winner?: never; matchFinished: boolean; matchWinner: number | null };

export function Results(props: Props) {
  const computedWinner: Winner | undefined = (() => {
    if ('winner' in props) return props.winner;
    if (!props.matchFinished) return null;
    if (props.matchWinner === null) return 'tie';
    return props.matchWinner === 0 ? 'one' : 'two';
  })();

  if (!computedWinner) return null;

  const message = winnerMessages[computedWinner];
  const tieStyle = computedWinner === 'tie' ? styles.tieText : null;
  const textStyle = StyleSheet.flatten([styles.root, tieStyle]);

  return <Text style={textStyle}>{message}</Text>;
}

const styles = StyleSheet.create({
  root: {
    color: '#f6ae2d',
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(11, 19, 43, 0.9)',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  tieText: {
    color: '#ffd166',
  },
});
