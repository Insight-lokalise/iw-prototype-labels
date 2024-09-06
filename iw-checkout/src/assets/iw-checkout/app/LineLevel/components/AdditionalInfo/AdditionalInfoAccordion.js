import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { change } from 'redux-form'
import PropTypes from 'prop-types'
import cn from 'classnames'
import map from 'lodash-es/map'
import reduce from 'lodash-es/reduce'

import { t } from '@insight/toolkit-utils/lib/labels'
import { connectToLocale } from '@insight/toolkit-react/lib/Locale/Locale'
import ROUTES from '../../../../libs/routes'
import { IWLoading } from './../../../../libs/iw-components'
import { IWAccordionSection } from './../../../../libs/iw-components/iw-accordion'
import { FieldLabel } from './../../../../libs/iw-components/iw-form/formSFCs'
import {
  deleteFile,
  fetchOrderMetaData,
  fetchPopulateUIFlags,
  fetchSmartTrackers,
  saveAdditionalOrderInformation,
  saveHeaderLevelSmartTrackerDefaults,
  uploadFile,
} from './../../../../libs/OrderMetaData/actions'
import {
  selector_fileUploadInformation,
  selector_isFileUploadPending,
  selector_orderMetaData,
} from './../../../../libs/OrderMetaData/selectors'
import {
  selector_hasEditCheckoutDefaultsFavoritesPermission,
  selector_isAPAC,
  selector_isCES,
  selector_isEMEA,
  selector_isNavy,
  selector_navySTName,
  selector_isSharedUser
} from './../../../../libs/User/selectors'

import { handleSectionAndPageRedirect } from './../../../ShipBillPay/containers/helpers'

import {
  selector_hasAdditionalOrderInformation,
  selector_hasAdditionalOrderNotes,
  selector_hasFileUpload,
  selector_hasHeaderLevelSmartTrackers,
  selector_hasInvoiceNotes,
  selector_hasLabConfigurationNotes,
  selector_hasLineLevelInformation,
  selector_hasPopulateUIFlags,
  selector_hasSharedUserFields,
  selector_hasWarrantyFields,
  selector_headerLevelSmartTrackers,
  selector_isLimitedUser,
  selector_isSingleWebGroup,
  selector_populateUIFlags,
  selector_isSaveAsQuote,
} from './../../selectors'
import AdditionalInfoForm from './AdditionalInfoForm'

import { navigateToSection } from '../../../../libs/routes/navigate'
import ScrollToTop from '../../../../libs/routes/ScrollToTop'
import { proceedToCheckout } from './../../../../libs/ShoppingRequest/actions'


const trim = (str) => (str || '').trim()

function initialValuesForForm(
  valuesFromState,
  defaultHeaderLevelSmartTrackers
) {
  const defaultHeaderLevelSmartTrackersMap = reduce(
    defaultHeaderLevelSmartTrackers,
    (acc, smartTracker) => {
      acc[`st-${smartTracker.lineLevelId}`] = smartTracker.value
      return acc
    },
    {}
  )

  const deNormalizedSmarttrackerData = reduce(
    valuesFromState.smartTracker,
    (smartTracker, value) => {
      smartTracker[`st-${value.id}`] = value.value
      return smartTracker
    },
    {}
  )

  const filteredDeNormalizedSmartTrackerData = reduce(
    defaultHeaderLevelSmartTrackersMap,
    (smartTrackers, value, key) => {
      if (Object.keys(deNormalizedSmarttrackerData).includes(key)) {
        smartTrackers[key] = deNormalizedSmarttrackerData[key]
          ? deNormalizedSmarttrackerData[key]
          : value
      }
      return smartTrackers
    },
    defaultHeaderLevelSmartTrackersMap
  )
  return {
    ...valuesFromState,
    smartTracker: {
      ...defaultHeaderLevelSmartTrackersMap,
      ...filteredDeNormalizedSmartTrackerData,
    },
  }
}

function bindUserSelectedValuesToHeaderLevelSmarttrackers(
  headerLevelSmartTrackers,
  userSelectedSmarttrackers
) {
  // need a good name
  const userSelectedSmarttrackersMap = reduce(
    userSelectedSmarttrackers,
    (acc, smarttracker) => {
      acc[smarttracker.id] = smarttracker.value || ''
      return acc
    },
    {}
  )
  return map(headerLevelSmartTrackers, (smarttracker) => ({
    ...smarttracker,
    value: userSelectedSmarttrackersMap[smarttracker.lineLevelId] || '',
  }))
}

function HeaderLevelSmartTrackersView({
  headerLevelSmartTrackers,
  isNavy,
  navySTName,
}) {
  return (
    <div className="row expanded is-collapse-child">
      {headerLevelSmartTrackers.map((smarttracker, index) => {
        const isNavySmarttracker = isNavy && navySTName === smarttracker.name
        return (
          <div
            key={index}
            className={cn(
              { hide: isNavySmarttracker },
              'columns small-12 medium-4 large-4'
            )}
          >
            <FieldLabel
              className="form__label--readonly"
              label={smarttracker.name}
              required={smarttracker.required}
              regexFormat={smarttracker.format}
              name={smarttracker.name}
            />
            <p>{smarttracker.value}</p>
          </div>
        )
      })}
    </div>
  )
}

function ContactAddressView({ contactInfo }) {
  return (
    <div className="row expanded is-collapse-child">
      <div className="columns small-12 medium-4 large-4">
        <FieldLabel
          className="form__label--readonly"
          label={t('Name')}
          required={true}
          name={t('Name')}
        />
        <p>{contactInfo.name}</p>
      </div>
      <div className="columns small-12 medium-4 large-4">
        <FieldLabel
          className="form__label--readonly"
          label={t('Phone')}
          required={true}
          name={t('Phone')}
        />
        <p>{contactInfo.phone}</p>
      </div>
      <div className="columns small-12 medium-4 large-4">
        <FieldLabel
          className="form__label--readonly"
          label={t('Email')}
          required={true}
          name={t('Email')}
        />
        <p>{contactInfo.email}</p>
      </div>
    </div>
  )
}

class AdditionalInformationAccordion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialValues: {},
      isPending: true,
      hasError: false
    }
  }

  componentDidMount() {
    Promise.all([
      this.props.fetchSmartTrackers(),
      this.props.fetchOrderMetaData(this.props.isSharedUser),
      !this.props.hasPopulateUIFlags ? this.props.fetchPopulateUIFlags() : null,
    ]).then(() => {
      const initialValues = initialValuesForForm(
        this.props.orderMetaData,
        this.props.headerLevelSmartTrackers
      )

      this.setState({
        initialValues,
        isPending: false,
        hasError: false,
      })
      // If IWAccordion sets us as the active section when we shouldn't display,
      // set the next accordion section as active
      const isEditable = !this.props.isReadOnly && !this.props.isCollapsed
      if (!this.props.hasAdditionalOrderInformation && isEditable) {
        this.props.setActiveIndex('LineLevel', this.props.ownIndex + 1)
      }

      if (isEditable) {
        /* scroll to top since it is the top section */
        ScrollToTop()
      }
    })
  }

  handleFileSubmit = (file) => {
    this.props.uploadFile(file)
  }

  handleFormSubmit = (values) => {
    if (this.state.hasError) return;
    // Get smartTracker keys - they start with "st-"
    const smartTrackerKeys = Object.keys(values.smartTracker).filter((key) =>
      key.startsWith('st-')
    ) // Only use keys that start with "st-"
    const smartTrackers = smartTrackerKeys.map((value) => ({
      id: Number(value.split('-')[1]),
      value: trim(values.smartTracker[value]),
    })) // Create a new array based on those keys with a custom object

    // Get smartTracker default keys - they start with "samd-"
    const smartTrackerDefaultKeys = Object.keys(values.smartTracker).filter(
      (key) => key.startsWith('samd-') && values.smartTracker[key] === true
    ) // Only use keys that start with "samd-" and the st value is true.
    const smartTrackerDefaults = smartTrackerDefaultKeys.map((value) => {
      const lineNumber = value.split('-')[1]
      return {
        configId: Number(lineNumber),
        defaultValue: trim(values.smartTracker['st-' + lineNumber]),
      }
    }) // Create a new array based on those keys with a custom object

    // Make sure all smartTracker values are trimmed
    Object.keys(smartTrackerKeys).forEach((key) => {
      change(
        'AdditionalInfoForm',
        'smartTracker.' + key,
        smartTrackers[key].value
      )
    })

    // Clear all of the SetAsMyDefault checkboxes.
    Object.keys(smartTrackerDefaultKeys).forEach((key) => {
      change('AdditionalInfoForm', 'smartTracker.' + key, false)
    })

    let orderMetaData = {
      ...values,
      smartTracker: smartTrackers,
      file: this.props.fileUploadInformation,
    }
    let { userContact: normalizedUserContact = null } = values
    if (normalizedUserContact) {
      const { name = '' } = normalizedUserContact
      const trimmedName = name.trim().replace(/\s\s+/g, ' ')
      normalizedUserContact = { ...normalizedUserContact, name: trimmedName }
      orderMetaData = {
        ...orderMetaData,
        userContact: { ...normalizedUserContact },
      }
    }

    this.props.saveAdditionalOrderInformation(orderMetaData).then(() => {
      if (smartTrackerDefaults.length > 0) {
        this.props.saveHeaderLevelSmartTrackerDefaults({
          userDefaults: smartTrackerDefaults,
        })
      }
      if (this.props.isSaveAsQuote) {
        window.location.assign('/insightweb/displaysavequote')
      }    // Get smartTracker keys - they start with "st-"
      else {
        this.props
          .proceedToCheckout({ source: 'HEADERLEVEL' })
          .then(({ value }) => {
            const { checkoutState } = value
            navigateToSection(
              this.props.history,
              checkoutState,
              this.props.setActiveIndex
            )
          })
      }
    })
  }

  setErrorFlag = (hasError) => {
    this.setState({
      ...this.state,
      hasError
    })
  }

  render() {
    const { orderMetaData, redirectToSBPOnEdit, setActiveIndex, history } =
      this.props
    const {
      smartTracker,
      userContact,
      warrantyContact,
      additionalOrderInformation,
      file,
    } = orderMetaData
    const { orderNotes, labConfigNotes, invoiceNotes } =
      additionalOrderInformation
    const updatedSmarttrackers =
      bindUserSelectedValuesToHeaderLevelSmarttrackers(
        this.props.headerLevelSmartTrackers,
        smartTracker
      )
    const additionalInfoTitle = t('Order information')
    const warrantyContactNameMaxLength = 30;
    const isCES = this.props.context && this.props.context.isCES

    if (this.props.hasWarrantyFields && warrantyContact.name != null) {
      warrantyContact.name = warrantyContact.name.substring(0, warrantyContactNameMaxLength);
    }

    const onEdit = redirectToSBPOnEdit
      ? handleSectionAndPageRedirect.bind(
        null,
        history,
        setActiveIndex,
        ROUTES.LINE_LEVEL,
        0
      )
      : undefined

    return this.state.isPending ? (
      <IWLoading modal={true} className="iw-loading__size-giant" />
    ) : (
      this.props.hasAdditionalOrderInformation && (
        <IWAccordionSection
          {...this.props}
          isPrivate={true}
          className="additional-order-information"
          title={additionalInfoTitle}
          onEdit={onEdit}
        >
          {this.props.isReadOnly ? (
            <div>
              {this.props.hasHeaderLevelSmartTrackers && (
                <HeaderLevelSmartTrackersView
                  isNavy={this.props.isNavy}
                  navySTName={this.props.navySTName}
                  headerLevelSmartTrackers={updatedSmarttrackers}
                />
              )}
              {((this.props.hasSharedUserFields && !isCES) || this.props.isSimplifiedCESUser) && (
                <ContactAddressView contactInfo={userContact} />
              )}
              {this.props.hasWarrantyFields && (
                <ContactAddressView contactInfo={warrantyContact} />
              )}
              <div className="row expanded is-collapse-child">
                {this.props.hasAdditionalOrderNotes &&
                  additionalOrderInformation && (
                    <div className="columns small-12 medium-4 large-4">
                      <FieldLabel
                        spanId="iw-checkout__review-order-additional-notes"
                        className="form__label--readonly"
                        label={t('Additional order notes')}
                        name={t('Additional order notes')}
                      />
                      <p>{orderNotes}</p>
                    </div>
                  )}
                {this.props.hasLabConfigurationNotes &&
                  additionalOrderInformation && (
                    <div className="columns small-12 medium-4 large-4">
                      <FieldLabel
                        spanId="iw-checkout__review-order-lab-config-notes"
                        className="form__label--readonly"
                        label={t('Lab config notes')}
                        name={t('Lab config notes')}
                      />
                      <p>{labConfigNotes}</p>
                    </div>
                  )}
                {this.props.hasInvoiceNotes && additionalOrderInformation && (
                  <div className="columns small-12 medium-4 large-4">
                    <FieldLabel
                      spanId="iw-checkout__review-order-invoice-notes"
                      className="form__label--readonly"
                      label={t('Invoice notes')}
                      name={t('Invoice notes')}
                    />
                    <p>{invoiceNotes}</p>
                  </div>
                )}
                {this.props.hasFileUpload && orderMetaData && file && (
                  <div className="columns small-12 medium-4 large-4">
                    <FieldLabel
                      spanId="iw-checkout__review-order-file"
                      className="form__label--readonly"
                      label={t('File')}
                      name={t('File')}
                    />
                    <p>{file.displayName || ''}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <AdditionalInfoForm
              clearSetAsMyDefault={this.props.clearSetAsMyDefault}
              fileUploadInformation={this.props.fileUploadInformation}
              handleDeleteFile={this.props.deleteFile}
              handleFileSubmit={this.handleFileSubmit}
              handleFormSubmit={this.handleFormSubmit}
              onSubmit={this.handleFormSubmit}
              hasAdditionalOrderNotes={this.props.hasAdditionalOrderNotes}
              hasFileUpload={this.props.hasFileUpload}
              hasHeaderLevelSmartTrackers={
                this.props.hasHeaderLevelSmartTrackers
              }
              hasInvoiceNotes={this.props.hasInvoiceNotes}
              hasLabConfigurationNotes={this.props.hasLabConfigurationNotes}
              hasSharedUserFields={this.props.hasSharedUserFields}
              hasWarrantyFields={this.props.hasWarrantyFields}
              headerLevelSmartTrackers={this.props.headerLevelSmartTrackers}
              initialValues={this.state.initialValues}
              isAPAC={this.props.isAPAC}
              isEMEA={this.props.isEMEA}
              isEditChkoutDefaultFavs={this.props.isEditChkoutDefaultFavs}
              isFileUploadPending={this.props.isFileUploadPending}
              isLimitedUser={this.props.isLimitedUser}
              isNavy={this.props.isNavy}
              isSingleWebGroup={this.props.isSingleWebGroup}
              isReadOnly={this.props.isReadOnly}
              navySTName={this.props.navySTName}
              orderMetaData={this.props.orderMetaData}
              warrantyContactNameMaxLength={warrantyContactNameMaxLength}
              isCES={isCES}
              isSharedUser={this.props.isSharedUser}
              setErrorFlag={this.setErrorFlag}
            />
          )}
        </IWAccordionSection>
      )
    )
  }
}

function mapStateToProps(state) {
  return {
    fileUploadInformation: selector_fileUploadInformation(state),
    hasAdditionalOrderInformation:
      selector_hasAdditionalOrderInformation(state),
    hasAdditionalOrderNotes: selector_hasAdditionalOrderNotes(state),
    hasFileUpload: selector_hasFileUpload(state),
    hasHeaderLevelSmartTrackers: selector_hasHeaderLevelSmartTrackers(state),
    hasInvoiceNotes: selector_hasInvoiceNotes(state),
    hasLabConfigurationNotes: selector_hasLabConfigurationNotes(state),
    hasLineLevelInformation: selector_hasLineLevelInformation(state),
    hasPopulateUIFlags: selector_hasPopulateUIFlags(state),
    hasSharedUserFields: selector_hasSharedUserFields(state),
    hasWarrantyFields: selector_hasWarrantyFields(state),
    headerLevelSmartTrackers: selector_headerLevelSmartTrackers(state),
    isAPAC: selector_isAPAC(state),
    isEMEA: selector_isEMEA(state),
    isEditChkoutDefaultFavs:
      selector_hasEditCheckoutDefaultsFavoritesPermission(state),
    isFileUploadPending: selector_isFileUploadPending(state),
    isLimitedUser: selector_isLimitedUser(state),
    isNavy: selector_isNavy(state),
    isSingleWebGroup: selector_isSingleWebGroup(state),
    isSimplifiedCESUser: selector_isLimitedUser(state) && selector_isCES(state),
    isSaveAsQuote: selector_isSaveAsQuote(state),
    navySTName: selector_navySTName(state),
    orderMetaData: selector_orderMetaData(state),
    populateUIFlags: selector_populateUIFlags(state),
    isSharedUser: selector_isSharedUser(state)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      clearSetAsMyDefault: change,
      deleteFile,
      fetchOrderMetaData,
      fetchPopulateUIFlags,
      fetchSmartTrackers,
      saveAdditionalOrderInformation,
      saveHeaderLevelSmartTrackerDefaults,
      uploadFile,
      proceedToCheckout,
    },
    dispatch
  )
}

AdditionalInformationAccordion.propTypes = {
  clearSetAsMyDefault: PropTypes.func,
  fetchOrderMetaData: PropTypes.func.isRequired,
  fileUploadInformation: PropTypes.object,
  hasAdditionalOrderInformation: PropTypes.bool,
  hasAdditionalOrderNotes: PropTypes.bool,
  hasFileUpload: PropTypes.bool,
  hasHeaderLevelSmartTrackers: PropTypes.bool,
  hasInvoiceNotes: PropTypes.bool,
  hasLabConfigurationNotes: PropTypes.bool,
  hasSharedUserFields: PropTypes.bool,
  hasWarrantyFields: PropTypes.bool,
  headerLevelSmartTrackers: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  isFileUploadPending: PropTypes.bool,
  isNavy: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isSimplifiedCESUser: PropTypes.bool.isRequired,
  isSingleWebGroup: PropTypes.bool,
  isSaveAsQuote: PropTypes.bool,
  navySTName: PropTypes.string,
  orderMetaData: PropTypes.object.isRequired,
  redirectToSBPOnEdit: PropTypes.bool,
  saveAdditionalOrderInformation: PropTypes.func.isRequired,
  saveHeaderLevelSmartTrackerDefaults: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
  isSharedUser: PropTypes.bool
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(connectToLocale(AdditionalInformationAccordion))
