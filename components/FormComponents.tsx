import React, { ReactNode, Fragment, useState } from 'react'
import { Flex, Text, Box, Tooltip } from '@modulz/radix'
import { Plus } from 'react-feather'

export const Cell = ({
    label,
    desc,
    children,
}: {
    label: string
    desc?: string
    children: ReactNode
}) => {
    return (
        <Flex justifyContent="space-between" alignItems="baseline" margin={12}>
            {desc && (
                <Tooltip label={desc} side="bottom" align="start">
                    <Text size={0}>{label}</Text>
                </Tooltip>
            )}
            {!desc && <Text size={0}>{label}</Text>}
            <Box width={170}>{children}</Box>
        </Flex>
    )
}

export const Head = ({
    title,
    desc,
    children,
}: {
    title: string
    desc?: string
    children: ReactNode
}) => {
    return (
        <Flex
            backgroundColor="#eeeeee"
            justifyContent="space-between"
            alignItems="center"
            paddingX={12}
            paddingY="8px"
        >
            {desc && (
                <Tooltip label={desc} side="bottom" align="start">
                    <Text size={0} fontWeight={500}>
                        {title}
                    </Text>
                </Tooltip>
            )}
            {!desc && (
                <Text size={0} fontWeight={500}>
                    {title}
                </Text>
            )}
            {children}
        </Flex>
    )
}

export const Board = ({ children }) => {
    return <Box borderY="1px solid #c7c7c7">{children}</Box>
}

const CollspaedHead = ({
    title,
    desc,
    onOpen,
}: {
    title: string
    desc?: string
    onOpen: () => void
}) => {
    return (
        <Board>
            <Flex
                justifyContent="space-between"
                alignItems="center"
                paddingX={12}
                paddingY="8px"
                onClick={() => onOpen()}
            >
                {desc && (
                    <Tooltip label={desc} side="bottom" align="start">
                        <Text size={0} fontWeight={500}>
                            {title}
                        </Text>
                    </Tooltip>
                )}
                {!desc && (
                    <Text size={0} fontWeight={500}>
                        {title}
                    </Text>
                )}
                <Plus color="#959595" size={16}></Plus>
            </Flex>
        </Board>
    )
}

export const TitledBoard = ({
    collspae = false,
    title,
    desc,
    renderTitle = () => null,
    children,
}: {
    collspae?: boolean
    renderTitle?: (collspaed: boolean) => ReactNode
    children: ReactNode
    title: string
    desc?: string
}) => {
    const [collspaed, setCollspaed] = useState(false)

    if (collspae) {
        return !collspaed ? (
            <Fragment>
                <Head title={title} desc={desc}>
                    <Flex alignItems="center">
                        {renderTitle(collspaed)}
                        <Plus
                            color="#959595"
                            size={16}
                            onClick={() => setCollspaed(true)}
                        ></Plus>
                    </Flex>
                </Head>
                <Board>{children}</Board>
            </Fragment>
        ) : (
            <CollspaedHead
                title={title}
                desc={desc}
                onOpen={() => setCollspaed(false)}
            ></CollspaedHead>
        )
    }

    return (
        <Fragment>
            <Head title={title} desc={desc}>
                {renderTitle(false)}
            </Head>
            <Board>{children}</Board>
        </Fragment>
    )
}
