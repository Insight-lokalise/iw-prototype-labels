import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {avg, formatNumber, formatTime, sum, unique} from '../../api/harAnalytics'
import cn from 'classnames'


export default class EntryPerformance extends Component {

    render() {
        const metrics = this.props.metrics;

        const adj = metrics.elapsed / metrics.time || 0;
        const elapsed = metrics.elapsed / 1000 || 0;
        const pageViewDrop = elapsed * 11;
        const custSatisDrop = elapsed * 16;
        const conversionLoss = elapsed * 7;

        if (!metrics.elapsed) return (<span></span>)

        return (<div className={"c-detail__container"}>
            <div>{formatNumber(elapsed,2)}s results in {formatNumber(pageViewDrop)}% fewer page views.</div>
            <div>{formatNumber(elapsed,2)}s results in {formatNumber(custSatisDrop)}% decrease in customer satisfaction.</div>
            <div>{formatNumber(elapsed,2)}s results in {formatNumber(conversionLoss)}% loss in conversions.</div>
        </div>)
    }
}
EntryPerformance.propTypes = {
    type: PropTypes.string,
    metrics: PropTypes.object.isRequired,
    allMetrics: PropTypes.object.isRequired,
}
