import { Alignment, Button, Classes, MenuItem } from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'
import * as IconSet from 'react-feather'
import * as React from 'react'
import { SFC } from 'react'

const TypedSelect = Select.ofType<string>()

export const IconSelect: SFC<{
    name?: string
    onChange: (iconName?: string) => void
}> = (props) => {
    const { name: iconName } = props
    const SelectedIcon = iconName && IconSet[iconName]
    return (
        <label className={Classes.LABEL}>
            <TypedSelect
                items={Object.keys(IconSet)}
                itemPredicate={(query: string, item: string) => {
                    if (query === '') {
                        return item === props.name
                    }
                    return item.toLowerCase().indexOf(query.toLowerCase()) >= 0
                }}
                itemRenderer={(icon, { handleClick, modifiers }) => {
                    if (!modifiers.matchesPredicate) {
                        return null
                    }
                    const CurrentIcon = icon && IconSet[icon]
                    return (
                        <MenuItem
                            active={modifiers.active}
                            icon={CurrentIcon && <CurrentIcon></CurrentIcon>}
                            key={icon}
                            onClick={handleClick}
                            text={icon}
                        />
                    )
                }}
                noResults={<MenuItem disabled={true} text="No results" />}
                onItemSelect={(item) => props.onChange(item)}
                popoverProps={{ minimal: true }}
            >
                <Button
                    alignText={Alignment.LEFT}
                    className={Classes.TEXT_OVERFLOW_ELLIPSIS}
                    fill={true}
                    icon={SelectedIcon && <SelectedIcon></SelectedIcon>}
                    text={iconName}
                    rightIcon="caret-down"
                />
            </TypedSelect>
        </label>
    )
}
