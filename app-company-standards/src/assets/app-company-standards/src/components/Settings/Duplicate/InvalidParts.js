import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {t} from "@insight/toolkit-utils";
import { Button } from '@insight/toolkit-react'

export default function InvalidParts({ exportFile, parts }) {
    return (
        <div className="c-invalid-parts">
            <div className="c-invalid-parts__title">{t("Invalid parts")}</div>
            { parts.length === 0 ? (
              t("No invalid parts.")
            ) : (
              <Fragment>
                {parts.map(part => <div className="c-invalidParts__part" key={part}>{part}</div>) }
                <Button onClick={exportFile}>
                    {t('Export as file')}
                </Button>
              </Fragment>
            )}
        </div>
    )
}

InvalidParts.propTypes = {
  exportFile: PropTypes.func.isRequired,
  parts: PropTypes.arrayOf(PropTypes.string)
}

InvalidParts.defaultProps = {
  parts: []
}