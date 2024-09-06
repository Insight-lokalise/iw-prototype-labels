import React, {memo} from 'react'
import cn from 'classnames'
import Button from '@insight/toolkit-react/lib/Button/Button'
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWAnchor } from './../'

function IWAccordionSection(props) {
    const editText = t('Edit')
    const onEdit = props.onEdit || props.setActiveIndex.bind(null, props.accordionName, props.ownIndex)
    const child = React.cloneElement(React.Children.only(props.children))
    const isCollapsed = props.isCollapsed

    return (
        <section className={cn('section', props.className, { 'collapsed-section': isCollapsed })}>
            <div className="row expanded section__header is-collapse-child align-middle align-justify">
                <h3 className="columns shrink section__header-title">{props.title}</h3>
                { props.isReadOnly &&
                    <Button className='hide-for-print' color="none" icon='create' aria-label={editText} onClick={onEdit} />
                }
            </div>
            { !props.isCollapsed &&
                <div data-private={props.isPrivate} className="section__body">
                    { child }
                </div>
            }
        </section>
    )
}

export default memo(IWAccordionSection)

// Pattern for handling single or multiple children.
// const isOnlyChild = React.Children.count(children) === 1
// const childContent = isOnlyChild
//     ? React.cloneElement(React.Children.only(children), { ...rest })
//     : React.Children.map(children, child => React.cloneElement(child, { ...rest }))
