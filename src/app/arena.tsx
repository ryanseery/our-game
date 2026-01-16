import { Card } from 'components/card';
import { DuelButton } from 'components/duel-button';
import { PlayerInfo } from 'components/player-info';
import { Results, Winner } from 'components/results';
import { Rounds } from 'components/rounds';
import { usePokemon } from 'hooks/use-fetch-pokemon';
import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { PokemonDetail } from 'types/pokemon';

const baseScore = {
  playerOne: 0,
  playerTwo: 0,
};

const baseBattle = { one: null, two: null, winner: null };

export default function HomeScreen() {
  const { playerOne, playerTwo, loading } = usePokemon();

  const totalRounds = useMemo(
    () => Math.min(playerOne.length, playerTwo.length),
    [playerOne.length, playerTwo.length]
  );
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [score, setScore] = useState(baseScore);
  const [currentBattle, setCurrentBattle] = useState<{
    one: PokemonDetail | null;
    two: PokemonDetail | null;
    winner: Winner;
  }>(baseBattle);

  const handleDuel = () => {
    if (loading) return;
    if (!totalRounds) return;
    if (roundsPlayed >= totalRounds) return;

    const topOne = playerOne[roundsPlayed];
    const topTwo = playerTwo[roundsPlayed];

    const powerOne = topOne.stats?.[0]?.base_stat ?? 0;
    const powerTwo = topTwo.stats?.[0]?.base_stat ?? 0;

    let winner: Winner = null;

    if (powerOne > powerTwo) {
      winner = 'one';
      setScore((prev) => ({ ...prev, playerOne: prev.playerOne + 1 }));
    } else if (powerTwo > powerOne) {
      winner = 'two';
      setScore((prev) => ({ ...prev, playerTwo: prev.playerTwo + 1 }));
    }

    setCurrentBattle({ one: topOne, two: topTwo, winner });
    setRoundsPlayed((prev) => {
      const next = prev + 1;
      const finished = totalRounds > 0 && next >= totalRounds;

      if (finished) {
        setScore(baseScore);
      }

      return next;
    });
  };

  const handleReset = () => {
    setRoundsPlayed(0);
    setScore(baseScore);
    setCurrentBattle({ one: null, two: null, winner: null });
  };

  return (
    <View style={styles.root}>
      {loading ? (
        <ActivityIndicator size="large" color="#f6ae2d" />
      ) : (
        <>
          <PlayerInfo name="Player One" score={score.playerOne} />
          <View style={styles.table}>
            <View style={styles.tableContent}>
              <Results winner={currentBattle.winner} />
              <View style={styles.cardRow}>
                <Card
                  details={currentBattle.one}
                  isWinner={currentBattle.winner === 'one'}
                />
                <Card
                  details={currentBattle.two}
                  isWinner={currentBattle.winner === 'two'}
                />
              </View>
              <DuelButton
                totalRounds={totalRounds}
                roundsPlayed={roundsPlayed}
                handleReset={handleReset}
                handleDuel={handleDuel}
              />
              <Rounds totalRounds={totalRounds} roundsPlayed={roundsPlayed} />
            </View>
          </View>
          <PlayerInfo name="Player Two" score={score.playerTwo} />
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
