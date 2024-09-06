import React from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react'

import ForgotPassword from './ForgotPassword'

describe('ForgotPassword', () => {
    test('renders success', async () => {
        const wrapper = render(<ForgotPassword />)
        fireEvent.change(wrapper.getByLabelText('Email or username'), {target: {value: 'ok@def.com'}})
        fireEvent.click(wrapper.getByText('Send email'))
        await waitFor(() => expect(wrapper.getByText('Send email')).toBeInTheDocument())    
        expect(wrapper.getByText('If you have an insight.com account, an email with a link to reset your password has been sent to ok@def.com')).toBeInTheDocument()
    })
    test('renders not found', async () => {
        const wrapper = render(<ForgotPassword />)
        fireEvent.change(wrapper.getByLabelText('Email or username'), {target: {value: 'notFound@def.com'}})
        fireEvent.click(wrapper.getByText('Send email'))
        await waitFor(() => expect(wrapper.getByText('Send email')).toBeInTheDocument())    
        expect(wrapper.getByText('If you have an insight.com account, an email with a link to reset your password has been sent to notFound@def.com')).toBeInTheDocument()
    })
    test('renders forbidden', async () => {
        const wrapper = render(<ForgotPassword />)
        fireEvent.change(wrapper.getByLabelText('Email or username'), {target: {value: 'forbidden@def.com'}})
        fireEvent.click(wrapper.getByText('Send email'))
        await waitFor(() => expect(wrapper.getByText('Send email')).toBeInTheDocument())    
        expect(wrapper.getByText('We partner with your organization to provide a single sign on experience. Please reach out to your internal resources for information on how to reset your internal password.')).toBeInTheDocument()
    })
    test('renders error', async () => {
        const wrapper = render(<ForgotPassword />)
        fireEvent.change(wrapper.getByLabelText('Email or username'), {target: {value: 'error@def.com'}})
        fireEvent.click(wrapper.getByText('Send email'))
        await waitFor(() => expect(wrapper.getByText('Send email')).toBeInTheDocument())    
        expect(wrapper.getByText('An error occurred. Please try again.')).toBeInTheDocument()
    })
    test('renders undefined', async () => {
        const wrapper = render(<ForgotPassword />)
        fireEvent.change(wrapper.getByLabelText('Email or username'), {target: {value: 'undefined@def.com'}})
        fireEvent.click(wrapper.getByText('Send email'))
        await waitFor(() => expect(wrapper.getByText('Send email')).toBeInTheDocument())    
        expect(wrapper.getByText('An error occurred. Please try again.')).toBeInTheDocument()
    })
})