import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddressSection from './AddressSection';

describe('AddressSection', () => {
  const address = {
    attentionLine: 'John Doe',
    companyName: 'Example Company',
    address1: '123 Main St',
    address2: 'Apt 4B',
    address3: '',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    countryId: 'USA',
  };

  test('renders shipping address title', () => {
    render(<AddressSection type="shipping-address" address={address} />);
    expect(screen.getByText('Shipping address')).toBeInTheDocument();
  });

  test('renders billing address title', () => {
    render(<AddressSection type="billing-address" address={address} />);
    expect(screen.getByText('Billing address')).toBeInTheDocument();
  });

  test('renders address information', () => {
    const { container } = render(<AddressSection type="shipping-address" address={address} />);
    expect(screen.getByText('Shipping address')).toBeInTheDocument();
    expect(container.querySelector('.c-address-section')).toHaveTextContent('123 Main St');
    expect(container.querySelector('.c-address-section')).toHaveTextContent('Apt 4B');
    expect(container.querySelector('.c-address-section')).toHaveTextContent('Anytown');
  });

  test('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<AddressSection type="shipping-address" address={address} onEdit={onEdit} />);
    const editButton = screen.getByRole('button', { name: /edit shipping address/i });
    editButton.click();
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith('shipping-address');
  });
});
