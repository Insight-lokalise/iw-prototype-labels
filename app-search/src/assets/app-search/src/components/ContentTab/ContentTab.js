import React, { useEffect, useState, useContext } from 'react'
import { Pagination } from '@insight/toolkit-react'
import { ContentTabHeader } from './ContentTabHeader'
import { SearchContext } from '../../context/SearchContext'
import useDidMount from '../../hooks/useDidMount'
import { DEFAULT_PAGE_COUNT } from '../../constants'
import { ContentRow } from "./ContentRow";

export const ContentTab = ({ handleTabClick, query, items, id, newContentRowUI }) => {
  const { origParams } = useContext(SearchContext)
  const [contents, setContents] = useState(items?.hits)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(
    Math.ceil(items?.total / items?.results)
  )
  const [rows, setRows] = useState(DEFAULT_PAGE_COUNT)

  useEffect(() => {
    setContents(items?.hits)
  }, [items])

  const onPageChange = (page) => {
    handleTabClick({
      searchText: query,
      pageSize: rows,
      currentPage: page,
    }).then((res) => {
      setContents(res?.hits)
      setCurrentPage(page)
    })
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }

  useDidMount(() => {
    handleTabClick({ searchText: query, pageSize: rows }).then((res) => {
      setContents(res?.hits)
      setCurrentPage(1)
      setTotalPages(Math.ceil(res?.total / res.results))
    })
  }, [rows])

  return (
    <div className="o-grid">
      <ContentTabHeader
        rows={rows}
        currentPage={currentPage}
        setRows={setRows}
        query={query}
        totalRecords={items?.total}
        id={id}
      />
      {contents && (
        <div className="search-results-wrapper">
          {contents.map(
            ({ title, articleDate, path, excerpt, articleType }, id) => (
              <ContentRow
                title={title}
                articleDate={articleDate}
                path={path}
                excerpt={excerpt}
                articleType={articleType}
                id={id}
                key={id}
                newContentRowUI={newContentRowUI}
              />
            )
          )}
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageHandler={onPageChange}
      />
    </div>
  )
}

export default ContentTab
