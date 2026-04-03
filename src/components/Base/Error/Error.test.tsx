import { render, screen } from "@testing-library/react";
import ErrorItem from "@/components/Base/Error";

vi.mock("./error.scss", () => ({}));

describe("ErrorItem", () => {
  // ... другие тесты

  it("handles null error gracefully", () => {
    render(<ErrorItem error={null} />);

    // Проверяем, что нет текста "null" в документе
    // (так как React преобразует null в пустую строку)
    expect(
      screen.queryByText("News loading error: null"),
    ).not.toBeInTheDocument();

    // Проверяем, что если есть элемент, то он не содержит "null"
    const errorElement = screen.queryByText(/News loading error:/);
    if (errorElement) {
      expect(errorElement.textContent).not.toContain("null");
    }
  });
});
