import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Alert } from '../Alert';

describe('Alert Component', () => {
  it('renders alert with title and content', () => {
    render(<Alert title="Important Notice">Please read carefully.</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Important Notice')).toBeInTheDocument();
    expect(screen.getByText('Please read carefully.')).toBeInTheDocument();
  });

  it('renders emergency alert with appropriate role and styles', () => {
    render(<Alert variant="emergency" title="Emergency">Call 108 immediately</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('bg-rose-50');
    expect(screen.getByText('Call 108 immediately')).toBeInTheDocument();
  });
});
