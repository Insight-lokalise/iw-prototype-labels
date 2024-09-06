import React, { Component } from 'react'
import { getErrorItems, patchErrorMessage } from 'api'
import ErrorList from './components/ErrorList'

/**
 * The main App component,
 */
export default class App extends Component {

constructor(props) {
  super(props)
  this.state ={
    errors :[],
    currentPage: 0,
    errorsPerPage: 10,
    totalElements :0,
    sortColumn: 'when'
  }
  this.handleClick= this.handleClick.bind(this);
}

componentDidMount() {

const { currentPage, errorsPerPage, sortColumn} = this.state
  getErrorItems(currentPage,errorsPerPage,sortColumn).then(response => {
     const isDataReturned =response._embedded && response._embedded.errors; 
     this.setState(() => {
      return {
       errors: isDataReturned ?response._embedded.errors:[],
       totalElements : response.page.totalElements,
       currentPage: response.page.number
      }
    })
  })
}

messageAction(error,status){
  patchErrorMessage(error.id,error.key,error.topic,status).then(response => {window.location.reload()})

}

handleClick(event) {

  getErrorItems(event.target.id -1,this.state.errorsPerPage,this.state.sortColumn).then(response => {         
     this.setState(() => {
      return {
       errors: response._embedded.errors,
       totalElements : response.page.totalElements,
       currentPage: response.page.number
      }
    })
  })

}


 render() {

   

 const { errors, currentPage, errorsPerPage, sortColumn, totalElements } = this.state;

 const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalElements/ errorsPerPage); i++) {
           pageNumbers.push(i);
         }

 const renderPageNumbers = pageNumbers.map(number => {
           return (
             <li
               key={number}
               id={number}
               onClick={this.handleClick}
             >
               {number}
             </li>
           );
         });

    return (
      <div>
      <ErrorList errors={errors} onMessageAction ={this.messageAction}/>
       <div>
          <ul className="page-numbers">
            {renderPageNumbers}
          </ul>
      </div>
      </div>
    )
  }
}
