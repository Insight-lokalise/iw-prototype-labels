import React, {Fragment, useState} from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { Button } from "@insight/toolkit-react";
import { useCreateTnCContext, useTnCsContext } from '@context'
import { scrollTo, useRichTextContent } from '@lib'
import { approver, edit, read } from '@constants'
import { t } from 'api'

export default function TnCTableRow({ term, tncAddOrEdit, permission }) {

  const { description, editedBy, editTime, published, revisionId, salesAgreement, termId, type } = term

  const hasSalesAgreement = salesAgreement && salesAgreement.length > 0

  const agreements = hasSalesAgreement ? salesAgreement.map((agreement) =>
    <span>{agreement}<br /></span>
  ) : 'None';

  const { actions: { setNewTnC, setTnCToUpdate }, selectedSalesArea } = useTnCsContext()

  const { actions: { setPreviewView }, previewView } = useCreateTnCContext()

  const { defaultTerm, prePopulateForm, publishOrDeleteTerm } = useRichTextContent()

  const [isPublishedPreview, setIsPublishedPreview] = useState(published);

  const isApprover = approver === permission
  const isEditOnly = edit === permission
  const isReadOnly = read === permission

  function openPreview(previewTerm) {
    setIsPublishedPreview(previewTerm.published)
    setNewTnC(false)
    setPreviewView(true)
    setTnCToUpdate(previewTerm)
    prePopulateForm(false, previewTerm)
    scrollTo()
  }

  return(
    <div className={cn('o-grid u-padding-top-tiny u-margin-bot-tiny c-tc_termsRow', {'c-tc__default-border': term.default})}>
      <div className="o-grid__item u-1/1 u-padding-bot-tiny u-padding-left">
        <div className="o-grid ">
          <div className="o-grid__item u-3/6">
            <div className="o-grid ">
              <div className="o-grid__item u-1/6">
                <div className="o-grid__item o-grid__item--shrink u-text-center c-tc__descWrap u-margin-top-tiny">{type}</div>
              </div>
              <div className="o-grid__item u-1/6">
                <div className="o-grid__item o-grid__item--shrink u-margin-top-tiny u-text-center">{termId}</div>
              </div>
              <div className="o-grid__item u-1/6">
                <div className="o-grid__item o-grid__item--shrink u-margin-top-tiny">{revisionId}</div>
              </div>
              <div className="o-grid__item u-3/6">
                <div className="o-grid__item o-grid__item--shrink c-tc__descWrap u-margin-top-tiny">
                  {description}
                </div>
              </div>
            </div>
          </div>
          <div className="o-grid__item u-3/6">
            {previewView  ?
                <Fragment>
                  <div className="o-grid ">
                    <div className="o-grid__item u-1/4">
                      <div className="o-grid__item o-grid__item--shrink u-margin-top-tiny">
                        {editedBy}<br />{editTime}
                      </div>
                    </div>
                    <div className="o-grid__item u-1/4 u-text-center">
                      {term.default ? <div className="o-grid__item o-grid__item--shrink u-margin-top-tiny"><span className='c-tc_default'>{t('Default')}</span></div>
                        : <div className="o-grid__item o-grid__item--shrink u-margin-top-tiny">{ agreements || t('None')}</div>
                      }
                    </div>
                    <div className="o-grid__item u-2/4">
                      <div className="o-grid__item o-grid__item--shrink u-text-center u-margin-top-tiny">{isPublishedPreview ? t('Yes') : t('No')}</div>
                    </div>
                  </div>
                </Fragment>
              : <div className="o-grid ">
                  <div className="o-grid__item u-1/4">
                    <div className="o-grid__item o-grid__item--shrink u-margin-top-tiny">
                      {editedBy}<br />{editTime}
                    </div>
                  </div>
                  <div className="o-grid__item u-1/4 u-text-center">
                    {term.default ? <div className="o-grid__item o-grid__item--shrink u-margin-top-tiny"><span className='c-tc_default'>{t('Default')}</span></div>
                      : <div className="o-grid__item o-grid__item--shrink u-margin-top-tiny">{ agreements || t('None')}</div>
                    }
                  </div>
                  <div className="o-grid__item u-2/4">
                    <div className="o-grid__item o-grid__item--shrink u-text-center u-margin-top-tiny">
                    {!isReadOnly &&
                        <Fragment><Button color='link' className='c-tc_actionButton' onClick={() => tncAddOrEdit(true, term)}>{t('Edit')}</Button> |</Fragment>
                    }
                    <Button color='link' className='c-tc_actionButton' onClick={() => openPreview(term)}>{t('Preview')}</Button>
                    {isApprover && '|'}
                      {published ?
                        <Fragment>
                          {isApprover &&
                            <Fragment>
                              <Button color='link' className='c-tc_actionButton' onClick={() => publishOrDeleteTerm(false, termId, revisionId)}>{t('Archive')}</Button>
                              { !term.default && !hasSalesAgreement && '|' }
                              { !term.default && !hasSalesAgreement && <Button color='link' onClick={() => defaultTerm(termId)} className='c-tc_actionButton'>{t('Set Default')}</Button>}
                            </Fragment>
                          }
                        </Fragment>
                      :
                        <Fragment>
                          {isApprover &&
                              <Button color='link' className='c-tc_actionButton' onClick={() => publishOrDeleteTerm(true, termId, revisionId)}>{t('Publish')}</Button>
                          }
                          {(isApprover || isEditOnly) &&
                            <Fragment>
                              {'|'}<Button color='link' className='c-tc_actionButton' onClick={() => publishOrDeleteTerm(false, termId, revisionId)}>{t('Delete')}</Button>
                            </Fragment>
                          }
                        </Fragment>
                      }
                    </div>
                  </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

TnCTableRow.propTypes = {
  term: PropTypes.shape(PropTypes.object).isRequired,
  tncAddOrEdit: PropTypes.func.isRequired
}
