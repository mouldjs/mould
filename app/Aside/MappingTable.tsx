import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import mould from '../../mould'
import { useCurrentMould } from '../utils'
import { MenuItem } from '@blueprintjs/core'
import { Suggest } from '@blueprintjs/select'
import { X } from 'react-feather'
import { deleteScope, connectScopeToKit } from '../appShell'
import { Property, propertySelectProps } from './PropertySelectUtils'
import { findIndex } from 'lodash'

const PropertySuggest = Suggest.ofType<Property>()

const Table = styled.table({
    width: '100%',
    wordWrap: 'break-word',
    tableLayout: 'fixed',
    border: '1px solid #ccc',
    borderRadius: '5px',
})

const Row = styled.tr`
    position: relative;
`

const ScopeWrapper = styled.td({
    position: 'relative',
})

const DeleteIcon = styled(X)`
    display: none;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
    cursor: pointer;
    &:hover {
        color: #ff7575;
    }
    ${Row}:hover & {
        display: block;
    }
`

export default ({ mouldName, kitName }: { mouldName; kitName }) => {
    const dispatch = useDispatch()

    const currentMould = useCurrentMould()
    const kits = currentMould && currentMould.kits
    const currentKit = kits?.find((k) => k.name === kitName)
    const bindingList = currentKit?.dataMappingVector

    const type = currentKit?.type

    const plugin = mould.getComponent(type)
    const fields =
        plugin.type === 'Mould'
            ? Object.keys(currentMould!.input)
            : Object.keys(plugin.Standard!._def.shape)
    const usedAttrs = bindingList?.map(([src]) => src)
    const attrsList = fields.filter((f) => !usedAttrs?.includes(f))

    const suggestProps = {
        allowCreate: false,
        closeOnSelect: true,
        createdItems: [],
        fill: false,
        items: attrsList,
        openOnKeyDown: false,
        resetOnClose: true,
        resetOnQuery: true,
        resetOnSelect: true,
    }

    const deleteMapping = ({ scope }: { scope: string }) => () => {
        dispatch(
            deleteScope({
                scopeName: scope,
                mouldName,
            })
        )
    }

    const handleValueChange = (p: Property) => {
        const kitIndex = findIndex(kits, (k) => k.name === kitName)
        const scope = currentMould && currentMould.scope
        const tmpScope = `scope ${scope!.length + 1}`
        dispatch(
            connectScopeToKit({
                scope: tmpScope,
                prop: p,
                mouldName,
                kitIndex,
            })
        )
    }

    return (
        <Table className="bp3-html-table bp3-html-table-bordered bp3-html-table-striped bp3-interactive">
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Scope</th>
                </tr>
            </thead>
            <tbody>
                {bindingList?.map((v, index) => {
                    return (
                        <Row>
                            <td>{v[0]}</td>
                            <ScopeWrapper>
                                <div>{v[1]}</div>
                                <DeleteIcon
                                    onClick={deleteMapping({
                                        scope: v[1],
                                    })}
                                    size={12}
                                />
                            </ScopeWrapper>
                        </Row>
                    )
                })}
                <tr>
                    <td>
                        <PropertySuggest
                            {...propertySelectProps({ items: attrsList })}
                            {...suggestProps}
                            items={attrsList}
                            inputProps={{
                                className: 'primary',
                            }}
                            noResults={
                                <MenuItem disabled={true} text="No results." />
                            }
                            inputValueRenderer={() => 'new...'}
                            onItemSelect={handleValueChange}
                            popoverProps={{
                                minimal: true,
                            }}
                        />
                    </td>
                    <td>...</td>
                </tr>
            </tbody>
        </Table>
    )
}
