import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

export default function Paginator({ changePage, currentPage, maxPage, minPage }) {
  return (
    <div className='o-grid o-grid--justify-center c-activity-log__paginator'>
      <div className='o-grid__item o-grid__item--shrink'>
        {(currentPage - minPage >= 2) &&
          (<Button className='c-activity-log__paginator-link' color='link' onClick={() => changePage(minPage)}>{'<<'}</Button>)
        }
        {(currentPage - minPage >= 1) &&
          (<Button className='c-activity-log__paginator-link' color='link' onClick={() => changePage(currentPage - 1)}>{'<'}</Button>)
        }
        {(currentPage - minPage >= 2) &&
          (<Button className='c-activity-log__paginator-link' color='link' onClick={() => changePage(currentPage - 2)}>{currentPage - 1}</Button>)
        }
        {(currentPage - minPage >= 1) &&
          (<Button className='c-activity-log__paginator-link' color='link' onClick={() => changePage(currentPage - 1)}>{currentPage}</Button>)
        }
        <div className='c-activity-log__paginator-link c-activity-log__paginator-link--active u-text-bold' color='link'>{currentPage + 1}</div>
        {(maxPage - currentPage >= 1) &&
          (<Button className='c-activity-log__paginator-link' color='link' onClick={() => changePage(currentPage + 1)}>{currentPage + 2}</Button>)
        }
        {(maxPage - currentPage >= 2) &&
          (<Button className='c-activity-log__paginator-link' color='link' onClick={() => changePage(currentPage + 2)}>{currentPage + 3}</Button>)
        }
        {(maxPage - currentPage >= 1) &&
          (<Button className='c-activity-log__paginator-link' color='link' onClick={() => changePage(currentPage + 1)}>{'>'}</Button>)
        }
        {(maxPage - currentPage >= 2) &&
          (<Button className='c-activity-log__paginator-link' color='link' onClick={() => changePage(maxPage)}>{'>>'}</Button>)
        }
      </div>
    </div>
  )
}

Paginator.propTypes = {
  changePage: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  maxPage: PropTypes.number.isRequired,
  minPage: PropTypes.number
}

Paginator.defaultProps = {
  minPage: 0
}
