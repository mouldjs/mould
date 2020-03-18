import './react-tags.css'
import React, { useState } from 'react'
import { Text } from '@modulz/radix'
import { PlusCircle } from 'react-feather'
import { useCurrentMould } from './utils'
import { ArcherElement } from 'react-archer'
import { WithOutContext as TagInput } from 'b1ncer-react-tag-input'
import { useDispatch } from 'react-redux'
import { modifyScope } from './appShell'
import { useDrag } from 'react-dnd'

const ScopeItem = ({ scope }: { scope: string }) => {
    const [, drag] = useDrag({ item: { type: 'SCOPE', scope } })

    return (
        <ArcherElement id={`scope-${scope}`}>
            <Text ref={drag} size={1} fontWeight="500">
                {scope}
            </Text>
        </ArcherElement>
    )
}

export const MouldScope = () => {
    const dispatch = useDispatch()
    const [editMode, setEditMode] = useState(false)
    const mould = useCurrentMould()

    if (!mould) {
        return null
    }

    const scopes = mould.scope

    return (
        <div
            style={{
                position: 'absolute',
                left: '100%',
                height: '100%',
                // background: 'red',
                paddingLeft: 30,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minWidth: 200,
                pointerEvents: 'none',
            }}
        >
            <div style={{ pointerEvents: 'auto' }}>
                <Text as="span" size={0} onClick={() => setEditMode(!editMode)}>
                    Scopes
                    <PlusCircle
                        size={15}
                        style={{ display: 'inline-block', marginLeft: 6 }}
                    ></PlusCircle>
                </Text>

                {editMode ? (
                    <TagInput
                        autofocus
                        placeholder="add new scope"
                        tags={scopes.map(scope => ({ id: scope, text: scope }))}
                        handleAddition={tag =>
                            dispatch(
                                modifyScope({
                                    mouldId: mould.id,
                                    scope: [...mould.scope, tag.text],
                                })
                            )
                        }
                        handleDelete={i => {
                            dispatch(
                                modifyScope({
                                    mouldId: mould.id,
                                    scope: mould.scope.filter(
                                        (s, index) => i !== index
                                    ),
                                })
                            )
                        }}
                        handleDrag={(tag, currPos, newPos) => {
                            const newScopes = [...scopes]

                            newScopes.splice(currPos, 1)
                            newScopes.splice(newPos, 0, tag.text)

                            dispatch(
                                modifyScope({
                                    mouldId: mould.id,
                                    scope: newScopes,
                                })
                            )
                        }}
                    ></TagInput>
                ) : (
                    scopes.map(scope => {
                        return <ScopeItem key={scope} scope={scope}></ScopeItem>
                    })
                )}
            </div>
        </div>
    )
}
