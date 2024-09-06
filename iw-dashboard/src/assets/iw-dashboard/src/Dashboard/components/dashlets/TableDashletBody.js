import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { IWLoading, IWResponsiveTable, RTRow } from '../../../iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'

export default class TableDashletBody extends Component {
  constructor(props) {
    super(props)    
    this.state = props.rawTableData
      ? {
          isLoading: false,
          tableData: props.transformTableData(props.rawTableData, props.isCES),
        }
      : { isLoading: true, tableData: [] }
  }

  componentDidUpdate(prevProps) {
    if (this.props.rawTableData !== prevProps.rawTableData) {
      this.setState({ tableData: this.props.transformTableData(this.props.rawTableData, this.props.isCES), isLoading: false })
    }
  }

  render() {
    const { isLoading, tableData } = this.state
    if (isLoading) {
      return (
        <div className="dashlet__loading-wrapper">
          <IWLoading />
        </div>
      )
    }
    return (tableData && tableData.length > 0) ? (
      <IWResponsiveTable tableColumns={translateColumnNames(this.props.tableColumns)}>
        {this.state.tableData.map(tableRow => {
          const { rowComponent: RowComponent, rowComponentProps } = tableRow
          return (
            <RTRow
              key={JSON.stringify(rowComponentProps)}
              render={injectedProps => <RowComponent {...rowComponentProps} {...injectedProps} />}
            />
          )
        })}
      </IWResponsiveTable>
    ) : (
      <p className="dashlet__no-data-message">{t('No records found')}</p>
    )
  }
}

TableDashletBody.propTypes = {
  rawTableData: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  tableColumns: PropTypes.arrayOf(PropTypes.object).isRequired,
  transformTableData: PropTypes.func.isRequired,
  isCES: PropTypes.bool,
}

TableDashletBody.defaultProps = {
  rawTableData: undefined,
  isCES: false,
}

function translateColumnNames(tableColumns) {
  return tableColumns.map(column => ({
    ...column,
    name: t(column.name),
  }))
}
