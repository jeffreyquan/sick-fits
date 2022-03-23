import { render, screen } from "@testing-library/react";
import wait from "waait";
import CardCount from "../components/CartCount";

describe("<CardCount/>", () => {
  it("renders", () => {
    render(<CardCount count={10} />);
  });

  it("matches snapshot", () => {
    const { container } = render(<CardCount count={11} />);
    expect(container).toMatchSnapshot();
  });

  it("updates via props", async () => {
    const { container, rerender } = render(<CardCount count={11} />);
    expect(container).toHaveTextContent("11");
    // Update the props
    rerender(<CardCount count="12" />);
    // await for __ ms
    // await wait(400);
    expect(container).toHaveTextContent("1211");
    await screen.findByText("12");
    expect(container).toHaveTextContent("12");
    expect(container).toMatchSnapshot();
  });
});
