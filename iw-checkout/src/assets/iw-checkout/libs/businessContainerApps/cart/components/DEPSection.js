import PropTypes from 'prop-types'
import React, { Component } from 'react'
import DEPInteractions from './DEPInteractions'
import DEPEnrollments from './DEPEnrollments'
import { isNewEnrollmentID } from '../helpers'

class DEPSection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEnrolled: props.enforceEnrollment,
      invalidID: false,
      isExistingID: false,
      selectedOption: '',
      reset: false,
      isRegisteredOption: true,
    }
  }

  componentDidMount() {
    const {
      childEnrollmentId,
      contractID,
      customerId,
      materialIDKey,
      updateTentativeDEPValues,
      erpManufaturerId,
      enrollmentInfo,
      enrollmentInfoFromState,
    } = this.props
    const { isEnrolled, invalidID, isExistingID, reset } = this.state
    const enrollment =
      Object.keys(enrollmentInfo).length > 0 && enrollmentInfo[erpManufaturerId]
    const defaultPartner =
      enrollment && enrollment.defaultPartner ? enrollment.defaultPartner : null
    const isPartnersAvailable =
      enrollment && enrollment.partners && enrollment.partners.length > 0
    const {
      customerId: customerIdFromState,
      isNewEnrollment: isNewEnrollmentFromState,
    } = enrollmentInfoFromState
    const partners = enrollment ? enrollment.partners : []
    const customerIdFromStateDesc = partners.find((entry) =>
      entry.includes(customerIdFromState)
    )
    const customerIdDesc = partners.find((entry) => entry.includes(customerId))
    const defaultPartnerDesc = partners.find((entry) =>
      entry.includes(defaultPartner)
    )
    const customerIdInUse =
      customerIdFromStateDesc || customerIdDesc || defaultPartnerDesc
    const isNewEnrollment =
      typeof isNewEnrollmentFromState === 'undefined'
        ? isNewEnrollmentID(enrollmentInfo, erpManufaturerId, customerIdInUse)
        : isNewEnrollmentFromState
    const next = isNewEnrollment
      ? { enteredCustomerID: customerIdInUse }
      : { selectedCustomerID: customerIdInUse }
    const param = {
      childEnrollmentId,
      contractID,
      customerId: customerIdInUse,
      defaultCustomerID: customerId,
      DEPChecked: isEnrolled && isPartnersAvailable,
      isExistingID,
      invalidID: isPartnersAvailable ? invalidID : !customerIdInUse,
      isNewEnrollment,
      materialIDKey,
      reset,
    }
    this.setState(
      {
        isEnrolled: isEnrolled,
        invalidID: isPartnersAvailable ? invalidID : !customerIdInUse,
      },
      () => updateTentativeDEPValues({ ...param, ...next })
    )
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      childEnrollmentId,
      contractID,
      customerId,
      materialIDKey,
      updateTentativeDEPValues,
      enrollmentInfo,
      enrollmentInfoFromState,
      erpManufaturerId,
    } = this.props
    const { isEnrolled, invalidID, isExistingID, reset } = this.state
    const {
      customerId: customerIdFromState,
      isNewEnrollment: isNewEnrollmentFromState,
      enteredCustomerID,
      selectedCustomerID,
    } = enrollmentInfoFromState
    const customerIdInUse =
      typeof isNewEnrollmentFromState === 'undefined'
        ? customerId
        : isNewEnrollmentFromState
        ? enteredCustomerID
        : selectedCustomerID
    const isNewEnrollment =
      typeof isNewEnrollmentFromState === 'undefined'
        ? isNewEnrollmentID(enrollmentInfo, erpManufaturerId, customerIdInUse)
        : isNewEnrollmentFromState
    if (prevProps.customerId !== this.props.customerId) {
      const param = {
        childEnrollmentId,
        contractID,
        customerId: customerIdInUse,
        defaultCustomerID: customerId,
        isExistingID,
        invalidID,
        DEPChecked: isEnrolled,
        isNewEnrollment,
        materialIDKey,
        reset,
        enteredCustomerID,
        selectedCustomerID,
      }
      const next = isNewEnrollment
        ? { enteredCustomerID: customerIdInUse }
        : { selectedCustomerID: customerIdInUse }
      updateTentativeDEPValues({ ...param, ...next })
    }
  }

  render() {
    const { isEnrolled, invalidID, isExistingID, reset } = this.state
    const {
      bundleParentMaterialIDKey,
      childEnrollmentId,
      contractID,
      customerId,
      enrollmentInfo,
      erpManufaturerId,
      materialIDKey,
      numberOfItemsInCart,
      showCopyToAllLink,
      showProductImages,
      splitItems,
      isReadOnly,
      enrollmentInfoFromState,
      copyDEPValues,
    } = this.props
    const { isNewEnrollment, enteredCustomerID, selectedCustomerID } =
      enrollmentInfoFromState

    /* Set to state when user check or uncheck DEP option */

    const toggleEnabling = (isChecked) => {
      const {
        childEnrollmentId,
        contractID,
        customerId,
        materialIDKey,
        updateTentativeDEPValues,
        enrollmentInfo,
      } = this.props
      const enrollment = enrollmentInfo[erpManufaturerId]
      const defaultPartner =
        enrollment && enrollment.defaultPartner
          ? enrollment.defaultPartner
          : null

      const customerIdToUse = isChecked
        ? isNewEnrollment
          ? customerId
          : customerId || defaultPartner
        : null
      const { invalidID, isExistingID } = this.state
      const param = {
        childEnrollmentId,
        contractID,
        customerId: customerIdToUse,
        DEPChecked: isChecked,
        isExistingID,
        invalidID,
        isNewEnrollment: isChecked ? isNewEnrollment : false,
        materialIDKey,
        reset: false,
        enteredCustomerID: isNewEnrollment ? customerIdToUse : null,
        selectedCustomerID: isNewEnrollment ? null : customerIdToUse,
      }
      this.setState(
        {
          isEnrolled: isChecked,
          reset: false,
        },
        () => updateTentativeDEPValues(param)
      )
    }

    /* Set to state when user resets the current section */

    const handleClearFields = (
      childEnrollmentId,
      contractID,
      materialIDKey
    ) => {
      const param = {
        childEnrollmentId,
        contractID,
        customerId: null,
        DEPChecked: true,
        defaultCustomerID: null,
        materialIDKey,
        reset: true,
        enteredCustomerID: null,
        selectedCustomerID: null,
        isNewEnrollment: false,
      }
      this.setState(
        {
          reset: true,
        },
        () => this.props.updateTentativeDEPValues(param)
      )
    }

    /* Set to state when user copies data to all other sections */

    const handleCopyToAll = (contractID, materialIDKey) => {
      copyDEPValues({ contractID, materialIDKey })
    }

    /* Trigger split call user splits the line items */

    const splitDEPItems = () => {
      const splitReq = {
        enrollments: [
          {
            parentId:
              bundleParentMaterialIDKey > 0
                ? bundleParentMaterialIDKey
                : materialIDKey,
            contractId: contractID,
          },
        ],
      }
      splitItems(splitReq)
    }

    /* Set to state when user types in value */

    const handleUserInput = (value) => {
      const {
        childEnrollmentId,
        contractID,
        materialIDKey,
        updateTentativeDEPValues,
      } = this.props
      const { isEnrolled } = this.state
      const regexOutput = !/^(\d{6}|\d{7}|\d{8})$|^([a-zA-Z]\d[a-zA-Z]\d)/.test(
        value
      )
      //Repeating numbers and consecutive numbers are considered invalid, so we are adding them in a blacklist
      const blackListedEnrollmentId = new RegExp(
        '^([0]{6,8}|[1]{6,8}|[2]{6,8}|[3]{6,8}|[4]{6,8}' +
          '|[5]{6,8}|[6]{6,8}|[7]{6,8}|[8]{6,8}|[9]{6,8}' +
          '|123456|1234567|12345678|87654321|7654321|654321' +
          '|876543|8765432|765432)$'
      ).test(value)
      const existingID =
        enrollmentInfo[erpManufaturerId]?.partners.indexOf(value) > -1
      const customerIdToUse = !!value ? value : null
      const param = {
        childEnrollmentId,
        contractID,
        customerId: customerIdToUse,
        defaultCustomerID: customerId,
        DEPChecked: isEnrolled,
        isExistingID: existingID,
        invalidID: regexOutput || blackListedEnrollmentId,
        isNewEnrollment: true,
        enteredCustomerID: customerIdToUse,
        materialIDKey,
        reset: false,
      }
      this.setState(
        {
          isExistingID: existingID,
          invalidID: regexOutput || blackListedEnrollmentId,
        },
        () => updateTentativeDEPValues(param)
      )
    }

    /* Return default customer ID based on radio button type */

    const setDefaultCustomerID = (type) => {
      const { reset } = this.state
      if (type == 'select') {
        return reset ? null : selectedCustomerID
      } else {
        return reset ? null : enteredCustomerID
      }
    }

    /* Handle selection of radio buttons, to know if multiple option radio selected or user input radio selected */

    const handleEnrollmentIDSelection = (value) => {
      const {
        childEnrollmentId,
        contractID,
        customerId,
        materialIDKey,
        updateTentativeDEPValues,
      } = this.props
      const { isEnrolled, reset } = this.state
      const customerIdToUse = setDefaultCustomerID(value)
      const regexOutput = !/^(\d{6}|\d{7}|\d{8})$|^([a-zA-Z]\d[a-zA-Z]\d)/.test(
        customerIdToUse
      )
      const isNewEnrollment = value === 'input'

      const param = {
        childEnrollmentId,
        contractID,
        customerId: customerIdToUse,
        defaultCustomerID: customerId,
        DEPChecked: isEnrolled,
        invalidID: isNewEnrollment ? regexOutput : false,
        isExistingID: false,
        isNewEnrollment,
        materialIDKey,
        reset: false,
      }
      const more = isNewEnrollment
        ? { enteredCustomerID: customerIdToUse }
        : { selectedCustomerID: customerIdToUse }
      updateTentativeDEPValues({ ...param, ...more })
      this.setState({
        invalidID: isNewEnrollment ? regexOutput : false,
      })
    }

    /* Set to state when user selects from dropdown */

    const setSelectedEnrollmentID = ({ value }) => {
      const {
        childEnrollmentId,
        contractID,
        customerId,
        materialIDKey,
        updateTentativeDEPValues,
      } = this.props
      const { isEnrolled } = this.state

      const param = {
        childEnrollmentId,
        contractID,
        customerId: value,
        defaultCustomerID: customerId,
        DEPChecked: isEnrolled,
        invalidID: false,
        isExistingID: false,
        isNewEnrollment: false,
        materialIDKey,
        reset: false,
        selectedCustomerID: value,
      }
      this.setState(
        {
          reset: false,
          invalidID: false,
        },
        () => updateTentativeDEPValues(param)
      )
    }

    const enrollment = enrollmentInfo[erpManufaturerId]
    const enrollmentIDs =
      enrollment && enrollment.partners
        ? enrollment.partners.length > 0 &&
          enrollment.partners.map((option) => ({
            value: option,
            label: option,
          }))
        : []

    const defaultPartner =
      enrollment && enrollment.defaultPartner ? enrollment.defaultPartner : ''
    const isPartnersAvailable =
      enrollment && enrollment.partners && enrollment.partners.length > 0

    /* default should only be populated when enteredCustomerID is empty */
    const defaultEnrollmentID = reset
      ? null
      : !!enteredCustomerID
      ? null
      : defaultPartner

    return (
      <div className="row expanded text-center hide-for-print hide-for-email">
        <DEPInteractions
          bundleParentMaterialIDKey={bundleParentMaterialIDKey}
          childEnrollmentId={childEnrollmentId}
          contractID={contractID}
          handleClearFields={handleClearFields}
          handleCopyToAll={handleCopyToAll}
          isEnrolled={isEnrolled}
          isReadOnly={isReadOnly}
          materialIDKey={materialIDKey}
          numberOfItemsInCart={numberOfItemsInCart}
          showCopyToAllLink={showCopyToAllLink}
          showProductImages={showProductImages}
          splitDEPItems={splitDEPItems}
          toggleEnabling={toggleEnabling}
          enrollmentIDs={enrollmentIDs}
        />
        {isEnrolled && (
          <DEPEnrollments
            enrollmentIDs={enrollmentIDs}
            enteredCustomerID={enteredCustomerID}
            handleEnrollmentIDSelection={handleEnrollmentIDSelection}
            handleUserInput={handleUserInput}
            invalidID={invalidID}
            isExistingID={isExistingID}
            materialIDKey={materialIDKey}
            reset={reset}
            selectedCustomerID={selectedCustomerID}
            defaultEnrollmentID={defaultEnrollmentID}
            setSelectedEnrollmentID={setSelectedEnrollmentID}
            isRegisteredOption={isPartnersAvailable ? !isNewEnrollment : false}
          />
        )}
      </div>
    )
  }
}

DEPSection.propTypes = {
  customerId: PropTypes.string,
  enrollmentInfo: PropTypes.object.isRequired,
  erpManufaturerId: PropTypes.string.isRequired,
  isReadOnly: PropTypes.bool,
  materialIDKey: PropTypes.number.isRequired,
  numberOfItemsInCart: PropTypes.number.isRequired,
  showCopyToAllLink: PropTypes.bool.isRequired,
  showProductImages: PropTypes.bool.isRequired,
  updateTentativeDEPValues: PropTypes.func.isRequired,
}

DEPSection.defaultProps = {
  customerId: null,
  enrollmentInfo: {},
  isReadOnly: false,
}

export default DEPSection
