import React, { useState } from 'react'
import { Flex, Text } from '@modulz/radix'
import { FolderPlus } from 'react-feather'
import { Popover, PopoverInteractionKind } from '@blueprintjs/core'
import Dialog from './InsertDialog'

const InsertTrigger = () => {
    const [isOpen, setIsOpen] = useState(false)
    const handleClose = () => setIsOpen(false)

    return (
        <>
            <Popover interactionKind={PopoverInteractionKind.HOVER_TARGET_ONLY}>
                <div
                    className="p-r right-divider m-r"
                    style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onClick={() => setIsOpen(true)}
                >
                    <FolderPlus
                        className={isOpen ? 'primary' : 'pure'}
                    ></FolderPlus>
                    <p className={`clickable m-t-sm m-b-0 pure`}>Insert</p>
                </div>
                <Flex
                    translate
                    p={10}
                    width="180px"
                    alignItems="center"
                    justifyContent="center"
                    sx={{ flexDirection: 'column', fontSize: '14px' }}
                >
                    <FolderPlus size={32} color="#666"></FolderPlus>
                    <Text
                        as="p"
                        mt={15}
                        sx={{ color: '#666', textAlign: 'center' }}
                    >
                        Insert
                    </Text>
                    <Text
                        as="p"
                        size={2}
                        mt={10}
                        sx={{ color: '#666', lineHeight: '1.3' }}
                    >
                        Quickly browse and insert any component in your app.
                    </Text>
                </Flex>
            </Popover>
            <Dialog isOpen={isOpen} onClose={handleClose} />
        </>
    )
}

export default InsertTrigger
