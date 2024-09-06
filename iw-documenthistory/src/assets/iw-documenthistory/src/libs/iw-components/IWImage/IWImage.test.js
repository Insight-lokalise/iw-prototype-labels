import React from "react";
import { render } from "@testing-library/react";
import { IWImage } from "./IWImage";

describe("IWImage", () => {
  it("should default src if none is provided", () => {
    const { getByRole } = render(<IWImage />);
    const image = getByRole("img");
    expect(image).toHaveAttribute("class", "c-image__fallback");
  });

  it("should match the previous snapshot", () => {
    const { asFragment } = render(<IWImage alt="sm" custom="prop" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
