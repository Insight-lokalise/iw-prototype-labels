import React from 'react'

import { usePurpose } from '@context'

export default function Link() {
   const { selectedForm } = usePurpose().getPurpose()
   const host = window.location.host
   return (
      <div className="c-builder-link">
         <div className="c-builder-link__panel">
            <p className="c-builder-link__text">Your Forms Url is https://{host}/submission/{selectedForm.formId}</p>
         </div>
      </div>
   )
}
