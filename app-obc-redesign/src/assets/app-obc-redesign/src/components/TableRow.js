import  React from 'react'
import { Button, Field } from '@insight/toolkit-react'
import PropTypes from 'prop-types'

export default function TableRow (props) {

  const orderOptions = props.orderOptions.map((option) => {
    return {
      text: option.toString(),
      id: `order-${option}`
    }
  })

  const obcFieldOptions = props.obcFieldOptions.map(value => {
    return {
      text: value,
      id: `fieldname-${value}`
    }
  })

  return (
    <tr className="c-table__row" id={props.id}>
      <td className="c-table__cell" data-label="Order Number">
        <div className="c-select-container">
          <Field fieldComponent="Select" handleChange={props.handleOrderSelect} name="orderNumber" value={props.fieldOrder.toString()} options={orderOptions} />
        </div>
      </td>
      <td className="c-table__cell" data-label="Fieldname">
        <div className="c-select-container">
          <Field fieldComponent="Select" handleChange={props.updateField} name="elementName" value={props.fieldName} options={obcFieldOptions} />
        </div>
      </td>
      <td className="c-table__cell" data-label="Header">
        <Field fieldComponent="Text" handleChange={props.updateField} name="elementHeader" value={props.fieldHeader} />
      </td>
      <td className="c-table__cell" data-label="Specific Value">
        <Field fieldComponent="Text" handleChange={props.updateField} name="elementSpecificValue" value={props.fieldValue} />
      </td>
      <td className="c-table__cell" data-label="Max Length">
        <Field fieldComponent="Number" handleChange={props.updateField} name="elementMaxLength" value={props.fieldMaxLength} />
      </td>
      <td><Button color="primary" onClick={props.handleDelete} >Delete</Button></td>
    </tr>
  )
}

TableRow.propTypes = {
  orderOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
  obcFieldOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  fieldOrder: PropTypes.number.isRequired,
  handleOrderSelect: PropTypes.func.isRequired,
  fieldName: PropTypes.string.isRequired,
  updateField: PropTypes.func.isRequired,
  fieldHeader: PropTypes.string.isRequired,
  fieldValue: PropTypes.string.isRequired,
  fieldMaxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  handleDelete: PropTypes.func.isRequired
}
