import React from 'react'
import ViewError from './ViewError'

export default function CrashScreen() {
    return (
        <ViewError
            heading={'Something went wrong'}
            refresh
            subheading={'Sorry about the issues. This has been recorded and the right people are looking into it'}
        />
    )
}