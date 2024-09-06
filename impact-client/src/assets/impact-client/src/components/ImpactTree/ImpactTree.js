import React, { Component } from 'react'
import PropTypes from 'prop-types'
import JSONPath from 'jsonpath-plus';
import Tree, { TreeNode } from 'rc-tree';
import GroupTag from '../GroupTag/GroupTag'

export default class ImpactTree extends Component {
    constructor(props) {
        super(props)
        this.state = {
            configData: this.props.configData,
            expandedKeys: [],
            checkedKeys: [],
            checkedKeys1: [],
            selectedKeys: [],
        };
    }
    componentWillUpdate(nextProps, nextState) {
        this.notReRender = false;
    }
    onCheck = (checkedKeys) => {
        this.setState({
            checkedKeys,
        });
    }
    onClickNode = (clicked) => {
        this.props.changeGroup(clicked.target.getAttribute("data-key"));
    }
    render() {
        const self = this;
        const loop = data => {
            return data.map((item) => {
                return <div className="c-groupleaf" onClick={self.onClickNode.bind(self)} key={item.title} data-key={item.title} title={item.title}>
                    <GroupTag type={item.indicator}></GroupTag>
                    {item.title}
                    </div>;
            });
        };
        let treeNodes;
        if (this.treeNodes && this.notReRender) {
            treeNodes = this.treeNodes;
        } else {
            treeNodes = loop(this.props.configData.groups);
            this.treeNodes = treeNodes;
        }
        return (<div style={{ padding: '0 10px' }}>
            {this.state.configData.groups.length ? <div style={{ display: 'flex' }}>
                <div>
                    <div>Groups</div>
                        {treeNodes}
                </div>
            </div> : null}
        </div>);
    }
}
ImpactTree.propTypes = {
    configData: PropTypes.object.isRequired,
    changeGroup: PropTypes.func.isRequired,
    harData: PropTypes.object.isRequired,
}
