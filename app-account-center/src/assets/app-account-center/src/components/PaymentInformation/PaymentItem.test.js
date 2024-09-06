import React from "react";
import { render } from "@testing-library/react";

import PaymentItem from "./PaymentItem";

const card = {
  storedCardId: 540249,
  lpWebLoginProfileId: 5752851,
  storedCardDesc: "test card 1",
  storedCardHolderName: "test 1",
  storedCardToken: "************1111",
  worldPayToken: null,
  storedCardExpMonth: 1,
  storedCardExpYear: 2023,
  storedCardType: "VISA",
  isDefaultCard: false,
  storedCardMethodId: 2,
  storedCardPoNum: null,
  displayCardNum: "************1111",
  createdOn: 1641599695883,
  updatedOn: 1641599695883,
  exceptionExists: false,
  exceptionsList: null,
  storedCardDetailsChanged: false,
  storedCardNewExpMonth: 0,
  storedCardNewExpYear: 0,
};

const defaultCard = {
  storedCardId: 540249,
  lpWebLoginProfileId: 5752851,
  storedCardDesc: "test card 1",
  storedCardHolderName: "test 1",
  storedCardToken: "************1111",
  worldPayToken: null,
  storedCardExpMonth: 1,
  storedCardExpYear: 2023,
  storedCardType: "VISA",
  isDefaultCard: true,
  storedCardMethodId: 2,
  storedCardPoNum: null,
  displayCardNum: "************1111",
  createdOn: 1641599695883,
  updatedOn: 1641599695883,
  exceptionExists: false,
  exceptionsList: null,
  storedCardDetailsChanged: false,
  storedCardNewExpMonth: 0,
  storedCardNewExpYear: 0,
};

const setup = async ({ isCreditCard, card }) => {
  const deleteCardHandler = jest.fn();
  const updateDefaultCardHandler = jest.fn();

  const wrapper = render(
    <PaymentItem
      card={card}
      method={isCreditCard ? 2 : 3}
      deletePaymentHandler={deleteCardHandler}
      setDefaultCard={updateDefaultCardHandler}
    />
  );

  return { ...wrapper };
};

describe("Payment Item", () => {
  test("renders non-default card", async () => {
    const { getByText, getByTestId, queryByText } = await setup({
      isCreditCard: true,
      card,
    });

    const defaultLozenge = queryByText("Default");
    const deleteButton = getByTestId("card-delete-button-540249");
    const editButton = getByTestId("card-edit-button-540249");

    expect(defaultLozenge).not.toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
    expect(getByText("Set as default")).toBeInTheDocument();
  });

  test("renders default card", async () => {
    const { getByText, getByTestId, queryByText } = await setup({
      isCreditCard: true,
      card: defaultCard,
    });

    const editButton = getByTestId("card-edit-button-540249");

    expect(queryByText("Set as default")).not.toBeInTheDocument();

    expect(getByText("Default")).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
  });
});
