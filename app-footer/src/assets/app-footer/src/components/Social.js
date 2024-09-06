import React from "react";
import PropTypes, { string } from "prop-types";
import Button from "@insight/toolkit-react/lib/Button/Button";
import SocialIcon from "@insight/toolkit-react/lib/SocialIcon/SocialIcon";
import SocialIconSymbols from "@insight/toolkit-react/lib/SocialIcon/SocialIconSymbols";

export default function Social({ nodes }) {
  return (
    <div className="c-footer-padding  c-footer-social">
      <SocialIconSymbols />
      <ul className="o-list-inline  c-footer-social__list">
        {nodes.map(({ id, name, href, title }) => {
          return (
            <li key={id} className="o-list-inline__item">
              <Button
                aria-label={title}
                color="tertiary"
                size="small"
                href={href}
                className="c-footer-social__link"
              >
                <SocialIcon brandColorOnHover icon={name} title={title} />
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

Social.defaultProps = {
  nodes: [{ id: "", name: "", href: "", title: "" }],
};
Social.propTypes = {
  nodes: PropTypes.arrayOf(
    PropTypes.shape({ id: string, name: string, href: string, title: string })
  ),
};
