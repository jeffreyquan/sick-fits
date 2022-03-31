import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import Router from "next/router";
import CreateProduct, {
  CREATE_PRODUCT_MUTATION,
} from "../components/CreateProduct";
import { fakeItem, makePaginationMocksFor } from "../lib/testUtils";
import { ALL_PRODUCTS_QUERY } from "../components/Products";
import wait from "waait";

const item = fakeItem();

jest.mock("next/router", () => ({
  push: jest.fn(),
}));

describe("<CreateProduct />", () => {
  it("renders and matches snapshot", () => {
    const { container } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("handles the updating", async () => {
    // 1. Render the form
    const { container } = render(
      <MockedProvider>
        <CreateProduct />
      </MockedProvider>
    );

    // 2. Type into the boxes
    await userEvent.type(screen.getByPlaceholderText(/Name/i), item.name);
    userEvent.clear(screen.getByPlaceholderText(/Price/i));
    await userEvent.type(
      screen.getByPlaceholderText(/Price/i),
      item.price.toString()
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Description/i),
      item.description
    );

    // 3. Check that those boxes are populated
    expect(screen.getByDisplayValue(item.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.price)).toBeInTheDocument();
    expect(screen.getByDisplayValue(item.description)).toBeInTheDocument();
  });

  it("creates the items when the form is submitted", async () => {
    // Create the mocks for this one
    const mocks = [
      {
        request: {
          query: CREATE_PRODUCT_MUTATION,
          variables: {
            name: item.name,
            description: item.description,
            image: "",
            price: item.price,
          },
        },
        result: {
          data: {
            createProduct: {
              ...item, // all fake item fields
              id: "abc123",
              __typename: "Item",
            },
          },
        },
      },
      {
        request: {
          query: ALL_PRODUCTS_QUERY,
          variables: {
            skip: 0,
            first: 2,
          },
        },
        result: {
          data: {
            allProducts: [item],
          },
        },
      },
    ];

    const { container } = render(
      <MockedProvider mocks={mocks}>
        <CreateProduct />
      </MockedProvider>
    );

    // Type into the inputs
    await userEvent.type(screen.getByPlaceholderText(/Name/i), item.name);
    userEvent.clear(screen.getByPlaceholderText(/Price/i));
    await userEvent.type(
      screen.getByPlaceholderText(/Price/i),
      item.price.toString()
    );
    await userEvent.type(
      screen.getByPlaceholderText(/Description/i),
      item.description
    );

    // Submit it and see if the page change has been called
    await userEvent.click(screen.getByText(/Add Product/i));
    await waitFor(() => wait(0));
    expect(Router.push).toHaveBeenCalled();
    expect(Router.push).toHaveBeenCalledWith({ pathname: "/product/abc123" });
  });
});
