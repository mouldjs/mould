import './react-tags.css'
import React, { useState } from 'react'
import { Text } from '@modulz/radix'
import { PlusCircle, CheckCircle, Edit } from 'react-feather'
import { useCurrentMould } from './utils'
import { ArcherElement } from 'react-archer'
import { WithOutContext as TagInput } from 'b1ncer-react-tag-input'
import { useDispatch } from 'react-redux'
import { modifyScope, deleteScope } from './appShell'
import { useDrag } from 'react-dnd'

const ScopeItem = ({ scope }: { scope: string }) => {
    const [, drag] = useDrag({ item: { type: 'SCOPE', scope } })

    return (
        <ArcherElement id={`scope-${scope}`}>
            <Text sx={{ cursor: 'grab' }} ref={drag} size={1} fontWeight="500">
                {scope}
            </Text>
        </ArcherElement>
    )
}

export const MouldScope = () => {
    const dispatch = useDispatch()
    const [editMode, setEditMode] = useState(true)
    const mould = useCurrentMould()

    if (!mould) {
        return null
    }

    const scopes = mould.scope

    return (
        <div
            style={{
                position: 'absolute',
                boxSizing: 'border-box',
                left: '100%',
                height: '100%',
                // background: 'red',
                marginLeft: 30,
                display: 'flex',
                flexDirection: 'column',
                // justifyContent: 'center',
                width: 130,
                pointerEvents: 'none',
                paddingTop: 40,
            }}
        >
            <div
                style={{
                    pointerEvents: 'auto',
                    position: 'relative',
                }}
            >
                <Text
                    as="p"
                    size={4}
                    mb="5px"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setEditMode(!editMode)}
                >
                    Scopes
                    {!editMode &&
                        (scopes.length > 0 ? (
                            <Edit
                                size={15}
                                style={{
                                    display: 'inline-block',
                                    marginLeft: 6,
                                }}
                            ></Edit>
                        ) : (
                            <PlusCircle
                                size={15}
                                style={{
                                    display: 'inline-block',
                                    marginLeft: 6,
                                }}
                            ></PlusCircle>
                        ))}
                    {scopes.length > 0 && !editMode && (
                        <Text
                            sx={{ display: 'block', color: '#7B7B7B' }}
                            as="span"
                            size={0}
                        >
                            Grab one of the scopes to kit to get binding
                        </Text>
                    )}
                </Text>

                {editMode ? (
                    <>
                        <TagInput
                            autofocus={false}
                            placeholder="Type and press enter"
                            tags={scopes.map((scope) => ({
                                id: scope,
                                text: scope,
                            }))}
                            handleAddition={(tag) =>
                                dispatch(
                                    modifyScope({
                                        mouldId: mould.id,
                                        scope: [...mould.scope, tag.text],
                                    })
                                )
                            }
                            handleDelete={(i) => {
                                dispatch(
                                    deleteScope({
                                        mouldId: mould.id,
                                        scopeName: mould.scope[i],
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
                        <CheckCircle
                            size={15}
                            onClick={() => setEditMode(!editMode)}
                            style={{
                                cursor: 'pointer',
                                position: 'absolute',
                                display: 'block',
                                bottom: '-20px',
                                right: '5px',
                            }}
                        ></CheckCircle>
                    </>
                ) : (
                    scopes.map((scope) => {
                        return <ScopeItem key={scope} scope={scope}></ScopeItem>
                    })
                )}
            </div>
        </div>
    )
}
