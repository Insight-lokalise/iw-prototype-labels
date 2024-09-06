import React, {useState} from 'react'
import { Button } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import IPSContractOption from './IPSContractOption'

const SpecificationsIPSContract = ({
  prices,
  selectedContract,
  setSelectedContract,
  locale,
  isMobile
}) => {
  const [displayContracts, setDisplayContracts] = useState(prices.slice(0,3))
  const contractCount = prices.length
  const showMore = () => {
    if(displayContracts.length <= 3){
      setDisplayContracts(prices)
    } else {
      setDisplayContracts(prices.slice(0,3))
    }
  }

  const renderContractsDesktop = () => {
    return (
      <>
        {prices &&
          displayContracts.map((contract, index) => (
            <IPSContractOption 
              contract={contract}
              selectedContract={selectedContract}
              setSelectedContract={setSelectedContract}
              locale={locale}
              index={index}
              isMobile={isMobile}
            />
          ))
        }
        {contractCount > 3 &&
          <Button
            className="c-product-specifications__pricing__contract__show-more"
            color="inline-link"
            size="small"
            icon={displayContracts.length <= 3 ? 'arrow-down' : 'arrow-up'}
            onClick={showMore}
          >
            {displayContracts.length <= 3 ? t('Show more') : t('Show less')}
          </Button>
        }
      </>
    )
  }

  const renderContractsMobile = () => {
    return (
      <select 
        value={selectedContract.contractNumber} 
        onChange={(e) => setSelectedContract(
          prices.filter(p => p.contractNumber === e.target.value)[0]
        )}
      >
        {
          prices.map((contract, index) => (
            <IPSContractOption
              contract={contract}
              selectedContract={selectedContract}
              setSelectedContract={setSelectedContract}
              locale={locale}
              index={index}
              isMobile={isMobile}
            />
          ))
        }
      </select>
    )
  }
  return (
    <section className="c-product-specifications__pricing__contracts__list">
      {isMobile ? renderContractsMobile() : renderContractsDesktop()}
    </section>
  )
}

export default SpecificationsIPSContract
