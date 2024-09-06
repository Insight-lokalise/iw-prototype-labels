import React from 'react'
import { shallow } from 'enzyme'

import { SaveForLater, mapStateToProps } from './../SaveForLater'
import { jonKrone_lenovo } from './../../../../__fixtures__/jonKrone_lenovo'

jest.mock('@insight/)

describe('<SaveForLater />', () => {
    it('should match previous snapshot.', () => {
        const wrapper = shallow(
            <SaveForLater {...mapStateToProps(jonKrone_lenovo)} />
        )
        expect(wrapper).toMatchSnapshot()
    })
})
