import React from 'react'
import PropTypes from "prop-types";
import cn from 'classnames'
import Button from "@insight/toolkit-react/lib/Button/Button";
import Icon from "@insight/toolkit-react/lib/Icon/Icon";

export default function NodeSection({ columns, excludedLinks, index, isMobile, term }) {
  return (
    <div className={`o-grid__item  u-1/1 u-1/${columns}@desktop`} key={index}>
      <div className="c-footer-padding-large">
        <h2 className={`c-footer__heading  u-h6`}>{term.title}</h2>
        <ul className="o-list-bare  u-margin-bot-none">
          {term.nodes.map((link, index) => (
            (excludedLinks[link.id] || link.name === 'connect-with-insight') ? null : (
              <li
                className={`c-footer__list-item  ${(link.name === "read-the-magazine" ? (isMobile ? "c-footer--magazine__mobile" : "c-footer--magazine") : null)}`}
                key={index}
              >
                {link.type ==='text' ? (
                  <span className="c-footer__text">
                    {link.description || link.title}
                  </span>
                ) : ( 
                  <Button
                    className={`c-footer__list-${link.type == 'button' ? 'button' : 'link'}`}
                    color={link.type == "button" ? "primary" : "tertiary-link"}
                    size="small"
                    href={link.href}
                  >
                    {link.icon && <Icon icon={link.icon} />}{link.title}
                  </Button>
                )}
                {link.nodes ? link.nodes.map((sublink) => ( sublink.name !=="tech-journal" ? null : (
                  <div>
                    <Button color="link" className={`c-footer--techjournal}`} size="small" href={sublink.href}>
                      <img
                        className="c-footer--techjournal"
                        alt='Tech Journal Magazine'
                        src="/content/dam/insight-web/logos/techjournal-logo.png"
                      />
                    </Button>
                  </div>
                ))) : null }
              </li>
            )
          ))}
        </ul>
      </div>
    </div>
  )
}

NodeSection.propTypes = {
  columns: PropTypes.number.isRequired,
  excludedLinks: PropTypes.shape({}),
  index: PropTypes.number.isRequired,
  isMobile: PropTypes.boolean,
  term: PropTypes.shape({}).isRequired
}

NodeSection.defaultProps = {
  excludedLinks: {},
  isMobile: false,
}