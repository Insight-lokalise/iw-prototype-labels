import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm } from 'redux-form'
import { IWButton } from '../../../../libs/iw-components'
import { IWSelectField, IWTextField } from '../../../../libs/iw-components/IWForm'
import { t } from '@insight/toolkit-utils/lib/labels'

import { searchBy, PURCHASE_NUMBER } from '../../constants/Constants'
import searchTypeNameMap from './helpers'
import { PCMOrderSearch } from './PCMOrderSearch'

class SimpleSearchFormView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchBy: props.initialValues.searchBy || PURCHASE_NUMBER,
    }
    this.displayField = this.displayField.bind(this)
    this.reset = this.reset.bind(this)
  }

  displayField(e) {
    this.setState({
      searchBy: e.target.value,
    })
  }

  reset() {
    this.props.reloadOrderHistoryResults()
  }

  render() {
    const { isPCMUSUser } = this.props
    const searchTypeLabel = searchTypeNameMap(searchBy)
    return (
      <div>
        <form className="search-form" onSubmit={this.props.handleSubmit(this.props.handleSimpleSearchFormSubmit)}>
          <div className="row expanded">
            <div className="columns small-12 medium-4 large-3">
              <IWSelectField
                className="js-gtm-orders__search-by-category"
                name="searchBy"
                id="searchBy"
                label={t('Search by')}
                hideLabel
                optionsArrayOrFunction={searchBy.map(option => ({
                  value: option.value,
                  displayName: t(option.displayName),
                }))}
                defaultValue={this.state.searchBy}
                onChange={this.displayField}
                ariaLabel="searchByCategory"
              />
            </div>
            <div className="columns small-12 medium-4 large-3">
              <IWTextField
                className="js-gtm-orders__search-by-value"
                name={this.state.searchBy}
                id={this.state.searchBy}
                required
                label={t(searchTypeLabel[this.state.searchBy])}
                ariaLabel="searchByValue"
                hideLabel
                tooltip=""
              />
            </div>
            {isPCMUSUser && (
              <div className="columns small-12 medium-4 large-3">
                <PCMOrderSearch />
              </div>
            )}
          </div>
          <div className="row expanded">
            <div className="columns">
              <IWButton className="search-form__btn js-gtm-orders__quick-search" type="submit">
                {t('Search')}
              </IWButton>
              <IWButton className="clear search-form__btn" type="reset" onClick={this.reset}>
                {t('Clear search')}
              </IWButton>
            </div>
            <hr className="search-form__hr" />
          </div>
        </form>
      </div>
    )
  }
}

export default reduxForm({
  form: 'SimpleSearchForm',
  destroyOnUnmount: false,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(SimpleSearchFormView)

SimpleSearchFormView.propTypes = {
  handleSimpleSearchFormSubmit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isPCMUSUser: PropTypes.bool.isRequired,
  initialValues: PropTypes.shape({
    searchBy: PropTypes.string,
    // key value pairs
  }).isRequired,
  reloadOrderHistoryResults: PropTypes.func.isRequired,
}
