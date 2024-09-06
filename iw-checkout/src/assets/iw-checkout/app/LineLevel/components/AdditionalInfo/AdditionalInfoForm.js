import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { FormSection,reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import { IWTextAreaField } from '../../../../libs/iw-components/iw-form'
import { IWButton,IWFileUpload } from './../../../../libs/iw-components'
import ContactFormSection from './ContactFormSection'
import HeaderLevelSmartTrackerFields from './HeaderLevelSmarttrackerFields'

function AdditionalInfoForm(props) {
  const continueText = t('Continue')
  const{
    clearSetAsMyDefault,
    fileUploadInformation,
    handleFileSubmit,
    handleSubmit,
    handleDeleteFile,
    handleFormSubmit,
    hasAdditionalOrderNotes,
    hasFileUpload,
    hasHeaderLevelSmartTrackers,
    hasInvoiceNotes,
    hasLabConfigurationNotes,
    hasSharedUserFields,
    hasWarrantyFields,
    headerLevelSmartTrackers,
    isAPAC,
    isCES,
    isEditChkoutDefaultFavs,
    isEMEA,
    isFileUploadPending,
    isLimitedUser,
    isNavy,
    isReadOnly,
    isSingleWebGroup,
    isSharedUser,
    navySTName,
    orderMetaData,
    setErrorFlag,
    warrantyContactNameMaxLength
  } = props
  const isCESLimitedUser = isLimitedUser && isCES
  return (
    <div className="row expanded is-collapse-child">
      <div className="column">
        <form noValidate className="form" onSubmit={handleSubmit(handleFormSubmit)}>
          {hasHeaderLevelSmartTrackers &&
            <HeaderLevelSmartTrackerFields {...props}
              clearSetAsMyDefault={(fieldName, value)=>clearSetAsMyDefault('AdditionalInfoForm', fieldName, value)}
              headerLevelSmartTrackers={headerLevelSmartTrackers}
              isEditChkoutDefaultFavs={isEditChkoutDefaultFavs}
              isLimitedUser={isLimitedUser}
              isNavy={isNavy}
              isSingleWebGroup={isSingleWebGroup}
              navySTName={navySTName}
              orderSmartTrackers={orderMetaData.smartTracker}
            />
           }
          {((hasSharedUserFields && !isCES) || isCESLimitedUser) &&
            <ContactFormSection
                headerText={t('Since you are using a shared account, you need to enter your personal information so we know who placed the order.')}
                isAPAC={isAPAC}
                isEMEA={isEMEA}
                isEmailReadOnly={isLimitedUser}
                sectionName="userContact"
                showHeaderText={!isLimitedUser}
                isSharedUser={isSharedUser}
                setErrorFlag={setErrorFlag}
            />
           }
          {hasWarrantyFields &&
            <ContactFormSection
                headerText={t('To authorize warranty purchases, our partners require certain contact information for warranty purchases on insight.com.')}
                isAPAC={isAPAC}
                isEMEA={isEMEA}
                sectionName="warrantyContact"
                showHeaderText={true}
                nameMaxLength={warrantyContactNameMaxLength}
                isSharedUser={isSharedUser}
                setErrorFlag={setErrorFlag}
            />
           }
          <FormSection name="additionalOrderInformation">
            <div className="row expanded">
              <div className="columns small-12 medium-8">
                {hasAdditionalOrderNotes &&
                  <IWTextAreaField
                    label={t('Additional Notes for this order')}
                    maxLength={300}
                    name='orderNotes'
                  />
                }
                {hasLabConfigurationNotes &&
                  <IWTextAreaField
                    label={t('Lab config notes')}
                    maxLength={300}
                    name='labConfigNotes'
                  />
                }
                {hasInvoiceNotes &&
                  <IWTextAreaField
                    label={t('Invoice notes')}
                    maxLength={60}
                    name='invoiceNotes'
                  />
                }
              </div>
              <div className="columns small-12 medium-4 large-4">
                {hasFileUpload &&
                  <IWFileUpload
                    handleDeleteFile={handleDeleteFile}
                    handleFileSubmit={handleFileSubmit}
                    isUploadPending={isFileUploadPending}
                    label={t('File upload')}
                    name='file'
                    uploadedFileName={fileUploadInformation ? fileUploadInformation.displayName : null}
                  />
                }
              </div>
            </div>
          </FormSection>
          { !isReadOnly &&
            <div className="row expanded align-right text-right">
              <div className="column small-12 medium-shrink">
                <IWButton className="expanded section__button no-margin-bot" type="submit" >
                  { continueText }
                </IWButton>
              </div>
            </div>
          }
        </form>
      </div>
    </div>
  )
}


AdditionalInfoForm.propTypes = {
  clearSetAsMyDefault: PropTypes.func,
  fileUploadInformation: PropTypes.object,
  handleFileSubmit: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  hasAdditionalOrderNotes: PropTypes.bool,
  hasFileUpload: PropTypes.bool,
  hasHeaderLevelSmartTrackers: PropTypes.bool,
  hasInvoiceNotes: PropTypes.bool,
  hasLabConfigurationNotes: PropTypes.bool,
  hasSharedUserFields: PropTypes.bool,
  hasWarrantyFields: PropTypes.bool,
  headerLevelSmartTrackers: PropTypes.array.isRequired,
  initialValues: PropTypes.object.isRequired,
  isEditChkoutDefaultFavs: PropTypes.bool,
  isFileUploadPending: PropTypes.bool,
  isLimitedUser: PropTypes.bool,
  isNavy: PropTypes.bool,
  isSingleWebGroup: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  navySTName: PropTypes.string,
  warrantyContactNameMaxLength: PropTypes.number,
  isCES: PropTypes.bool,
  formErrors: PropTypes.array,
  isSharedUser: PropTypes.bool,
  setErrorFlag: PropTypes.func
}

export default reduxForm({
  destroyOnUnmount: true,
  enableReinitialize: true,
  form: 'AdditionalInfoForm',
  keepDirtyOnReinitialize: true,
})(AdditionalInfoForm)
