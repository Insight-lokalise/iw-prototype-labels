import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import TagIcon from "./TagIcon";

export default function Tag({ text, color, hideTagText, padding }) {
  return (
    <div className={cn("o-grid", { color, "c-tag": padding })}>
      <div className="o-grid__item o-grid__item--shrink u-margin-right-tiny" title={text}>
        <TagIcon color={color} />
      </div>
      {hideTagText ? null : (
        <div className="o-grid__item o-grid__item--shrink">
          <span className="u-font-size-tiny">{text}</span>
        </div>
      )}
    </div>
  );
}

Tag.propTypes = {
  color: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  hideTagText: PropTypes.bool,
  padding: PropTypes.bool,
};

Tag.defaultProps = {
  hideTagText: false,
  padding: true
}
