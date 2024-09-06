import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Pie, PieChart, Sector} from 'recharts'
import ReactTable from "react-table";
import {avg, formatNumber, groupBy, sum} from '../../api/harAnalytics'
import "react-table/react-table.css";
import JSONPath from 'jsonpath-plus';

export default class EntryGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sizeIndex: 0,
            timeIndex: 0,
            bysize: [],
            bytime: []
        };
    }
    getDerivedStateFromProps() {
        this.setState({
            sizeIndex: 0,
            timeIndex: 0,
        });
    }
    renderTimeShape(props) {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
            fill, payload, percent, value } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        const time = formatNumber(value / 1000,3);
        const fontclass = payload.name.length > 14 ? payload.name.length > 18 ? "c-text-tiny" : "c-text-small" : "c-text-normal"
        return (
            <g>
                <text x={cx} y={cy} dy={8} className={fontclass} textAnchor="middle" fill="#333">{payload.name}</text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} className="c-text-normal" textAnchor={textAnchor} fill="#333">{`Time ${time}s`}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} className="c-text-normal" textAnchor={textAnchor} fill="#999">
                    {`${(percent * 100).toFixed(2)}%`}
                </text>
            </g>
        );
    }
    renderSizeShape(props) {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
            fill, payload, percent, value } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        const size = formatNumber((value / 1000),1);
        const fontclass = payload.name.length > 14 ? payload.name.length > 18 ? "c-text-tiny" : "c-text-small" : "c-text-normal"

        return (
            <g>
                <text x={cx} y={cy} dy={8} className={fontclass} textAnchor="middle" fill="#333">{payload.name}</text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} className="c-text-normal" textAnchor={textAnchor} fill="#333">{`Size ${size}K`}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} className="c-text-normal" textAnchor={textAnchor} fill="#999">
                    {`${(percent * 100).toFixed(2)}%`}
                </text>
            </g>
        );
    }
    onTimePieEnter(data, index) {
        this.setState({
            timeIndex: index,
        });
    }
    onSizePieEnter(data, index) {
        this.setState({
            sizeIndex: index,
        });
    }
    render () {
        const self = this;
        const group = groupBy(this.props.harEntries,function(item) {
            let url = new URL(JSONPath({path: "$.request.url", json: item}));
            let groupName = url.host.split('.').reverse().slice(0,2).reverse().join('.');
            return groupName;
        })
        console.log("Host group: ",group)
        let sizedata = Object.keys(group).map((g) => {
            let summary = {
                name: g,
                value: sum(JSONPath({path: "$.[*].response._transferSize", json: group[g]}))
            }
            return summary;
        });
        sizedata = sizedata.sort((o1,o2) => (o1.value > o2.value) ? -1 : (o1.value < o2.value) ? 1 : 0);

        let timedata = Object.keys(group).map((g) => {
            const summary = {
                name: g,
                value: sum(JSONPath({path: "$.[*].time", json: group[g]}))
            }
            return summary;
        });
        timedata = timedata.sort((o1,o2) => (o1.value > o2.value) ? -1 : (o1.value < o2.value) ? 1 : 0);

        return (
            <div>
                <PieChart className="c-entrygraph-elapsed" width={500} height={250}>
                    <Pie
                        activeIndex={this.state.sizeIndex}
                        activeShape={this.renderSizeShape}
                        data={sizedata}
                        cx={240}
                        cy={120}
                        innerRadius={60}
                        outerRadius={80}
                        fill="#A80B6E"
                        onMouseEnter={this.onSizePieEnter.bind(self)}
                    />
                </PieChart>
                <PieChart className="c-entrygraph-size" width={500} height={250}>
                    <Pie
                        activeIndex={this.state.timeIndex}
                        activeShape={this.renderTimeShape}
                        data={timedata}
                        cx={240}
                        cy={120}
                        innerRadius={60}
                        outerRadius={80}
                        fill="#9F177A"
                        onMouseEnter={this.onTimePieEnter.bind(self)}
                        />
                </PieChart>
            </div>
        );
    }
}
EntryGraph.propTypes = {
    harEntries: PropTypes.array.isRequired
}
