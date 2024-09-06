import React, { cloneElement } from 'react'
import PropTypes from 'prop-types'
import { Transition } from 'react-transition-group'

const styles = {
    entering: {
        transform: 'scale(1)'
    },
    entered: {
        transform: 'scale(1)'
    }
}

export default function SpeedDialTransition({
    children,
    timeout = { enter: 225, exit: 195 },
    onEnter,
    onExit,
    style: styleProp,
    ...rest
}) {
    const handleEnter = node => {
        if (onEnter) {
            onEnter(Node)
        }
    }

    const handleExit = node => {
        if (onExit) {
            onExit(node)
        }
    }

    const style = {
        ...styleProp,
        ...(children.props.style || {})
    }

    return (
        <Transition appear onEnter={handleEnter} onExit={handleExit} timeout={timeout} {...rest}>
            {(state, childProps) => cloneElement(children, {
                style: {
                    transform: 'scale(0)',
                    willChange: 'transform',
                    ...styles[state],
                    ...style
                },
                ...childProps
            })}
        </Transition>
    )
}