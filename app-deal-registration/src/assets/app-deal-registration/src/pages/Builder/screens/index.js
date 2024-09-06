import React from 'react'
import Loadable from 'react-loadable'
import { ViewLoader } from '@components'

const loading = ({ isLoading }) => isLoading && <ViewLoader />

export const Fields = Loadable({
    loader: () => import('./Fields/Fields'),
    loading
})

export const Layout = Loadable({
    loader: () => import('./Layout/Layout'),
    loading
})

export const Finalize = Loadable({
    loader: () => import('./Finalize/Finalize'),
    loading
})

export const Link = Loadable({
    loader: () => import('./Link/Link'),
    loading
})