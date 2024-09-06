import React from 'react'
import {render, waitForElementToBeRemoved} from '@testing-library/react'

import ProductGroupDetailView from './ProductGroupDetailView'

jest.mock('@insight/toolkit-utils/lib/labels', ()=>{return {
    t: jest.fn(string => string)
}})
jest.mock('react-redux', () => {
    return {
        useDispatch: jest.fn(() => () => null),
        useSelector: jest.fn(() => () => { return {
            language: 'en',
            defaultProductSets: [{ contract: [{ lineitems: [] }] }],
            showAddToCartPopup: null,
            isViewPriceEnabled: true,
            fetchProductSetsPending: null,
            isEMEA: false,
            userSettings: {},
        }})
    }
})

jest.mock('api', () => { return {
    getCartItemCount: jest.fn(() => Promise.resolve(1))
}})
jest.mock('./ProductSetView', () => '')
jest.mock('./AddToCartModal', () => '')
jest.mock('./Shared', () => { return {
    TagPinContainer: () => '',
    Toggle: () => '',
    parse: string => string,
}})

describe('ProductGroupDetailView', () => {
    it('renders description', () => {
        const props = {
            category: {
                name: { en: 'Sample category name' }
            },
            productGroup: {
                description: { en: 'Sample description' },
                id: 'a',
                name: { en: 'Sample product group name' },
            }
        }
        const { queryByText } = render(<ProductGroupDetailView {...props}/>)
        waitForElementToBeRemoved(queryByText('Loading...')).then(() => {
            expect(queryByText('Sample description')).toBeTruthy()
        })
    })
    it('renders no description', () => {
        const props = {
            category: {
                name: { en: 'Sample category name' }
            },
            productGroup: {
                description: {},
                id: 'a',
                name: { en: 'Sample product group name' },
            }
        }
        const { queryByText } = render(<ProductGroupDetailView {...props}/>)
        waitForElementToBeRemoved(queryByText('Loading...')).then(() => {
            expect(queryByText('Sample description')).toBeFalsy()
        })
    })
})
   