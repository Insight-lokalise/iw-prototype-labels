import React from 'react'
import { act, render, screen } from '@testing-library/react'
import AddNewCardPM from './AddNewCardPM'

jest.mock('@insight/toolkit-utils/lib/labels', ()=>({
  t: jest.fn(string => string)
}))

describe('<AddNewCardPM>', () => {
  const promise = Promise.resolve()
  const setPaymentState = jest.fn()
  const resultCallback = jest.fn()

  // 1. REQUESTOR - requestor_enter_cc is OFF and checkbox is unchecked
  it('Render required card information checkbox when requestor is not forced to enter CC information', () => {
    const { queryByTestId } = render(
      <AddNewCardPM
        availableCardTypes={[]}
        canSaveCard
        setPaymentState={setPaymentState}
        addToStoredCards={false}
        isDefaultCard={false}
        isPaymetricReady
        isPaymentRequired={false}
        isProcurementCard={false}
        locale={'en_US'}
        resultCallback={resultCallback}
        storedCardDesc={''}
        requireCardInfo={false}
        featureFlags={{}}
      />
    )
    const storedCheckbox = screen.getByLabelText('Enter new card information');
    expect(storedCheckbox).toBeInTheDocument();
    expect(storedCheckbox).not.toBeChecked();
    expect(queryByTestId("c-paymetric-custom-html")).not.toBeInTheDocument();
  });

  // 2. REQUESTOR - requestor_enter_cc is OFF and checkbox is checked
  it('should render PaymetricIFrame with add stored cards checkbox unchecked when required card information checkbox is checked', async () => {
    const { getByTestId } = render(
      <AddNewCardPM
        availableCardTypes={[]}
        canSaveCard
        setPaymentState={setPaymentState}
        addToStoredCards={false}
        isDefaultCard={false}
        isPaymetricReady
        isPaymentRequired={false}
        isProcurementCard={false}
        locale={'en_US'}
        resultCallback={resultCallback}
        storedCardDesc={''}
        requireCardInfo
        featureFlags={{}}
      />
    )
    const storedCheckbox = screen.getByLabelText('Enter new card information');
    expect(storedCheckbox).toBeInTheDocument();
    expect(storedCheckbox).toBeChecked();
    expect(getByTestId("c-paymetric-custom-html")).toBeInTheDocument();
    await act(() => promise)
    const storedCards = screen.getByLabelText('Add to my stored cards');
    expect(storedCards).toBeInTheDocument();
    expect(storedCards).not.toBeChecked();
  });

  // 3. REQUESTOR - requestor_enter_cc is ON , always display payment section
  it('should render PaymetricIFrame with add stored cards checkbox unchecked when requestor_enter_cc is ON', async () => {
    const { getByTestId } = render(
      <AddNewCardPM
        availableCardTypes={[]}
        canSaveCard
        setPaymentState={setPaymentState}
        addToStoredCards={false}
        isDefaultCard={false}
        isPaymetricReady
        isPaymentRequired
        isProcurementCard={false}
        locale={'en_US'}
        resultCallback={resultCallback}
        storedCardDesc={''}
        requireCardInfo
        featureFlags={{}}
      />
    )
    expect(getByTestId("c-paymetric-custom-html")).toBeInTheDocument();
    await act(() => promise)
    const storedCards = screen.getByLabelText('Add to my stored cards');
    expect(storedCards).toBeInTheDocument();
    expect(storedCards).not.toBeChecked();
  });

  // 4. General users - Always load paymetric section if its non-EMEA
  it('Should render Stored card description & set as default checkbox when Add to stored cards checked', async () => {
    const { container, getByTestId } = render(
      <AddNewCardPM
        availableCardTypes={[]}
        canSaveCard
        setPaymentState={setPaymentState}
        addToStoredCards
        isDefaultCard={false}
        isPaymetricReady
        isPaymentRequired
        isProcurementCard={false}
        locale={'en_US'}
        resultCallback={resultCallback}
        storedCardDesc={''}
        requireCardInfo
        featureFlags={{}}
      />
    )
    expect(getByTestId("c-paymetric-custom-html")).toBeInTheDocument();
    await act(() => promise)
    const storedCards = screen.getByLabelText('Add to my stored cards');
    expect(storedCards).toBeInTheDocument();
    expect(storedCards).toBeChecked();
    expect(container.querySelector('[name="storedCardDesc"]')).toHaveValue('');
    const setDefault = screen.getByLabelText('Set as default');
    expect(setDefault).toBeInTheDocument();
    expect(setDefault).not.toBeChecked();
  });

  // 5. General
  it('Hide Stored card description & set as default checkbox when Add to stored cards checkbox unchecked', async () => {
    const { container, getByTestId } = render(
      <AddNewCardPM
        availableCardTypes={[]}
        canSaveCard
        setPaymentState={setPaymentState}
        addToStoredCards={false}
        isDefaultCard={false}
        isPaymetricReady
        isPaymentRequired
        isProcurementCard={false}
        locale={'en_US'}
        resultCallback={resultCallback}
        storedCardDesc={''}
        requireCardInfo
        featureFlags={{}}
      />
    )
    expect(getByTestId("c-paymetric-custom-html")).toBeInTheDocument();
    await act(() => promise)
    const storedCards = screen.getByLabelText('Add to my stored cards');
    expect(storedCards).toBeInTheDocument();
    expect(storedCards).not.toBeChecked();
    expect(container.querySelector('[name="storedCardDesc"]')).not.toBeInTheDocument();
  });
});




