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
  cardIndex: -1,
  players: [{ score: 0 }, { score: 0 }],
  roundWinner: null,
  matchFinished: false,
  matchWinner: null,
};

type GameAction =
  | { type: 'PLAY'; payload: { decks: PokemonDetail[][] } }
  | { type: 'RESET' };

/**
 * Reducer for duel state.
 * - Stateless about decks: caller must supply the current decks on every PLAY.
 * - For each play we advance the card index, compare the drawn cards, and award a point to the winner.
 * - Once a player reaches WIN_THRESHOLD we mark the match as finished and record the winner; otherwise we keep playing.
 * - RESET simply restores baseState so the next press starts a fresh match.
 */
function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLAY': {
      const nextIndex = state.cardIndex + 1;

      // Next draw index drives both the played hand and the upcoming state
      const cards = action.payload.decks.map((deck) => deck[nextIndex] ?? null);

      const winnerIdx = determineWinner(cards);

      const hasWinner = winnerIdx !== null;

      const updatedPlayers = state.players.map((player, idx) =>
        hasWinner && idx === winnerIdx
          ? { ...player, score: player.score + 1 }
          : player,
      );

      const thresholdReached =
        hasWinner && updatedPlayers[winnerIdx].score >= WIN_THRESHOLD;

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

/**
 * useGameState
 * Step-by-step:
 * - Shuffle incoming Pokemon once per render and split into two decks so each player draws from their own pile.
 * - Store only scores/index/winner flags in reducer state; decks stay external and are passed in with each PLAY action.
 * - A duel increments the card index, compares that pair of cards, and awards one point to the higher base_stat.
 * - First player to WIN_THRESHOLD ends the match; we freeze matchWinner/matchFinished until the caller triggers a reset.
 * - When matchFinished is true and the user presses duel again, we dispatch RESET and call onReset (side effects stay outside the reducer to keep it pure).
 * - currentCards stays null before the first duel so the UI shows blanks; missing cards in a short deck count as a tie for that round.
 * @param data Full list of Pokemon to split into two decks.
 * @param options.onReset callback invoked after a finished match when the user initiates the next duel.
 */
export function useGameState(
  data: PokemonDetail[],
  options: { onReset: () => void },
) {
  const [state, dispatch] = useReducer(reducer, baseState);

  const decks = useMemo(() => randomSplitArray(data), [data]);

  const { cardIndex, players, roundWinner, matchFinished, matchWinner } = state;

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

    dispatch({ type: 'PLAY', payload: { decks } });
  }, [decks, matchFinished, options]);

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
