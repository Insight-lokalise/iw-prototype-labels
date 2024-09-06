import React from "react";
import { render } from "@testing-library/react";
import EmptyCart from "./EmptyCart";

jest.mock("@insight/toolkit-utils/lib/labels", () => {
  return {
    t: jest.fn((string) => string),
  };
});


const setup = async (locale='en_US') => {
  const wrapper = render(
    <EmptyCart locale={locale}/>
  );
  return { ...wrapper };
};

describe("Empty Cart", () => {
  test("Renders Empty Cart", async () => {
    const { container, getByText, getByTestId } = await setup();
    expect(getByText("There are no items in your cart.")).toBeInTheDocument();
  });

  test("Renders Empty Cart with help links", async () => {
    const locale = 'en_US'
    const { container, getByText, getByTestId } = await setup(locale);
    expect(getByText("There are no items in your cart.")).toBeInTheDocument();
    expect(getByText('Shop all hardware').closest('a')).toHaveAttribute('href', `/content/insight-web/${locale}/shop/hardware.html`)
    expect(getByText('Shop all software').closest('a')).toHaveAttribute('href', `/content/insight-web/${locale}/shop/software.html`)
    expect(getByText('Shop all brands').closest('a')).toHaveAttribute('href', `/content/insight-web/${locale}/shop/partner.html`)
  });
});
