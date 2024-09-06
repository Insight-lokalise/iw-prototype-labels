import React from 'react'
import { screen, render } from '@testing-library/react'
import SearchSuggestion from './SearchSuggestion'

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const historySuggestion = {
  value: 'mouse pad',
}

const searchSuggestion = {
  value: 'mouse pad',
  categoryCode: 'hardware/computer_accessories',
  categoryLabel: 'Computer Accessories',
}

const setup = async ({query, removeSuggestion, suggestion}) => {

  const onSelect = jest.fn()

  const wrapper = render(
    <SearchSuggestion
      onSelect={onSelect}
      query={query}
      removeSuggestion={removeSuggestion}
      suggestion={suggestion}
    />)

  return {
    ...wrapper,
    onSelect,
  }
}

describe('SearchSuggestion tests', () => {
  test('Render history suggestion', async () => {
    const removeSuggestion = jest.fn()
    const { getByText, queryByText } = await setup({query: 'mouse', removeSuggestion: removeSuggestion, suggestion: historySuggestion});
    expect(getByText('mouse').className).toEqual('c-search-suggestions__match')
    expect(getByText('pad').closest('.c-search-suggestions__btn')).toBeInTheDocument()
    expect(screen.getByLabelText('Delete search suggestion')).toBeInTheDocument()
    expect(queryByText('in Computer Accessories')).not.toBeInTheDocument()
  })
  test('Render search suggestion', async () => {
    const { getByText } = await setup({query: 'mouse', suggestion: searchSuggestion});
    expect(getByText('mouse').className).toEqual('c-search-suggestions__match')
    expect(getByText('pad').closest('.c-search-suggestions__btn')).toBeInTheDocument()
    expect(screen.queryByLabelText('Delete search suggestion')).not.toBeInTheDocument()
    expect(getByText('in Computer Accessories')).toBeInTheDocument()
  })
})
