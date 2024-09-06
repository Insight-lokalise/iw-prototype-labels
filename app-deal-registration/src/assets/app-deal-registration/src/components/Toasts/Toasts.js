import React from 'react'
import { useSelector } from 'react-redux'
import { ToastList } from '@insight/toolkit-react'

import { useDisplay } from '@context'

export default function Toasts() {
    const toasts = useSelector(state => state.display.toasts)
    const display = useDisplay()

    const dismissToast = toast => display.dismissToast(toast)

    return (
        <ToastList
            dismissToast={dismissToast}
            toastDisplayDuration={3000}
            toasts={toasts}
        />
    )
}