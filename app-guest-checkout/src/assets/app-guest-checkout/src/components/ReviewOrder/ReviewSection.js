import React from 'react';
import PropTypes from 'prop-types';
import {Panel} from "@insight/toolkit-react";
import { t } from '@insight/toolkit-utils/lib/labels'

const ReviewSection = ({ title, onEdit, isEditable, children }) => {
  return (
    <div>
      <Panel className="c-review-section">
        <Panel.Title className="c-review-section-title">
          <Panel.Title.Left>
            <h2 className="u-h5 u-text-bold u-margin-bot-none">
              {title}
            </h2>
          </Panel.Title.Left>
          { isEditable && (
            <Panel.Title.Button
              data-testid="personal-info-edit-btn"
              icon="create"
              className="c-section-edit-icon"
              onClick={() => onEdit()}
            >
                <span className="u-hide-visually">
                  {t(`Edit ${title}`)}
                </span>
            </Panel.Title.Button>
          )}
        </Panel.Title>
        <Panel.Body>
          {children}
        </Panel.Body>
      </Panel>
    </div>
  );
};

ReviewSection.propTypes = {
  title: PropTypes.string.isRequired,
  onEdit: PropTypes.func,
  isEditable: PropTypes.bool,
};

ReviewSection.defaultProps = {
  onEdit: () => {},
  isEditable: false,
};

export default ReviewSection;
