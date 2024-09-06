import cn from 'classnames'

export default function generateClasses({ checked, className, disabled, isDragging, showOutline }) {
    const base = cn('c-switch', {
        'is-active': checked,
        'is-disabled': disabled
    }, className)

    const background = cn('c-switch__background', {
        'has-outline': showOutline,
        'is-active': checked,
        'is-disabled': disabled,
        'is-dragging': isDragging,
    })

    const handle = cn('c-switch__handle', {
        'is-dragging': isDragging
    })

    const label = cn('c-switch__label', {
        'is-active': checked,
        'is-disabled': disabled
    }
    )
    return { base, background, handle, label }
}