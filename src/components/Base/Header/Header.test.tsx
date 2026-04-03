import { render } from '@testing-library/react';
import Header from '@/components/Base/Header';

vi.mock('./header.scss', () => ({}));

describe('Header', () => {
  it('renders without crashing', () => {
    render(<Header />);
    expect(document.querySelector('section')).toBeInTheDocument();
  });

  it('has correct wrapper class', () => {
    render(<Header />);
    expect(document.querySelector('section')).toHaveClass('header__wrapper');
  });

  it('renders logo container', () => {
    render(<Header />);
    expect(document.querySelector('.header__logo')).toBeInTheDocument();
  });

  it('renders SVG logo', () => {
    render(<Header />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 184 25');
    expect(svg).toHaveAttribute('fill', '#000');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('has valid SVG path', () => {
    render(<Header />);
    const path = document.querySelector('svg path');
    expect(path).toBeInTheDocument();
    expect(path?.getAttribute('d')).toBeTruthy();
  });

  it('uses section not header', () => {
    render(<Header />);
    expect(document.querySelector('header')).not.toBeInTheDocument();
    expect(document.querySelector('section')).toBeInTheDocument();
  });
});