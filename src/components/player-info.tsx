import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { flatten } from 'utils/styles';

const MAX_BALLS = 6;

export function PlayerInfo({ name, score }: { name: string; score: number }) {
  const filledCount = Math.max(0, Math.min(score, MAX_BALLS));

  return (
    <View style={styles.root}>
      <View style={styles.scoreRow}>
        {Array.from({ length: MAX_BALLS }).map((_, index) => (
          <PokeBall
            key={index}
            filled={index < filledCount}
            style={styles.ballSpacing}
          />
        ))}
      </View>
      <Text style={styles.label}>{name}</Text>
    </View>
  );
}

function PokeBall({
  filled = false,
  style,
}: {
  filled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const fContainer = flatten([
    styles.ball,
    filled ? styles.ballFilled : styles.ballEmpty,
    style,
  ]);

  const fTop = flatten([
    styles.ballHalfTop,
    filled && styles.ballHalfTopFilled,
  ]);
  const fBottom = flatten([
    styles.ballHalfBottom,
    filled && styles.ballHalfBottomFilled,
  ]);
  return (
    <View style={fContainer}>
      <View style={fTop} />
      <View style={fBottom} />
      <View style={styles.ballBand} />
      <View style={styles.ballButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    marginVertical: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ballSpacing: {
    marginHorizontal: 4,
  },
  label: {
    color: '#dfe0e4',
    fontSize: 18,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  ball: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#dfe0e4',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
  },
  ballFilled: {
    borderColor: '#f6ae2d',
    boxShadow: '0px 0px 10px rgba(246,174,45,0.35)',
  },
  ballEmpty: {
    opacity: 0.5,
  },
  ballHalfTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'transparent',
  },
  ballHalfTopFilled: {
    backgroundColor: '#f26419',
  },
  ballHalfBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'transparent',
  },
  ballHalfBottomFilled: {
    backgroundColor: '#dfe0e4',
  },
  ballBand: {
    position: 'absolute',
    left: -2,
    right: -2,
    top: '50%',
    marginTop: -1,
    height: 6,
    backgroundColor: '#0d0101',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#dfe0e4',
  },
  ballButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 10,
    height: 10,
    marginLeft: -5,
    marginTop: -5,
    borderRadius: 5,
    backgroundColor: '#dfe0e4',
    borderWidth: 2,
    borderColor: '#0d0101',
  },
});
