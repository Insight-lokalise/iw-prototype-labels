import React from 'react'

export default function Error ({ error, onMessageAction }) {



 const handleReSend=()=> {
   onMessageAction(error,'RESUBMITTED');

 }

 const handleIgnore=()=> {
	 onMessageAction(error,'IGNORED');
 }


		return (
      <div>
      	<p> <b>Date Occurred </b>: {error.when}</p>
				<p> <b>Host </b>: {error.host}</p>
				<p> <b>Service </b>: {error.service}</p>
        <p> <b>Topic </b>: {error.topic}</p>
        <p> <b>Key </b>: {error.key}</p>
        <p> <b>Event </b>: {error.event}</p>
        <p> <b>Status </b>: {error.status}</p>
        <p> <b>Date Actioned </b>: {error.dateActioned}</p>
        <p> <b>Exception </b>: {error.cause}</p>
        <p> <button className="c-button  c-button--primary" onClick = {handleReSend}>
				Resend Message
				</button>
				<button className="c-button  c-button--secondary" onClick = {handleIgnore}>
				Ignore Message
				</button>
        </p>
        </div>

		)
	}
