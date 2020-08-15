import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import mould from '../../mould'
import { useCurrentMould } from '../utils'
import { MenuItem } from '@blueprintjs/core'
import { Suggest } from '@blueprintjs/select'
import { X } from 'react-feather'
import {
    disconnectScopeToKit,
    connectScopeToKit,
    modifyScopeFromDataMappingVector,
} from '../appShell'
import {
    Scope,
    Property,
    suggestSelectProps,
    createTarget,
    renderCreateTargetOption,
    isTargetEqual,
} from './SuggestSelectUtils'
import { findIndex, clone } from 'lodash'

const PropertySuggest = Suggest.ofType<Property>()
const ScopeSuggest = Suggest.ofType<Scope>()

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
    const scope = currentMould && currentMould.scope
    const currentKit = kits?.find((k) => k.name === kitName)
    const bindingList = currentKit?.dataMappingVector
    const [internalScope, setInternalScope] = useState(clone(scope) || [])
    const type = currentKit?.type

    useEffect(() => {
        setInternalScope(clone(scope) || [])
    }, [scope])
    const plugin = mould.getComponent(type)
    if (!plugin) {
        return null
    }
    const fields =
        plugin.type === 'Mould'
            ? Object.keys(currentMould!.input)
            : Object.keys(plugin.Standard!._def.shape)
    const usedAttrs = bindingList?.map(([src]) => src)
    const attrsList = fields.filter((f) => !usedAttrs?.includes(f))

    const propertySuggestConfig = {
        allowCreate: false,
        closeOnSelect: true,
        fill: false,
        openOnKeyDown: false,
        resetOnClose: true,
        resetOnQuery: true,
        resetOnSelect: true,
    }

    const scopeSuggestConfig = {
        allowCreate: false,
        closeOnSelect: true,
        createdItems: [],
        fill: false,
        items: scope,
        minimal: true,
        openOnKeyDown: false,
        resetOnClose: false,
        resetOnQuery: true,
        resetOnSelect: false,
    }

    const deleteMapping = ({
        scope,
        prop,
    }: {
        scope: string
        prop: string
    }) => () => {
        dispatch(
            disconnectScopeToKit({
                scope,
                prop,
                mouldName,
                kitName,
            })
        )
    }

    const handleAddingPropertyChange = (p: Property) => {
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

    const handleScopeEditingChange = (s: Scope, index: number) => {
        setInternalScope([
            ...internalScope.slice(0, index),
            s,
            ...internalScope.slice(index),
        ])
        dispatch(
            modifyScopeFromDataMappingVector({
                mouldName,
                newScope: s,
                indexInDataMappingVector: index,
                kitName,
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
                                <ScopeSuggest
                                    className="suggest-select"
                                    {...suggestSelectProps({
                                        items: internalScope,
                                    })}
                                    {...scopeSuggestConfig}
                                    defaultSelectedItem={v[1]}
                                    createNewItemFromQuery={createTarget}
                                    createNewItemRenderer={
                                        renderCreateTargetOption
                                    }
                                    inputValueRenderer={(s: Scope) => s}
                                    itemsEqual={isTargetEqual}
                                    items={internalScope}
                                    noResults={
                                        <MenuItem
                                            disabled={true}
                                            text="No results."
                                        />
                                    }
                                    onItemSelect={(s) =>
                                        handleScopeEditingChange(s, index)
                                    }
                                    popoverProps={{ minimal: true }}
                                />
                                <DeleteIcon
                                    onClick={deleteMapping({
                                        scope: v[1],
                                        prop: v[0],
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
                            className="suggest-select"
                            {...suggestSelectProps({ items: attrsList })}
                            {...propertySuggestConfig}
                            items={attrsList}
                            noResults={
                                <MenuItem disabled={true} text="No results." />
                            }
                            inputValueRenderer={() => 'new...'}
                            onItemSelect={handleAddingPropertyChange}
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
