import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url === "/api/products") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              name: "Beautiful flower bouquet shaped as a heart",
              imageUrl: "https://static.bonniernews.se/ba/4fc79006.jpeg",
            },
            {
              id: 2,
              name: "Mix of flowers",
              imageUrl: "https://hitta.florist/images/mix.jpg",
            },
          ]),
      });
    }

    return Promise.reject(new Error(`Unhandled fetch URL: ${url}`));
  });

  const mockLocalStorage = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => {
        store[key] = value.toString();
      },
      clear: () => {
        store = {};
      },
    };
  })();
  Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage,
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

//Test to check if loading screen appears before the products are loaded.
test("displays loading message initially", async () => {
  render(<Home />);

  const loadingMessage = screen.getByText(/Vänligen vänta, laddar.../i);
  expect(loadingMessage).toBeInTheDocument();

  const productImage1 = await screen.findByAltText(
    "Beautiful flower bouquet shaped as a heart"
  );

  await waitFor(() => {
    expect(loadingMessage).toBeInTheDocument();
  });

  expect(productImage1).toBeInTheDocument();
});

//checks that the products appear on the page.
test("fetches and displays products after loading", async () => {
  render(<Home />);
  const productImage1 = await screen.findByAltText(
    "Beautiful flower bouquet shaped as a heart"
  );
  const productImages = await screen.findAllByAltText("Mix of flowers");

  expect(productImage1).toBeInTheDocument();
  expect(productImages.length).toBeGreaterThan(0); // Covers multiple with same alt
});
