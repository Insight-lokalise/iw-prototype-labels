import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import { IWSelectField, IWDateField } from '../../../../libs/iw-components/IWForm'
import { IWButton } from '../../../../libs/iw-components'
import { t, l } from '@insight/toolkit-utils/lib/labels'
import AccountByRegionView from './AccountByRegionView'
import { accountTypes, orderTypes, productTypes, statusList } from '../../constants/Constants'
import { oneYearBackFromEndDate, oneYearFromStartDate, threeYearsAgo } from '../../constants/Date'
import { PCMOrderSearch } from './PCMOrderSearch'

class AdvancedSearchFormView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      endDate: props.initialValues.endDate,
      maxEndDate: new Date(),
      minEndDate: oneYearBackFromEndDate(new Date()),
      isRegionDisplayed: false,
      minStartDate: threeYearsAgo(new Date()),
      startDate: props.initialValues.startDate,
    }
    this.initialState = this.state
    this.displayRegions = this.displayRegions.bind(this)
    this.handleEndDateChange = this.handleEndDateChange.bind(this)
    this.handleStartDateChange = this.handleStartDateChange.bind(this)
    this.reset = this.reset.bind(this)
  }

  componentDidMount() {
    this.props.getRegionsByBillTo()
    if (this.props.selectionList.length === 0) {
      this.props.getHierarchyTreeDropDown()
    }
  }

  /*
   * When accounts by region option under Account selection DD is selected,
   * then display regions dropdown.
   */
  displayRegions(e) {
    this.setState({
      isRegionDisplayed: e.target.value === '-1',
    })
  }

  handleEndDateChange(date) {
    this.setState({
      endDate: date,
    })
  }

  handleStartDateChange(date) {
    const currentDate = new Date()
    const oneYearPlus = oneYearFromStartDate(date)
    const endDate = oneYearPlus > currentDate ? currentDate : oneYearPlus
    this.setState({
      endDate,
      maxEndDate: endDate,
      minEndDate: oneYearBackFromEndDate(date),
      startDate: date,
    })
  }

  reset() {
    this.setState(this.initialState)
    this.props.reloadOrderHistoryResults()
  }

  render() {
    const {
      opsCentersList,
      handleSubmit,
      handleAdvancedSearchFormSubmit,
      isPCMUSUser,
      regionList,
      selectionList,
      showOnlyMyOrders,
    } = this.props
    const orders = showOnlyMyOrders
      ? [{ displayName: 'My Orders', value: '1' }]
      : [
          { displayName: 'All Orders', value: '0' },
          { displayName: 'My Orders', value: '1' },
        ]
    return (
      <form
        className="search-form"
        onSubmit={handleSubmit(data => handleAdvancedSearchFormSubmit({ ...data, endDate: this.state.endDate }))}
      >
        <div className="row expanded">
          <div className="columns small-12 medium-6 large-4">
            <IWSelectField
              name="status"
              label={t('Order status')}
              ariaLabel="searchByStatus"
              optionsArrayOrFunction={statusList.map(option => ({
                value: option.value,
                displayName: t(option.displayName),
              }))}
            />
          </div>
          <div className="columns small-12 medium-6 large-4">
            <div className="row is-collapse-child align-middle search-form__date-field-wrapper">
              <div className="columns search-form__date-field">
                <IWDateField
                  label={t('From')}
                  minDate={this.state.minStartDate}
                  maxDate={new Date()}
                  name="startDate"
                  onChange={this.handleStartDateChange}
                  required={false}
                  selected={this.state.startDate}
                  showHelpIcon={false}
                />
              </div>
              <div className="columns search-form__date-field">
                <IWDateField
                  label={t('To')}
                  minDate={this.state.minEndDate}
                  maxDate={this.state.maxEndDate}
                  name="endDate"
                  onChange={this.handleEndDateChange}
                  required={false}
                  selected={this.state.endDate}
                  showHelpIcon={false}
                />
              </div>
            </div>
            <p className="form__field-msg">{t('Maximum date range is one year')}</p>
          </div>
          <div className="columns small-12 medium-6 large-4">
            <IWSelectField
              name="orderType"
              ariaLabel="searchByOrderType"
              label={t('Open/invoiced orders')}
              optionsArrayOrFunction={orderTypes.map(option => ({
                value: option.value,
                displayName: t(option.displayName),
              }))}
            />
          </div>
          <div className="columns small-12 medium-6 large-4">
            <IWSelectField
              className="js-gtm-orders__search-by-account"
              name="levelIndex"
              ariaLabel="searchByAccountType"
              label={t('Account selection')}
              optionsArrayOrFunction={selectionList.map(option => ({
                value: option.id,
                displayName: t(accountTypes[option.name]),
              }))}
              onChange={this.displayRegions}
              selected={1}
            />
          </div>
          <div className="columns small-12 medium-6 large-4">
            <IWSelectField
              name="orders"
              ariaLabel="searchByOrders"
              label={t('Orders')}
              optionsArrayOrFunction={orders.map(option => ({
                value: option.value,
                displayName: t(option.displayName),
              }))}
            />
          </div>
          <div className="columns small-12 medium-6 large-4">
            <IWSelectField
              name="shippingType"
              ariaLabel="searchByShippingType"
              label={t('Shipping type')}
              optionsArrayOrFunction={productTypes.map(option => ({
                value: option.value,
                displayName: t(option.displayName),
              }))}
            />
          </div>

          {/* Below 2 dropdown values has to be loaded from API response */}
          {this.state.isRegionDisplayed && (
            <AccountByRegionView opsCentersList={opsCentersList} regionList={regionList} />
          )}
        </div>
        <div className="row expanded">
          <div className="columns small-12 medium-6">
            <IWButton className="search-form__btn js-gtm-orders__advanced-search" type="submit">
              {t('Search')}
            </IWButton>
            <IWButton className="clear search-form__btn" type="reset" onClick={this.reset}>
              {t('Clear search')}
            </IWButton>
          </div>
          {isPCMUSUser && (
            <div className="columns small-12 medium-6">
              <PCMOrderSearch />
            </div>
          )}
          <hr className="search-form__hr" />
        </div>
      </form>
    )
  }
}

export default reduxForm({
  form: 'AdvancedSearchForm',
  destroyOnUnmount: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(AdvancedSearchFormView)

AdvancedSearchFormView.propTypes = {
  getHierarchyTreeDropDown: PropTypes.func.isRequired,
  getRegionsByBillTo: PropTypes.func.isRequired,
  handleAdvancedSearchFormSubmit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isPCMUSUser: PropTypes.bool.isRequired,
  initialValues: PropTypes.shape({
    endDate: PropTypes.date,
    startDate: PropTypes.date,
  }).isRequired,
  opsCentersList: PropTypes.arrayOf(PropTypes.object).isRequired,
  regionList: PropTypes.arrayOf(PropTypes.object).isRequired,
  reloadOrderHistoryResults: PropTypes.func.isRequired,
  selectionList: PropTypes.arrayOf(PropTypes.object).isRequired,
  showOnlyMyOrders: PropTypes.bool.isRequired,
}
