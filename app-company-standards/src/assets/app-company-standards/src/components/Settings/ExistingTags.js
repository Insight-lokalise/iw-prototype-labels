import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'
import { Button, ButtonGroup } from '@insight/toolkit-react'

import { Tag } from '../Shared'
import TagEdit from './TagEdit'

export default class ExistingTags extends Component {
  constructor() {
    super()
    this.state = {}
    this.handleDelete = this.handleDelete.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.toggleEdit = this.toggleEdit.bind(this)
  }

  toggleEdit(id) {
    this.setState(state => ({ [id]: !state[id] }))
  }

  handleDelete(id) {
    this.setState({ [id]: 'loading' })
    this.props.deleteTag({ id })
  }

  handleEdit({ id, name, color }) {
    this.props.editTag({ id, name, color }).then(() => this.toggleEdit(id))
  }

  render() {
    const { language, languages, tagDictionary } = this.props
    const idList = Object.keys(tagDictionary)
    return (
      <Fragment>
        <div>{t('Existing tags')}</div>
        <div className="c-existing-tags">
          {idList.length === 0 && t('No tags.')}
          {idList
            .filter(id => tagDictionary[id] && tagDictionary[id].master)
            .map(id => {
              const { color, name } = tagDictionary[id]
              const { [id]: open } = this.state
              return (
                <div key={id} className="o-grid c-existing-tags-row">
                  {!open || open === 'loading' ? (
                    <Fragment>
                      <div className="o-grid__item c-existing-tags-row__tag">
                        <Tag color={color} text={name[language]} />
                      </div>
                      <div className="o-grid__item c-existing-tags-row__actions">
                        <ButtonGroup align="right">
                          <Button color="link" onClick={() => this.toggleEdit(id)}>
                            {t('Edit')}
                          </Button>
                          <Button
                            color="link"
                            disabled={this.state[id] === 'loading'}
                            onClick={() => this.handleDelete(id)}
                          >
                            {t('Delete')}
                          </Button>
                        </ButtonGroup>
                      </div>
                    </Fragment>
                  ) : (
                    <TagEdit
                      closeEdit={this.toggleEdit}
                      color={color}
                      editTag={this.handleEdit}
                      id={id}
                      languages={languages}
                      name={name}
                    />
                  )}
                </div>
              )
            })}
        </div>
      </Fragment>
    )
  }
}

ExistingTags.propTypes = {
  deleteTag: PropTypes.func.isRequired,
  editTag: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  tagDictionary: PropTypes.objectOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.objectOf(PropTypes.string).isRequired,
    })
  ),
}

ExistingTags.defaultProps = {
  tagDictionary: {},
}
