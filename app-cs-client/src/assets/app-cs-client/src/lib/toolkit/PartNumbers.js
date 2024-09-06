import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

export default function PartNumbers({ className, inline, insightPart, mfrPart, unspsc }) {
  const classNames = cn(
    'c-structured-list c-pdp__details--table',
    { 'c-structured-list--inline': inline },
    className
  )
  return (
    <table className={classNames}>
      <caption className="c-structured-list__caption u-hide-visually">Part numbers</caption>
      <tbody className="c-structured-list__items">
        {insightPart && (
          <tr className="c-structured-list__item">
            <th className="c-structured-list__term c-pdp__details--table-row" scope="row">Insight #:</th>
            <td className="c-structured-list__description c-pdp__details--table-row">{insightPart}</td>
          </tr>
        )}
        {mfrPart && (
          <tr className="c-structured-list__item" >
            <th className="c-structured-list__term c-pdp__details--table-row" scope="row">Mfr #:</th>
            <td className="c-structured-list__description c-pdp__details--table-row">{mfrPart}</td>
          </tr>
        )}
        {unspsc && (
          <tr className="c-structured-list__item">
            <th className="c-structured-list__term c-pdp__details--table-row" scope="row">UNSPSC #:</th>
            <td className="c-structured-list__description c-pdp__details--table-row">{unspsc}</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

PartNumbers.propTypes = {
  className: PropTypes.string,
  inline: PropTypes.bool,
  insightPart: PropTypes.string,
  mfrPart: PropTypes.string,
  unspsc: PropTypes.string,
};

PartNumbers.defaultProps = {
  className: '',
  inline: false,
  insightPart: '',
  mfrPart: '',
  unspsc: '',
};
