import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cn from 'classnames'


export default class GroupTag extends Component {
    render() {
        if (typeof this.props.type === "undefined" || this.props.type === "") {
            return <div className={"c-grouptag"}/>;
        };
        const options = this.props.type.split(":");
        if (options[0]==="roundrect"||options[0]==="round"||options[0]==="rect") {
            const indClasses = {"c-grouptag":true};
            indClasses["c-grouptag--"+options[0]]=true;
            let styles = {};
            if (options[2].startsWith(".")) {
                indClasses[options[2].substr(1)]=true;
            } else {
                styles = {color: options[2], backgroundColor: options[3], borderColor: options[4] || options[3], borderStyle: "solid", borderWidth: 1}
            }
            return (<div className={cn(indClasses)} style={styles}>{options[1]}</div>)
        }
        if (options[0]==="icon") {
            return (<div style={{color: options[2], backgroundColor: options[3]}}>Go</div>)
        }
        return (<div className={"c-grouptag"}></div>)
    }
}
GroupTag.propTypes = {
    type: PropTypes.string
}
