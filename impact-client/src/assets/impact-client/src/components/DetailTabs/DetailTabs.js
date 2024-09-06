import PropTypes from 'prop-types'
import React, {Component} from 'react'
import 'react-table/react-table.css'
import {Tab, Tabs} from '@insight/toolkit-react-prototype'
import {EntryContacts} from '../EntryContacts'
import {EntryGraph} from '../EntryGraph'
import {EntryMetrics} from '../EntryMetrics'
import {EntryPerformance} from '../EntryPerformance'

export default class DetailTabs extends Component {
    state = {
        selectedTabId: 'metrics',
    }
    onSelectedTabChange = id => {
        this.setState({
            selectedTabId: id,
        })
    }

    render() {
        return (<div style={{padding: '20px', height: '300px'}}>
                <Tabs>
                    <Tab
                        isSelected={'performance' === this.state.selectedTabId}
                        key={0}
                        onClick={() => this.onSelectedTabChange('performance')}>
                        Performance
                    </Tab>
                    <Tab
                        isSelected={'metrics' === this.state.selectedTabId}
                        key={1}
                        onClick={() => this.onSelectedTabChange('metrics')}>
                        Metrics
                    </Tab>
                    <Tab
                        isSelected={'graphs' === this.state.selectedTabId}
                        key={2}
                        onClick={() => this.onSelectedTabChange('graphs')}>
                        Graphs
                    </Tab>
                    <Tab
                        isSelected={'contacts' === this.state.selectedTabId}
                        key={3}
                        onClick={() => this.onSelectedTabChange('contacts')}>
                        Contacts
                    </Tab>
                </Tabs>
                {this.state.selectedTabId === 'performance' &&
                <EntryPerformance harEntries={this.props.harEntries} metrics={this.props.metrics} allMetrics={this.props.allMetrics}></EntryPerformance>
                }
                {this.state.selectedTabId === 'metrics' &&
                <EntryMetrics harEntries={this.props.harEntries} metrics={this.props.metrics} allMetrics={this.props.allMetrics}></EntryMetrics>
                }
                {this.state.selectedTabId === 'graphs' &&
                <EntryGraph harEntries={this.props.harEntries}></EntryGraph>
                }
                {this.state.selectedTabId === 'contacts' &&
                <EntryContacts detail={this.props.detail}></EntryContacts>
                }
            </div>
        )
    }
}

DetailTabs.propTypes = {
    detail: PropTypes.object.isRequired,
    harEntries: PropTypes.array.isRequired,
    metrics: PropTypes.object.isRequired,
    allMetrics: PropTypes.object.isRequired,
}
