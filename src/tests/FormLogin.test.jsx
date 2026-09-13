import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom'; 
import { FormLogin } from '../components/organisms/FormLogIn'; 

vi.mock('../services/usersApi', () => ({
    usersApi: () => ({
        loginUser: vi.fn().mockResolvedValue({ username: 'Sakura' })
    })
}));

describe('FormLogin Unit Test', () => {
    it('debería actualizar los valores de los inputs al escribir', async () => {
        render(
            <MemoryRouter>
                <FormLogin />
            </MemoryRouter>
        );
        
        const user = userEvent.setup();
        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);

        await user.type(emailInput, 'test@correo.com');
        await user.type(passwordInput, '123456');

        expect(emailInput.value).toBe('test@correo.com');
        expect(passwordInput.value).toBe('123456');
    });

    it('debería mostrar el mensaje de bienvenida tras un login exitoso', async () => {
        render(
            <MemoryRouter>
                <FormLogin />
            </MemoryRouter>
        );
        
        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText(/email/i), 'test@correo.com');
        await user.type(screen.getByPlaceholderText(/password/i), '123456');
        await user.click(screen.getByRole('button', { name: /Iniciar Session/i }));

        const welcomeMessage = await screen.findByText(/¡Bienvenida\/o Sakura!/i);
        
        expect(welcomeMessage).toBeTruthy();
    });
});