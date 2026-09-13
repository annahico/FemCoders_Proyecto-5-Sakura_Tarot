import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { usersApi } from '../services/usersApi';

vi.mock('axios');

describe('usersApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registerUser never sends the plaintext password to the API', async () => {
    // No existing user with this email.
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockImplementationOnce((url, body) => Promise.resolve({ data: { id: '1', ...body } }));

    const { registerUser } = usersApi();
    await registerUser({ username: 'Sakura', email: 'sakura@correo.com', password: 'clow-card-123' });

    expect(axios.post).toHaveBeenCalledTimes(1);
    const sentBody = axios.post.mock.calls[0][1];
    expect(sentBody.password).toBeUndefined();
    expect(sentBody.passwordHash).toBeTypeOf('string');
    expect(sentBody.passwordHash).not.toBe('clow-card-123');
    expect(sentBody.salt).toBeTypeOf('string');
  });

  it('registerUser rejects when the email is already taken', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: '1', email: 'sakura@correo.com' }] });

    const { registerUser } = usersApi();
    await expect(
      registerUser({ username: 'Sakura', email: 'sakura@correo.com', password: 'x' })
    ).rejects.toThrow('El email ya está registrado');
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('loginUser succeeds with the correct password', async () => {
    // Register first, to get a real hash+salt pair.
    axios.get.mockResolvedValueOnce({ data: [] });
    let storedUser;
    axios.post.mockImplementationOnce((url, body) => {
      storedUser = { id: '1', ...body };
      return Promise.resolve({ data: storedUser });
    });
    const { registerUser, loginUser } = usersApi();
    await registerUser({ username: 'Sakura', email: 'sakura@correo.com', password: 'clow-card-123' });

    axios.get.mockResolvedValueOnce({ data: [storedUser] });
    const loggedInUser = await loginUser('sakura@correo.com', 'clow-card-123');
    expect(loggedInUser.username).toBe('Sakura');
  });

  it('loginUser rejects with the wrong password', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    let storedUser;
    axios.post.mockImplementationOnce((url, body) => {
      storedUser = { id: '1', ...body };
      return Promise.resolve({ data: storedUser });
    });
    const { registerUser, loginUser } = usersApi();
    await registerUser({ username: 'Sakura', email: 'sakura@correo.com', password: 'clow-card-123' });

    axios.get.mockResolvedValueOnce({ data: [storedUser] });
    await expect(loginUser('sakura@correo.com', 'wrong-password')).rejects.toThrow('Contraseña incorrecta');
  });

  it('loginUser rejects when the user does not exist', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    const { loginUser } = usersApi();
    await expect(loginUser('nadie@correo.com', 'x')).rejects.toThrow('Usuario no encontrado');
  });
});
