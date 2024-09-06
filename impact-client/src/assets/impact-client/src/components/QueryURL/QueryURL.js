import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {Button} from '@insight/toolkit-react-prototype'
import axios from 'axios'
import axiosJsonp from 'axios-jsonp'
import jsonp from 'jsonp'
import JSONPath from 'jsonpath-plus';

export default class QueryURL extends Component {
    state = {
        url: "",
        isLoading: false,
    }
    keyUp = (event) => {
        if (event.key==="Enter") {
            this.queryHar();
        }
    }
    setURL = (event) => {
        this.setState({url: event.target.value})
    }

    queryHar = () => {

        const self = this;

        this.setState(state => ({
            isLoading: true,
        }))

        const apikey="AIzaSyBd11wKWq_TqkHwtS0EN61zsMiusWqbMJo";

        const pageSpeedPromise = axios.get('https://content.googleapis.com/pagespeedonline/v4/runPagespeed', {
            params: {
                url: this.state.url,
                key: apikey,
                filter_third_party_resources: false,
            }
        });
        function analyzePageSpeed(response) {
            const convertToKBytes = (bytes) => {
                const bytesmatch = /^(\d+(?:.?\d)*)(\w*)$/.exec(bytes);
                const value = bytesmatch[1];
                const uom = bytesmatch[2];
                let kbytes = 0;
                switch(uom) {
                    case "B": kbytes = Math.round(parseFloat(value) / 100) / 10; break;
                    case "KiB": kbytes = parseFloat(value); break;
                    default: kbytes = undefined;
                }
                return kbytes;
            }

//////////  OPT IMAGES  //////////
            const optImages = JSONPath({path: 'data.formattedResults.ruleResults.OptimizeImages.urlBlocks[0].urls[*].result', json: response});
            const pageSpeed = optImages.reduce((a,v) => {
                    const url = v.args[0].value;
                    const optImages = {bytes: convertToKBytes(v.args[1].value), save:parseInt(v.args[2].value)};
                    a[url] = {...(a[url]||{}), optImages: optImages}
                    return a;
                }, {} )

//////////  GZIP COMPRESS  //////////
            const gzipCompress = JSONPath({path: 'data.formattedResults.ruleResults.EnableGzipCompression.urlBlocks[0].urls[*].result', json: response});
            gzipCompress.reduce((a,v) => {
                     const url = v.args[0].value;
                     const gzipCompress = { bytes: convertToKBytes(v.args[1].value), save:parseInt(v.args[2].value)};
                     a[url] = {...(a[url]||{}), gzipCompress: gzipCompress }
                     return a;
                 }, pageSpeed )

//////////  POOR BROWSER CACHING  //////////
            let convertToHours = (expire) => {
                const expmatch = /^(\d+(?:.?\d)*) (\w*)$/.exec(expire);
                const value = expmatch[1];
                const uom = expmatch[2];
                let hours = 0;
                switch(uom) {
                    case "hours": hours = parseFloat(value); break;
                    case "minutes": hours = parseFloat(value) / 60; break;
                    case "seconds": hours = parseFloat(value) / 3600; break;
                    default: hours = undefined;
                }
                return hours;
            }
            const poorCaching = JSONPath({path: 'data.formattedResults.ruleResults.LeverageBrowserCaching.urlBlocks[0].urls[*].result', json: response});
            poorCaching.reduce((a,v) => {
                    let url = v.args[0].value;
                    let fixCache = false;
                    a[url] = {...(a[url]||{})}
                    if (v.format==="{{URL}} (expiration not specified)") a[url].fixCache = {cacheMsg: "expiration not specified", hours: null}
                    if (v.format==="{{URL}} ({{LIFETIME}})") a[url].fixCache = {cacheMsg: v.args[1].value, hours: convertToHours(v.args[1].value)}
                    return a;
                }
                , pageSpeed )

            return pageSpeed;
        }


        let parms = {};
        window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(abyss,key,value) {
            parms[key] = decodeURIComponent(value);
        });
        let protocol = document.location.protocol
        let url = ''
        if (!!parms.server) {
            if (!parms.server.startsWith('http')) {
              url+=protocol+'//';
            }
            url+=parms.server
        } else {
            let hostname = document.location.hostname
            url+=protocol+'//'+hostname+':3000'
        }
        url+= '/analyze?url='+encodeURIComponent(this.state.url);
        const harDataPromise = axios({
            url,
            adapter: axiosJsonp,
            callbackParamName: 'cb'
        });
        function analyzeHar(response) {
            this.setState(state => ({
                isLoading: false,
            }))

            return response;
        }

        const harData = null;
        const pageSpeedData = null;
        Promise.all([
            harDataPromise.catch((values) => {return {}}),
            pageSpeedPromise.catch((values) => {return {}})
        ]).then(
            (values) => {
                const harData = values[0]?analyzeHar.bind(self)(values[0]):null;
                const pageSpeedData = values[1]?analyzePageSpeed.bind(self)(values[1]):null;
                this.props.changeAnalyticData(harData,pageSpeedData);
            }
        );
    }
    render() {
        return (<div className="c-queryurl c-form__element"><label className="c-flex0 c-queryurl-url c-form__label" htmlFor="url">URL</label>
            <input type="url" className="c-flex1 c-input" id="url" onChange={this.setURL} onKeyUp={this.keyUp}/><Button isLoading={this.state.isLoading} className="c-flex0 c-loading--small c-button--analyze" onClick={this.queryHar}>Analyze</Button></div>
        )
    }
}
QueryURL.propTypes = {
    changeAnalyticData: PropTypes.func.isRequired,
}
