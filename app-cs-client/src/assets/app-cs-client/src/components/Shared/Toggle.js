import React from "react";
import PropTypes from "prop-types";
import { Button } from "@insight/toolkit-react";
import { t } from "@insight/toolkit-utils";

// add on key press
export default function Toggle({ label, ariaLabel, isToggled, onClick }) {
  return (
    <div className="o-grid o-grid--justify-right">
      <div className="o-grid__item u-3/4 u-text-right u-margin-right-small">
        <span>{label}</span>
      </div>
      <div
        className={`o-grid__item o-grid__item--shrink u-text-${
          isToggled ? "right" : "left"
        }`}
      >
        <span
          className={`c-cs-toggle c-cs-toggle__slider c-cs-toggle__round c-cs-toggle__action${
            isToggled ? "--on" : "--off"
          }`}
        >
          <Button
            aria-label={ariaLabel}
            className="c-cs-toggle__action"
            onClick={onClick}
          />
        </span>

        <span className="c-cs-toggle__toggle-text u-font-size-tiny">
          {isToggled ? t("On") : t("Off")}
        </span>
      </div>
    </div>
  );
}

Toggle.propTypes = {
  label: PropTypes.string,
  ariaLabel: PropTypes.string.isRequired,
  isToggled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

Toggle.defaultProps = {
  label: '',
  isToggled: true
};
