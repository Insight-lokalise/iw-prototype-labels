import React, { Children, cloneElement, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Button, Icon } from '@insight/toolkit-react'

import Action from './SpeedDialActions'
import Transition from './SpeedDialTransition'

const initialState = {
    focusedAction: 0,
    nextItemArrowKey: undefined
}

export default function SpeedDial({
    children: childrenProps,
    className,
    direction = 'up',
    hidden = false,
    isOpen,
    onClick,
    onClose,
    ...rest
}) {
    const [state, setState] = useState(initialState)
    const actions = useRef([])

    const createActionRef = idx => node => {
        actions.current[idx + 1] = node
    }

    const handleClose = e => {
        actions.current[0].focus()
        setState(prev => initialState)
        onClose && onClose(e)
    }

    const childrenLen = childrenProps.length
    let childrenCount = 0

    const children = Children.map(childrenProps, child => {
        const delay = 30 * (isOpen ? childrenCount : childrenLen - childrenCount)
        childrenCount += 1

        if (child == null) {
            return
        }

        return cloneElement(child, {
            delay,
            isOpen,
            ref: createActionRef(childrenCount - 1)
        })
    })

    const actionClasses = cn({
        [`is-${direction}`]: direction
    })
    const classes = cn('c-speed-dial', actionClasses, className)
    const childClasses = cn('c-speed-dial__actions', actionClasses, {
        'is-closed': !isOpen
    })

    let clickProp = { onClick }
    if (typeof document !== 'undefined' && 'ontouchstart' in document.documentElement) {
        clickProp = { onTouchEnd: onClick }
    }

    return (
        <div className={classes} {...rest}>
            <Transition
                in={!hidden}
                timeout={{
                    enter: 240,
                    exit: 240
                }}
                unmountOnExit
            >
                <Button
                    aria-expanded={isOpen ? 'true' : 'false'}
                    aria-haspopup="true"
                    className="c-speed-dial__trigger"
                    color="primary"
                    {...clickProp}
                    ref={node => {
                        actions.current[0] = node
                    }}
                >
                    <Icon icon="close" size="large" style={{ transform: 'rotate(45deg)', color: '#fff' }} />
                </Button>
            </Transition>
            <div role="menu" className={childClasses}>{children}</div>
        </div>
    )
}

SpeedDial.Action = Action