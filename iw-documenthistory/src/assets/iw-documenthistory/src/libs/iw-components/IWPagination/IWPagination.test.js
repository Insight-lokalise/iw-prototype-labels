import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import IWPagination from './IWPagination'

const props = {
  totalItems: null, // Required
  maxItemsPerPage: null, // Required
  onChange: jest.fn(),
  currentPage: 1,
}

const mockFunc = jest.fn(currentPage => {
  return Promise.resolve(currentPage)
})

describe('IWPagination', () => {
  beforeEach(() => {
    props.onChange.mockClear()
  })
  describe('Component will render the correct buttons depending on the current page and amount of pages.', () => {
    it('Should not render a pagination element, ::One page, 1 of 1::', () => {
      const thisProps = { ...props, totalItems: 5, maxItemsPerPage: 5 }
      const {container} = render(<IWPagination {...thisProps} />)
      expect(container.querySelector('.qa-pagination')).not.toBeInTheDocument()
    })

    it('Should not render to-first and previous buttons but render next button, ::Two pages, 1 of 2::', () => {
      const thisProps = { ...props, totalItems: 7, maxItemsPerPage: 5 }
      const {container} = render(<IWPagination {...thisProps} currentPage={1} />)
      expect(container.querySelector('.qa-pagination')).toBeInTheDocument()
      expect(container.querySelectorAll('.qa-pagination')).toHaveLength(1)
      expect(container.querySelectorAll('.qa-pagination__page')).toHaveLength(2)
      expect(container.querySelector('.qa-pagination__page--first')).toHaveClass('invisible')
      expect(container.querySelector('.qa-pagination__page--previous')).toHaveClass('invisible')
      expect(container.querySelector('.qa-pagination__page--next')).not.toHaveClass('invisible')
      expect(container.querySelector('.qa-pagination__page--last')).toHaveClass('invisible')
    })

    it('Should render three pages plus the next and goto last buttons ::Three pages, 1 of 3::', () => {
      const thisProps = { ...props, totalItems: 11, maxItemsPerPage: 5 }
      const {container} = render(<IWPagination {...thisProps} currentPage={1} />)
      expect(container.querySelectorAll('.qa-pagination')).toHaveLength(1)
      expect(container.querySelectorAll('.qa-pagination__page')).toHaveLength(3)
      expect(container.querySelector('.qa-pagination__page--first')).toHaveClass('invisible')
      expect(container.querySelector('.qa-pagination__page--previous')).toHaveClass('invisible')
      expect(container.querySelector('.qa-pagination__page--next')).not.toHaveClass('invisible')
      expect(container.querySelector('.qa-pagination__page--last')).not.toHaveClass('invisible')
    })

    it('Should render previous button plus pages only ::Two pages. 2 0f 2::', () => {
      const thisProps = { ...props, totalItems: 6, maxItemsPerPage: 5 }
      const {container} = render(<IWPagination {...thisProps} currentPage={2} />)
      expect(container.querySelectorAll('.qa-pagination')).toHaveLength(1)
      expect(container.querySelectorAll('.qa-pagination__page')).toHaveLength(2)
      expect(container.querySelector('.qa-pagination__page--first')).toHaveClass('invisible')
      expect(container.querySelector('.qa-pagination__page--previous')).not.toHaveClass('invisible')
      expect(container.querySelector('.qa-pagination__page--next')).toHaveClass('invisible')
      expect(container.querySelector('.qa-pagination__page--last')).toHaveClass('invisible')
    })

    it('Should render previous and to-first buttons plus pages only ::Two pages. 3 0f 3::', () => {
      const thisProps = { ...props, totalItems: 11, maxItemsPerPage: 5 }
      const {container} = render(<IWPagination {...thisProps} currentPage={3} />)
      expect(container.querySelectorAll('.qa-pagination')).toHaveLength(1)
      expect(container.querySelectorAll('.qa-pagination__page')).toHaveLength(3)
      expect(container.querySelector('.qa-pagination__page--first')).not.toHaveClass('invisible')
      expect(container.querySelector('.qa-pagination__page--previous')).not.toHaveClass('invisible')
      expect(container.querySelector('.qa-pagination__page--next')).toHaveClass('invisible')
      expect(container.querySelector('.qa-pagination__page--last')).toHaveClass('invisible')
    })
  })

  it('Should render a max of 5 pages ::More than 5 pages::', () => {
    const thisProps = { ...props, totalItems: 26, maxItemsPerPage: 5 }
    const {container} = render(<IWPagination {...thisProps} />)
    expect(container.querySelectorAll('.qa-pagination')).toHaveLength(1)
    expect(container.querySelectorAll('.qa-pagination__page')).toHaveLength(5)
  })

  it('Should render a max of 10 pages ::Custom number of pages::', () => {
    const thisProps = { ...props, totalItems: 50, maxItemsPerPage: 5, maxPagesToShow: 10 }
    const {container} = render(<IWPagination {...thisProps} />)
    expect(container.querySelectorAll('.qa-pagination')).toHaveLength(1)
    expect(container.querySelectorAll('.qa-pagination__page')).toHaveLength(10)
  })

  // TODO : update test case
  it('Should Transition the available pages when clicking next. ::from 3 of 6 to 4 of 6::', done => {
    const thisProps = { ...props, totalItems: 30, maxItemsPerPage: 5, onChange: mockFunc }
    const {container} = render(<IWPagination {...thisProps} currentPage={4} />)
    expect(container.querySelector('.qa-pagination__page-link--current').innerHTML).toEqual('4')
    const next = container.querySelector('.qa-pagination__page--next')
    fireEvent.click(next)
    setTimeout(() => {
      try {
        expect(container.querySelector('.qa-pagination__page-link--current').innerHTML).toEqual('4')
        done()
      } catch (e) {
        done.fail(e)
      }
    })
  })

  // // TODO : update test case
  it('Should Transition the available pages when clicking previous. ::from 4 of 6 to 3 of 6::', done => {
    const thisProps = { ...props, totalItems: 30, maxItemsPerPage: 5, onChange: mockFunc }
    const {container} = render(<IWPagination {...thisProps} currentPage={3} />)
    expect(container.querySelector('.qa-pagination__page-link--current').innerHTML).toEqual('3')
    expect(container.querySelectorAll('.qa-pagination__page')).toHaveLength(5)
    const next = container.querySelector('.qa-pagination__page--previous')
    fireEvent.click(next)
    setTimeout(() => {
      try {
        expect(container.querySelector('.qa-pagination__page-link--current').innerHTML).toEqual('3')
        expect(container.querySelectorAll('.qa-pagination__page')).toHaveLength(5)
        done()
      } catch (e) {
        done.fail(e)
      }
    })
  })

  it('Should change current page when anchors are clicked', done => {
    const thisProps = { ...props, totalItems: 25, maxItemsPerPage: 5 }
    const {container} = render(<IWPagination {...thisProps} currentPage={5} onChange={mockFunc} />)
    const gotoLastPageIcon = container.querySelector('.qa-pagination__page--last')
    fireEvent.click(gotoLastPageIcon)
    setTimeout(() => {
      try {
        expect(mockFunc.mock.calls[2][0]).toBe(5)
        done()
      } catch (e) {
        done.fail(e)
      }
    })
  })
})
