import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Button from "@insight/toolkit-react/lib/Button/Button";
import Flag from "@insight/toolkit-react/lib/Flag/Flag";
import Lozenge from "@insight/toolkit-react/lib/Lozenge/Lozenge";
import { t } from "@insight/toolkit-utils/lib/labels";

export default function DropdownSearchResult(props) {
  const { isActive, onClick, result } = props;

  return (
    <Fragment>
      <Button
        className="c-header-account-menu__btn"
        color="subtle"
        isDisabled={isActive}
        fullWidth
        onClick={() => {
          onClick(result);
        }}
      >
        {result.cssCountryFlag && (
          <span className="c-header-account-menu__flag">
            <Flag country={result.cssCountryFlag} />
          </span>
        )}
        {result.displayName}
      </Button>
      {isActive && (
        <Lozenge color="info" className="c-header-account-menu__status">
          {t("Current")}
        </Lozenge>
      )}
    </Fragment>
  );
}

DropdownSearchResult.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  result: PropTypes.shape({
    cssCountryFlag: PropTypes.string,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
};
