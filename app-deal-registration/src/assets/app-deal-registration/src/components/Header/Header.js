import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Button, Dropdown, Logo } from '@insight/toolkit-react'

const buttonProps = { color: 'link', className: "c-header__link" }
const createPaths = history => ([
    { key: 'Admin', onClick: () => history.push('/admin') },
    { key: 'Home', onClick: () => history.push('/') },
    { key: 'Logout', onClick: () => window.location.href = '/logout'}
])

const Header = ({ location, history }) => {
    const includesSubmission = location.pathname.split('/').includes('submission')
    const [menuHidden, setMenuHidden] = useState(includesSubmission)
    const paths = createPaths(history)

    useEffect(() => {
        if (includesSubmission && !menuHidden) {
            setMenuHidden(true)
        } else if (!includesSubmission && menuHidden) {
            setMenuHidden(false)
        }
    }, [location])

    return (
        <div className="c-header">
            <div className="c-header__logo">
                <Logo />
            </div>
            <div className="c-header__menu">
                {!menuHidden && (
                    <Dropdown id="header-dropdown" position="right" text="Menu">
                        {paths.map(({ key, onClick }) => (
                            <Button {...buttonProps} key={key} onClick={onClick}>{key}</Button>
                        ))}
                    </Dropdown>
                )}
            </div>
        </div>
    )
}

export default withRouter(Header)