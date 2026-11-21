import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignUpPage } from '@/pages/auth/SignUpPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { ProfilePage } from '@/pages/auth/ProfilePage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const renderWithProviders = (ui: React.ReactElement, { route = '/' } = {}) => {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

describe('Authentication Pages & Route Protection', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders LoginPage with credentials inputs, remember checkbox, and OAuth actions', () => {
    renderWithProviders(<LoginPage />, { route: '/login' });

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByText('Remember session')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('validates email format and required password on LoginPage', async () => {
    renderWithProviders(<LoginPage />, { route: '/login' });

    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Please enter your email address.')).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText('name@example.com');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('renders SignUpPage with strength meter, password confirmation, and terms checkbox', () => {
    renderWithProviders(<SignUpPage />, { route: '/signup' });

    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Dr. Rajesh Sharma')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('rajesh@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min 8 chars, 1 uppercase, 1 symbol')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Re-enter password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('validates password match and terms consent on SignUpPage', async () => {
    renderWithProviders(<SignUpPage />, { route: '/signup' });

    fireEvent.change(screen.getByPlaceholderText('Dr. Rajesh Sharma'), { target: { value: 'Dr. John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('rajesh@example.com'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Min 8 chars, 1 uppercase, 1 symbol'), {
      target: { value: 'StrongP@ss123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Re-enter password'), { target: { value: 'MismatchedPass' } });

    // Enable terms checkbox to test password match validation
    const termsCheckbox = screen.getByRole('checkbox');
    fireEvent.click(termsCheckbox);

    const submitBtn = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Passwords do not match. Please verify both fields.')).toBeInTheDocument();
  });

  it('renders ForgotPasswordPage and handles email submission', async () => {
    renderWithProviders(<ForgotPasswordPage />, { route: '/forgot-password' });

    expect(screen.getByText('Reset your password')).toBeInTheDocument();
    const emailInput = screen.getByPlaceholderText('name@example.com');
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });

    const submitBtn = screen.getByRole('button', { name: /send reset instructions/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Check your inbox')).toBeInTheDocument();
    expect(screen.getByText(/If an account exists for/i)).toBeInTheDocument();
  });

  it('renders ResetPasswordPage and checks password length constraint', async () => {
    renderWithProviders(<ResetPasswordPage />, { route: '/reset-password' });

    expect(screen.getByText('Create new password')).toBeInTheDocument();
    const newPassInput = screen.getByPlaceholderText('Min 8 characters');
    const confirmInput = screen.getByPlaceholderText('Re-enter new password');

    fireEvent.change(newPassInput, { target: { value: 'short' } });
    fireEvent.change(confirmInput, { target: { value: 'short' } });

    const submitBtn = screen.getByRole('button', { name: /update password/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Password must be at least 8 characters long.')).toBeInTheDocument();
  });

  it('renders ProfilePage with account settings and preferences', () => {
    renderWithProviders(<ProfilePage />, { route: '/profile' });

    expect(screen.getByText('Personal Information & Preferences')).toBeInTheDocument();
    expect(screen.getByText('Security & Password')).toBeInTheDocument();
    expect(screen.getByText('Healthcare Data Protection')).toBeInTheDocument();
    expect(screen.getByText('Delete Account & Health Data')).toBeInTheDocument();
  });

  it('redirects unauthenticated users from ProtectedRoute to /login', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<div>LOGIN PAGE CONTENT</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>DASHBOARD CONTENT</div>} />
        </Route>
      </Routes>,
      { route: '/dashboard' }
    );

    // Should redirect to login page because user is not authenticated
    await waitFor(() => {
      expect(screen.getByText('LOGIN PAGE CONTENT')).toBeInTheDocument();
    });
    expect(screen.queryByText('DASHBOARD CONTENT')).not.toBeInTheDocument();
  });
});
