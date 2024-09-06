import React from 'react'
import { render } from '@testing-library/react'

import RepOwnerReport from './RepOwnerReport';

jest.mock('@insight/toolkit-utils/lib/labels', () => ({
    t: jest.fn(string => string)
}))

const location = {
    state: 'the login report state'
}
const setup = async () => {
    const wrapper = render(
        <RepOwnerReport location={location} />
    )

    return {
        ...wrapper
    }
}

describe('Web Group Rep Own Report', () => {
    it('renders the Web Group Rep Own Report', async () => {
        const { getByText } = await setup()
        expect(getByText('Web Group Rep Own Report')).toBeInTheDocument()
    })

})
