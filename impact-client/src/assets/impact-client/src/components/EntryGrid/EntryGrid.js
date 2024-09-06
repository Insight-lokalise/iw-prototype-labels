import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactTable from "react-table";
import {avg, formatNumber, formatTime, reformClassName, sum, unique} from '../../api/harAnalytics'
import "react-table/react-table.css";
import {configData} from '../../data/impact-server'
import {GroupTag} from '../GroupTag'
import {ImproveIcons} from '../ImproveIcons'
import JSONPath from 'jsonpath-plus';

export default class EntryGrid extends Component {
    render() {
        const self = this;
        const pageStart=new Date(JSONPath({path: "$.log.pages[0].startedDateTime", json: this.props.harData})[0]).getTime();
        const pageContentLoad=pageStart + JSONPath({path: "$.log.pages[0].pageTimings.onContentLoad", json: this.props.harData})[0];
        const pageLoad=pageStart + JSONPath({path: "$.log.pages[0].pageTimings.onLoad", json: this.props.harData})[0];
        const harEntries=this.props.harEntries;
        const totalSize = sum(JSONPath({path: "$[*].response._transferSize", json: harEntries}))
        const totalSavings = sum(harEntries.map((d) => {
            const url = d.request.url;
            const ps = this.props.pageSpeed[url];
            let savings = 0;
            if (ps) {
                if (ps.optImages && ps.optImages.save) {
                    savings += d.response._transferSize * Number.parseFloat(ps.optImages.save) / 100;
                }
                if (ps.gzipCompress && ps.gzipCompress.save) {
                    savings += d.response._transferSize * Number.parseFloat(ps.gzipCompress.save) / 100;
                }
            }
            return savings;
        }));

        let sortFloat = (s1, s2, desc) => {
          const d = (desc || false) ? -1 : 1
          const f1 = parseFloat(s1.replace(/,/,""));
          const f2 = parseFloat(s2.replace(/,/,""));
          return d * (f1 > f2)?-1:(f1 < f2)?1:0
        }
        let sortDomainName = (o1, o2, desc) => {
          const d = (desc || false) ? -1 : 1
          const s1 = new URL(o1.request.url).host.split('.').reverse().join('.');
          const s2 = new URL(o2.request.url).host.split('.').reverse().join('.');
          return d * (s1 > s2)?-1:(s1 < s2)?1:0
        }
        let sortDate = (s1, s2, desc) => {
          const d = (desc || false) ? -1 : 1
          const d1 = new Date(s1).getTime()
          const d2 = new Date(s2).getTime()
          return d * (d1 > d2) ? -1 : (d1 < d2) ? 1 : 0
        };

        const totalElapsed = sum(JSONPath({path: "$[*].time", json: harEntries}))
//        let uniqueDomain = unique(JSONPath({path: "$[*].request.url", json: harEntries}),(d) => new URL(d).host.split('.').reverse().slice(0,2).reverse().join('.'))
        const uniqueSubdomain = unique(JSONPath({path: "$[*].request.url", json: harEntries}),(d) => new URL(d).host)
        const startTime = this.props.harEntries.reduce((a,i)=> {i=new Date(i.startedDateTime).getTime(); return (a||i)<i?a:i;},undefined);
        const endTime = this.props.harEntries.reduce((a,i)=> {i=new Date(i.startedDateTime).getTime()+i.time; return (a||i)>i?a:i;},undefined);
        const totalCount = this.props.harEntries.length;
      return <ReactTable
        getTrProps={(state, rowInfo, column) => {
          const rowdata = rowInfo.original
          const start = new Date(rowdata.startedDateTime).getTime()
          const end = start + rowdata.time
          const dstart = new Date(start)
          const dpageContentLoad = new Date(pageContentLoad)
          let dpageLoad = new Date(pageLoad)
          return {
            className: start > pageContentLoad ? 'c-entrygrid--pageLoad'
              : start > pageLoad ? 'c-entrygrid--pageContentLoad' : 'c-entrygrid--pageLoading',
          }
        }}
        data={harEntries}
        pageSize={harEntries.length}
        showPagination={false}
        columns={[
          {
            columns: [
              {
                Header: 'Tags',
                id: 'entryTags',
//                            width: "150",
                accessor: (d) => {
                  let tags = configData.groups.map((g, i) => {
                    if (g.title !== 'All' && g.query(d)) {
                      return (<GroupTag key={i} type={g.indicator}/>)
                    }
                  })
                  return tags
                },
              },
              // {
              //     Header: "Domain",
              //     id: "entryDomain",
              //     accessor: (d) => new URL(d.request.url).host.split('.').reverse().slice(0,2).reverse().join('.'),
              //     Footer: (d) => uniqueDomain.length+" Unique"
              // },
              {
                Header: 'Subdomain',
                id: 'entrySubdomain',
                accessor: (d) => new URL(d.request.url).host,
                Footer: (d) => uniqueSubdomain.length + ' Unique',
                sortMethod: sortDomainName,
              },
              {
                Header: 'URL',
                id: 'entryURL',
                accessor: 'request.url',
                Cell: row => (
                  <span title={row.value}>{row.value}</span>
                ),
              },
              // {
              //     Header: "Priority",
              //     id: "priority",
              //     accessor: (d) => {return d._initialPriority + (d._initialPriority===d._priority ? "" : " / "+d._priority) },
              // },
              {
                Header: 'Mime Type',
                id: 'mimeType',
                accessor: 'response.content.mimeType',
              },
//                         {
//                             Header: "Initiator",
//                             id: "entryIntiator",
// //                            width: "200",
//                             accessor: (d) => typeof d._initiator !== "string" ? "" : new URL(d._initiator).host,
// //                            accessor: "_initiator",
//                         },
//                         {
//                             Header: "Start Time",
//                             id: "entrySize",
// //                            width: "150",
//                             className: "c-entrygrid-size",
//                             accessor: (d) => (new Date(d.startedDateTime)),
//                             sortMethod: sortFloat,
//                             Footer: (d) => formatNumber(Number(totalSize / 1000),1)+" K"
//                         },
//                         {
//                             Header: "Start",
//                             id: "entryStart",
//                             className: "c-entrygrid-start",
//                             accessor: (d) => d.startedDateTime.split("T")[1],
//                             Footer: (d) => formatNumber(totalElapsed,1)+" ms"
//                         },
              {
                Header: 'Elapsed',
                id: 'entryElapsed',
                className: 'c-entrygrid-elapsed',
                accessor: (d) => formatNumber(Number(d.time / 1000), 3) + 's',
                sortMethod: sortFloat,
                Footer: (d) => formatNumber(totalElapsed / 1000, 3) + ' s',
              },
              {
                Header: 'Size',
                id: 'entrySize',
                className: 'c-entrygrid-size',
                accessor: (d) => formatNumber(Number(d.response._transferSize / 1000), 1) + ' K',
                sortMethod: sortFloat,
                Footer: (d) => formatNumber(Number(totalSize / 1000), 1) + ' K',
              },
              {
                Header: 'Improvements',
                id: 'entryCompression',
                className: 'c-entrygrid-size',
                accessor: (d) => {
                  const compress = JSONPath({path: '$.response.content.compression', json: d})[0] || 0
                  const size = JSONPath({path: '$.response._transferSize', json: d})[0] || 0
                  const bsize = JSONPath({path: '$.response.bodySize', json: d})[0] || 0
                  const url = d.request.url
                  const ps = this.props.pageSpeed[url] || {}
                  const optImageSave = JSONPath({path: '$.optImages.save', json: ps})[0]
                  const optImageBytes = JSONPath({path: '$.optImages.bytes', json: ps})[0]
                  let optImageClassName = ''
                  let optImagesMsg = ''
                  if (!!optImageSave) {
                    optImageClassName = (optImageBytes <= 5) ? 'c-improveicon-low' :
                      (optImageBytes <= 20) ? 'c-improveicon-medium' : 'c-improveicon-high'
                    optImagesMsg = 'Compress this image to save ' + optImageBytes + 'kb (' + optImageSave + '%).'
                  }

                  const gzipCompressSave = JSONPath({path: '$.gzipCompress.save', json: ps})[0]
                  const gzipCompressBytes = JSONPath({path: '$.gzipCompress.bytes', json: ps})[0]
                  let gzipCompressClassName = ''
                  let gzipCompressMsg = ''
                  if (!!gzipCompressSave) {
                    gzipCompressClassName = (gzipCompressSave <= 5) ? 'c-improveicon-low' :
                      (gzipCompressSave <= 20) ? 'c-improveicon-medium' : 'c-improveicon-high'
                    gzipCompressMsg = 'Activate GZip compression on web server to save ' + gzipCompressBytes + 'kb (' + gzipCompressSave + '%) on this image.'
                  }

                  const poorCachingHours = JSONPath({path: '$.fixCache.hours', json: ps})[0]
                  const poorCachingClassName = !poorCachingHours ? '' :
                    (poorCachingHours <= 1) ? 'c-improveicon-high' :
                      (poorCachingHours <= 12) ? 'c-improveicon-medium' : 'c-improveicon-low'
                  const poorCachingMsg = JSONPath({path: '$.fixCache.cacheMsg', json: ps})[0] || ''
                  const result = (<span>
                                        <ImproveIcons name='optimize-image' className={optImageClassName}
                                                      title={optImagesMsg}/>
                                        <ImproveIcons name='gzip-compress' className={gzipCompressClassName}
                                                      title={gzipCompressMsg}/>
                                        <ImproveIcons name='poor-caching' className={poorCachingClassName}
                                                      title={poorCachingMsg}/>

                                    </span>
                  )
                  return result
                },
              },
              {
                Header: 'Potential Savings',
                id: 'entrySavings',
                className: 'c-entrygrid-size',
                accessor: (d) => {
                  const compress = JSONPath({path: '$.response.content.compression', json: d})[0] || 0
                  const size = JSONPath({path: '$.response._transferSize', json: d})[0] || 0
                  const bsize = JSONPath({path: '$.response.bodySize', json: d})[0] || 0
                  const url = d.request.url
                  const ps = this.props.pageSpeed[url] || {}
                  const optImageSave = JSONPath({path: '$.optImages.save', json: ps})[0]
                  const optImageBytes = JSONPath({path: '$.optImages.bytes', json: ps})[0]
                  let potentialSavings = 0
                  let optImageClassName = ''
                  let optImagesMsg = ''
                  if (!!optImageSave) {
                    potentialSavings += optImageBytes
                  }

                  const gzipCompressSave = JSONPath({path: '$.gzipCompress.save', json: ps})[0]
                  const gzipCompressBytes = JSONPath({path: '$.gzipCompress.bytes', json: ps})[0]
                  let gzipCompressClassName = ''
                  let gzipCompressMsg = ''
                  if (!!gzipCompressSave) {
                    potentialSavings += gzipCompressBytes
                  }
                  const psClassName = (potentialSavings <= 5) ? 'c-improveicon-low' :
                    (potentialSavings <= 20) ? 'c-improveicon-medium' : 'c-improveicon-high'
                  const result = (<span className={{psClassName: true}}>{formatNumber(potentialSavings, 1)} K</span>)
                  return result
                },
                // Cell: row => {
                //     let potential = row.value.startsWith("(");
                //     return (
                //         <div className={potential?"c-entrygrid-size-savings":""}>{row.value}</div>
                //     )
                // },
                sortMethod: sortFloat,
                Footer: (d) => <div
                  className={totalSavings !== 0 ? 'c-entrygrid-size-savings' : ''}>{'(' + formatNumber(Number(totalSavings / 1000), 1) + ' K)'}</div>,
              },
              {
                Header: 'Network',
                id: 'entryWaterfall',
                className: 'c-entrygrid-waterfall',
                Cell: row => {
                  const z = (n) => n < 0 ? 0 : n
                  const t = {...row.original.timings}
                  if (t.connect >= 0) t.connect -= z(t.ssl)
//                                let ttotal = z(t._queued)+z(t.blocked)+z(t.dns)+z(t.connect)+z(t.ssl)+z(t.send)+z(t.wait)+z(t.receive);
                  const ttotal = endTime - startTime
                  let lg = ''
                  let pos = 0
                  const pct = (n) => Number(n * 100).toFixed(0) + '%'
                  const addlg = (c, v) => {
                    lg += ', ' + c + ' ' + (pct(pos / ttotal)) + ', ' + c + ' ' + (pct((pos + v) / ttotal))
                    pos += v
                  }
                  const sdt = new Date(row.original.startedDateTime).getTime()
                  const start = sdt - startTime
                  addlg('#ffffff', z(start))
                  addlg('#dddd00', z(t._queued))
                  addlg('#999999', z(t.blocked))
                  addlg('#259689', z(t.dns))
                  addlg('#fa9814', z(t.connect))
                  addlg('#9924ae', z(t.ssl))
                  addlg('#99ff99', z(t.send))
                  addlg('#30c959', z(t.wait))
                  addlg('#33a9f2', z(t.receive))
                  const end = endTime - startTime - pos
                  addlg('#ffffff', z(end))
                  return (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#ffffff',
                        borderRadius: '2px',
                      }}
                    >
                      <div
                        style={{
                          width: `${row.value}%`,
                          height: '100%',
                          backgroundImage: 'linear-gradient(90deg' + lg + ')',
                          borderRadius: '2px',
                          transition: 'all .2s ease-out',
                        }}
                      />
                    </div>
                  )
                },
                accessor: (d) => {
                  return d.startedDateTime
                },
                sortMethod: sortDate,
                Footer: (d) => formatNumber(totalCount, 0) + ' calls',
              },
            ],
          },
        ]}
        defaultPageSize={10}
        className="-striped -highlight"
      />
    }
}
EntryGrid.propTypes = {
    configData: PropTypes.object.isRequired,
    harEntries: PropTypes.array.isRequired,
    harData: PropTypes.object.isRequired,
    pageSpeed: PropTypes.object.isRequired,
}
