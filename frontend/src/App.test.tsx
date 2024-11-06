// src/App.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders login form when not logged in', () => {
    render(<App />);
    const loginElement = screen.getByText(/Login/i);
    expect(loginElement).toBeInTheDocument();
});

test('renders welcome message after successful login', () => {
    render(<App />);

    // Find input fields and button
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    // Simulate user typing in email and password
    fireEvent.change(emailInput, { target: { value: 'mzohaib0677@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'zohaib1071' } });

    // Click the login button
    fireEvent.click(loginButton);

    // Check for the welcome message
    const welcomeElement = screen.getByText(/Welcome Home!/i);
    expect(welcomeElement).toBeInTheDocument();
});
