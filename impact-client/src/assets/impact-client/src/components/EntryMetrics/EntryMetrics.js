import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cn from 'classnames'


export default class EntryMetrics extends Component {
    render() {
        const g = "o-grid u-1/2"
        const gcol = "o-grid u-1/6 o-grid__margin"
        const gmcol = "o-grid u-1/1"
        const gdhead = "o-grid__item u-3/3 o-grid__col-label"
        const gshead = "o-grid__item u-1/3 o-grid__col-sublabel"
        const gdata = "o-grid__item u-1/3 o-grid__data"
        const gidl = "o-grid__item u-1/1 o-grid__row-label";
        const places = 2;

        const displaySeconds = (time) => {
            const seconds = time/1000;
            return Number(seconds).toLocaleString(undefined,{minimumFractionDigits:places,maximumFractionDigits:places})+"s"
        }

        const displayMetrics = (label,metrics) => {
            const adj = metrics.elapsed / metrics.time || 0;
            return (
                <div className={gcol}>
                    <div className={gmcol}>
                        <div className={gdhead}>{label}</div>
                    </div>
                    <div className={gmcol}>
                        <div className={gshead}>Count</div>
                        <div className={gshead}>Time</div>
                        <div className={gshead}>Adj</div>
                    </div>
                    <div className={gmcol}>
                        <div className={gdata}>{metrics.entryCount}</div>
                        <div className={gdata}>{displaySeconds(metrics.time)}</div>
                        <div className={gdata}>{displaySeconds(metrics.elapsed || 0)}</div>
                    </div>
                    <div className={gmcol}>
                        <div className={gdata}>{metrics.dnsCount}</div>
                        <div className={gdata}>{displaySeconds(metrics.dnsElapsed)}</div>
                        <div className={gdata}>{displaySeconds(metrics.dnsElapsed * adj)}</div>
                    </div>
                    <div className={gmcol}>
                        <div className={gdata}>{metrics.connectCount}</div>
                        <div className={gdata}>{displaySeconds(metrics.connectElapsed)}</div>
                        <div className={gdata}>{displaySeconds(metrics.connectElapsed * adj)}</div>
                    </div>
                    <div className={gmcol}>
                        <div className={gdata}>{metrics.sendCount}</div>
                        <div className={gdata}>{displaySeconds(metrics.sendElapsed)}</div>
                        <div className={gdata}>{displaySeconds(metrics.sendElapsed * adj)}</div>
                    </div>
                    <div className={gmcol}>
                        <div className={gdata}>{metrics.waitCount}</div>
                        <div className={gdata}>{displaySeconds(metrics.waitElapsed)}</div>
                        <div className={gdata}>{displaySeconds(metrics.waitElapsed * adj)}</div>
                    </div>
                    <div className={gmcol}>
                        <div className={gdata}>{metrics.receiveCount}</div>
                        <div className={gdata}>{displaySeconds(metrics.receiveElapsed)}</div>
                        <div className={gdata}>{displaySeconds(metrics.receiveElapsed * adj)}</div>
                    </div>
                    <div className={gmcol}>
                        <div className={gdata}>{metrics._queuedCount}</div>
                        <div className={gdata}>{displaySeconds(metrics._queuedElapsed)}</div>
                        <div className={gdata}>{displaySeconds(metrics._queuedElapsed * adj)}</div>
                    </div>
                </div>
            )
        }

        if (!this.props.metrics.elapsed) return (<span></span>)

        return (<div className={"o-grid c-detail__container"}>
                <div className={gcol}>
                    <div className={gidl}>&nbsp;</div>
                    <div className={gidl}>&nbsp;</div>
                    <div className={gidl}>Combined:</div>
                    <div className={gidl}>DNS:</div>
                    <div className={gidl}>Connect:</div>
                    <div className={gidl}>Send:</div>
                    <div className={gidl}>Wait:</div>
                    <div className={gidl}>Receive:</div>
                    <div className={gidl}>_queued:</div>
                </div>
                {displayMetrics("Group",this.props.metrics)}
                {displayMetrics("All",this.props.allMetrics)}
            </div>
        )
    }
}
EntryMetrics.propTypes = {
    harEntries: PropTypes.array.isRequired,
    metrics: PropTypes.object.isRequired,
    allMetrics: PropTypes.object.isRequired,
}
