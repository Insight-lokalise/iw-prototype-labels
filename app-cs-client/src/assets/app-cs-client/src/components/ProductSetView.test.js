import React from 'react'
import {render, waitForElementToBeRemoved} from '@testing-library/react'

import ProductSetView from './ProductSetView'

jest.mock('@insight/toolkit-utils', ()=>{return {
    t: jest.fn(string => string),
    getCurrentLocale: jest.fn(string => string)
}})

jest.mock('react-redux', () => {
    return {
        useSelector: jest.fn(() => { return {
            language: 'en',
            isViewPriceEnabled: true,
            isEMEA: false,
            userSettings: {},
        }})
    }
})

describe('ProductSetView', () => {
    it('renders description', () => {
        const props = {
            contract: [{ lineitems: [] }],
            description: { en: 'Sample description' },
            disableQty: false,
            id: 'a',
            lastEditedBy: 'Steve',
            lastEditedDate: 12,
            name: { en: 'Sample product set name' },
            order: [''],
            type: 'MULTIPLE'
        }
        const { getByText } = render(<ProductSetView {...props}/>)
        expect(getByText('Sample description'))
    })
    it('renders attachment', () => {
        const props = {
            attachment: 'https://www.insight.com/File.pdf',
            contract: [{ lineitems: [] }],
            description: { en: 'Sample description' },
            disableQty: false,
            id: 'a',
            lastEditedBy: 'Steve',
            lastEditedDate: 12,
            name: { en: 'Sample product set name' },
            order: [''],
            type: 'MULTIPLE'
        }
        const { getByText } = render(<ProductSetView {...props}/>)
        expect(getByText('File.pdf'))
    })
    it('renders no description', () => {
        const props = {
            contract: [{ lineitems: [] }],
            description: {},
            disableQty: false,
            id: 'a',
            lastEditedBy: 'Steve',
            lastEditedDate: 12,
            name: { en: 'Sample product set name' },
            order: [''],
            type: 'MULTIPLE'
        }
        const { queryByText } = render(<ProductSetView {...props}/>)
        expect(queryByText('Sample description')).toBeFalsy()
    })
})
