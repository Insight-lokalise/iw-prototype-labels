import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CreateAccountForm from "./CreateAccountForm";


export default class CreateAccount extends Component {
	render() {
	  const { title, description, locale } = this.props
		return (
		  <div className="ds-v1  app-create-account">
        <CreateAccountForm title={title} description={description} locale={locale}/>
      </div>
    )
	}
}

CreateAccount.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
}


