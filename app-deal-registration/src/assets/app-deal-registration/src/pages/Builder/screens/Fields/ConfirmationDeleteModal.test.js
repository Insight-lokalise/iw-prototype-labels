import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import ConfirmationDeleteModal from './ConfirmationDeleteModal'

describe('<ConfirmationDeleteModal>', () => {
  const closeModal = jest.fn()
  const removeInput = jest.fn()
  it('should render confirmation modal', () => {
    const { getByText } = render(
      <ConfirmationDeleteModal
        closeModal={closeModal}
        fieldName={''}
        removeInput={removeInput}
      />
    )
    expect(getByText('Please Confirm')).toBeTruthy()
    expect(getByText("No")).toBeTruthy();
    expect(getByText("Yes")).toBeTruthy();
  });

  it('Click on YES removes input and closes the modal', () => {
    const { getByText } = render(
      <ConfirmationDeleteModal
        closeModal={closeModal}
        fieldName={''}
        removeInput={removeInput}
      />
    )
    expect(getByText('Please Confirm')).toBeTruthy();
    fireEvent.click(getByText(/yes/i));
    expect(removeInput).toHaveBeenCalledTimes(1);
  });

  it('Click on NO closes the modal', () => {
    const { getByText } = render(
      <ConfirmationDeleteModal
        closeModal={closeModal}
        fieldName={''}
        removeInput={removeInput}
      />
    )
    expect(getByText('Please Confirm')).toBeTruthy();
    fireEvent.click(getByText(/no/i));
    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
