import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CardReading } from '../components/organisms/CardReading';
import { TarotContext } from '../context/TarotContext';

const navigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => navigate };
});

Element.prototype.scrollIntoView = vi.fn();

const cardA = { id: '1', spanishName: 'Viento', meaning: 'Simboliza el intelecto.', sakuraCard: 'viento.jpg' };
const cardB = { id: '2', spanishName: 'Fuego', meaning: 'Pasión y energía.', sakuraCard: 'fuego.jpg' };
const cardC = { id: '3', spanishName: 'Agua', meaning: 'Fluidez y cambio.', sakuraCard: 'agua.jpg' };
const deck = [cardA, cardB, cardC];

const saveReading = vi.fn();

function Wrapper({ isLoadingDeck = false, initialDeck = deck }) {
  const [selectedCards, setSelectedCards] = useState([]);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleSelect = (card) => {
    if (!isRevealed && selectedCards.length < 3 && !selectedCards.find((c) => c.id === card.id)) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const revealReading = () => {
    if (isRevealed) {
      setSelectedCards([]);
      setIsRevealed(false);
    } else if (selectedCards.length === 3) {
      setIsRevealed(true);
    }
  };

  return (
    <TarotContext.Provider value={{ deck: initialDeck, selectedCards, isRevealed, isLoadingDeck, handleSelect, revealReading, saveReading }}>
      <CardReading />
    </TarotContext.Provider>
  );
}

const renderCardReading = (props = {}) =>
  render(
    <MemoryRouter>
      <Wrapper {...props} />
    </MemoryRouter>
  );

const selectAllThreeCards = async (user) => {
  for (const card of deck) {
    await user.click(screen.getByAltText(card.spanishName));
  }
};

describe('CardReading', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('shows a loading message while the deck is loading', () => {
    renderCardReading({ isLoadingDeck: true });
    expect(screen.getByText(/cargando mazo mágico/i)).toBeTruthy();
  });

  it('shows a fallback message when the deck failed to load', () => {
    renderCardReading({ initialDeck: [] });
    expect(screen.getByText(/no se pudo cargar el mazo/i)).toBeTruthy();
  });

  it('keeps "Revelar Destino" disabled until 3 cards are selected', async () => {
    renderCardReading();
    const user = userEvent.setup();
    const revealButton = screen.getByRole('button', { name: /revelar destino/i });
    expect(revealButton).toBeDisabled();

    await user.click(screen.getByAltText('Viento'));
    expect(revealButton).toBeDisabled();
  });

  it('reveals the reading once 3 cards are selected', async () => {
    renderCardReading();
    const user = userEvent.setup();
    await selectAllThreeCards(user);

    const revealButton = screen.getByRole('button', { name: /revelar destino/i });
    await waitFor(() => expect(revealButton).not.toBeDisabled());
    await user.click(revealButton);

    expect(await screen.findByRole('heading', { name: 'Viento' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Fuego' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Agua' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /guardar lectura/i })).toBeTruthy();
  });

  it('sends you to /login when trying to save without a session', async () => {
    renderCardReading();
    const user = userEvent.setup();
    await selectAllThreeCards(user);
    await user.click(screen.getByRole('button', { name: /revelar destino/i }));
    await user.click(await screen.findByRole('button', { name: /guardar lectura/i }));

    expect(navigate).toHaveBeenCalledWith('/login');
    expect(saveReading).not.toHaveBeenCalled();
  });

  it('saves the reading for a logged-in user', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 'u1', username: 'Sakura' }));
    saveReading.mockResolvedValueOnce({ id: 'r1' });
    renderCardReading();
    const user = userEvent.setup();
    await selectAllThreeCards(user);
    await user.click(screen.getByRole('button', { name: /revelar destino/i }));
    await user.click(await screen.findByRole('button', { name: /guardar lectura/i }));

    expect(saveReading).toHaveBeenCalledWith('u1', 'Sakura');
    expect(await screen.findByText(/lectura guardada/i)).toBeTruthy();
  });
});
