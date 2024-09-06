import React, { useState } from 'react';
import { t, validateEmail } from '@insight/toolkit-utils';
import { updateReportEmail } from "../../api/index";
import { REPORTING_TEXTS } from '../../texts';
import { Button, Field, Icon, Loading, Message } from '@insight/toolkit-react';

const { VIEW_REPORT_MODAL_TEXTS, REPORT_OPTIONS } = REPORTING_TEXTS;
const { ADD_NEW, SAVE, EMAIL_ERROR, EMAIL_UPDATE_FAILED } = VIEW_REPORT_MODAL_TEXTS;
const getSplittedValues = (value, delimiter) => {
  return value?.split(delimiter);
}
const getValue = (e, email) => {
  const targetValue = e?.target?.value;
  if (typeof targetValue === "undefined" || targetValue === null) {
    return email;
  }
  return e?.target?.value;
}

const EditReportEmail = (props) => {
  const {
    emailField,
    trackingNumber,
    editMode,
    setEditMode,
  } = props;
  let initialEmails = emailField ? getSplittedValues(emailField, /,\s*|,/) : [];
  const [emailList, setEmailList] = useState(initialEmails);
  const [emails, setEmails] = useState(emailList);
  const [emailError, setEmailError] = useState(null);
  const [loader, setLoader] = useState(false);
  const reportDefinitionModalClass = 'c-reporting__report-modal';

  const handleEmailChange = (index, value, addEmail = true) => {
    const updatedEmails = [...emails];
    if (addEmail) {
      updatedEmails[index] = value || '';
    } else {
      updatedEmails.splice(index, 1);
    }
    setEmails(updatedEmails);
  }

  const validateEmails = () => {
    return emails.every((email) => validateEmail(email));
  }

  const handleSave = async () => {
    const valid = validateEmails();
    setEmailError(valid ? null : t(EMAIL_ERROR));
    if (valid) {
      try {
        const email = emails?.join?.(",");
        if (email) {
          const payload = {
            instanceId: parseInt(trackingNumber),
            email
          };
          setLoader(true);
          const data = await updateReportEmail(payload);
          const resp = data === 'Sucess';
          if (resp) {
            setEditMode(false);
            setEmailList(emails);
          }
          setEmailError(resp ? null : t(EMAIL_UPDATE_FAILED));
        }
      } finally {
        setLoader(false);
      }
    }
  }

  if (editMode) {
    if(loader) {
      return <Loading />;
    }
    const fields = emails.map((email, index) => {
      return <div className={`${reportDefinitionModalClass}__email-wrapper`}>
        <Field
          fieldComponent="Text"
          className={`${reportDefinitionModalClass}__email`}
          handleChange={(e) => handleEmailChange(index, getValue(e, email))}
          value={email}
        />
        {index !== 0 && (
          <Button color="inline-link" onClick={() => handleEmailChange(index, '', false)} >
            <Icon color="primary" icon="trashcan" />
          </Button>
        )}
      </div>
    });

    const emailEditBtnClass = `${reportDefinitionModalClass}__action-btn`;
    return <div>
      {fields}
      {emailError && (
        <Message type="error" className="c-form__error">{emailError}</Message>
      )}
      <div className={`${reportDefinitionModalClass}__action-btn-wrapper`}>
        <Button color="link" className={emailEditBtnClass}
          onClick={() => {
            setEmails(emailList);
            setEditMode(false);
            setEmailError(null);
          }}
        >
          {t(REPORT_OPTIONS.CANCEL)}
        </Button> |
        <Button color="link" className={emailEditBtnClass}
          onClick={() => handleEmailChange(emails?.length)}
        >
          {t(ADD_NEW)}
        </Button> |
        <Button color="link" className={emailEditBtnClass}
          onClick={handleSave}
        >
          {t(SAVE)}
        </Button>
      </div>
    </div>
  }

  return emails.map((email, index) => {
    return <div className={`${reportDefinitionModalClass}__email-wrapper`}>
      <span>{email}</span>
      {index === 0 && (
        <Button color="inline-link" onClick={() => setEditMode(true)} >
          <Icon color="primary" icon="create" />
        </Button>
      )}
    </div>
  });
}

export default EditReportEmail;