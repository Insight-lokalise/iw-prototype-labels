import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { connectToLocale } from '@insight/toolkit-react'
import Button from '@insight/toolkit-react/lib/Button/Button'
import Panel from '@insight/toolkit-react/lib/Panel/Panel'
import Message from '@insight/toolkit-react/lib/Message/Message'
import StaticFormField from '../StaticFormField'

const PasswordSettings = ({ context }) => {
  const { locale, pingDomain, pingClientId } = context
  const pingUrl = `${pingDomain}/as/authorize?client_id=${pingClientId}&response_type=code&scope=openid&redirect_uri=${pingDomain}&locale=${locale.replace(
    '_',
    '-'
  )}`

  return (
    <div className="c-password-settings c-panel-border">
      <Panel>
        <Panel.Title className="c-ac-panel-title">
          <Panel.Title.Left>
            <h2 className="u-h5 u-text-bold u-margin-bot-none">
              {t('Password settings')}
            </h2>
          </Panel.Title.Left>
        </Panel.Title>
        <Panel.Body>
          <div className="o-grid" data-private="true">
            <div className="o-grid__item u-1/1">
              <StaticFormField
                data-testid="password"
                label={t('Password')}
                value={'*********'}
              />
            </div>
            <div className="o-grid__item u-1/1">
              <Button
                color="inline-link"
                className="c-change-password"
                href={pingUrl}
                target="_blank"
              >
                {t('Change password')}
              </Button>
              <Message className="c-change-password-info" type="info">
                {t(
                  'Clicking "Change password" will take you to our secure password update page.'
                )}
              </Message>
            </div>
          </div>
        </Panel.Body>
      </Panel>
    </div>
  )
}

export default connectToLocale(PasswordSettings)
