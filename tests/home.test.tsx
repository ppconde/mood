import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import HomePage from '../app/page';

vi.mock('@clerk/nextjs', () => ({
    auth: () => new Promise((resolve) => resolve({ userId: 'w1212' })),
    ClerkProvider: ({ children }) => <div>{children}</div>,
    useUser: () => ({ isSignedIn: true, user: { id: '123dw', fullName: 'John B' } }),
}));

test('Homepage', async () => {
    render(await HomePage());
    expect(screen.getByText('get started')).toBeTruthy();
});