import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Button from "@insight/toolkit-react/lib/Button/Button";

export default function FooterHelp({ excludedLinks, helpLinks }) {
  const filteredHelpLinks = helpLinks.filter(node => !excludedLinks[node.id])
  const columns = Math.max(1, filteredHelpLinks.length)
  return (
    <div className='c-footer-gradient'>
      <ul className='o-list-bare  o-grid  u-margin-bot-none'>
        {filteredHelpLinks.map((item, index) => (
          item.type === 'button' ? (
            <li className={`o-grid__item  u-1/1 u-1/${columns}@desktop  c-footer-gradient__list-item`} key={index}>
              <Button color="tertiary" href={item.href} icon={item.icon}>
                {item.title}
              </Button>
            </li>
          ) : (
            <li className={`o-grid__item  u-1/1 u-1/${columns}@desktop  c-footer-gradient__list-item`} key={index}>
              <h5 className="c-footer-gradient__list-item u-text-bold">{item.description || item.title}</h5>
            </li>
          )
        ))}
      </ul>
    </div>
  )
}

FooterHelp.propTypes = {
  helpLinks: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  excludedLinks: PropTypes.shape({})
}

FooterHelp.defaultProps = {
  excludedLinks: {},
}
