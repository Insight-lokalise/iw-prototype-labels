import React from "react";
import { render } from "@testing-library/react";
import CartHeader from "./CartHeader";

jest.mock("@insight/toolkit-utils/lib/labels", () => {
  return {
    t: jest.fn((string) => string),
  };
});


const setup = async () => {
  const wrapper = render(
    <CartHeader />
  );
  return { ...wrapper };
};

describe("CartHeader", () => {
  test("Renders Cart Header for Shopping Cart page", async () => {
    const { container, getByText, getByTestId } = await setup();
    expect(getByText("Cart")).toBeInTheDocument();
  });
});
