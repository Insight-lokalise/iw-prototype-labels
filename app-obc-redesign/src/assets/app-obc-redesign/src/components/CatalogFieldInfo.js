import  React, { Component, Fragment } from 'react'
import axios from 'axios'
import { Button, Loading, Message } from '@insight/toolkit-react'
import { FieldError } from "@insight/toolkit-react/lib/Form/Components/Decorators";
import uuid from 'uuid/v4';
import AppContext from '../context/AppProvider'
import {
  deleteCatalogFields,
  fetchOBCFieldOptions,
  updateCatalogFieldsData,
  fetchOBCClientConfigs
} from 'api'
import TableRow from './TableRow'

class CatalogFieldInfo extends Component {
  state = {
    catalogFields: [],
    obcFieldOptions: null,
    loadingStep: 0,
    submitLoading: false,
    apiStatus: "",
    apiStatusMessage: "",
    removedIds: [],
  }

  componentDidMount() {
    const { catalogId } = this.context
    fetchOBCFieldOptions().then((response) => {
      const { loadingStep } = this.state
      this.setState({obcFieldOptions: response.data, loadingStep: loadingStep + 1 });
    });
    fetchOBCClientConfigs(catalogId).then((response) => {
      const { loadingStep } = this.state
      this.setState({catalogFields: response.data, loadingStep: loadingStep + 1 })
    })
  }

  getField = (id) => {
    return this.state.catalogFields.find(field => field.id === id)
  }

  getFieldIndex = (id) => {
    return this.state.catalogFields.findIndex(field => field.id === id)
  }

  updateField = id => ({currentTarget: fieldComponent}) => {
    const { value, name } = fieldComponent
    const updatedCatalogFields = this.state.catalogFields.map(field => {
      return field.id === id ? {...field, ...{[name]: value}} : field
    })
    this.setState({ catalogFields: updatedCatalogFields })
  }

  removeField = (id) => {
    const updatedCatalogFields = this.state.catalogFields.reduce((prev, field) => {
      if (field.id === id) {
        if (typeof id === 'number') this.setState(({ removedIds }) => ({ removedIds: [ ...removedIds, id ] }))
        return prev
      } // when iterating over the field we are trying to delete, we will exclude it
      return [...prev, field]
    }, [])
    this.setState({ catalogFields: updatedCatalogFields })
  }

  addField = ({ elementName, elementHeader, elementSpecificValue, elementMaxLength }) => {
    const id = uuid()
    const updatedCatalogFields = [
      ...this.state.catalogFields,
      { id, elementName, elementHeader, elementSpecificValue, elementMaxLength }
    ]
    this.setState({ catalogFields: updatedCatalogFields })
  }

  /* Method to move element up/down when user selects an item from the order dropdown */
  moveField = (id, position) => {
    const currentPosition = parseInt(position) - 1 // subtract 1 due to page offset
    const foundField = this.getField(id)
    const foundFieldPosition = this.getFieldIndex(id)
    
    const updatedCatalogFields = this.state.catalogFields.reduce((prev, field, index) => {
      if (currentPosition === index) { // check if position we want to move to equals current position
        return foundFieldPosition > currentPosition // check direction of move
          ? [...prev, foundField, field] // run this if move from bottom to top
          : [...prev, field, foundField] // run this if move from top to bottom
      } else if (field.id !== id) { // makes sure that moved field is not duplicated
        return [...prev , field]
      } else { // check if you iterating over the field you are going to move
        return prev
      }
    }, [])
    this.setState({ catalogFields: updatedCatalogFields })
  }

  renderRows = () => {
    const {catalogFields, obcFieldOptions} = this.state;
    const orderOptions = catalogFields.map((val, index) => index+1)

    const rows = catalogFields.map((field, index) => {
      const correctIndex = index+1
      return (
        <TableRow
          key={field.id}
          id={field.id}
          orderOptions={orderOptions}
          obcFieldOptions={obcFieldOptions}
          // fieldValues
          fieldName={field.elementName}
          fieldHeader={field.elementHeader}
          fieldValue={field.elementSpecificValue}
          fieldMaxLength={field.elementMaxLength}
          fieldOrder={correctIndex}
          // handlers
          updateField={this.updateField(field.id)}
          handleOrderSelect={e => this.moveField(field.id, e.target.value)} // sorts this.state.catalogFields
          handleDelete={() => {this.removeField(field.id)}}
        />
      )
    })
    return rows
  }

  handleAddButton = () => {
    this.addField({
      elementName: this.state.obcFieldOptions[0],
      elementHeader: "",
      elementMaxLength: "",
      elementSpecificValue: ""
    })
  }

  validateForm = () => {

    const {catalogFields} = this.state     
    
    return !(catalogFields.some(catalogField => (catalogField.header === "" || catalogField.header === null)))
  }

  handleSubmit = () => {
    const {catalogFields} = this.state
    const { salesOrg, soldTo: partnerNumber, catalogId, userEmail: createdBy }= this.context
    const createDate = new Date().toISOString()

    const apiFields = catalogFields.map((field, index) => {
      return {
        catalogId,
        createDate,
        createdBy,
        elementHeader: field.elementHeader,
        elementMaxLength: field.elementMaxLength,
        elementName: field.elementName,
        elementOrder: index+1,
        elementSpecificValue: field.elementSpecificValue,
        id: typeof field.id === 'number' ? field.id : null,
        partnerNumber,
        salesOrg
      }
    })

    this.setState({ submitLoading: true })

    axios.all([ updateCatalogFieldsData(apiFields), deleteCatalogFields(this.state.removedIds)])
      .then(axios.spread(() => {
        this.setState({ submitLoading: false, formSubmitted: true, apiStatus: "success", apiStatusMessage: "Data saved successfully!" })
      }))
      .catch((error) => {
          this.setState({ submitLoading: false, apiStatus: "error", apiStatusMessage: "Data was not saved successfully!" })
          console.error(error)
        }
      )
  }

  render() {
    const {loadingStep, submitLoading, apiStatus, apiStatusMessage, catalogFields } = this.state

    if(loadingStep < 2) {
      return (
        <div className="u-text-center"><Loading size='large' /></div>
      )    
    }
    else {
      return (
        <Fragment>
          <div className="c-catalog-info o-grid__item">
            <div className="c-table-container">
              <table className="c-table  c-table--hover">
                <thead className="c-table__head">
                  <tr className="c-table__row">
                    <th className="c-table__cell" scope="col">Order</th>
                    <th className="c-table__cell" scope="col">Field name to include</th>
                    <th className="c-table__cell" scope="col">Header (required)</th>
                    <th className="c-table__cell" scope="col">Specific value</th>
                    <th className="c-table__cell" scope="col">Max length</th>                 
                    <th className="c-table__cell" scope="col"></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="c-table__body">
                  {this.renderRows()}
                </tbody>
              </table>
              <Button className="c-catalog-info__add" icon="add" color="link" onClick={this.handleAddButton}>Add Row</Button>
            </div>
          </div>
          {!this.validateForm() && <FieldError showErrorIcon>Please enter a Header for each field.</FieldError>}
          <div className="o-grid__item u-text-right u-margin-bot">
            {!!catalogFields.length && 
              <Button color="primary" type="submit" onClick={this.handleSubmit} isLoading={submitLoading} isDisabled={!this.validateForm()}>Submit</Button>
            }
          </div>
          {apiStatus !== "" &&
            <div className="o-grid__item">
              <Message type={apiStatus}>
              {apiStatusMessage}
              </Message>
            </div>
          }
        </Fragment>
      )
    }                    
  }
}

CatalogFieldInfo.contextType = AppContext
export default CatalogFieldInfo;
