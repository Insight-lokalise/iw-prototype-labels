import React from 'react'
import { Button, Form, Field, Panel } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export const StoredCartsHeader = ({query, setQuery, loading}) => {

  const submitQuery = ({query}) => {
    setQuery(query)
  }

  const validateForm = ({ query }) => {
    return {
      query:
        query?.trim()?.length < 3 && query?.trim()?.length !== 0
          ? t('Minimum of 3 characters required')
          : undefined,
    }
  }

  return (
    <Panel className="c-stored-carts--panel c-stored-carts__header">
      <Panel.Body>
        <h1 className="u-h3 u-text-bold">{t('Saved lists')}</h1>
        <Form
          initialValues={{ query: query }}
          onSubmit={submitQuery}
          skipValidateOnMount
          validate={validateForm}
          render={({ handleSubmit }) => {
            return(<form
              onSubmit={handleSubmit}
              className="o-grid u-1/2@tablet u-1/3@desktop"
            >
              <div className="o-grid__item u-1/1">
                <label className="c-form__label" htmlFor="query">
                  {t('Search lists')}
                </label>
                <div className="o-grid">
                  <div className="o-grid__item">
                    <Field
                      autoComplete="off"
                      fieldComponent="Search"
                      placeholder={t('Minimum of 3 characters required')}
                      isDisabled={loading}
                      name="query"
                      showErrorIcon
                      type="text"
                    />
                  </div>
                  <div className="o-grid__item  o-grid__item--shrink">
                    <Button
                      aria-label={t('Search')}
                      className="c-stored-carts__header__search-btn"
                      color="primary"
                      type="submit"
                      icon="search"
                      isDisabled={loading}
                    />
                  </div>
                </div>
              </div>
              <div className="o-grid__item u-1/1">
                <small className="c-form__help">
                  {t('Search by list name, product name, or part number')}
                </small>
              </div>
            </form>)
          }}
        />
      </Panel.Body>
    </Panel>
  )
}
