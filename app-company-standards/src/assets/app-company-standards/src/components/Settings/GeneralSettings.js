import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Field, Button, ButtonGroup } from '@insight/toolkit-react'
import { isObject, t } from '@insight/toolkit-utils';

import { dateFormat, RichTextEditor } from '../Shared'
import { languageMap } from '../../lib'
import { UniversalMessageContext } from "../UniversalMessages"

export default class GeneralSettings extends Component {
  constructor(props) {
    super(props)
    const { settings: {
      defaultLanguage,
      defaultView,
      disableViewChange,
      header,
      languages,
      locked,
      notes,
      welcomeText
    } } = this.props
    this.state = {
      disableSave: false,
      isHeaderEditable: false,
      defaultLanguage,
      defaultView,
      disableViewChange,
      header,
      languages,
      locked,
      notes,
      welcomeText
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleLanguageSelect = this.handleLanguageSelect.bind(this)
    this.handleRichTextChange = this.handleRichTextChange.bind(this)
    this.saveChanges = this.saveChanges.bind(this)
  }

  handleInputChange = ({ target: { checked, name, type, value } }) => {
    const result = type === 'checkbox' ? checked : value
    this.setState({ [name]: result })
  }

  handleLanguageSelect = (event) => {
    const { target: { checked, name } } = event
    const { languages } = this.state
    this.setState({ languages: { ...languages, [name]: checked } })
  }

  handleTextChange = ({ target: { name, value } }) => {
    const {
      props: { language },
      state: { [name]: langObj },
    } = this
    this.setState({ [name]: { ...langObj, [language]: value } })
  }

  handleNotesChange = ({ target: { value } }) => this.setState({ notes: value })


  handleRichTextChange = (content, lang, allowEdit) => {
    const { welcomeText } = this.state
    this.setState({ welcomeText: { ...welcomeText, [lang]: content }, disableSave: !allowEdit })
  }

  saveChanges = () => {
    const {
      defaultLanguage,
      defaultView,
      disableViewChange,
      header,
      languages,
      locked,
      notes,
      welcomeText
    } = this.state
    const { editSettings, settings } = this.props
    editSettings({
      ...settings,
      defaultLanguage,
      defaultView,
      disableViewChange,
      header,
      languages,
      locked,
      notes,
      welcomeText,
    }, this.context.setActiveMessage)
  }

  render() {
    const {
      state: {
        defaultView,
        disableSave,
        disableViewChange,
        header,
        languages,
        notes,
        welcomeText,
      },
      props: {
        isManagerView,
        language,
        settings: {
          notesLastEditedDate,
          notesLastEditedBy,
          welcomeTextLastEditedBy,
          welcomeTextLastEditedDate,
        }
      }
    } = this
    // THE FOLLOWING CONST IS COMMENTED TO HIDE LANGUAGE SELECTION FOR COMPANY STANDARDS PILOT
    // const availableLocales = isObject(languages) ? Object.keys(languages) : []
    const availableLocales = ['en_US']
    const availableLanguages = availableLocales.map(locale => locale.slice(0, 2))
    const maxLength = 1000;
    return (
      <Fragment>
        <form className="c-form c-general-settings__modified-caption">
          <Field
            id="cs-settings-header"
            label={t("Header")}
            name="header"
            onChange={this.handleTextChange}
            placeholder={t("Example: My company standards")}
            fieldComponent="Text"
            maxLength="40"
            value={header[language]}
          />
          {availableLanguages.map(lang => (
            <RichTextEditor
              content={welcomeText ? welcomeText[lang] : ""}
              id={`RTE-${lang}`}
              key={lang}
              label={`${t("Custom welcome text")} (${languageMap[lang]})`}
              lastEditedBy={
                welcomeTextLastEditedBy ? welcomeTextLastEditedBy[lang] : ""
              }
              lastEditedDate={
                welcomeTextLastEditedDate ? welcomeTextLastEditedDate[lang] : ""
              }
              maxLength={maxLength}
              onChange={(content, allowEdit) =>
                this.handleRichTextChange(content, lang, allowEdit)
              }
            />
          ))}
          {isManagerView ? null : (
            <Field
              max={maxLength}
              className="c-cs-settings__internal-notes"
              id="cs-settings-notes"
              label={t("Internal notes")}
              name="notes"
              onChange={e => {
                this.handleNotesChange(e, maxLength);
              }}
              showCounter
              fieldComponent="TextArea"
              value={notes || ""}
              helpText={`${t("Last modified by")} ${notesLastEditedBy} ${t(
                "on"
              )} ${dateFormat(notesLastEditedDate)}`}
            />
          )}
          <div className="c-form__element">
            <label className="c-form__label" htmlFor="select">
              {t("Default end user view")}
              <div className="c-form__control">
                <div className="c-select-container">
                  <select
                    className="c-select"
                    id="select"
                    name="defaultView"
                    onChange={this.handleInputChange}
                    value={defaultView}
                  >
                    <option disabled>{t("Select one")}</option>
                    <option value="TILE">{t("Tile view")}</option>
                    <option value="LIST">{t("List view")}</option>
                  </select>
                </div>
              </div>
            </label>
          </div>
          <Field
            id="cs-settings-disable-view-change"
            checkboxLabel={t("Disable end user view options")}
            name="disableViewChange"
            onChange={this.handleInputChange}
            fieldComponent="Checkbox"
            checked={disableViewChange}
          />
          <hr />
          <div className="o-grid">
            <div className="o-grid__item u-1/1 u-1/2@tablet">
              {availableLocales.length > 1 && (
                <fieldset className="c-form__group">
                  <div className="c-form__element">
                    <legend className="c-form__legend">
                      {t("Available language selection")}
                    </legend>
                    <div className="c-form__control">
                      {availableLocales.map(lang => (
                        <Field
                          key={lang}
                          id={`cs-settings-languageSelect-${lang}`}
                          checkboxLabel={languageMap[lang]}
                          disabled={lang === "en_US"}
                          name={lang}
                          onChange={this.handleLanguageSelect}
                          fieldComponent="Checkbox"
                          checked={languages[lang]}
                        />
                      ))}
                    </div>
                  </div>
                </fieldset>
              )}
            </div>
            <div className="o-grid__item u-1/1 u-1/2@tablet">
              <ButtonGroup align="right">
                <Button
                  color="primary"
                  onClick={this.saveChanges}
                  isDisabled={
                    this.state.notes?.length > 1000 ||
                    disableSave
                  }
                >
                  {t("Save")}
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </form>
      </Fragment>
    );
  }
}

GeneralSettings.propTypes = {
  editSettings: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  settings: PropTypes.shape({
    defaultView: PropTypes.oneOf(['list', 'tile']),
    disableViewChange: PropTypes.bool,
    header: PropTypes.objectOf(PropTypes.string),
    languages: PropTypes.objectOf(PropTypes.bool),
    notes: PropTypes.objectOf(PropTypes.string),
    notesEditDate: PropTypes.number,
    notesEditUser: PropTypes.string,
    textEditDate: PropTypes.number,
    textEditUser: PropTypes.string,
    welcomeText: PropTypes.objectOf(PropTypes.string),
  }).isRequired
}

GeneralSettings.contextType = UniversalMessageContext
