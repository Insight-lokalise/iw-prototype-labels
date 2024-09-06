import React from 'react'
import { render } from 'test-utils'
import { fireEvent } from '@testing-library/react'
import Tools from "./Tools"

describe('Tools dropdown in Header', ()=>{
    test('Should render Tools dropdown button', ()=>{
      const { getByRole } = render(<Tools />);

      expect(getByRole('button')).toHaveClass('c-dropdown__button')
    })

    test('Should expand dropdown when clicked', () => {
        const { getByRole } = render(<Tools />);
        const btn = getByRole('button')

        fireEvent.click(btn)
        expect(btn.closest('div')).toHaveClass('is-open')
    })
})
