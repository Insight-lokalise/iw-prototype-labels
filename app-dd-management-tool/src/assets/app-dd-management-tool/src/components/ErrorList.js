import React from 'react'
import Error from './Error'

const ErrorList= (props)=> {

const { errors, onMessageAction } = props;
  return (
        <div>
            {
             errors.map((error) => (
               <div className="errorBorder" key={error.id}>
              <Error
              key={error.id} error={error}
              onMessageAction={props.onMessageAction}/>
              </div>
            ))
            }
          </div>
  		);
}
export default ErrorList;
