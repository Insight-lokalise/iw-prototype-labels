import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ReviewSection from './ReviewSection';

describe('ReviewSection', () => {
  test('renders title correctly', () => {
    render(<ReviewSection title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('renders children correctly', () => {
    const { container } = render(
      <ReviewSection title="Test Title">
        <p>Child content</p>
      </ReviewSection>
    );
    expect(container.querySelector('p')).toHaveTextContent('Child content');
  });

  test('does not render edit button when isEditable is false', () => {
    render(<ReviewSection title="Test Title" />);
    expect(screen.queryByTestId('personal-info-edit-btn')).toBeNull();
  });

  test('renders edit button when isEditable is true', () => {
    render(<ReviewSection title="Test Title" isEditable />);
    expect(screen.getByTestId('personal-info-edit-btn')).toBeInTheDocument();
  });

  test('calls onEdit function when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<ReviewSection title="Test Title" isEditable onEdit={onEdit} />);
    const editButton = screen.getByTestId('personal-info-edit-btn');
    userEvent.click(editButton);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
