import { PokemonDetail } from '@/hooks/use-fetch-pokemon';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  root: {
    width: 150,
    minHeight: 190,
    borderRadius: 12,
    backgroundColor: '#0d0101',
    borderWidth: 2,
    borderColor: '#3a506b',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  empty: {
    borderStyle: 'dashed',
    borderColor: '#7481ba',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#7481ba',
    fontWeight: '600',
  },
  winner: {
    borderColor: '#f6ae2d',
    boxShadow: '0px 6px 16px rgba(246,174,45,0.35)',
  },
  image: {
    width: 96,
    height: 96,
    marginBottom: 8,
  },
  winnerLabel: {
    color: '#f6ae2d',
    fontWeight: '700',
  },
  name: {
    color: '#dfe0e4',
    fontWeight: '700',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  stat: {
    color: '#f6ae2d',
    fontWeight: '600',
  },
});

export function Card({
  details,
  isWinner,
}: {
  details: PokemonDetail | null;
  isWinner: boolean;
}) {
  if (!details) {
    return (
      <View style={[styles.root, styles.empty]}>
        <Text style={styles.emptyText}>Ready</Text>
      </View>
    );
  }

  const imageUri = details.sprites?.front_default;

  return (
    <View style={[styles.root, isWinner && styles.winner]}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          contentFit="contain"
        />
      ) : (
        <Text style={styles.emptyText}>No sprite</Text>
      )}
      <Text style={styles.name}>{details.name}</Text>
      <Text style={styles.stat}>
        Power: {details.stats?.[0]?.base_stat ?? 0}
      </Text>
      {isWinner ? <Text style={styles.winnerLabel}>Winner</Text> : null}
    </View>
  );
}
