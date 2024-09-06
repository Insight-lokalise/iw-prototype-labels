import React from 'react'
import { render } from 'test-utils'
import { fireEvent } from '@testing-library/react'
import Search from "./Search"

describe('Searchbar in Header', ()=>{
    test('Should render Search form', ()=>{
        const { getByRole } = render(<Search />)

        expect(getByRole('search')).toHaveClass('c-form c-form--small')
    })
})

