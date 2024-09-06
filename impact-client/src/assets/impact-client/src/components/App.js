import React, {Component} from 'react'
import {configData} from '../data/impact-server'
import {DetailTabs} from './DetailTabs'
import {EntryGrid} from './EntryGrid'
import {Logo} from './Logo'
import {ImpactContent} from './ImpactContent'
import {ImpactContext} from './ImpactContext'
import {ImpactFooter} from './ImpactFooter'
import {ImpactHeader} from './ImpactHeader'
import {ImpactPage} from './ImpactPage'
import {ImpactTree} from './ImpactTree'
import {QueryURL} from './QueryURL'
import {Sidebar} from './Sidebar'
import JSONPath from 'jsonpath-plus';

const harData = {};

export default class App extends Component {
    constructor(props) {
        super(props)
        const harEntries = this.harSort(JSONPath({path: 'log.entries[*]', json: harData}))
        const groupDetail = JSONPath({path: 'groups[0]', json: configData})[0]
        const metrics = this.updateMetrics(harEntries);
        const allMetrics = this.updateMetrics(harEntries);
        this.state = {
            harData: harData,
            harEntries: harEntries,
            groupDetail: groupDetail,
            metrics: metrics,
            allMetrics: allMetrics,
        }
    }
    harSort(harEntries) {
        harEntries = harEntries.sort((o1, o2, desc) => {
            const d = (desc || false) ? -1 : 1
            const d1 = new Date(o1.startedDateTime).getTime();
            const d2 = new Date(o2.startedDateTime).getTime();
            return d * (d1 > d2)?1:(d1 < d2)?-1:0
        })
        return harEntries;
    }
    updateMetrics(harEntries) {
        const seeddt = new Date(JSONPath({path: "$[0].startedDateTime",json: harEntries})).getTime() || undefined;
        const metrics = {
            entryCount: harEntries.length || 0,
            dnsCount: 0,
            dnsElapsed: 0,
            connectCount: 0,
            connectElapsed: 0,
            sendCount: 0,
            sendElapsed: 0,
            waitCount: 0,
            waitElapsed: 0,
            receiveCount: 0,
            receiveElapsed: 0,
            sslCount: 0,
            sslElapsed: 0,
            _queuedCount: 0,
            _queuedElapsed: 0,
            time: 0,
        };
        let mst = seeddt;
        let met = seeddt;
        harEntries.forEach((entry) => {
            const timings=entry.timings;
            const addMetrics = (m) => {
                const elapsed = timings[m] || -1;
                if (elapsed>=0) {
                    metrics[m+"Count"]++;
                    metrics[m+"Elapsed"]+=elapsed;
                }
            }

            addMetrics("dns");
            addMetrics("connect");
            addMetrics("send");
            addMetrics("wait");
            addMetrics("receive");
            addMetrics("ssl");
            addMetrics("_queued");
            metrics.time+=entry.time;

            const est = new Date(entry.startedDateTime).getTime();
            const eet = est + entry.time;
            mst = (mst<est?mst:est);
            met = (met>eet?mst:eet);

        })
        metrics.startTime = mst;
        metrics.endTime = met;
        metrics.elapsed = met - mst;

        return metrics;
    }

  changeGroup = (title) => {
    const groupDetail = configData.groups.find((d) => d.title === title)
    const harEntries = this.harSort(JSONPath({path: '$.data.log.entries[*]', json: this.state.harData}).filter(groupDetail.query))
    const metrics = this.updateMetrics(harEntries);
    this.setState(state => ({
      groupDetail: groupDetail,
      harEntries: harEntries,
      metrics: metrics,
    }))
  }

  changeAnalyticData = (harData, pageSpeed) => {
    const harEntries = this.harSort(JSONPath({path: 'data.log.entries[*]', json: harData}).filter(this.state.groupDetail.query));
    const metrics = this.updateMetrics(harEntries);
    const allEntries = JSONPath({path: '$.harData.log.entries[*]', json: this.state})
    const allMetrics = this.updateMetrics(allEntries);
    this.setState(state => ({
      harData: harData,
      harEntries: harEntries,
      metrics: metrics,
      allMetrics: allMetrics,
      pageSpeed: pageSpeed,
    }))
  }

  render() {
        return <ImpactPage>
            <ImpactHeader></ImpactHeader>
            <ImpactContent>
                <Sidebar>
                    <Logo isInverted={true}>header</Logo>
                    <ImpactContext.Provider value={this.state.groupDetail}>
                        <ImpactTree harData={harData} configData={configData}
                                    changeGroup={this.changeGroup}></ImpactTree>
                    </ImpactContext.Provider>
                </Sidebar>
                <div style={{flex: 1}}>
                    <ImpactContext.Provider value={this.state.harData}>
                        <QueryURL changeAnalyticData={this.changeAnalyticData}></QueryURL>
                    </ImpactContext.Provider>
                    <DetailTabs  harEntries={this.state.harEntries} allMetrics={this.state.allMetrics} metrics={this.state.metrics} detail={this.state.groupDetail}/>
                    <EntryGrid configData={configData} harEntries={this.state.harEntries}
                               harData={harData} pageSpeed={this.state.pageSpeed}></EntryGrid>
                </div>
            </ImpactContent>
            <ImpactFooter></ImpactFooter>
        </ImpactPage>
    }
}
