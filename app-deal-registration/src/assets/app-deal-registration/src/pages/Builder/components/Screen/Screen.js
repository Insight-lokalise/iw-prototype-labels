import React, { useEffect, useRef } from 'react'
import cn from 'classnames'

import { useBuilderContext } from '../../context'
import { Fields, Layout, Finalize, Link } from '../../screens'
import Footer from '../Footer/Footer'
import Steps from '../Steps/Steps'

export default function Screen() {
    const screenRef = useRef(null)
    const { activeStep, registerScreenRef } = useBuilderContext()
    
    useEffect(() => {
        registerScreenRef(screenRef.current)
    }, [])

    const getContent = () => {
        switch (activeStep) {
            case 1: return <Fields />
            case 2: return <Layout />
            case 3: return <Finalize />
            case 4: return <Link />
            default: return null
        }
    }

    const classes = cn('c-screen', {
        'is-full': activeStep > 1
    })
    return (
        <div className={classes} ref={screenRef}>
            <Steps />
            {getContent()}
            <Footer />
        </div>
    )
}