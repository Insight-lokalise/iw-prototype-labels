import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-beautiful-dnd'
import { connect } from 'react-redux'

import {
  selector_wId,
  selector_categories,
  saveCategoryOrder,
  reorderProductGroup as saveProductGroupOrder,
  reorderProductSet as saveProductSetOrder,
  reorderProductItem as saveProductItemOrder
} from "../../duck"
import { reorderCategories, reorderProductSets, reorderProductGroups, reorderProductItems } from "../../api/us"
import FindAndReplaceButton from "./FindAndReplaceButton"

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

class DragAndDropManager extends Component {
  constructor() {
    super()
    this.state = {}

    this.onDragEnd = this.onDragEnd.bind(this)
    this.registerDraggableGroup = this.registerDraggableGroup.bind(this)
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return
    }
    const newItemOrder = reorder(this.state[result.type], result.source.index, result.destination.index)
    if (result.type === 'categories') {
      reorderCategories({ idOrder: newItemOrder, wId: this.props.webGroupId }).then(({data})=>{
        this.props.saveCategoryOrder(data)
      })
    }
    else if (this.props.categories[result.type]) {
      reorderProductGroups({ idOrder: newItemOrder, categoryId: result.type }).then(({data})=>{
        this.props.saveProductGroupOrder({id:result.type, order:data})
      })
    }
    else if (result.type === "productItem") {
      reorderProductItems({ idOrder: newItemOrder, productSetId: this.props.productSetId }).then(({data})=>{
        this.props.saveProductItemOrder({id:this.props.productSetId, order:data})
      })
    }
    else {
      reorderProductSets({ idOrder: newItemOrder, productGroupId: result.type }).then(({data})=>{
        this.props.saveProductSetOrder({id:result.type, order:data})
      })
    }
    this.setState({ [result.type]: newItemOrder })
  if (this.props.reorderProducts) {
    this.props.reorderProducts(newItemOrder)
    }
  }

  registerDraggableGroup({ itemOrder, type }) {
    this.setState({ [type]: itemOrder })
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        {this.props.children(this.state, {
          registerDraggableGroup: this.registerDraggableGroup,
        })}
      </DragDropContext>
    )
  }
}

function mapStateToProps(state) {
  return {
    webGroupId: selector_wId(state),
    categories: selector_categories(state),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveCategoryOrder: (order) => dispatch(saveCategoryOrder(order)),
    saveProductGroupOrder: ({id, order}) => dispatch(saveProductGroupOrder(id, order)),
    saveProductSetOrder: ({id, order}) => dispatch(saveProductSetOrder(id, order)),
    saveProductItemOrder: ({id, order}) => dispatch(saveProductItemOrder(id, order)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DragAndDropManager)

DragAndDropManager.propTypes = {
  children: PropTypes.func.isRequired,
  reorderProducts: PropTypes.func,
}

DragAndDropManager.defaultProps = {
  reorderProducts: null,
}