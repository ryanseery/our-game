import { useCallback, useMemo, useReducer } from 'react';

import { randomSplitArray } from 'utils/shuffle';
import { PokemonDetail } from 'types/pokemon';

const WIN_THRESHOLD = 7;

type Player = { score: number };

export type Winner = 'one' | 'two' | 'tie' | null;

// Game state bookkeeping
// - cardIndex tracks the current hand index (starts at -1 before the first round)
type GameState = {
  cardIndex: number;
  players: Player[];
  roundWinner: number | null;
  matchFinished: boolean;
  matchWinner: Winner;
};

const baseState: GameState = {
  cardIndex: -1, // idle/no rounds yet; first press moves to 0
  players: [{ score: 0 }, { score: 0 }],
  roundWinner: null,
  matchFinished: false,
  matchWinner: null,
};

type GameAction =
  | {
      type: 'PLAY';
      payload: {
        winnerIdx: number | null;
        nextIndex: number;
      };
    }
  | { type: 'RESET' };

/**
 * Reducer for duel state.
 * - Handles scoring, determines threshold finish, and tracks roundWinner/matchWinner.
 */
function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLAY': {
      const { winnerIdx, nextIndex } = action.payload;

      const updatedPlayers = state.players.map((player, idx) =>
        winnerIdx !== null && idx === winnerIdx
          ? { ...player, score: player.score + 1 }
          : player,
      );

      const thresholdReached =
        winnerIdx !== null && updatedPlayers[winnerIdx].score >= WIN_THRESHOLD;

      if (thresholdReached) {
        const scoreA = updatedPlayers[0].score;
        const scoreB = updatedPlayers[1].score;
        const result: Winner =
          scoreA === scoreB ? 'tie' : scoreA > scoreB ? 'one' : 'two';

        return {
          ...state,
          cardIndex: nextIndex,
          players: updatedPlayers,
          roundWinner: winnerIdx,
          matchFinished: true,
          matchWinner: result,
        };
      }

      return {
        ...state,
        cardIndex: nextIndex,
        players: updatedPlayers,
        roundWinner: winnerIdx,
        matchFinished: false,
        matchWinner: null,
      };
    }
    case 'RESET': {
      return { ...baseState };
    }
    default:
      return state;
  }
}

/**
 * Compute the winner index for a single duel based on active cards.
 * @param cards Two card slots (may contain null when a deck is short).
 * @returns 0 for player one, 1 for player two, or null for a tie/no cards.
 */
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

type Options = { onReset: () => void };

/**
 * useGameState
 * Rules and flow:
 * - Two players duel one card at a time; the higher base_stat wins the round.
 * - First to seven round wins takes the match (WIN_THRESHOLD).
 * - roundWinner reflects the latest round winner (0, 1, or null for tie).
 * - matchFinished/matchWinner are set when a player reaches seven; the next press resets and triggers onReset.
 * - Decks shuffle when data changes (refetch supplies a fresh shuffle).
 * - currentCards are null until the first duel to avoid rendering pre-start cards.
 * @param data Full list of Pokemon to split into decks.
 * @param options onReset is called after a finished match when the next press occurs.
 */
export function useGameState(data: PokemonDetail[], options: Options) {
  const [state, dispatch] = useReducer(reducer, baseState);

  const { cardIndex, players, roundWinner, matchFinished, matchWinner } = state;

  const decks = useMemo(() => randomSplitArray(data), [data]);

  // Render logic: idle -> blanks; otherwise show the current hand at cardIndex.
  const currentCards = useMemo(() => {
    const isIdle = cardIndex < 0 && roundWinner === null;
    if (isIdle) return decks.map(() => null);
    return decks.map((deck) => deck[cardIndex] ?? null);
  }, [cardIndex, decks, roundWinner]);

  const duel = useCallback(() => {
    if (matchFinished) {
      dispatch({ type: 'RESET' });
      options.onReset();
      return;
    }

    // Next draw index drives both the played hand and the upcoming state
    const nextIndex = state.cardIndex + 1;
    const cards = decks.map((deck) => deck[nextIndex] ?? null);

    const winnerIdx = determineWinner(cards);

    dispatch({ type: 'PLAY', payload: { winnerIdx, nextIndex } });
  }, [decks, matchFinished, options, state.cardIndex]);

  const resultWinner: Winner = matchFinished ? matchWinner : null;

  return {
    currentCards,
    duel,
    roundWinner,
    players,
    matchFinished,
    resultWinner,
  };
}
