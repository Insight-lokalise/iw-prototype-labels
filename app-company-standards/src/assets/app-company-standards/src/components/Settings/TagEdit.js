import React, { Component } from "react";
import PropTypes from "prop-types";
import { t } from "@insight/toolkit-utils";
import { Button, ButtonGroup, Dropdown, Field } from "@insight/toolkit-react";

import { languageMap } from "../../lib";
import { TagIcon, tagColors } from "../Shared";

export default class TagEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: props.color,
      disabled: false,
      name: { ...props.name }
    };
    this.handleEdit = this.handleEdit.bind(this);
  }

  handleNameChange = ({ target }) => {
    const { name } = this.state;
    name[target.name] = target.value;
    this.setState({ name });
  };

  handleColorChange = color => {
    this.setState({ color });
  };

  handleEdit = () => {
    const {
      state: { color, name },
      props: { id }
    } = this;
    const emptyNames = Object.values(name).findIndex(Boolean) === -1;
    if (emptyNames) return;
    this.setState({ disabled: true });
    this.props.editTag({ color, id, name }).then(
      this.setState({
        color: this.props.color,
        disabled: false,
        name: { ...this.props.name }
      })
    );
  };

  handleSubmit = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.handleEdit();
    }
  };

  render() {
    const {
      state: { color, disabled, name },
      props: { closeEdit, id, languages }
    } = this;
    return (
      <div className="o-grid__item u-2/3 u-margin-bot-small">
        <form className="c-form c-cs-tag-edit__form">
          <div className="o-grid o-grid--justify-between">
            <div className="o-grid__item u-1/5 c-settings-tags__dropdown">
              <div className="c-form__element">
                <label
                  className="c-form__label c-cs-tag__required-field"
                  htmlFor={`assignColor-${id}`}
                >
                  {t("Assign color")}
                </label>
                <Dropdown
                  id={`assignColor-${id}`}
                  position="left"
                  text={<TagIcon color={color} />}
                >
                  {tagColors.map(tagColor => (
                    <Button
                      className="c-settings-tags__dropdown-icon"
                      key={tagColor}
                      onClick={() => this.handleColorChange(tagColor)}
                    >
                      <TagIcon color={tagColor} />
                    </Button>
                  ))}
                </Dropdown>
              </div>
            </div>
            <div className="o-grid__item o-grid__item--shrink">
              {languages.map(lang => (
                <div className="c-form__element" key={lang}>
                  <Field
                    id="js-settings-tags__text"
                    label={`${t("Tag text")} (${languageMap[lang]})`}
                    maxLength={20}
                    name={lang}
                    onChange={this.handleNameChange}
                    fieldComponent="Text"
                    value={name[lang]}
                    onKeyPress={this.handleSubmit}
                  />
                  <small className="c-character-counter">
                    <strong>{name[lang] ? 20 - name[lang].length : 20}</strong>{" "}
                    {t("characters left")}
                  </small>
                </div>
              ))}
            </div>
            <div className="o-grid__item o-grid__item--shrink">
              <ButtonGroup className="o-grid o-grid--full-height o-grid--center">
                {id && (
                  <Button color="link" onClick={() => closeEdit(id)}>
                    <span>{t("Cancel")}</span>
                  </Button>
                )}
                <Button
                  color="link"
                  disabled={disabled}
                  onClick={this.handleEdit}
                >
                  <span>{t(id ? "Save" : "Create")}</span>
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

TagEdit.propTypes = {
  closeEdit: PropTypes.func,
  color: PropTypes.string.isRequired,
  editTag: PropTypes.func.isRequired,
  id: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.objectOf(PropTypes.string).isRequired
};

TagEdit.defaultProps = {
  closeEdit: () => {},
  id: undefined
};
