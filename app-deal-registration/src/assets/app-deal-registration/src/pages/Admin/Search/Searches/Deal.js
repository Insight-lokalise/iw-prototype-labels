import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { DebouncedInput } from 'components'
import { isRequired } from 'lib'
import { DEAL_FIELDS_MAP } from '../../constants'
export default function Deal({
  alternateDealRegNum,
	dealId,
	dealNum,
	handleChange,
  opportunityId,
	searchFieldName
}) {
	const commonProps = {
		fieldComponent: 'Text',
		handleChange,
		validate: isRequired
	}

	const renderInput = (searchFieldName) => {
	  switch(searchFieldName) {
      case DEAL_FIELDS_MAP.dealNum:
        return (
          <DebouncedInput
            label="Deal num"
            name="dealNum"
            value={dealNum}
            {...commonProps}
          />
        )
      case DEAL_FIELDS_MAP.dealId:
        return (
          <DebouncedInput
            label="Deal id"
            name="dealId"
            value={dealId}
            {...commonProps}
          />
        )
      case DEAL_FIELDS_MAP.alternateDealRegNum:
        return (
          <DebouncedInput
            label="Alternate deal ID"
            name="alternateDealRegNum"
            value={alternateDealRegNum}
            {...commonProps}
          />
        )
      case DEAL_FIELDS_MAP.opportunityId:
        return (
          <DebouncedInput
            label="Opportunity ID"
            name="opportunityId"
            value={opportunityId}
            {...commonProps}
          />
        )
      default:
        return (
          <Fragment>
            <DebouncedInput
              label="Deal id"
              name="dealId"
              value={dealId}
              {...commonProps}
            />
            <DebouncedInput
              label="Deal num"
              name="dealNum"
              value={dealNum}
              {...commonProps}
            />
          </Fragment>
        )
    }
  }

	return (
		<div className="c-admin-search__text">
      {renderInput(searchFieldName)}
		</div>
	)
}
