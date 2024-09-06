import React, { useState, useEffect } from "react";
import { Button, Modal, Message } from '@insight/toolkit-react';
import { t } from '@insight/toolkit-utils';
import { REPORT_DEFINITION_LABELS, REPORTING_TEXTS } from '../../texts';
import { getReportDefinition } from "../../api/index";
import {
  ACCOUNT_LEVELS,
  DELIMITER_TYPES,
  DELIVERY_METHODS,
  VIEW_REPORT_MODAL_FIELD_IDS,
  VIEW_REPORT_MODAL_FIELDS
} from './ReportDefinitionModalFields';
import EditReportEmail from "./EditReportEmail";

const { REPORT_OPTIONS } = REPORTING_TEXTS;

const {
  EMAIL, FTPLOCATION, TRACKINGNUMBER, ACCOUNTLEVEL,
  DELIVERYMETHOD, DELIMITERTYPE, DELIMITERVALUE,
} = VIEW_REPORT_MODAL_FIELD_IDS;

const ReportDefinitionModal = ({ handleViewReport, trackingNumber }) => {
  const [loader, setLoader] = useState(true);
  const [report, setReport] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);

  const reportDefinitionModalClass = 'c-reporting__report-modal';
  const gridItem1by2Class = 'o-grid__item u-1/2';

  const fetchReportData = async () => {
    try {
      const data = await getReportDefinition(trackingNumber);
      setReport(data);
    } finally {
      setLoader(false);
    }
  }

  useEffect(() => {
    fetchReportData();
  }, []);

  const renderArrayField = (field) => {
    return report[field.id]?.map?.((item) => {
      return <div>{item[field.key]}</div>
    });
  }

  // Render Fields
  const getFieldValue = (field) => {
    const fieldValue = report[field.id];

    // Tracking number
    if (field.id === TRACKINGNUMBER) {
      return trackingNumber;
    }

    // Email
    if (field.id === EMAIL) {
      return <EditReportEmail
        editMode={editMode}
        setEditMode={setEditMode}
        emailField={report[field.id]}
        trackingNumber={trackingNumber}
      />;
    }

    // Delimiter
    if (field.id === DELIMITERTYPE) {
      const delimeterType = report[field.id];
      return t(DELIMITER_TYPES[delimeterType]) || report[DELIMITERVALUE];
    }

    // Account Level
    if (field.id === ACCOUNTLEVEL) {
      const accountLevel = report[field.id];
      return t(ACCOUNT_LEVELS[accountLevel]);
    }

    return Array.isArray(fieldValue) ? renderArrayField(field) : `${fieldValue}`;
  }

  const shouldDisplayField = (field) => {
    if (field.id === TRACKINGNUMBER) {
      return true;
    }

    const fieldValue = report[field.id];
    let display = fieldValue;
    if (fieldValue) {
      const checkEmailRegex = /Enter up/;
      // EMAIL
      if (field.id === EMAIL && checkEmailRegex.test(fieldValue)) {
        display = false;
      }
      // FTP Location
      else if (field.id === FTPLOCATION && report[DELIVERYMETHOD] !== DELIVERY_METHODS.FTP) {
        display = false;
      }
    }
    return display;
  }

  const renderModalBody = () => {
    if (!report) {
      return null;
    }

    return (
      <ul className={`${reportDefinitionModalClass}__content o-list-bare`}>
        {
          VIEW_REPORT_MODAL_FIELDS.map((field) => {
            if (!shouldDisplayField(field)) {
              return null;
            }

            return <li className="o-grid">
              <div className={`${gridItem1by2Class} u-text-bold`}>
                {t(field.label)}:
              </div>
              <div className={gridItem1by2Class}>
                {getFieldValue(field)}
              </div>
            </li>
          })
        }
      </ul>
    );
  }

  const handleModalClose = (closeModal = false) => {
    if (editMode && !closeModal) {
      setConfirmationModal(true);
    } else {
      handleViewReport(null);
      setConfirmationModal(false);
    }
  }

  const closeConfirmationModal = () => setConfirmationModal(false);

  const renderDefinitionModal = () => {
    return <Modal
      isOpen
      size='medium'
      isLoading={loader}
      onClose={() => handleModalClose()}
      className={reportDefinitionModalClass}
    >
      <Modal.Header>
        <h2 className="u-text-bold">{t(REPORT_OPTIONS.VIEW)}</h2>
      </Modal.Header>
      <Modal.Body id={`${reportDefinitionModalClass}__body`} className={`${reportDefinitionModalClass}__body`}>
        {renderModalBody()}
      </Modal.Body>
      <Modal.Footer>
        <Button color="primary" onClick={() => handleModalClose()}>
          {t(REPORT_OPTIONS.CLOSE)}
        </Button>
      </Modal.Footer>
    </Modal>
  }

  const renderConfirmationModal = () => {
    return <>
      <Modal
        isOpen
        onClose={closeConfirmationModal}
        className={`${reportDefinitionModalClass}__confirmation`}
      >
        <Modal.Body id={`${reportDefinitionModalClass}__body`} >
          <Message type="error">{t(REPORT_DEFINITION_LABELS.UNSAVED_CHANGES)}</Message>
        </Modal.Body>
        <Modal.Footer>
          <Button color="link" onClick={closeConfirmationModal}>
            {t(REPORT_OPTIONS.CANCEL)}
          </Button>
          <Button color="primary" onClick={() => handleModalClose(true)}>
            {t(REPORT_OPTIONS.CLOSE)}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  }

  return (
    <>
      {renderDefinitionModal()}
      {confirmationModal && renderConfirmationModal()}
    </>
  );
}

export default ReportDefinitionModal;