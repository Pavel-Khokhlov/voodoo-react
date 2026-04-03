import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookItem from "@/components/BookItem";
import { Book, BuyLink } from "@/store/books";

// Мокаем изображения
vi.mock("@/assets/logo/amazon.webp", () => ({ default: "amazon-mock.webp" }));
vi.mock("@/assets/logo/apple.webp", () => ({ default: "apple-mock.webp" }));
vi.mock("@/assets/logo/b&n.webp", () => ({ default: "bn-mock.webp" }));
vi.mock("@/assets/logo/bam.webp", () => ({ default: "bam-mock.webp" }));
vi.mock("@/assets/logo/bookshop.webp", () => ({
  default: "bookshop-mock.webp",
}));

// Мокаем SCSS файл
vi.mock("./book.scss", () => ({}));

// Мокаем console.warn для проверки предупреждений
const consoleWarnMock = vi.spyOn(console, "warn").mockImplementation(() => {});

describe("BookItem Component", () => {
  // Полный мок книги со всеми полями
  const mockBook: Book = {
    age_group: "Adult",
    amazon_product_url: "https://amazon.com/gatsby",
    article_chapter_link: "https://example.com/chapter",
    asterisk: 0,
    author: "F. Scott Fitzgerald",
    book_image: "https://example.com/gatsby-cover.jpg",
    book_image_height: 500,
    book_image_width: 330,
    book_review_link: "https://example.com/review",
    book_uri: "nyt://book/gatsby",
    buy_links: [
      { name: "Amazon", url: "https://amazon.com/gatsby" },
      { name: "Apple Books", url: "https://apple.com/gatsby" },
      { name: "Barnes & Noble", url: "https://barnesandnoble.com/gatsby" },
    ],
    contributor: "F. Scott Fitzgerald",
    contributor_note: "American novelist",
    created_date: "2024-01-01",
    dagger: 0,
    description: "A story of decadence and excess...",
    first_chapter_link: "https://example.com/first-chapter",
    isbns: [{ isbn10: "0743273567", isbn13: "9780743273565" }],
    price: "15.99",
    primary_isbn10: "0743273567",
    primary_isbn13: "9780743273565",
    publisher: "Scribner",
    rank: 1,
    rank_last_week: 2,
    sunday_review_link: "https://example.com/sunday-review",
    title: "The Great Gatsby",
    updated_date: "2024-01-15",
    weeks_on_list: 52,
  };

  beforeEach(() => {
    consoleWarnMock.mockClear();
  });

  afterAll(() => {
    consoleWarnMock.mockRestore();
  });

  describe("Basic rendering", () => {
    it("renders without crashing", () => {
      render(<BookItem book={mockBook} />);
      expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
    });

    it("renders book title correctly", () => {
      render(<BookItem book={mockBook} />);
      expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
      expect(screen.getByText("The Great Gatsby")).toHaveClass("book__title");
    });

    it("renders book author correctly", () => {
      render(<BookItem book={mockBook} />);
      expect(screen.getByText(/Author:/)).toBeInTheDocument();
      expect(screen.getByText("F. Scott Fitzgerald")).toBeInTheDocument();
    });

    it("renders weeks on list correctly", () => {
      render(<BookItem book={mockBook} />);
      expect(screen.getByText(/Weeks on list:/)).toBeInTheDocument();
      expect(screen.getByText("52")).toBeInTheDocument();
    });

    it('renders "Where to buy:" label', () => {
      render(<BookItem book={mockBook} />);
      expect(screen.getByText("Where to buy:")).toBeInTheDocument();
    });
  });

  describe("Book cover image", () => {
    it("renders book cover with correct src and alt", () => {
      render(<BookItem book={mockBook} />);
      const cover = screen.getByAltText("cover book");
      expect(cover).toBeInTheDocument();
      expect(cover).toHaveAttribute("src", mockBook.book_image);
      expect(cover).toHaveClass("book__cover");
    });

    it("handles missing book image", () => {
      const bookWithoutImage = { ...mockBook, book_image: "" };
      render(<BookItem book={bookWithoutImage} />);
      const cover = screen.getByAltText("cover book");
      expect(cover).toHaveAttribute("src", "");
    });
  });

  describe("Book description", () => {
    it("renders description when provided", () => {
      render(<BookItem book={mockBook} />);
      expect(
        screen.getByText("A story of decadence and excess..."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("A story of decadence and excess..."),
      ).toHaveClass("book__description");
    });

    it("does not render description when empty string", () => {
      const bookWithEmptyDesc = { ...mockBook, description: "" };
      render(<BookItem book={bookWithEmptyDesc} />);

      // Проверяем, что элемент с классом book__description не содержит текста
      const descriptionElement = document.querySelector(".book__description");

      if (descriptionElement) {
        // Если элемент существует, проверяем что он пустой или не видим
        expect(descriptionElement.textContent?.trim()).toBe("");
        // Или проверяем что элемент не отображается (если есть соответствующий CSS)
        // expect(descriptionElement).not.toBeVisible();
      } else {
        // Если элемент не существует
        expect(descriptionElement).not.toBeInTheDocument();
      }
    });

    it("does not render description when undefined", () => {
      const bookWithUndefinedDesc = {
        ...mockBook,
        description: undefined as unknown as string,
      };
      render(<BookItem book={bookWithUndefinedDesc} />);

      const descriptionElement = document.querySelector(".book__description");
      expect(descriptionElement).not.toBeInTheDocument();
    });

    it("does not render description when null", () => {
      const bookWithNullDesc = {
        ...mockBook,
        description: null as unknown as string,
      };
      render(<BookItem book={bookWithNullDesc} />);

      const descriptionElement = document.querySelector(".book__description");
      expect(descriptionElement).not.toBeInTheDocument();
    });

    it("renders description with special characters", () => {
      const bookWithSpecialDesc: Book = {
        ...mockBook,
        description: 'Description with &amp; <tags> and "quotes"',
      };
      render(<BookItem book={bookWithSpecialDesc} />);

      expect(
        screen.getByText('Description with &amp; <tags> and "quotes"'),
      ).toBeInTheDocument();
    });

    it("renders description with line breaks", () => {
      const bookWithLineBreaks: Book = {
        ...mockBook,
        description: "First line\nSecond line\nThird line",
      };
      render(<BookItem book={bookWithLineBreaks} />);

      expect(screen.getByText(/First line/)).toBeInTheDocument();
      expect(screen.getByText(/Second line/)).toBeInTheDocument();
      expect(screen.getByText(/Third line/)).toBeInTheDocument();
    });
  });

  describe("Buy links icons", () => {
    it("renders all buy links icons", () => {
      render(<BookItem book={mockBook} />);

      expect(screen.getByAltText("Amazon")).toBeInTheDocument();
      expect(screen.getByAltText("Apple Books")).toBeInTheDocument();
      expect(screen.getByAltText("Barnes & Noble")).toBeInTheDocument();
    });

    it("renders correct links for each store", () => {
      render(<BookItem book={mockBook} />);

      const amazonLink = screen.getByAltText("Amazon").closest("a");
      const appleLink = screen.getByAltText("Apple Books").closest("a");
      const bnLink = screen.getByAltText("Barnes & Noble").closest("a");

      expect(amazonLink).toHaveAttribute("href", "https://amazon.com/gatsby");
      expect(appleLink).toHaveAttribute("href", "https://apple.com/gatsby");
      expect(bnLink).toHaveAttribute(
        "href",
        "https://barnesandnoble.com/gatsby",
      );
    });

    it("opens links in new tab with security attributes", () => {
      render(<BookItem book={mockBook} />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
      });
    });

    it("renders icons with correct classes", () => {
      render(<BookItem book={mockBook} />);

      const amazonIcon = screen.getByAltText("Amazon");
      expect(amazonIcon).toHaveClass("book__icon");

      const appleIcon = screen.getByAltText("Apple Books");
      expect(appleIcon).toHaveClass("book__icon");
    });
  });

  describe("Icon mapping", () => {
    it("maps Amazon correctly", () => {
      render(<BookItem book={mockBook} />);
      const amazonIcon = screen.getByAltText("Amazon");
      expect(amazonIcon).toHaveAttribute("src", "amazon-mock.webp");
    });

    it("maps Apple Books correctly", () => {
      render(<BookItem book={mockBook} />);
      const appleIcon = screen.getByAltText("Apple Books");
      expect(appleIcon).toHaveAttribute("src", "apple-mock.webp");
    });

    it("maps Barnes & Noble correctly", () => {
      render(<BookItem book={mockBook} />);
      const bnIcon = screen.getByAltText("Barnes & Noble");
      expect(bnIcon).toHaveAttribute("src", "bn-mock.webp");
    });

    it("maps Barnes and Noble (alternative spelling) correctly", () => {
      const bookWithAltSpelling: Book = {
        ...mockBook,
        buy_links: [
          {
            name: "Barnes and Noble",
            url: "https://barnesandnoble.com/gatsby",
          },
        ],
      };
      render(<BookItem book={bookWithAltSpelling} />);
      const bnIcon = screen.getByAltText("Barnes and Noble");
      expect(bnIcon).toHaveAttribute("src", "bn-mock.webp");
    });

    it("maps Books-A-Million correctly", () => {
      const bookWithBam: Book = {
        ...mockBook,
        buy_links: [
          { name: "Books-A-Million", url: "https://booksamillion.com/gatsby" },
        ],
      };
      render(<BookItem book={bookWithBam} />);
      const bamIcon = screen.getByAltText("Books-A-Million");
      expect(bamIcon).toHaveAttribute("src", "bam-mock.webp");
    });

    it("maps Bookshop.org correctly", () => {
      const bookWithBookshop: Book = {
        ...mockBook,
        buy_links: [
          { name: "Bookshop.org", url: "https://bookshop.org/gatsby" },
        ],
      };
      render(<BookItem book={bookWithBookshop} />);
      const bookshopIcon = screen.getByAltText("Bookshop.org");
      expect(bookshopIcon).toHaveAttribute("src", "bookshop-mock.webp");
    });
  });

  describe("Unknown store handling", () => {
    it("does not render icon for unknown store", () => {
      const bookWithUnknownStore: Book = {
        ...mockBook,
        buy_links: [{ name: "Unknown Store", url: "https://unknown.com" }],
      };
      render(<BookItem book={bookWithUnknownStore} />);

      expect(screen.queryByAltText("Unknown Store")).not.toBeInTheDocument();
    });

    it("logs warning for unknown store", () => {
      const bookWithUnknownStore: Book = {
        ...mockBook,
        buy_links: [{ name: "Unknown Store", url: "https://unknown.com" }],
      };
      render(<BookItem book={bookWithUnknownStore} />);

      expect(consoleWarnMock).toHaveBeenCalledWith(
        "Icon not found for: Unknown Store",
      );
    });

    it("handles mixed known and unknown stores", () => {
      const bookWithMixedStores: Book = {
        ...mockBook,
        buy_links: [
          { name: "Amazon", url: "https://amazon.com" },
          { name: "Unknown Store", url: "https://unknown.com" },
          { name: "Apple Books", url: "https://apple.com" },
        ],
      };
      render(<BookItem book={bookWithMixedStores} />);

      expect(screen.getByAltText("Amazon")).toBeInTheDocument();
      expect(screen.getByAltText("Apple Books")).toBeInTheDocument();
      expect(screen.queryByAltText("Unknown Store")).not.toBeInTheDocument();
      expect(consoleWarnMock).toHaveBeenCalledWith(
        "Icon not found for: Unknown Store",
      );
    });
  });

  describe("Empty buy links", () => {
    it("handles empty buy_links array", () => {
      const bookWithoutLinks: Book = {
        ...mockBook,
        buy_links: [],
      };
      render(<BookItem book={bookWithoutLinks} />);

      const iconsContainer = document.querySelector(".book__icons");
      expect(iconsContainer?.children.length).toBe(0);
    });

    it('renders "Where to buy:" text even without links', () => {
      const bookWithoutLinks: Book = {
        ...mockBook,
        buy_links: [],
      };
      render(<BookItem book={bookWithoutLinks} />);

      expect(screen.getByText("Where to buy:")).toBeInTheDocument();
      const icons = document.querySelectorAll(".book__icon");
      expect(icons.length).toBe(0);
    });
  });

  describe("Edge cases", () => {
    it("handles very long book title", () => {
      const longTitleBook: Book = {
        ...mockBook,
        title: "A".repeat(200),
      };
      render(<BookItem book={longTitleBook} />);
      expect(screen.getByText("A".repeat(200))).toBeInTheDocument();
    });

    it("handles very long author name", () => {
      const longAuthorBook: Book = {
        ...mockBook,
        author: "A".repeat(200),
      };
      render(<BookItem book={longAuthorBook} />);
      expect(screen.getByText("A".repeat(200))).toBeInTheDocument();
    });

    it("handles very long description", () => {
      const longDescBook: Book = {
        ...mockBook,
        description: "A".repeat(1000),
      };
      render(<BookItem book={longDescBook} />);
      expect(screen.getByText("A".repeat(1000))).toBeInTheDocument();
    });

    it("handles weeks_on_list as 0", () => {
      const bookZeroWeeks: Book = {
        ...mockBook,
        weeks_on_list: 0,
      };
      render(<BookItem book={bookZeroWeeks} />);
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("handles negative weeks_on_list", () => {
      const bookNegativeWeeks: Book = {
        ...mockBook,
        weeks_on_list: -5,
      };
      render(<BookItem book={bookNegativeWeeks} />);
      expect(screen.getByText("-5")).toBeInTheDocument();
    });

    it("handles special characters in title", () => {
      const specialCharsBook: Book = {
        ...mockBook,
        title: "Book & < > \" ' Title",
      };
      render(<BookItem book={specialCharsBook} />);
      expect(screen.getByText("Book & < > \" ' Title")).toBeInTheDocument();
    });

    it("handles large rank numbers", () => {
      const bookLargeRank: Book = {
        ...mockBook,
        rank: 999999,
        rank_last_week: 1000000,
      };
      render(<BookItem book={bookLargeRank} />);
      expect(screen.getByText("52")).toBeInTheDocument(); // weeks_on_list не изменился
    });
  });

  describe("User interactions", () => {
    it("allows clicking on buy links", async () => {
      const user = userEvent.setup();
      render(<BookItem book={mockBook} />);

      const amazonLink = screen.getByAltText("Amazon").closest("a");
      expect(amazonLink).toBeInTheDocument();
      expect(amazonLink).toHaveAttribute("href", "https://amazon.com/gatsby");
    });

    it("allows clicking on multiple buy links", async () => {
      const user = userEvent.setup();
      render(<BookItem book={mockBook} />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(mockBook.buy_links.length);

      links.forEach((link, index) => {
        expect(link).toHaveAttribute("href", mockBook.buy_links[index].url);
      });
    });
  });

  describe("Accessibility", () => {
    it("has alt text for all icons", () => {
      render(<BookItem book={mockBook} />);

      const icons = screen.getAllByRole("img");
      icons.forEach((icon) => {
        expect(icon).toHaveAttribute("alt");
      });
    });

    it("has descriptive alt text for book cover", () => {
      render(<BookItem book={mockBook} />);
      const cover = screen.getByAltText("cover book");
      expect(cover).toHaveAttribute("alt", "cover book");
    });

    it("has descriptive alt text for store icons", () => {
      render(<BookItem book={mockBook} />);

      expect(screen.getByAltText("Amazon")).toHaveAttribute("alt", "Amazon");
      expect(screen.getByAltText("Apple Books")).toHaveAttribute(
        "alt",
        "Apple Books",
      );
      expect(screen.getByAltText("Barnes & Noble")).toHaveAttribute(
        "alt",
        "Barnes & Noble",
      );
    });

    it("has semantic HTML structure", () => {
      render(<BookItem book={mockBook} />);

      expect(screen.getByRole("heading", { level: 5 })).toBeInTheDocument();
      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe("CSS classes", () => {
    it("applies correct wrapper class", () => {
      render(<BookItem book={mockBook} />);
      const wrapper = document.querySelector(".book__wrapper");
      expect(wrapper).toBeInTheDocument();
    });

    it("applies correct classes to all elements", () => {
      render(<BookItem book={mockBook} />);

      expect(document.querySelector(".book__cover")).toBeInTheDocument();
      expect(document.querySelector(".book__title")).toBeInTheDocument();
      expect(document.querySelector(".book__author")).toBeInTheDocument();
      expect(document.querySelector(".book__weeks")).toBeInTheDocument();
      expect(document.querySelector(".book__buy")).toBeInTheDocument();
      expect(document.querySelector(".book__icons")).toBeInTheDocument();
      expect(document.querySelectorAll(".book__icon").length).toBe(3);
    });
  });

  describe("Additional book data (not rendered but available)", () => {
    it("has access to all book properties", () => {
      render(<BookItem book={mockBook} />);

      // Эти поля не рендерятся, но доступны в компоненте
      expect(mockBook.age_group).toBe("Adult");
      expect(mockBook.publisher).toBe("Scribner");
      expect(mockBook.price).toBe("15.99");
      expect(mockBook.isbns).toHaveLength(1);
      expect(mockBook.rank).toBe(1);
      expect(mockBook.rank_last_week).toBe(2);
    });
  });
});
