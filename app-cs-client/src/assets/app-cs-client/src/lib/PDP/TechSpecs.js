import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Button, Icon } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export default function TechSpecs({ technicalSpecs }) {
  const [expanded, setExpanded] = useState(true)
  return (
    <Fragment>
      <div className={cn('o-grid__item u-1/1 u-margin-bot-small', {'c-pdp__tech-specs--info': expanded})}>
        {technicalSpecs.map(({ label, details }) => (
          <div className='c-pdp__tech-specs' key={label}>
            <h5 className='c-pdp__tech-specs--title u-text-bold u-padding-top-small u-margin-bot-tiny'>{label}</h5>
            <table className='c-pdp__tech-specs--table'>
              <tbody>
                {details.map(({ label, value }) => (
                  <tr key={label} className='o-grid u-padding-tiny c-pdp__tech-specs--table-row'>
                    <div className='o-grid__item u-1/2'>
                      <td className='c-pdp__tech-specs--table-data'>{label}</td>
                    </div>
                    <div className='o-grid__item u-1/2'>
                      <td className='c-pdp__tech-specs--table-data'>{value}</td>
                    </div>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <div className="o-grid o-grid--justify-center">
        <div className='o-grid__item o-grid__item--shrink'>
          <Button onClick={() => setExpanded(!expanded)} color="link">
            <Icon className="u-margin-right-tiny" icon="add-circled--outline" title="expand section" size="small" />{expanded ? t('See complete specification') : t('Minimize specifications')}
          </Button>
        </div>
      </div>
    </Fragment>
  )
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
