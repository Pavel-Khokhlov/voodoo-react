import { render, screen } from "@testing-library/react";
import Loader from "@/components/Base/Loader";

vi.mock("./loader.scss", () => ({}));

describe("Loader", () => {
  it("renders without crashing", () => {
    render(<Loader />);
    expect(document.querySelector(".spinner")).toBeInTheDocument();
  });

  it("displays loading text", () => {
    render(<Loader />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders three spinner inner divs", () => {
    render(<Loader />);
    expect(document.querySelectorAll(".inner")).toHaveLength(3);
  });

  it("has correct classes for inner divs", () => {
    render(<Loader />);
    expect(document.querySelector(".inner.one")).toBeInTheDocument();
    expect(document.querySelector(".inner.two")).toBeInTheDocument();
    expect(document.querySelector(".inner.three")).toBeInTheDocument();
  });

  it("has loading text with correct class", () => {
    render(<Loader />);
    const textElement = document.querySelector(".spinner__text");
    expect(textElement).toBeInTheDocument();
    expect(textElement?.textContent).toBe("Loading...");
  });
});
