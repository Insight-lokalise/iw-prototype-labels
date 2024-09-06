import React, { Component } from "react";
import cn from 'classnames'
import { t } from "@insight/toolkit-utils";
import { Loading } from "@insight/toolkit-react";
import PropTypes from "prop-types";

import { fetchActivityLog } from "../../api";
import Activity from "./Activity";
import Paginator from "./Paginator";

export default class ActivityLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      initialLoad: true,
      isLoading: false,
      maxPage: 0,
      log: []
    };
    this.changePage = this.changePage.bind(this);
  }

  componentDidMount() {
    this.changePage(0).then(() => this.setState({ initialLoad: false }));
  }

  async changePage(page) {
    const { wId } = this.props;
    this.setState({ isLoading: true });
    const { activities, totalPages } = await fetchActivityLog({ page, wId });
    this.setState({
      currentPage: page,
      isLoading: false,
      log: activities,
      maxPage: totalPages - 1
    });
  }

  render() {
    const { currentPage, initialLoad, log, isLoading, maxPage } = this.state;
    if (initialLoad) return <Loading />;
    // Key is set to index because the render is static on each mount.
    return (
      <div className="o-box c-activity-log u-padding-top-none">
        <h2
          className={cn("c-activity-log__title", {
            "u-text-bold u-margin-bot-small": log.length === 0
          })}
        >
          {t("Activity log")}
        </h2>
        {log.length > 0 ? (
          <div>
            <div className="o-grid">
              <div className="o-grid__item u-1/1 u-text-right">
                <span>{`${maxPage + 1} ${t("pages")}`}</span>
              </div>
            </div>
            {isLoading ? (
              <Loading />
            ) : (
              log.map((activity, i) => (
                <div className="c-activity-log__row" key={i}>
                  <Activity {...activity} />
                </div>
              ))
            )}
            {maxPage > 0 && (
              <div className="o-grid o-grid--justify-center">
                <Paginator
                  changePage={this.changePage}
                  currentPage={currentPage}
                  maxPage={maxPage}
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <p>{t("No activity available")}</p>
          </div>
        )}
      </div>
    );
  }
}

ActivityLog.propTypes = {
  wId: PropTypes.string
};

ActivityLog.defaultProps = {
  wId: undefined
};
