import React from 'react'
import { render } from '@testing-library/react'
import { IWMessage } from './iw-message'

describe('IWMessage', () => {
    let wrapper

    afterEach(() => {
        wrapper.unmount()
    })
    it('renders w/ icon', () => {
      wrapper = render(
        <IWMessage
          text='Hello!'
          severity='error'
          msgId='N/A'
          hideIcon={false}
          className='classes'
        />
      )
      const {container} = wrapper
      expect(container.querySelector('.ion-android-alert')).toBeInTheDocument()
    })
    it('renders w/o icon', () => {
      wrapper = render(
        <IWMessage
          text='Hello!'
          severity='error'
          msgId='N/A'
          hideIcon
          className='classes'
        />
      )
      const {container} = wrapper
      expect(container.querySelector('.ion-android-alert')).not.toBeInTheDocument()
    })
    it('returns null when no text', () => {
      wrapper = render(
        <IWMessage
          severity='error'
          msgId='N/A'
          hideIcon
          className='classes'
        />
      )
      const {container} = wrapper
      expect(container.firstChild).toBe(null)
    })
    it('defaults to info severity', () => {
      wrapper = render(
        <IWMessage
          text='Hello!'
          severity={undefined}
          msgId='N/A'
          hideIcon
          className='classes'
        />
      )
      const {container} = wrapper
      expect(container.querySelector('.ion-android-alert')).not.toBeInTheDocument()
    })
})
