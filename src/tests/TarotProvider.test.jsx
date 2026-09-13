import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TarotProvider } from '../context/TarotProvider';
import { useTarot } from '../context/TarotContext';

const { getRandomCards, getReadingsByUserId, saveReading } = vi.hoisted(() => ({
  getRandomCards: vi.fn(),
  getReadingsByUserId: vi.fn(),
  saveReading: vi.fn(),
}));

vi.mock('../services/sakuraApi', () => ({
  sakuraApi: () => ({ getRandomCards }),
}));

vi.mock('../services/readingApi', () => ({
  readingApi: () => ({ getReadingsByUserId, saveReading }),
}));

const cardA = { id: '1', spanishName: 'Viento' };
const cardB = { id: '2', spanishName: 'Fuego' };
const cardC = { id: '3', spanishName: 'Agua' };
const cardD = { id: '4', spanishName: 'Tierra' };

function TestConsumer() {
  const {
    deck, selectedCards, isRevealed, history,
    isLoadingDeck, isLoadingHistory,
    handleSelect, revealReading,
    saveReading: saveReadingFromContext,
  } = useTarot();

  return (
    <div>
      <span data-testid="loading-deck">{String(isLoadingDeck)}</span>
      <span data-testid="loading-history">{String(isLoadingHistory)}</span>
      <span data-testid="deck-count">{deck.length}</span>
      <span data-testid="selected-count">{selectedCards.length}</span>
      <span data-testid="is-revealed">{String(isRevealed)}</span>
      <span data-testid="history-count">{history.length}</span>
      {deck.map((card) => (
        <button key={card.id} onClick={() => handleSelect(card)}>select-{card.id}</button>
      ))}
      <button onClick={revealReading}>reveal</button>
      <button onClick={() => saveReadingFromContext('u1', 'Sakura')}>save</button>
    </div>
  );
}

const renderProvider = () =>
  render(
    <TarotProvider>
      <TestConsumer />
    </TarotProvider>
  );

describe('TarotProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    getRandomCards.mockResolvedValue([cardA, cardB, cardC, cardD]);
    getReadingsByUserId.mockResolvedValue([]);
  });

  it('loads a deck of cards on mount', async () => {
    renderProvider();
    await waitFor(() => expect(screen.getByTestId('loading-deck').textContent).toBe('false'));
    expect(screen.getByTestId('deck-count').textContent).toBe('4');
  });

  it('does not call the readings API when nobody is logged in', async () => {
    renderProvider();
    await waitFor(() => expect(screen.getByTestId('loading-history').textContent).toBe('false'));
    expect(getReadingsByUserId).not.toHaveBeenCalled();
    expect(screen.getByTestId('history-count').textContent).toBe('0');
  });

  it('fetches history scoped to the logged-in user', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 'u1', username: 'Sakura' }));
    getReadingsByUserId.mockResolvedValueOnce([{ id: 'r1' }]);

    renderProvider();

    await waitFor(() => expect(screen.getByTestId('history-count').textContent).toBe('1'));
    expect(getReadingsByUserId).toHaveBeenCalledWith('u1');
  });

  it('handleSelect allows up to 3 unique cards and ignores the rest', async () => {
    renderProvider();
    await waitFor(() => expect(screen.getByTestId('deck-count').textContent).toBe('4'));

    const user = userEvent.setup();
    await user.click(screen.getByText('select-1'));
    await user.click(screen.getByText('select-1'));
    await user.click(screen.getByText('select-2'));
    await user.click(screen.getByText('select-3'));
    await user.click(screen.getByText('select-4'));

    expect(screen.getByTestId('selected-count').textContent).toBe('3');
  });

  it('only reveals once 3 cards are selected, and resets on the next click', async () => {
    renderProvider();
    await waitFor(() => expect(screen.getByTestId('deck-count').textContent).toBe('4'));

    const user = userEvent.setup();
    await user.click(screen.getByText('reveal'));
    expect(screen.getByTestId('is-revealed').textContent).toBe('false');

    await user.click(screen.getByText('select-1'));
    await user.click(screen.getByText('select-2'));
    await user.click(screen.getByText('select-3'));
    await user.click(screen.getByText('reveal'));
    expect(screen.getByTestId('is-revealed').textContent).toBe('true');

    await user.click(screen.getByText('reveal'));
    expect(screen.getByTestId('is-revealed').textContent).toBe('false');
    expect(screen.getByTestId('selected-count').textContent).toBe('0');
  });

  it('saveReading stores the current selection and appends it to history', async () => {
    saveReading.mockResolvedValueOnce({ id: 'r99' });
    renderProvider();
    await waitFor(() => expect(screen.getByTestId('deck-count').textContent).toBe('4'));

    const user = userEvent.setup();
    await user.click(screen.getByText('select-1'));
    await user.click(screen.getByText('select-2'));
    await user.click(screen.getByText('select-3'));
    await user.click(screen.getByText('save'));

    await waitFor(() => expect(screen.getByTestId('history-count').textContent).toBe('1'));
    expect(saveReading).toHaveBeenCalledWith('u1', 'Sakura', { past: cardA, present: cardB, future: cardC });
  });
});
