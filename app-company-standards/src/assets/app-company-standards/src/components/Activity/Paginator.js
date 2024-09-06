import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'

export default function Paginator({ changePage, currentPage, maxPage, minPage }) {
  return (
    <div className='c-activity-log__paginator'>
      {(currentPage - minPage >= 2) &&
        (<Button color='link' onClick={() => changePage(minPage)}>{'<<'}</Button>)
      }
      {(currentPage - minPage >= 1) &&
        (<Button color='link' onClick={() => changePage(currentPage - 1)}>{'<'}</Button>)
      }
      {(currentPage - minPage >= 2) &&
        (<Button color='link' onClick={() => changePage(currentPage - 2)}>{currentPage - 1}</Button>)
      }
      {(currentPage - minPage >= 1) &&
        (<Button color='link' onClick={() => changePage(currentPage - 1)}>{currentPage}</Button>)
      }
      <span className="c-activity-log__paginator__current-page">{currentPage + 1}</span>
      {(maxPage - currentPage >= 1) &&
        (<Button color='link' onClick={() => changePage(currentPage + 1)}>{currentPage + 2}</Button>)
      }
      {(maxPage - currentPage >= 2) &&
        (<Button color='link' onClick={() => changePage(currentPage + 2)}>{currentPage + 3}</Button>)
      }
      {(maxPage - currentPage >= 1) &&
        (<Button color='link' onClick={() => changePage(currentPage + 1)}>{'>'}</Button>)
      }
      {(maxPage - currentPage >= 2) &&
        (<Button color='link' onClick={() => changePage(maxPage)}>{'>>'}</Button>)
      }
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
