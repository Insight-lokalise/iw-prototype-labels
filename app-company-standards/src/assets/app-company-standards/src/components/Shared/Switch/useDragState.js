import {
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState
} from 'react'

import { DRAG_TYPES, INITIAL_DRAG_STATE } from './constants'
import { createPositions, dragReducer } from './helpers'

export default function useDragState({ checked, disabled, handleChange, handleDiameter, height, name, width }) {
    const { currentDiameter, currentPosition: calculatedPosition, positions } = createPositions({
        checked,
        handleDiameter,
        height,
        width
    })
    const [currentPosition, setCurrentPosition] = useState(calculatedPosition)
    const [dragState, dispatch] = useReducer(dragReducer, INITIAL_DRAG_STATE)
    const { isDragging, startX } = dragState

    const inputRef = useRef(null)
    const lastDragAt = useRef(0)
    const lastDragStartTime = useRef(0)
    const lastKeyupAt = useRef(0)
    
    useEffect(() => {
        const newPosition = checked ? positions.checked : positions.unchecked
        if (newPosition !== currentPosition) {
            setCurrentPosition(newPosition)
        }
    }, [checked])

    function hideOutline() {
        dispatch({ type: DRAG_TYPES['hide-outline'] })
    }

    function showOutline() {
        dispatch({ type: DRAG_TYPES['show-outline'] })
    }

    function onChange(e) {
        const target = { checked: !checked, name }
        handleChange && handleChange(target, e)
    }

    function onDrag(clientX) {
        const mousePosition = currentPosition + clientX + startX
        if (!isDragging && clientX !== startX) {
            dispatch({ type: DRAG_TYPES['set-dragging'] })
        }

        const newPosition = Math.min(positions.checked, Math.max(positions.unchecked, mousePosition))
        if (newPosition !== currentPosition) {
            setCurrentPosition(newPosition)
        }
    }

    function onDragStop(e) {
        const halfwayPoint = (positions.checked + positions.unchecked) / 2  
        const timeSinceDragStart = Date.now() - lastDragStartTime.current
        
        // Simulate clicking the handle
        if (!isDragging || timeSinceDragStart < 250) {
            onChange(e)
        } else if (checked) {
            // handle dragging from halfway point
            if (currentPosition > halfwayPoint) {
                setCurrentPosition(positions.checked)
            } else {
                onChange(e)
            }
        } else if (currentPosition < halfwayPoint) {
            // handle dragging from unchecked
            setCurrentPosition(positions.unchecked)
        } else {
            onChange(e)
        }

        dispatch({ type: DRAG_TYPES['drag-stop'] })
        lastDragAt.current = Date.now()
    }

    function onMouseMove(e) {
        e.preventDefault()
        onDrag(e.clientX)
    }

    function onMouseUp(e) {
        onDragStop(e)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
    }

    function onMouseDown(e) {
        e.preventDefault()
        // ignore right click and scroll
        if (typeof e.button === 'number' && e.button !== 0) {
            return
        }

        onDragStart(e.clientX)
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)
    }

    function onTouchMove(e) {
        onDrag(e.touches[0].clientX)
    }

    function onTouchEnd(e) {
        e.preventDefault()
        onDragStop(e)
    }

    function onTouchStart(e) {
        onDragStart(e.touches[0].clientX)
    }

    function onKeyUp() {
        lastKeyupAt.current = Date.now()
    }

    function onClick(e) {
        e.preventDefault()
        inputRef.current.focus()
        onChange(e)
        hideOutline()
    }

    function onInputChange(e) {
        if (Date.now() - lastDragAt.current > 50) {
            onChange(e)
            if (Date.now() - lastKeyupAt.current > 50) {
                dispatch({ type: DRAG_TYPES['hide-outline'] })
            }
        }
    }

    const dragHandlers = useMemo(() => ({
        background: {
            onClick: disabled ? null : onClick
        },
        handle: {
            onMouseDown: disabled ? null : onMouseDown,
            onTouchCancel: disabled ? null : hideOutline,
            onTouchEnd: disabled ? null : onTouchEnd,
            onTouchMove: disabled ? null : onTouchMove,
            onTouchStart: disabled ? null : onTouchStart            
        },
        input: {
            onBlur: hideOutline,
            onChange: onInputChange,
            onFocus: showOutline,
            onKeyUp: onKeyUp,
            ref: inputRef            
        }
    }), [disabled])

    return { 
        currentDiameter,
        currentPosition,
        dragState, 
        handlers: dragHandlers,
        positions
    }
}