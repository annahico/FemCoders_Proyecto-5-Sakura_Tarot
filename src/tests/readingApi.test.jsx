import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { readingApi } from '../services/readingApi';

vi.mock('axios');

const past = { id: '1', spanishName: 'Viento' };
const present = { id: '2', spanishName: 'Fuego' };
const future = { id: '3', spanishName: 'Agua' };

describe('readingApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saveReading posts a reading with userId/username and the three cards', async () => {
    axios.post.mockResolvedValueOnce({ data: { id: '100' } });

    const { saveReading } = readingApi();
    await saveReading('u1', 'Sakura', { past, present, future });

    expect(axios.post).toHaveBeenCalledTimes(1);
    const [, body] = axios.post.mock.calls[0];
    expect(body.userId).toBe('u1');
    expect(body.username).toBe('Sakura');
    expect(body.cards).toEqual({ past, present, future });
    expect(body.date).toBeTypeOf('string');
  });

  it('getReadingsByUserId filters by the given userId', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: '1', userId: 'u1' }] });

    const { getReadingsByUserId } = readingApi();
    const result = await getReadingsByUserId('u1');

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('userId=u1'));
    expect(result).toEqual([{ id: '1', userId: 'u1' }]);
  });

  it('deleteReading calls DELETE on the reading id', async () => {
    axios.delete.mockResolvedValueOnce({ data: { id: '1' } });

    const { deleteReading } = readingApi();
    await deleteReading('1');

    expect(axios.delete).toHaveBeenCalledWith(expect.stringMatching(/\/readings\/1$/));
  });

  it('deleteAllReadings deletes every reading for that user and reports how many', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: '1' }, { id: '2' }] });
    axios.delete.mockResolvedValue({ data: {} });

    const { deleteAllReadings } = readingApi();
    const result = await deleteAllReadings('u1');

    expect(axios.delete).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ deleted: 2 });
  });

  it('deleteAllReadings is a no-op when the user has no readings', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    const { deleteAllReadings } = readingApi();
    const result = await deleteAllReadings('u1');

    expect(axios.delete).not.toHaveBeenCalled();
    expect(result).toEqual({ deleted: 0 });
  });
});
