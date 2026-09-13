import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HistoryPage } from '../pages/HistoryPage';
import { TarotContext } from '../context/TarotContext';

const { deleteReading } = vi.hoisted(() => ({ deleteReading: vi.fn() }));

vi.mock('../services/readingApi', () => ({
  readingApi: () => ({ deleteReading }),
}));

const reading1 = {
  id: 'r1',
  date: '13 septiembre 2026',
  username: 'Sakura',
  cards: {
    past: { spanishName: 'Viento', sakuraCard: 'viento.jpg', meaning: 'Simboliza el intelecto.' },
    present: { spanishName: 'Fuego', sakuraCard: 'fuego.jpg', meaning: 'Pasión y energía.' },
    future: { spanishName: 'Agua', sakuraCard: 'agua.jpg', meaning: 'Fluidez y cambio.' },
  },
};

const reading2 = {
  id: 'r2',
  date: '14 septiembre 2026',
  username: 'Sakura',
  cards: { past: null, present: null, future: null },
};

function Wrapper({ initialHistory, isLoadingHistory }) {
  const [history, setHistory] = useState(initialHistory);
  return (
    <TarotContext.Provider value={{ history, setHistory, isLoadingHistory }}>
      <HistoryPage />
    </TarotContext.Provider>
  );
}

const renderHistoryPage = (initialHistory = [], isLoadingHistory = false) =>
  render(
    <MemoryRouter>
      <Wrapper initialHistory={initialHistory} isLoadingHistory={isLoadingHistory} />
    </MemoryRouter>
  );

describe('HistoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a loading message while the history is loading', () => {
    renderHistoryPage([], true);
    expect(screen.getByText(/cargando tu historial/i)).toBeTruthy();
  });

  it('shows an empty state when there are no saved readings', () => {
    renderHistoryPage([], false);
    expect(screen.getByText(/no tienes lecturas guardadas/i)).toBeTruthy();
  });

  it('opens a detail modal with the reading when a card is clicked', async () => {
    renderHistoryPage([reading1]);
    const user = userEvent.setup();

    await user.click(screen.getByText(/consultante: sakura/i));

    const modalTitle = await screen.findByText(/tu lectura del 13 septiembre 2026/i);
    expect(modalTitle).toBeTruthy();
    expect(screen.getByText('Viento')).toBeTruthy();
    expect(screen.getByText('Simboliza el intelecto.')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: /cerrar/i }));
    expect(screen.queryByText(/tu lectura del 13 septiembre 2026/i)).toBeNull();
  });

  it('deletes a single reading without opening its detail modal', async () => {
    deleteReading.mockResolvedValueOnce({});
    renderHistoryPage([reading1, reading2]);
    const user = userEvent.setup();

    await user.click(screen.getAllByRole('button', { name: /eliminar lectura/i })[0]);

    expect(deleteReading).toHaveBeenCalledWith('r1');
    expect(await screen.findByText(/lectura eliminada/i)).toBeTruthy();
    expect(screen.queryByText(/tu lectura del 13 septiembre 2026/i)).toBeNull();
    expect(screen.queryByText(/13 septiembre 2026/i)).toBeNull();
    expect(screen.getByText(/14 septiembre 2026/i)).toBeTruthy();
  });

  it('clearing all history asks for confirmation and does nothing on cancel', async () => {
    renderHistoryPage([reading1, reading2]);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /limpiar historial/i }));
    expect(screen.getByText(/no se puede deshacer/i)).toBeTruthy();

    await user.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(screen.queryByText(/no se puede deshacer/i)).toBeNull();
    expect(deleteReading).not.toHaveBeenCalled();
    expect(screen.getByText(/13 septiembre 2026/i)).toBeTruthy();
  });

  it('clearing all history deletes every reading on confirm', async () => {
    deleteReading.mockResolvedValue({});
    renderHistoryPage([reading1, reading2]);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /limpiar historial/i }));
    await user.click(within(screen.getByText(/no se puede deshacer/i).closest('div')).getByRole('button', { name: /borrar todo/i }));

    expect(deleteReading).toHaveBeenCalledTimes(2);
    expect(await screen.findByText(/historial eliminado/i)).toBeTruthy();
    expect(screen.getByText(/no tienes lecturas guardadas/i)).toBeTruthy();
  });
});
