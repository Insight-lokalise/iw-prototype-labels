import React from 'react';
import { render } from '@testing-library/react';
import IWDate from "./IWDate";

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
  t: jest.fn(string => string)
}))

const setup = async ({date, monthList, hideDay}) => {
  const wrapper = render(
    <IWDate date={date} monthList={monthList} hideDay={hideDay}/>
  )
  return {
    ...wrapper
  }
}
const today = new Date();
describe('IWDate Component', () => {
  it('Should render loading', async () => {
    const {getByTestId} = await setup({date: today, monthList: '3', hideDay: true});
    expect(getByTestId('iw-date')).toBeInTheDocument();
  })
})
