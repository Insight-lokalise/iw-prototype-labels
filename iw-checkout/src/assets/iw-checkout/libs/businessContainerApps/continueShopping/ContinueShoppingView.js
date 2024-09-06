import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import get from 'lodash-es/get'

import { t } from '@insight/toolkit-utils/lib/labels'
import CustomSelectInput from './ContinueShoppingSelectInput'
import { currentLocale } from '../../models/User/locale'
import { getNewStandardsName } from '../../models/User'

const HOME_PAGE = 'homePage'
const LAST_PRODUCT_PAGE = 'lastProductPage'
const LAST_SEARCH_RESULTS = 'lastSearchResults'
const SOFTWARE_LICENSE_AGREEMENT = 'softwareLicense'
const COMPANY_STANDARDS = 'companyStandards'
const DUPLICATE_ORDER = 'duplicateOrder'

export default class ContinueShoppingView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      options: []
    }
  }

  componentDidMount() {
    this.getNavlinkOptions()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.showDuplicateOrderLink !== this.props.showDuplicateOrderLink) {
      this.getNavlinkOptions()
    }
  }

  getNavlinkOptions() {
    const options = [
      { action: HOME_PAGE, label: t('Home page'), destinationUrl: this.props.userHomePageURL },
    ]
    const lastProductUrl = this.lastProductUrlFromSession()
    if (!!lastProductUrl) {
      options.push({ action: LAST_PRODUCT_PAGE, label: t('Last product page'), destinationUrl: lastProductUrl })
    }

    const lastSearchUrl = this.lastSearchUrlFromSession()
    if (!!lastSearchUrl) {
      options.push({ action: LAST_SEARCH_RESULTS, label: t('Last search results'), destinationUrl: lastSearchUrl })
    }

    if (this.props.hasSoftwareContractSearchPermission && this.props.hasSoftwareContracts) {
      options.push({ action: SOFTWARE_LICENSE_AGREEMENT, label: t('Software license agreements'), destinationUrl: 'softwareLicensing' })
    }

    if (this.props.hasDuplicateOrderPermission && this.props.showDuplicateOrderLink) {
      options.push({ action: DUPLICATE_ORDER, label: t('Duplicate this Order'), destinationUrl: '' })
    }
    const companyStandardName = get(window.InsightNavigation, ['accountToolsData', 'toolsObj', 'myStandards'], t('Company standards'))
    const userInformation = this.props.userInformation
    if(userInformation && this.props.hasQuickFormsPermission) {
      const webGroupId = userInformation && userInformation.webGroupId
      getNewStandardsName(webGroupId).then(({hasNewCStandards, name})=>{
        if(hasNewCStandards) {
          options.push({ action: COMPANY_STANDARDS, label: name, destinationUrl: '/insightweb/companyStandards' })
        } else {
          options.push({ action: COMPANY_STANDARDS, label: companyStandardName, destinationUrl: 'search#demoCompanyStandards' })
        }
      })
      this.setState({options})
    } else {
      this.setState({options})
    }
  }
  selectContinueShopping = ({ action, destinationUrl }) => {
    if (action === 'duplicateOrder') {
      this.props.duplicateOrder()
    } else {
      document.location = destinationUrl
    }
    // datalayer is used by google tracking and defined in header
    if (typeof dataLayer !== 'undefined') {
      const cs_dropdown = {
        event: 'cS-dropdown',
        info: action,
      }
      fireTagEvent('csDropdown',cs_dropdown);
    }
  }

  lastProductUrlFromSession() {
    const lastProduct = $.cookie('lastViewedMaterial')
    if (!lastProduct) return false
    const product = lastProduct.indexOf('^^') !== -1 ?
      lastProduct.substring(0, lastProduct.indexOf('^^'))
      :
      lastProduct

    const lastProductUrl = `/${currentLocale()}/search.html?qtype=buy&q=${encodeURIComponent(product)}`

    return lastProductUrl
  }


  lastSearchUrlFromSession() {
    let lastSearches = $.cookie('searchHistory')
    if (!lastSearches) {
      return false
    }

    lastSearches = JSON.parse(decodeURIComponent(lastSearches))

    const lastSearchUrl = lastSearches.constructor === Array && lastSearches.length > 0 ?
      `/${currentLocale()}/search.html?qtype=buy&q=${encodeURIComponent(lastSearches[0].text)}`
      :
      false

    return lastSearchUrl
  }
  render() {
    const {options} = this.state
    return (!this.props.isCloudCart &&
      <div className="continue-shopping">
        <Select
          data-gtm-event="cS-dropdown"
          options={options}
          aria-label={t('Continue shopping')}
          placeholder={t('Continue shopping')}
          inputRenderer={CustomSelectInput}
          onChange={this.selectContinueShopping}>
        </Select>
      </div>
    )
  }
}




ContinueShoppingView.propTypes = {
    hasSoftwareContracts: PropTypes.bool.isRequired,
    hasSoftwareContractSearchPermission: PropTypes.bool.isRequired,
    hasQuickFormsPermission: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
    userHomePageURL: PropTypes.string.isRequired,
    isCloudCart: PropTypes.bool.isRequired,
    showDuplicateOrderLink: PropTypes.bool.isRequired,
}
