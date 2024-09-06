import React from 'react'
import { ProductsMock } from '../hooks/mock'
import { render } from '@testing-library/react'
import { ProductDetailsPage } from './ProductDetailsPage'

jest.mock('app-api-user-service', ()=>{return {}}, {virtual: true})

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom')
  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn().mockReturnValue({ materialId: '20LQS04200' }),
    useHistory: jest.fn(),
  }
})

const createProps = (opts) => ({
  onAddItemsToCart: jest.fn(),
  product: ProductsMock[0],
  betterTogether: ProductsMock.slice(1),
  compareToProducts: ProductsMock.slice(1),
  ...opts,
})

describe('<ProductDetails />', () => {
  it('should render without issue', () => {
    const props = createProps()
    render(<ProductDetailsPage {...props} />)
  })
})
