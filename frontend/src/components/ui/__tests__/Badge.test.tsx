import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../Badge';

describe('Badge Component', () => {
  it('renders badge children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies emergency variant styling', () => {
    render(<Badge variant="emergency">Critical</Badge>);
    const badge = screen.getByText('Critical');
    expect(badge.className).toContain('bg-rose-600');
  });

  it('applies normal variant styling', () => {
    render(<Badge variant="normal">Low Risk</Badge>);
    const badge = screen.getByText('Low Risk');
    expect(badge.className).toContain('bg-emerald-50');
  });
});
