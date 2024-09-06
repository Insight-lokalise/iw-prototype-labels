import React from 'react'
import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import { BREADCRUMBS } from '@constants'
import Breadcrumb from "./Breadcrumb";

jest.mock('@insight/toolkit-utils/lib/labels', ()=>{return {
  t: jest.fn(string => string)
}})

self.origin = 'localhost'
const setup = async ({ breadcrumb, key, match, routeName }) => {
  const wrapper = render(<Breadcrumb breadcrumb={breadcrumb} key={key} match={match} routeName={routeName} />, {wrapper: MemoryRouter})
  return {...wrapper}
}

describe('Breadcrumb', () => {
  test('Renders breadcrumb for Quote history page', async () => {
    const { container, getByText, getByTestId } = await setup({ breadcrumb: BREADCRUMBS.QUOTE_HISTORY, routeName: 'Quotes' })
    expect(getByTestId('breadcrumb')).toBeInTheDocument();
    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('Quotes')).toBeInTheDocument();
    expect(container.getElementsByClassName('c-breadcrumbs__link').length).toBe(1);
  })

  test('Renders breadcrumb for Quote details page', async () => {
    const { container, getByText, getByTestId } = await setup({ breadcrumb: BREADCRUMBS.QUOTE_DETAIL, match: { params: { id: '1'}}, routeName: 'Quote details' })
    expect(getByTestId('breadcrumb')).toBeInTheDocument();
    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('Quotes')).toBeInTheDocument();
    expect(getByText('Quote details #1')).toBeInTheDocument();
    expect(container.getElementsByClassName('c-breadcrumbs__name').length).toBe(3);
  })
})
