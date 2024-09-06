import React, { Component } from 'react'
import PropTypes from 'prop-types'
import "react-table/react-table.css";
import JSONPath from 'jsonpath-plus';

export default class EntryContacts extends Component {
    render() {

        const detail = this.props.detail;
        const g = "o-grid u-1/1 u-1/2@desktop"
        const gi = "o-grid__item u-1/1 u-3/4@desktop";
        const gidl = "o-grid__item c-detail__label u-1/1 u-1/4@desktop";

        return (<div className={"o-grid c-detail__container"}>
            <div className={"o-grid__item"}>
                <div>Insight Coordinator</div>
                <div className={g}><div className={gidl}>name: </div><div className={gi}>{JSONPath({path: "coordinator.name", json: detail})}</div></div>
                <div className={g}><div className={gidl}>email: </div><div className={gi}>{JSONPath({path: "coordinator.email", json: detail})}</div></div>
            </div>
            <div className={"o-grid__item"}>
                <div>{detail.contact.company} Contact</div>
                <div className={g}><div className={gidl}>name: </div><div className={gi}>{JSONPath({path: "contact.name", json: detail})}</div></div>
                <div className={g}><div className={gidl}>email: </div><div className={gi}>{JSONPath({path: "contact.email", json: detail})}</div></div>
            </div>
        </div>)
    }
}

EntryContacts.propTypes = {
    detail: PropTypes.object.isRequired
}
