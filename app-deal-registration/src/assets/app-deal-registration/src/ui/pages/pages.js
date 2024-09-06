import React from 'react'
import Loadable from 'react-loadable'
import { ViewLoader } from '@components'

const loading = ({ isLoading }) => isLoading && <ViewLoader />

export const Builder = Loadable({
    loader: () => import('./builder/Builder'),
    loading
})

export const Landing = Loadable({
    loader: () => import('./landing/Landing'),
    loading,
})

export const List = Loadable({
    loader: () => import('./list/List'),
    loading
})

/*
export const Edit = Loadable({
    loader: () => import('./edit/Edit'),
    loading
})

export const Preview = Loadable({
    loader: () => import('./preview/Preview'),
    loading
}) 

export const Submission = Loadable({
    loader: () => import('./submission/Submission'),
    loading
})
*/