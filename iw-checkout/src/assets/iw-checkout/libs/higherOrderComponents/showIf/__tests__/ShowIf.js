import React from 'react'
import { shallow } from 'enzyme'

import { ShowIfComponent, mapStateToProps } from './../ShowIf'
import { jonKrone_lenovo } from './../../../../__fixtures__/jonKrone_lenovo'

describe('<ShowIf />', () => {
    it('should render children if isLoggedIn is passed and correct', () => {
        const wrapper = shallow(
            <ShowIfComponent {...mapStateToProps(jonKrone_lenovo)}
                isLoggedIn >
                <strong className='renderTest'></strong>
            </ShowIfComponent>
        )
        expect(wrapper.find('.renderTest').exists()).toBe(true)

        const wrapper2 = shallow(
            <ShowIfComponent {...mapStateToProps(jonKrone_lenovo)}
                isLoggedIn={false} >
                <strong className='renderTest'></strong>
            </ShowIfComponent>
        )
        expect(wrapper2.find('.renderTest').exists()).toBe(false)
    })

    it('isFalse should flip render result', () => {
        const wrapper = shallow(
            <ShowIfComponent {...mapStateToProps(jonKrone_lenovo)}
                isFalse isLoggedIn >
                <strong className='renderTest'></strong>
            </ShowIfComponent>
        )
        expect(wrapper.find('.renderTest').exists()).toBe(false)
    })

    it('should render based on userPermissions', () => {
        const wrapper = shallow(
            <ShowIfComponent {...mapStateToProps(jonKrone_lenovo)}
                permissions='enable_crosssell' >
                <strong className='renderTest'></strong>
            </ShowIfComponent>
        )
        expect(wrapper.find('.renderTest').exists()).toBe(true)

        const wrapper2 = shallow(
            <ShowIfComponent {...mapStateToProps(jonKrone_lenovo)}
                permissions={['enable_crosssell', 'buy']} >
                <strong className='renderTest'></strong>
            </ShowIfComponent>
        )
        expect(wrapper2.find('.renderTest').exists()).toBe(true)

        const wrapper3 = shallow(
            <ShowIfComponent {...mapStateToProps(jonKrone_lenovo)}
                permissions={['enable_crosssell', 'DOES_NOT_EXIST']} >
                <strong className='renderTest'></strong>
            </ShowIfComponent>
        )
        expect(wrapper3.find('.renderTest').exists()).toBe(false)
    })

    it('should render based on webGroupPermissions', () => {
        const wrapper = shallow(
            <ShowIfComponent {...mapStateToProps(jonKrone_lenovo)}
                webGroupPermissions='enable_buy' >
                <strong className='renderTest'></strong>
            </ShowIfComponent>
        )
        expect(wrapper.find('.renderTest').exists()).toBe(true)

        const wrapper2 = shallow(
            <ShowIfComponent {...mapStateToProps(jonKrone_lenovo)}
                webGroupPermissions={['enable_solve', 'enable_buy']} >
                <strong className='renderTest'></strong>
            </ShowIfComponent>
        )
        expect(wrapper2.find('.renderTest').exists()).toBe(true)

        const wrapper3 = shallow(
            <ShowIfComponent {...mapStateToProps(jonKrone_lenovo)}
                webGroupPermissions={['enable_solve', 'DOES_NOT_EXIST']} >
                <strong className='renderTest'></strong>
            </ShowIfComponent>
        )
        expect(wrapper3.find('.renderTest').exists()).toBe(false)
    })

    describe('test', () => {
        it('should handle booleans and numbers', () => {
            const wrapper = shallow(
                <ShowIfComponent {...mapStateToProps(jonKrone_lenovo)}
                    test={true} >
                    <strong className='renderTest'></strong>
                </ShowIfComponent>
            )
            expect(wrapper.find('.renderTest').exists()).toBe(true)

            const wrapper2 = shallow(
                <ShowIfComponent {...mapStateToProps(jonKrone_lenovo)}
                    test={false} >
                    <strong className='renderTest'></strong>
                </ShowIfComponent>
            )
            expect(wrapper2.find('.renderTest').exists()).toBe(false)
        })

        it('should handle numbers', () => {
            const wrapper = shallow(
                <ShowIfComponent {...mapStateToProps(jonKrone_lenovo)}
                    test={2} >
                    <strong className='renderTest'></strong>
                </ShowIfComponent>
            )
            expect(wrapper.find('.renderTest').exists()).toBe(true)

            const wrapper2 = shallow(
                <ShowIfComponent {...mapStateToProps(jonKrone_lenovo)}
                    test={0} >
                    <strong className='renderTest'></strong>
                </ShowIfComponent>
            )
            expect(wrapper2.find('.renderTest').exists()).toBe(false)
        })

        it('should handle functions', () => {
            const testSpy = jest.fn(() => true)
            const wrapper = shallow(
                <ShowIfComponent {...mapStateToProps(jonKrone_lenovo)}
                    test={testSpy}
                    customProp='stringy' >
                    <strong className='renderTest'></strong>
                </ShowIfComponent>
            )
            expect(wrapper.find('.renderTest').exists()).toBe(true)
            expect(testSpy.mock.calls[0][0]).toEqual({
                ...mapStateToProps(jonKrone_lenovo),
                test: testSpy,
                customProp: 'stringy',
            })

            const wrapper2 = shallow(
                <ShowIfComponent {...mapStateToProps(jonKrone_lenovo)}
                    test={jest.fn(() => false)} >
                    <strong className='renderTest'></strong>
                </ShowIfComponent>
            )
            expect(wrapper2.find('.renderTest').exists()).toBe(false)
        })
    })
})
