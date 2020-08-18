import React, { useState, useRef } from 'react'
import { Component } from '../types'
import { useDispatch } from 'react-redux'
import { EditableText } from '@blueprintjs/core'
import { useCurrentMould, useSimulateScroll } from '../utils'
import styled from 'styled-components'
import { modifyKitName } from '../appShell'
import MappingTable from './MappingTable'

const Container = styled.div({
    padding: '8px',
    fontSize: '14px',
})

const Row = styled.tr`
    position: relative;
`

const Head = styled.div({
    display: 'flex',
    justifyContent: 'space-between',
})

const EditableKitName = styled(EditableText)`
    font-size: 18px;
`

export default ({
    node,
    mouldName,
    stateName,
}: {
    node: Component | null | undefined
    mouldName
    stateName
}) => {
    const dispatch = useDispatch()
    if (!node) {
        return null
    }
    const currentMould = useCurrentMould()

    const name = node.props['__kitName']
    const [newKitName, setNewKitName] = useState(name)
    const kits = currentMould && currentMould.kits
    const currentKit = kits?.find((k) => k.name === name)
    const type = currentKit?.type
    const kitNames = kits?.map((k) => (k.name === name ? '' : k.name))

    const onNameConfirm = () => {
        if (!newKitName) {
            resetName()
            return
        }
        if (kitNames?.includes(newKitName)) {
            resetName()
            return
        }
        dispatch(
            modifyKitName({
                newKitName,
                kitName: name,
                mouldName,
                stateName,
            })
        )
    }
    const onNameChange = (value) => {
        setNewKitName(value)
    }
    const resetName = () => {
        setNewKitName(name)
    }

    return (
        <Container>
            <Head className="m-b">
                <EditableKitName
                    type="text"
                    value={newKitName}
                    placeholder="Kit Name"
                    onConfirm={onNameConfirm}
                    onChange={onNameChange}
                    onEdit={resetName}
                    confirmOnEnterKey={true}
                    selectAllOnFocus={true}
                />
            </Head>
            <div className="m-b">Type: {type}</div>
            <MappingTable mouldName={mouldName} kitName={name} />
        </Container>
    )
}
