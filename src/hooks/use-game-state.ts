import { useCallback, useMemo, useReducer } from 'react';

import { randomSplitArray } from 'utils/shuffle';
import { PokemonDetail } from 'types/pokemon';

type Player = { score: number };

type GameState = {
  totalRounds: number;
  currentRound: number;
  players: Player[];
  winnerIndex: number | null;
};

const baseTotalRounds = 12;

const baseState: GameState = {
  totalRounds: baseTotalRounds,
  currentRound: 0,
  players: [{ score: 0 }, { score: 0 }],
  winnerIndex: null,
};

type GameAction = { type: 'PLAY'; payload: { winnerIdx: number | null } };

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLAY': {
      if (state.currentRound >= state.totalRounds) {
        return state; // already finished; ignore further updates
      }

      const winnerIdx = action.payload.winnerIdx;

      // handle score
      const updatedPlayers = state.players.map((player, idx) =>
        winnerIdx !== null && idx === winnerIdx
          ? { ...player, score: player.score + 1 }
          : player,
      );

      const isLastRound = state.currentRound >= state.totalRounds - 1;

      if (isLastRound) {
        return {
          ...state,
          currentRound: 0,
          players: state.players.map(() => ({ score: 0 })),
          winnerIndex: null,
        };
      }

      return {
        ...state,
        currentRound: state.currentRound + 1,
        players: updatedPlayers,
        winnerIndex: winnerIdx,
      };
    }
    default:
      return state;
  }
}

type Options = { onReset?: () => void };

/** Compute winner index for a round; null means tie or missing cards. */
function determineWinner(cards: (PokemonDetail | null)[]): number | null {
  let bestIdx: number | null = null;
  let bestPower = -Infinity;
  let tie = false;

  cards.forEach((card, idx) => {
    if (!card) return;
    const power = card.stats?.[0]?.base_stat ?? 0;
    if (power > bestPower) {
      bestPower = power;
      bestIdx = idx;
      tie = false;
    } else if (power === bestPower) {
      tie = true;
    }
  });

  return tie ? null : bestIdx;
}

/**
 * Game state for duel rounds.
 * - currentRound is 1-based for consumers; internal state stays 0-based.
 * - Auto-resets after the final round (scores cleared, round set to 0); onReset fires then.
 * - currentCards renders nulls on round 0 for an empty table, but scoring always uses activeCards.
 */
export function useGameState(
  data: PokemonDetail[],
  initialTotalRounds: number = baseTotalRounds,
  options?: Options,
) {
  const [state, dispatch] = useReducer(reducer, {
    ...baseState,
    totalRounds: initialTotalRounds,
  });

  const { totalRounds, currentRound, players, winnerIndex } = state;

  const decks = useMemo(() => randomSplitArray(data), [data]);

  const activeCards = useMemo(
    () => decks.map((deck) => deck[currentRound] ?? null),
    [decks, currentRound],
  );

  // Show placeholder/null cards on the initial screen but still keep activeCards for scoring.
  const currentCards = useMemo(
    () => (currentRound === 0 ? decks.map(() => null) : activeCards),
    [activeCards, decks, currentRound],
  );

  const duel = useCallback(() => {
    const isLastRound = currentRound >= totalRounds - 1;
    const winnerIdx = determineWinner(activeCards);

    dispatch({ type: 'PLAY', payload: { winnerIdx } });
    if (isLastRound) {
      options?.onReset?.();
    }
  }, [activeCards, currentRound, totalRounds, options]);

  return {
    totalRounds,
    currentRound: state.currentRound + 1,
    currentCards,
    duel,
    winnerIndex,
    players,
  };
}
