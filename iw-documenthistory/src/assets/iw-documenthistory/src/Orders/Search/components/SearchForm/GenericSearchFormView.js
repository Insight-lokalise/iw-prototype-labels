import cn from 'classnames'
import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import { IWAnchor, IWButton } from '../../../../libs/iw-components'
import { IWTextField, IWSelectField } from '../../../../libs/iw-components/IWForm'
import { t } from '@insight/toolkit-utils/lib/labels'

import GenericSearchResults from './GenericSearchResults'
import { searchType, authType } from '../../constants/Constants'
import searchTypeNameMap from './helpers'

class GenericSearchFormView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authType: props.authType,
      filters: {},
      isLoading: false,
      searchType: props.searchType,
    }
    this.getMoreRecords = this.getMoreRecords.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.selectSearchType = this.selectSearchType.bind(this)
    this.selectAuthType = this.selectAuthType.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }

  /* On click on pagination in generic order search trigger this function */
  getMoreRecords(startPage) {
    const paramObj = {
      startPage,
      filters: this.state.filters,
    }
    return this.props.getGenericOrderSearch(paramObj)
  }

  submitForm(paramObj) {
    const searchFilters = {
      searchType: this.state.searchType,
      authType: this.state.authType,
    }
    this.props
      .getGenericOrderSearch(paramObj, searchFilters)
      .then(() => {
        this.setState({
          isLoading: false,
        })
      })
      .catch(error => {
        console.warn('Failed to fetch generic order search')
        throw error
      })
  }

  handleFormSubmit(values) {
    const paramObj = {
      startPage: 1,
      filters: {
        [this.state.searchType]: values[this.state.searchType],
        [this.state.authType]: values[this.state.authType],
      },
    }
    this.setState({ isLoading: true, filters: paramObj.filters }, this.submitForm(paramObj))
  }

  selectSearchType(item, selValue) {
    this.setState({
      searchType: selValue || item,
    })
  }

  selectAuthType(item, selValue) {
    this.setState({
      authType: selValue || item,
    })
  }

  render() {
    const trackYourOrder = t('Track my order')
    const infoText = t(
      'To search for an order quickly without logging in, please enter the required information into the fields below.'
    )
    const searchTypeList = searchType.map(item => (
      <button
        key={`search-${item.displayName}`}
        onClick={() => this.selectSearchType(item.value)}
        onFocus={() => this.selectSearchType(item.value)}
        className={cn('generic-search__list-item', {
          'generic-search__list-item--active': item.value === this.state.searchType,
        })}
      >
        {t(item.displayName)}
      </button>
    ))
    const authTypeList = authType.map(item => (
      <button
        key={`search-${item.displayName}`}
        onClick={() => this.selectAuthType(item.value)}
        onFocus={() => this.selectAuthType(item.value)}
        className={cn('generic-search__list-item', {
          'generic-search__list-item--active': item.value === this.state.authType,
        })}
      >
        {t(item.displayName)}
      </button>
    ))

    const authTypeLabel = searchTypeNameMap(authType)
    const searchTypeLabel = searchTypeNameMap(searchType)

    return (
      <section className="generic-search">
        <header className="generic-search__header">
          <h1 className="generic-search__header-title">{trackYourOrder}</h1>
          <p className="generic-search__header-text">{infoText}</p>
          <p className="generic-search__header-text">
            <span>
              <IWAnchor className="orders__link hide-for-print" href="/insightweb/login">
                {t('Log in ')}
              </IWAnchor>
              {t('to your insight.com account to view complete order information.')}
            </span>
          </p>
        </header>
        <main>
          <form className="generic-search__form" noValidate onSubmit={this.props.handleSubmit(this.handleFormSubmit)}>
            <div className="show-for-large-up">
              <div className="row expanded">
                <div className="columns small-12 medium-6 large-expand">
                  <div className="generic-search__list">{searchTypeList}</div>
                </div>
                <div className="columns small-12 medium-6 large-expand">
                  <div className="generic-search__list">{authTypeList}</div>
                </div>
                <div className="columns small-12 large-shrink generic-search__column--shrink-width" />
              </div>
            </div>
            <div className="row expanded">
              <div className="columns small-12 medium-6 large-expand generic-search__separator">
                <IWSelectField
                  name="orderType"
                  label={t('Orders')}
                  hideLabel
                  className="hide-for-large"
                  onChange={this.selectSearchType}
                  optionsArrayOrFunction={searchType.map(option => ({
                    value: option.value,
                    displayName: t(option.displayName),
                  }))}
                />
                <IWTextField
                  name={this.state.searchType}
                  label={t(searchTypeLabel[this.state.searchType])}
                  hideLabel
                  tooltip=""
                  required
                  placeholder={t(`Enter ${searchTypeLabel[this.state.searchType].toLowerCase()}`)}
                />
              </div>
              <div className="columns small-12 medium-6 large-expand generic-search__separator">
                <IWSelectField
                  name="acctType"
                  hideLabel
                  onChange={this.selectAuthType}
                  className="hide-for-large"
                  label={t('Orders')}
                  optionsArrayOrFunction={authType.map(option => ({
                    value: option.value,
                    displayName: t(option.displayName),
                  }))}
                />
                <IWTextField
                  name={this.state.authType}
                  label={t(authTypeLabel[this.state.authType])}
                  hideLabel
                  tooltip=""
                  required
                  placeholder={t(`Enter ${authTypeLabel[this.state.authType].toLowerCase()}`)}
                />
              </div>
              <div className="columns small-12 large-shrink generic-search__column--shrink-width">
                <IWButton className="expand generic-search__btn" type="submit">
                  <span className="ion-search show-for-large-up generic-search__btn-icon" />
                  <span className="show-for-medium-down">{t('Search')}</span>
                </IWButton>
              </div>
            </div>
          </form>
          <GenericSearchResults
            getMoreRecords={this.getMoreRecords}
            isLoading={this.state.isLoading}
            isLoggedIn={this.props.isLoggedIn}
          />
        </main>
      </section>
    )
  }
}

export default reduxForm({
  form: 'GenericSearchForm',
  destroyOnUnmount: false,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(GenericSearchFormView)

GenericSearchFormView.propTypes = {
  authType: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  getGenericOrderSearch: PropTypes.func.isRequired,
  searchType: PropTypes.string.isRequired,
}
