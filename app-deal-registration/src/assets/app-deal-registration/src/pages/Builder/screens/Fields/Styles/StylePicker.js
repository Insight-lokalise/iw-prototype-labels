import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { BlockPicker } from 'react-color'
import { Button } from '@insight/toolkit-react'

import { Field, Popover } from '@components'
import {
    FONT_COLORS,
    FONT_HEX_TO_NAME_MAP,
    FONT_NAME_TO_HEX_MAP,
    FONT_TYPES, 
    FONT_WEIGHTS
} from '../../../constants'

export default function StylePicker({ dispatcher, id, type }) {
    const styles = useSelector(state => state.builder.styles[id])
    const [isOpen, setOpen] = useState(false)

    const handleClose = () => setOpen(false)
    const handleOpen = () => setOpen(true)

    const handleBasicChange = ({ target: { name, value }}) => {
        dispatcher.updateStyles({ id, name, value })
    }
    const handleColorChange = color => {
        dispatcher.updateStyles({
            id,
            name: 'color',
            value: FONT_HEX_TO_NAME_MAP[color.hex]
        })
    }
    const classes = `c-builder-style c-builder-style__${type}`

    return (
        <div className={classes}>
            <Popover
                button={(<Button color="link" icon="keypad" onClick={handleOpen} />)}
                contentClassName="c-builder-style__popover"
                isOpen={isOpen}
                onClose={handleClose}
                position="top-right"
            >
                <div className="c-builder-style__picker">
                    <Button className="c-builder-style__close" color="link" icon="close" onClick={handleClose} />
                    <Field
                        fullWidth
                        handleChange={handleBasicChange}
                        initialValue={styles.font}
                        label="Font"
                        name="font"
                        options={FONT_TYPES}
                        type="Select"
                    />
                    <Field
                        fullWidth
                        handleChange={handleBasicChange}
                        initialValue={styles.weight}
                        label="Weight"
                        name="weight"
                        options={FONT_WEIGHTS}
                        type="Select"
                    />
                    <BlockPicker
                        color={FONT_NAME_TO_HEX_MAP[styles.color]}
                        colors={FONT_COLORS}
                        onChangeComplete={handleColorChange}
                        triangle="hide"
                    />
                </div> 
            </Popover>            
        </div>
    )
}
