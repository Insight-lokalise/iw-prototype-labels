import React from "react";
import { render } from "@testing-library/react";
import ShoppingCartBreadcrumb from "./ShoppingCartBreadcrumb";

jest.mock("@insight/toolkit-utils/lib/labels", () => {
  return {
    t: jest.fn((string) => string),
  };
});

self.origin = "localhost";
const setup = async () => {
  const wrapper = render(
    <ShoppingCartBreadcrumb />
  );
  return { ...wrapper };
};

describe("Breadcrumb", () => {
  test("Renders breadcrumb for Shopping Cart page", async () => {
    const { container, getByText, getByTestId } = await setup();
    expect(getByTestId("breadcrumb")).toBeInTheDocument();
    expect(getByText("Home")).toBeInTheDocument();
    expect(getByText("Cart")).toBeInTheDocument();
    expect(container.getElementsByClassName("c-breadcrumbs__link").length).toBe(
      1
    );
    expect(container.getElementsByClassName("c-breadcrumbs__name").length).toBe(
      2
    );
  });
});
