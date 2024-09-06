import React from "react";
import { render } from "@testing-library/react";
import { BREADCRUMBS } from "@constants";
import AccountCenterBreadcrumb from "./AccountCenterBreadcrumb";

jest.mock("@insight/toolkit-utils/lib/labels", () => {
  return {
    t: jest.fn((string) => string),
  };
});

self.origin = "localhost";
const setup = async ({ breadcrumb, routeName }) => {
  const wrapper = render(
    <AccountCenterBreadcrumb breadcrumb={breadcrumb} routeName={routeName} />
  );
  return { ...wrapper };
};

describe("Breadcrumb", () => {
  test("Renders breadcrumb for My account page", async () => {
    const { container, getByText, getByTestId } = await setup({
      breadcrumb: BREADCRUMBS.MY_ACCOUNT,
      routeName: "Account settings",
    });
    expect(getByTestId("breadcrumb")).toBeInTheDocument();
    expect(getByText("Home")).toBeInTheDocument();
    expect(getByText("Account settings")).toBeInTheDocument();
    expect(container.getElementsByClassName("c-breadcrumbs__link").length).toBe(
      1
    );
  });

  test("Renders breadcrumb for manage address page", async () => {
    const { container, getByText, getByTestId } = await setup({
      breadcrumb: BREADCRUMBS.MANAGE_ADDRESS,
      routeName: "Manage addresses",
    });
    expect(getByTestId("breadcrumb")).toBeInTheDocument();
    expect(getByText("Home")).toBeInTheDocument();
    expect(getByText("Account settings")).toBeInTheDocument();
    expect(getByText("Manage addresses")).toBeInTheDocument();
    expect(container.getElementsByClassName("c-breadcrumbs__link").length).toBe(
      2
    );
  });

  test("Renders breadcrumb for add new address page", async () => {
    const { container, getByText, getByTestId } = await setup({
      breadcrumb: BREADCRUMBS.ADD_ADDRESS,
      routeName: "Add address",
    });
    expect(getByTestId("breadcrumb")).toBeInTheDocument();
    expect(getByText("Home")).toBeInTheDocument();
    expect(getByText("Account settings")).toBeInTheDocument();
    expect(getByText("Manage addresses")).toBeInTheDocument();
    expect(getByText("Add address")).toBeInTheDocument();
    expect(container.getElementsByClassName("c-breadcrumbs__link").length).toBe(
      3
    );
  });

  test("Renders breadcrumb for manage payment page", async () => {
    const { container, getByText, getByTestId } = await setup({
      breadcrumb: BREADCRUMBS.MANAGE_PAYMENT,
      routeName: "Manage payments",
    });
    expect(getByTestId("breadcrumb")).toBeInTheDocument();
    expect(getByText("Home")).toBeInTheDocument();
    expect(getByText("Account settings")).toBeInTheDocument();
    expect(getByText("Manage payments")).toBeInTheDocument();
    expect(container.getElementsByClassName("c-breadcrumbs__link").length).toBe(
      2
    );
  });

  test("Renders breadcrumb for add new payment page", async () => {
    const { container, getByText, getByTestId } = await setup({
      breadcrumb: BREADCRUMBS.ADD_PAYMENT,
      routeName: "Add card",
    });
    expect(getByTestId("breadcrumb")).toBeInTheDocument();
    expect(getByText("Home")).toBeInTheDocument();
    expect(getByText("Account settings")).toBeInTheDocument();
    expect(getByText("Manage payments")).toBeInTheDocument();
    expect(getByText("Add card")).toBeInTheDocument();
    expect(container.getElementsByClassName("c-breadcrumbs__link").length).toBe(
      3
    );
  });

  test("Renders breadcrumb for edit payment page", async () => {
    const { container, getByText, getByTestId } = await setup({
      breadcrumb: BREADCRUMBS.EDIT_PAYMENT,
      routeName: "Edit card",
    });
    expect(getByTestId("breadcrumb")).toBeInTheDocument();
    expect(getByText("Home")).toBeInTheDocument();
    expect(getByText("Account settings")).toBeInTheDocument();
    expect(getByText("Manage payments")).toBeInTheDocument();
    expect(getByText("Edit card")).toBeInTheDocument();
    expect(container.getElementsByClassName("c-breadcrumbs__link").length).toBe(
      3
    );
  });
});
