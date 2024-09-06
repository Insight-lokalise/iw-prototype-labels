import React, { useContext } from "react";
import PropTypes from "prop-types";

import { LanguageContext } from "../../lib";
import Tag from "./Tag";
import TagProvider from "../../containers/TagProvider";

export default function TagList({ padding, tagOrder, hideTagText }) {
  const { language } = useContext(LanguageContext);

  return (
    <TagProvider>
      {({ tagDictionary }) => {
        return (
          <div className="o-grid">
            {tagOrder.map((tagNumber) => {
              const tagDetails = tagDictionary[tagNumber];
              return tagDetails ? (
                <div
                  key={tagNumber}
                  className="o-grid__item u-1/1 o-grid__item--shrink"
                >
                  <Tag
                    hideTagText={hideTagText}
                    color={tagDetails.color}
                    padding={padding}
                    text={tagDetails.name[language]}
                  />
                </div>
              ) : null;
            })}
          </div>
        );
      }}
    </TagProvider>
  );
}

TagList.propTypes = {
  padding: PropTypes.bool,
  tagOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  hideTagText: PropTypes.bool
};

TagList.defaultProps = {
  hideTagText: false,
  padding: true
};
