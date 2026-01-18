import { StyleSheet, View } from 'react-native';

import { Card } from 'components/card';
import { DuelButton } from 'components/duel-button';
import { Loading } from 'components/loading';
import { PlayerInfo } from 'components/player-info';
import { Results } from 'components/results';
import { usePokemon } from 'hooks/use-fetch-pokemon';
import { useGameState } from 'hooks/use-game-state';

export default function Arena() {
  const { data, loading, refetch } = usePokemon();
  const {
    currentCards,
    duel,
    players,
    roundWinner,
    resultWinner,
    matchFinished,
  } = useGameState(data, { onReset: refetch });

  const handleDuel = () => duel();

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.root}>
      <PlayerInfo name="Player 1" score={players[0].score} />
      <View style={styles.table}>
        <View style={styles.tableContent}>
          <View style={styles.resultRow}>
            <Results winner={resultWinner} />
          </View>
          <View style={styles.cardRow}>
            {currentCards.map((card, i) => (
              <Card key={i} details={card} isWinner={roundWinner === i} />
            ))}
          </View>
          <DuelButton matchFinished={matchFinished} onPress={handleDuel} />
        </View>
      </View>
      <PlayerInfo name="Player 2" score={players[1].score} />
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
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  resultRow: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
