import { render, screen } from '@testing-library/react';
import Footer from '@/components/Base/Footer';

vi.mock('./footer.scss', () => ({}));

describe('Footer', () => {
  it('renders without crashing', () => {
    render(<Footer />);
    expect(screen.getByText(/@NY Times Developers by Pavel Khokhlov/)).toBeInTheDocument();
  });

  it('displays developer credit', () => {
    render(<Footer />);
    expect(screen.getByText('@NY Times Developers by Pavel Khokhlov')).toBeInTheDocument();
  });

  it('displays version information', () => {
    render(<Footer />);
    expect(screen.getByText(/Version:/)).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    render(<Footer />);
    expect(document.querySelector('.footer')).toBeInTheDocument();
    expect(document.querySelectorAll('.footer__text')).toHaveLength(2);
  });
});