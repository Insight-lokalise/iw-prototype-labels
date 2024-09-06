import React from 'react'
import { render } from 'test-utils'
import InsightLogo from "./InsightLogo";

describe('Insight Logo in Header', ()=>{
    test('Should render Insight logo', ()=>{
      const {container} = render(<InsightLogo/>)
      expect(container.firstChild).toHaveClass('c-header-logo')
    })
})
