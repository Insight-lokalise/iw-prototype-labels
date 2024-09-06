import React, { Fragment }  from 'react'
import PropTypes from 'prop-types'
import TnCTableHeader from './TnCTableHeader'
import TnCTableRow from './TnCTableRow'
import { useCreateTnCContext, useTnCsContext } from '@context'

  export default function TnCTable({ terms, tncAddOrEdit, permission } ) {
  const { selectedTnC } = useTnCsContext()
  const { previewView } = useCreateTnCContext()

  return(
    <div className='o-grid__item u-1/1 u-border c-tc_termsTable'>
      <TnCTableHeader />
      {previewView ?
        <TnCTableRow term={selectedTnC}  />
      :
        <Fragment>
          {terms.map(term => {
            return(
              <TnCTableRow term={term} tncAddOrEdit={tncAddOrEdit} permission={permission} />
            )
          })}
        </Fragment>
      }
    </div>
  )
}

TnCTable.propTypes = {
  permission: PropTypes.string.isRequired,
  terms: PropTypes.arrayOf().isRequired,
  tncAddOrEdit: PropTypes.func.isRequired
}
