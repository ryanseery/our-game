import { useEffect, useMemo, useRef } from 'react';
import { Image } from 'expo-image';
import { Animated, Easing, StyleSheet, Text, Platform } from 'react-native';
import { PokemonDetail } from 'types/pokemon';

export function Card({
  details,
  isWinner,
}: {
  details: PokemonDetail | null;
  isWinner: boolean;
}) {
  const dropAnim = useRef(new Animated.Value(1)).current;

  const key = details?.name ?? 'empty';

  useEffect(() => {
    if (!details) {
      dropAnim.setValue(1);
      return;
    }

    dropAnim.setValue(0);
    const useNativeDriver = Platform.OS !== 'web';

    Animated.timing(dropAnim, {
      toValue: 1,
      duration: 260,
      useNativeDriver,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [key, details, dropAnim]);

  const animatedStyle = useMemo(() => {
    const translateY = dropAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-18, 0],
    });
    const scaleIn = dropAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.9, 1],
    });
    const rotate = dropAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['-2deg', '0deg'],
    });

    return {
      transform: [{ translateY }, { scale: scaleIn }, { rotate }],
      opacity: dropAnim,
    };
  }, [dropAnim]);

  if (!details) {
    return (
      <Animated.View style={[styles.root, styles.empty, animatedStyle]}>
        <Text style={styles.emptyText}>Ready</Text>
      </Animated.View>
    );
  }

  const imageUri = details.sprites?.front_default;

  return (
    <Animated.View
      style={[styles.root, isWinner && styles.winner, animatedStyle]}
    >
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
    </Animated.View>
  );
}

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
