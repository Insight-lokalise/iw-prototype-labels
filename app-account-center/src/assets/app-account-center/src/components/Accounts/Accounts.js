import React, {useState} from 'react'
import AccountsHeader from './AccountsHeader'
import AccountsList from './AccountsList'

const Accounts = ({addToast}) => {
  const [filterString, setFilterString] = useState('')

  return (
    <div className="c-account-center">
      <div className='c-account-header'>
        <div className='o-grid o-grid--bottom'>
          <div className="o-grid__item">
            <AccountsHeader setFilterString={setFilterString} />
          </div>
        </div>
      </div>
      <div className='o-grid o-grid--gutters-small c-account-center-tiles'>
        <div className="o-grid__item">
          <AccountsList
            filterString={filterString}
            addToast={addToast}
          />
        </div>
      </div>
    </div>
  )
}

export default Accounts;
