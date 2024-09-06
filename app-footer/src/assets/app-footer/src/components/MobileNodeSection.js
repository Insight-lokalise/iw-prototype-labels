import React from 'react'
import PropTypes from "prop-types";
import cn from 'classnames'
import Button from "@insight/toolkit-react/lib/Button/Button";
import Icon from "@insight/toolkit-react/lib/Icon/Icon";
import { Accordion } from "@insight/toolkit-react"

export default function MobileNodeSection({ columns, excludedLinks, index, term }) {
  const content = (
    <ul className="o-list-bare  u-margin-bot-none">
      {term.nodes.map((link, index) => (
      excludedLinks[link.id] ? null :
      <li className="c-footer__mobile-list-item" key={index}>
        <Button color={link.type == "button" ? "primary" : "tertiary-link"} size="small" href={link.href}>
          {link.icon && <Icon icon={link.icon} />}{link.title}
        </Button>
      </li>
      ))}
    </ul>
  )
  const label = term.title
  return (
    <div className={`o-grid__item  u-1/1 u-1/${columns}@desktop`} key={index}>
      <Accordion
        className="c-footer-accordion"
        items={[{
          className: {
            content: 'c-footer-accordion__content',
            control: 'c-footer-accordion__controls',
            item: 'c-footer-accordion__item',
          },
          content: content,
          id: index,
          label: label,
        }]}
        theme="dark"
      />
    </div>
  )
}

MobileNodeSection.propTypes = {
  columns: PropTypes.number.isRequired,
  excludedLinks: PropTypes.shape({}),
  index: PropTypes.number.isRequired,
  term: PropTypes.shape({}).isRequired
}

MobileNodeSection.defaultProps = {
  excludedLinks: {}
}