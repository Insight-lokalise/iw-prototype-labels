import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWAnchor } from '../iw-anchor/iw-anchor'

class IWPagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageTracker: {},
            stages: 2,
        }
    }
    componentDidMount() {
       this.setPage(this.props.intialPage);
    }

   setPage(startPage) {
       const { totalRecords, recordsPerPage } = this.props
       const lastPage = Math.ceil(totalRecords / recordsPerPage)
       const newpageTracker = this.createPageTracker(startPage, lastPage, this.state.stages)
       // get new pageTracker object for specified page
        this.setState({
            pageTracker: newpageTracker,
        }, () => {
            // call change page function in parent component
            this.props.handlePageChange(this.state.pageTracker)
        })
    }

    createPageTracker(startPage, lastPage, stages) {
    // return object with all pageTracker properties required by the view
        return {
            lastPage,
            startPage,
            stages,
        }
    }

    startEndRecord(startPage, recordsPerPage, totalRecords) {
        const shownStart = ((startPage - 1) * recordsPerPage) + 1;
        let shownEnd = (startPage) * recordsPerPage;
        if (shownEnd > totalRecords) { shownEnd = totalRecords; }

        return {
            shownStart,
            shownEnd,
        }
    }

    renderActiveOrClickable(counter, pageTracker) {
        let activeLink
        if (counter === pageTracker.startPage) {
            activeLink = (<li key={counter} className='columns shrink pagination__page-item'><span className='pagination__page-link pagination__page-link--active'><span className="show-for-sr">{t('You are on page')}</span>{counter}</span></li>)
        } else {
            activeLink = (<li key={counter} className='columns shrink pagination__page-item'>
                <IWAnchor className="pagination__page-link"
                    aria-label={`${t('Page')} ${counter}`}
                    onClick={() => this.setPage(counter)}>
                    {counter}
                </IWAnchor>
            </li>)
        }
        return activeLink
    }

    renderNextLink(pageTracker) {
        const nextText = t('Next')
        const nextPageText = t('Next page')
        let nextLink
        /* Display nextpage text only when the current page is less than lastpage*/
        if (pageTracker.startPage < pageTracker.lastPage) {
            nextLink = (
                <IWAnchor className="pagination__page-link"
                    aria-label={nextPageText}
                    onClick={() => this.setPage(pageTracker.startPage + 1)}>
                    {nextText} <span className='ion--right ion-chevron-right'></span>
                </IWAnchor>
            )
        } else {
            nextLink = (
                <span className='pagination__page-link pagination__page-link--disabled' aria-label={nextPageText}>
                    {nextText} <span className='ion--right ion-chevron-right'></span>
                </span>
            )
        }
        return nextLink
    }

    renderPreviousLink(pageTracker) {
        const previousText = t('Previous')
        const previousPageText = t('Previous page')
        let previousLink
        if (pageTracker.startPage > 1) {
            previousLink = (
                <IWAnchor className="pagination__page-link"
                    aria-label={previousPageText}
                    onClick={() => this.setPage(pageTracker.startPage - 1)}>
                    <span className='ion ion-chevron-left'></span> {previousText}
                </IWAnchor>
            )
        } else {
            previousLink = (
                <span className='pagination__page-link pagination__page-link--disabled' aria-label={previousPageText}>
                    <span className='ion ion-chevron-left'></span> {previousText}
                </span>
            )
        }
        return previousLink
    }

    renderRemainingLinks(pageTracker) {
        let renderActiveOrClickable = []
        if (pageTracker.lastPage > 1 + (pageTracker.stages)) {
            /*
                - Load first 3 links along with NEXT PAGE links
                - Click on 2 display 1-4, click on 3 display 1-5
                - Ex: 1 2 3 Next, Previous 1 2 3 4 Next
            */
            if (pageTracker.startPage < (pageTracker.stages + 1)) {
                for (var initialCount = 1; initialCount <= (pageTracker.startPage + pageTracker.stages); initialCount++) {
                    renderActiveOrClickable.push(this.renderActiveOrClickable(initialCount, pageTracker))
                }
            } else if (pageTracker.lastPage - (pageTracker.stages * 1) >
                    pageTracker.startPage && pageTracker.startPage > (pageTracker.stages * 1)) {
                /*
                    - Get next 2 links onclick on 3 & further. Ex: Previous 1 2 3 4 5 Next
                    - Max 5 links will be displayed. If its > 5 (6th page), previous links will be hidden and displays next
                    - Ex: Previous 2 3 4 5 6 Next
                 */
                for (var nextCount = pageTracker.startPage - pageTracker.stages;
                        nextCount <= pageTracker.startPage + pageTracker.stages; nextCount++) {
                    renderActiveOrClickable.push(this.renderActiveOrClickable(nextCount, pageTracker))
                }
            } else {
                /*
                    - when you have last 3 pages left, show/hide steps accordingly.
                    - Ex: startPage - 8, Lastpage - 10 - Previous 6 7 8 9 10 Next
                    - Click on 9th page - Previous 7 8 9 10 Next and it goes on & finally dsiplays last 3 links
                    - Ex: Previous 8 9 10
                 */
                for (var lastCount = pageTracker.startPage - pageTracker.stages;
                        lastCount <= pageTracker.lastPage; lastCount++) {
                    renderActiveOrClickable.push(this.renderActiveOrClickable(lastCount, pageTracker))
                }
            }
            return renderActiveOrClickable
        }
    }

    render() {
        const toLabel = t('to')
        const ofLabel = t('of')
        this.state.pageTracker.startPage = this.props.tmpStartPage ? this.props.tmpStartPage : this.state.pageTracker.startPage
        const startEndRecord = this.startEndRecord(this.state.pageTracker.startPage, this.props.recordsPerPage, this.props.totalRecords)
        const pageTracker = this.state.pageTracker

        return (
            <div>
                {pageTracker.lastPage > 1 &&
                    <div>
                        <ul className="row collapse align-justify pagination" role="navigation" aria-label={t('Pagination')}>
                            <li className="columns shrink pagination__page-item">
                                {pageTracker.startPage > 1 &&
                                    <IWAnchor className="pagination__page-link"
                                        aria-label={t('Previous page')}
                                        onClick={() => this.setPage(1)}>
                                        <span className='ion ion-chevron-left'></span><span className='ion ion-chevron-left'></span>
                                    </IWAnchor>
                                }
                                {this.renderPreviousLink(pageTracker)}
                            </li>
                            <li className="columns shrink pagination__page-item">
                                <ul className="row collapse no-margin-bot">
                                    {this.renderRemainingLinks(pageTracker)}
                                </ul>
                            </li>
                            <li className="columns shrink pagination__page-item">
                                {this.renderNextLink(pageTracker)}
                                {pageTracker.lastPage !== pageTracker.startPage &&
                                    <IWAnchor className="pagination__page-link"
                                        aria-label={t('Last page')}
                                        onClick={() => this.setPage(pageTracker.lastPage)}>
                                        <span className='ion ion-chevron-right'></span><span className='ion ion-chevron-right'></span>
                                    </IWAnchor>
                                }
                            </li>
                        </ul>
                        <p className="text-right">
                            <strong>{startEndRecord.shownStart}</strong> {toLabel}
                            <strong> {startEndRecord.shownEnd}</strong> {ofLabel}
                            <strong> {this.props.totalRecords}</strong>
                        </p>
                    </div>
                }
            </div>
        );
    }
}

IWPagination.propTypes = {
    onChangePage: PropTypes.func,
    initialPage: PropTypes.number,
    lastPage: PropTypes.number,
    startPage: PropTypes.number,
    stages: PropTypes.number,
    tmpStartPage: PropTypes.number,
}

export default IWPagination
