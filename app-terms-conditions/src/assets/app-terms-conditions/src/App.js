import React  from 'react'
import { Locale } from '@insight/toolkit-react'
import { TnC } from '@components'
import { CreateTnCContextProvider, TnCContextProvider } from '@context'

export default function App() {
  return (
    <div className="c-tc-container">
      <TnCContextProvider>
        <CreateTnCContextProvider>
          <TnC />
        </CreateTnCContextProvider>
      </TnCContextProvider>
    </div>
  )
}
