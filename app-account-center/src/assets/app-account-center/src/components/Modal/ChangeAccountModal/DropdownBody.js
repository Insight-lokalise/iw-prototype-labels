import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "@insight/toolkit-react/lib/Button/Button";
import Field from "@insight/toolkit-react/lib/Form/Field/Field";
import { t } from "@insight/toolkit-utils/lib/labels";

import DropdownSearchResult from "./DropdownSearchResult";

export default function DropdownBody(props) {
  const {
    children,
    currentItemId,
    handleSearch,
    handleSelect,
    type,
    listItems,
  } = props;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);

  return (
    <Fragment>
      <form className="c-form">
        <Field
          className="c-header-account-menu__search"
          fieldComponent={"Search"}
          fullwidth
          handleChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          name={type}
          placeholder={t("Search")}
          value={searchTerm}
        />
      </form>
      <ul className="o-list-bare  u-margin-bot-none  c-header-account-menu__results">
        {listItems.length > 0 ? (
          listItems.map((result) => (
            <li
              className="o-list-bare__item  c-header-account-menu__item"
              key={result.id}
            >
              <DropdownSearchResult
                isActive={currentItemId === result.id}
                onClick={handleSelect}
                result={result}
              />
            </li>
          ))
        ) : (
          <Button
            className="c-header-account-menu__btn"
            color="subtle"
            isDisabled
            fullWidth
            onClick={() => {}}
          >
            {t("No results found")}
          </Button>
        )}
      </ul>
      {children}
    </Fragment>
  );
}

DropdownBody.propTypes = {
  children: PropTypes.node,
  currentItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  listItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  type: PropTypes.string.isRequired,
};

DropdownBody.defaultProps = {
  children: null,
};
