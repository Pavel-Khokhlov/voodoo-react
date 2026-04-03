import { render, screen } from '@testing-library/react';
import NewsItem from '@/components/NewsItem';
import { formatDate } from '@/helpers/date';
import { NewsProps } from '@/store/news';

// Мокаем хелпер formatDate
vi.mock('@/helpers/date', () => ({
  formatDate: vi.fn(),
}));

// Мокаем иконку Ant Design как React компонент
vi.mock('@ant-design/icons', () => ({
  LinkOutlined: () => <svg data-testid="link-icon" />,
}));

describe('NewsItem Component', () => {
  // Полный мок-объект, соответствующий типу NewsProps
  const mockItem: NewsProps = {
    section: 'Technology',
    title: 'Test News Title',
    abstract: 'This is a test abstract for the news article',
    uri: 'nyt://article/test-uri-123',
    url: 'https://test-news.com/article/1',
    byline: 'John Doe',
    source: 'Test Source',
    published_date: new Date('2024-01-15T08:00:00Z'),
    updated: new Date('2024-01-15T10:30:00Z'),
    des_facet: ['Technology', 'Innovation'],
    org_facet: ['Tech Corp'],
    per_facet: ['John Doe'],
    geo_facet: ['New York'],
    multimedia: {
      caption: 'Test image caption',
      copyright: '2024 Test Copyright',
      url2: 'https://example.com/image2.jpg',
      url3: 'https://example.com/image3.jpg',
    },
  };

  beforeEach(() => {
    vi.mocked(formatDate).mockReturnValue('15.01.2024');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic rendering', () => {
    it('renders without crashing', () => {
      render(<NewsItem item={mockItem} />);
      expect(screen.getByText('Test News Title')).toBeInTheDocument();
    });

    it('renders with isMain=false by default', () => {
      render(<NewsItem item={mockItem} />);
      const container = document.querySelector('.news__main');
      expect(container).toHaveClass('_small');
    });

    it('renders with isMain=true when prop is provided', () => {
      render(<NewsItem item={mockItem} isMain={true} />);
      const container = document.querySelector('.news__main');
      expect(container).not.toHaveClass('_small');
    });
  });

  describe('Content rendering', () => {
    it('displays news title correctly', () => {
      render(<NewsItem item={mockItem} />);
      expect(screen.getByText('Test News Title')).toBeInTheDocument();
    });

    it('displays news abstract correctly', () => {
      render(<NewsItem item={mockItem} />);
      expect(screen.getByText('This is a test abstract for the news article')).toBeInTheDocument();
    });

    it('displays formatted date using updated field', () => {
      render(<NewsItem item={mockItem} />);
      expect(formatDate).toHaveBeenCalledWith(mockItem.updated);
      expect(screen.getByText('15.01.2024')).toBeInTheDocument();
    });

    it('displays source when isMain is true', () => {
      render(<NewsItem item={mockItem} isMain={true} />);
      expect(screen.getByText('Test Source')).toBeInTheDocument();
    });

    it('does not display source when isMain is false', () => {
      render(<NewsItem item={mockItem} isMain={false} />);
      expect(screen.queryByText('Test Source')).not.toBeInTheDocument();
    });

    it('displays byline only when isMain is true', () => {
      render(<NewsItem item={mockItem} isMain={true} />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('does not display byline when isMain is false', () => {
      render(<NewsItem item={mockItem} isMain={false} />);
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  describe('Image rendering', () => {
    it('uses url2 image when isMain is false', () => {
      render(<NewsItem item={mockItem} isMain={false} />);
      const img = screen.getByAltText('Test News Title');
      expect(img).toHaveAttribute('src', mockItem.multimedia.url2);
    });

    it('uses url3 image when isMain is true', () => {
      render(<NewsItem item={mockItem} isMain={true} />);
      const img = screen.getByAltText('Test News Title');
      expect(img).toHaveAttribute('src', mockItem.multimedia.url3);
    });

    it('has correct alt text', () => {
      render(<NewsItem item={mockItem} />);
      const img = screen.getByAltText('Test News Title');
      expect(img).toBeInTheDocument();
    });
  });

  describe('Links and navigation', () => {
    it('renders redirect button with correct href', () => {
      render(<NewsItem item={mockItem} />);
      const redirectBtn = document.querySelector('.news__redirect-btn');
      expect(redirectBtn).toBeInTheDocument();
      expect(redirectBtn).toHaveAttribute('href', mockItem.url);
      expect(redirectBtn).toHaveAttribute('target', '_blank');
      expect(redirectBtn).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders link icon with correct href', () => {
      render(<NewsItem item={mockItem} />);
      const link = document.querySelector('.news__link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', mockItem.url);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('both links open in new tab with security attributes', () => {
      render(<NewsItem item={mockItem} />);
      const redirectBtn = document.querySelector('.news__redirect-btn');
      const linkIcon = document.querySelector('.news__link');
      
      expect(redirectBtn).toHaveAttribute('target', '_blank');
      expect(redirectBtn).toHaveAttribute('rel', 'noopener noreferrer');
      expect(linkIcon).toHaveAttribute('target', '_blank');
      expect(linkIcon).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Conditional classes', () => {
    it('applies _small class to main-info when isMain is false', () => {
      render(<NewsItem item={mockItem} isMain={false} />);
      const infoDiv = document.querySelector('.news__main-info');
      expect(infoDiv).toHaveClass('_small');
    });

    it('does not apply _small class to main-info when isMain is true', () => {
      render(<NewsItem item={mockItem} isMain={true} />);
      const infoDiv = document.querySelector('.news__main-info');
      expect(infoDiv).not.toHaveClass('_small');
    });
  });

  describe('User interactions', () => {
    it('redirect button is clickable', () => {
      render(<NewsItem item={mockItem} />);
      const redirectBtn = document.querySelector('.news__redirect-btn') as HTMLAnchorElement;
      expect(redirectBtn).toBeInTheDocument();
      expect(redirectBtn.href).toBe(mockItem.url);
    });

    it('link icon is clickable', () => {
      render(<NewsItem item={mockItem} />);
      const link = document.querySelector('.news__link') as HTMLAnchorElement;
      expect(link).toBeInTheDocument();
      expect(link.href).toBe(mockItem.url);
    });
  });

  describe('Edge cases', () => {
    it('handles missing multimedia object', () => {
      const itemWithoutMultimedia = {
        ...mockItem,
        multimedia: {
          caption: '',
          copyright: '',
        },
      };
      
      render(<NewsItem item={itemWithoutMultimedia} />);
      const img = screen.getByAltText('Test News Title');
      expect(img).toBeInTheDocument();
    });

    it('handles very long text content', () => {
      const longTextItem: NewsProps = {
        ...mockItem,
        title: 'A'.repeat(500),
        abstract: 'B'.repeat(1000),
      };
      
      render(<NewsItem item={longTextItem} />);
      expect(screen.getByText(longTextItem.title)).toBeInTheDocument();
      expect(screen.getByText(longTextItem.abstract)).toBeInTheDocument();
    });

    it('handles special characters in content', () => {
      const specialCharsItem: NewsProps = {
        ...mockItem,
        title: 'Test & < > " \' News',
        abstract: 'Abstract with &amp; <tags> and "quotes"',
      };
      
      render(<NewsItem item={specialCharsItem} />);
      expect(screen.getByText('Test & < > " \' News')).toBeInTheDocument();
    });

    it('formats date correctly even with invalid date', () => {
      const invalidDateItem: NewsProps = {
        ...mockItem,
        updated: new Date('invalid-date'),
      };
      
      vi.mocked(formatDate).mockReturnValue('Invalid date');
      render(<NewsItem item={invalidDateItem} />);
      expect(formatDate).toHaveBeenCalledWith(invalidDateItem.updated);
      expect(screen.getByText('Invalid date')).toBeInTheDocument();
    });

    it('handles empty facet arrays', () => {
      const itemWithEmptyFacets: NewsProps = {
        ...mockItem,
        des_facet: [],
        org_facet: [],
        per_facet: [],
        geo_facet: [],
      };
      
      render(<NewsItem item={itemWithEmptyFacets} />);
      expect(screen.getByText('Test News Title')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has alt text for images', () => {
      render(<NewsItem item={mockItem} />);
      const img = screen.getByAltText('Test News Title');
      expect(img).toHaveAttribute('alt', mockItem.title);
    });

    it('has title attribute on redirect button', () => {
      render(<NewsItem item={mockItem} />);
      const redirectBtn = document.querySelector('.news__redirect-btn');
      expect(redirectBtn).toHaveAttribute('title', 'Redirect to news');
    });

    it('has semantic HTML structure', () => {
      render(<NewsItem item={mockItem} />);
      
      // Проверяем наличие заголовка h3
      const heading = document.querySelector('h3.news__title');
      expect(heading).toBeInTheDocument();
      expect(heading?.textContent).toBe('Test News Title');
      
      // Проверяем наличие абзацев
      const paragraphs = document.querySelectorAll('p.news__text');
      expect(paragraphs.length).toBeGreaterThan(0);
    });
  });
});
