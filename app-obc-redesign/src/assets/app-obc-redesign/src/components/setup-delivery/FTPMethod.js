import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { Field, Form } from "@insight/toolkit-react";
import {
  FieldError,
  HelpText,
  Label,
} from "@insight/toolkit-react/lib/Form/Components/Decorators";
import { getPasswordStrength } from "@insight/toolkit-utils";

import AppContext from "../../context/AppProvider";
import FormButtons from "./FormButtons";

export default function FTPMethod({
  onSubmit,
  validateForm,
  viewNextStep,
  formSubmitted,
  errorsExist,
  submitLoading,
  renderMessages,
  deliveryMethod,
  disableSubmit,
}) {
  const { setupDeliveryInfo } = useContext(AppContext);
  const [state, setState] = useState({
    host: setupDeliveryInfo.ftpRemoteHost,
    port: setupDeliveryInfo.ftpRemotePort,
    user: setupDeliveryInfo.ftpRemoteUser,
    pwd: setupDeliveryInfo.ftpRemotePassword,
    confirm: setupDeliveryInfo.ftpRemotePassword,
    deliveryMethod, // set here to clear connected form fields on method change
  });

  useEffect(() => {
    validateForm(state, true);    
  }, [state]);

  const passwordHelpText =
    "Password must be 8-32 characters and contain at least three of the following elements: " +
    "uppercase letter, lowercase letter, number, and special characters of ~ ! @ # $ % ^ & * ( ).";

  return (
    <div className="o-grid">
      <h4 className="u-margin-bot">{`Step 3: Enter configuration options for ${deliveryMethod}.`}</h4>
      <Form
        initialValues={state}
        validateOnBlur={false}
        onSubmit={onSubmit}
        validate={validateForm}
        skipValidateOnMount
        render={({ handleSubmit }) => (
          <form className="c-form" onSubmit={handleSubmit}>
            <fieldset className="o-grid__item u-2/3@desktop">
              <Field fieldComponent="Text" name="host" required>
                {({ fieldProps, meta }) => {
                  return (
                    <div
                      className={cn("c-form__element", {
                        "has-error": meta.touched && meta.error,
                      })}
                    >
                      <Label
                        id="host-label"
                        required
                        htmlFor="host"
                      >{`${deliveryMethod} Host`}</Label>
                      <div className="c-form__control">
                        <input
                          className="c-input"
                          id="host"
                          type="text"                          
                          {...fieldProps}
                          value={state.host}
                          onChange={(e) =>
                            setState((props) => ({
                              ...props,
                              host: e.target.value,
                            }))
                          }
                        />
                        {meta.touched && meta.error && (
                          <FieldError showErrorIcon>{meta.error}</FieldError>
                        )}
                      </div>
                    </div>
                  );
                }}
              </Field>
              <Field fieldComponent="Text" name="port" required>
                {({ fieldProps, meta }) => {
                  return (
                    <div
                      className={cn("c-form__element", {
                        "has-error": meta.touched && meta.error,
                      })}
                    >
                      <Label
                        id="port-label"
                        required
                        htmlFor="port"
                      >{`${deliveryMethod} Port`}</Label>
                      <div className="c-form__control">
                        <input
                          className="c-input"
                          id="port"
                          type="text"                          
                          {...fieldProps}
                          value={state.port}
                          onChange={(e) =>
                            setState((props) => ({
                              ...props,
                              port: e.target.value,
                            }))
                          }
                        />
                        {meta.touched && meta.error && (
                          <FieldError showErrorIcon>{meta.error}</FieldError>
                        )}
                      </div>
                    </div>
                  );
                }}
              </Field>
              <Field fieldComponent="Text" name="user" required>
                {({ fieldProps, meta }) => {
                  return (
                    <div
                      className={cn("c-form__element", {
                        "has-error": meta.touched && meta.error,
                      })}
                    >
                      <Label
                        id="user-label"
                        required
                        htmlFor="user"
                      >{`${deliveryMethod} User`}</Label>
                      <div className="c-form__control">
                        <input
                          className="c-input"
                          id="user"
                          type="text"                          
                          {...fieldProps}
                          value={state.user}
                          onChange={(e) =>
                            setState((props) => ({
                              ...props,
                              user: e.target.value,
                            }))
                          }
                        />
                        {meta.touched && meta.error && (
                          <FieldError showErrorIcon>{meta.error}</FieldError>
                        )}
                      </div>
                    </div>
                  );
                }}
              </Field>
              <Field fieldComponent="Text" name="pwd" required>
                {({ fieldProps, meta }) => {
                  const { value } = fieldProps;
                  const strength = !!value && getPasswordStrength(value);
                  return (
                    <div
                      className={cn("c-form__element", {
                        "has-error": meta.touched && meta.error,
                      })}
                    >
                      <Label
                        id="pwd"
                        required
                        htmlFor="password"
                      >{`${deliveryMethod} Password`}</Label>
                      <div className="c-form__control">
                        <input
                          className="c-input"
                          maxLength={32}
                          id="password"
                          type="password"                          
                          {...fieldProps}
                          value={state.pwd}
                          onChange={(e) =>
                            setState((props) => ({
                              ...props,
                              pwd: e.target.value,
                            }))
                          }
                        />
                        <div className={`c-password-meter  is-${strength}`}>
                          {strength}
                        </div>
                        {meta.touched && meta.error && (
                          <FieldError showErrorIcon>{meta.error}</FieldError>
                        )}
                        <HelpText>{passwordHelpText}</HelpText>
                      </div>
                    </div>
                  );
                }}
              </Field>
              <Field fieldComponent="Text" name="confirm" required>
                {({ fieldProps, meta }) => {
                  return (
                    <div
                      className={cn("c-form__element", {
                        "has-error": meta.touched && meta.error,
                      })}
                    >
                      <Label
                        id="pwd"
                        required
                        htmlFor="confirm"
                      >{`${deliveryMethod} Confirm Password`}</Label>
                      <div className="c-form__control">
                        <input
                          className="c-input"
                          maxLength={32}
                          id="confirm"
                          type="password"                          
                          {...fieldProps}
                          value={state.confirm}
                          onChange={(e) =>
                            setState((props) => ({
                              ...props,
                              confirm: e.target.value,
                            }))
                          }
                        />
                        {meta.touched && meta.error && (
                          <FieldError showErrorIcon>{meta.error}</FieldError>
                        )}
                      </div>
                    </div>
                  );
                }}
              </Field>
            </fieldset>
            {renderMessages()}
            <FormButtons
              disableSubmit={disableSubmit}
              formSubmitted={formSubmitted}
              viewNextStep={viewNextStep}
              errorsExist={errorsExist}
              handleSubmit={handleSubmit}
              submitLoading={submitLoading}
            />
          </form>
        )}
      />
    </div>
  );
}

FTPMethod.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  validateForm: PropTypes.func.isRequired,
  viewNextStep: PropTypes.func.isRequired,
  formSubmitted: PropTypes.bool.isRequired,
  errorsExist: PropTypes.bool.isRequired,
  submitLoading: PropTypes.bool.isRequired,
  renderMessages: PropTypes.func.isRequired,
  deliveryMethod: PropTypes.string.isRequired,
};
