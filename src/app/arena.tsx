import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Card } from 'components/card';
import { DuelButton } from 'components/duel-button';
import { PlayerInfo } from 'components/player-info';
import { usePokemon } from 'hooks/use-fetch-pokemon';
import { useGameState } from 'hooks/use-game-state';

export default function Arena() {
  const { data, loading, refetch } = usePokemon();
  const {
    totalRounds,
    currentRound,
    currentCards,
    duel,
    players,
    winnerIndex,
  } = useGameState(data, undefined, { onReset: refetch });

  const handleDuel = () => duel();

  return (
    <View style={styles.root}>
      {loading ? (
        <ActivityIndicator size="large" color="#f6ae2d" />
      ) : (
        <>
          <PlayerInfo name="Player One" score={players[0].score} />
          <View style={styles.table}>
            <View style={styles.tableContent}>
              {/* <Results winner={currentBattle.winner} /> */}
              <View style={styles.cardRow}>
                {currentCards.map((card, i) => (
                  <Card key={i} details={card} isWinner={winnerIndex === i} />
                ))}
              </View>
              <DuelButton
                totalRounds={totalRounds}
                currentRound={currentRound}
                onPress={handleDuel}
              />
            </View>
          </View>
          <PlayerInfo name="Player Two" score={players[1].score} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0d0101',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  table: {
    flex: 1,
    marginVertical: 24,
    borderRadius: 16,
    backgroundColor: '#58659b',
    borderWidth: 2,
    borderColor: '#3a506b',
    padding: 16,
    justifyContent: 'center',
  },
  tableContent: {
    alignItems: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 16,
  },
});
