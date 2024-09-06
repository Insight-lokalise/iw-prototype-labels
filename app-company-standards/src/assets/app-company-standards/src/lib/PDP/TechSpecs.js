import React from 'react'
import PropTypes from 'prop-types'

export default function TechSpecs({ technicalSpecs }) {
  return technicalSpecs.map(({ label, details }) => (
    <div className='c-pdp__tech-specs' key={label}>
      <h5 className='c-pdp__tech-specs--title u-text-bold u-padding-top-small u-margin-bot-tiny'>{label}</h5>
      <table className='c-pdp__tech-specs--table'>
        <tbody>
          {details.map(({ label, value }) => (
            <tr key={label} className='o-grid u-padding-tiny c-pdp__tech-specs--table-row'>
              <td className='o-grid__item u-1/2 c-pdp__tech-specs--table-data'>{label}</td>
              <td className='o-grid__item u-1/2 c-pdp__tech-specs--table-data'>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ))
}

TechSpecs.propTypes = {
  technicalSpecs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    details: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })).isRequired,
  })).isRequired,
}