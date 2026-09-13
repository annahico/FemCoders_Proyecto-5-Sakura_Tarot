import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { FormRegister } from '../components/organisms/FormRegister';

const registerUser = vi.fn();

vi.mock('../services/usersApi', () => ({
    usersApi: () => ({ registerUser }),
}));

describe('FormRegister', () => {
    beforeEach(() => {
        registerUser.mockReset();
        localStorage.clear();
    });

    it('registers, stores the session in localStorage and shows a success message', async () => {
        registerUser.mockResolvedValue({ id: '1', username: 'Sakura' });

        render(
            <MemoryRouter>
                <FormRegister />
            </MemoryRouter>
        );

        const user = userEvent.setup();
        await user.type(screen.getByPlaceholderText(/nombre/i), 'Sakura');
        await user.type(screen.getByPlaceholderText(/email/i), 'sakura@correo.com');
        await user.type(screen.getByPlaceholderText(/password/i), 'clow-card-123');
        await user.click(screen.getByRole('button', { name: /Registrarse/i }));

        expect(await screen.findByText(/registro exitoso/i)).toBeTruthy();
        expect(registerUser).toHaveBeenCalledWith({
            username: 'Sakura',
            email: 'sakura@correo.com',
            password: 'clow-card-123',
        });
        expect(JSON.parse(localStorage.getItem('user'))).toEqual({ id: '1', username: 'Sakura' });
    });

    it('shows an error message and does not touch localStorage when registration fails', async () => {
        registerUser.mockRejectedValue(new Error('El email ya está registrado'));

        render(
            <MemoryRouter>
                <FormRegister />
            </MemoryRouter>
        );

        const user = userEvent.setup();
        await user.type(screen.getByPlaceholderText(/nombre/i), 'Sakura');
        await user.type(screen.getByPlaceholderText(/email/i), 'sakura@correo.com');
        await user.type(screen.getByPlaceholderText(/password/i), 'clow-card-123');
        await user.click(screen.getByRole('button', { name: /Registrarse/i }));

        expect(await screen.findByText(/error al registrarse/i)).toBeTruthy();
        expect(localStorage.getItem('user')).toBeNull();
    });
});
