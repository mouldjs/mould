import React, { ReactNode, Fragment, useState, RefObject } from 'react'
import { Flex, Text, Box, Tooltip, FlexProps } from '@modulz/radix'
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
        <Flex
            translate
            justifyContent="space-between"
            alignItems="baseline"
            marginY={1}
            marginRight={3}
        >
            {desc && (
                <Tooltip label={desc} side="bottom" align="start">
                    <Text size={0}>{label}</Text>
                </Tooltip>
            )}
            {!desc && (
                <Text sx={{ flexBasis: '50px' }} size={0}>
                    {label}
                </Text>
            )}
            <Box translate sx={{ flexBasis: 'auto' }}>
                {children}
            </Box>
        </Flex>
    )
}

export const Head = ({
    title,
    desc,
    children,
    ...rest
}: {
    title: string
    desc?: string
    children: ReactNode
} & FlexProps) => {
    return (
        <Flex
            translate
            backgroundColor="#eeeeee"
            justifyContent="space-between"
            alignItems="center"
            paddingX={12}
            paddingY="8px"
            {...rest}
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
    return (
        <Box translate borderY="1px solid #c7c7c7" padding={8}>
            {children}
        </Box>
    )
}

const CollspaedHead = ({
    title,
    desc,
    renderTitle,
}: {
    title: string
    desc?: string
    renderTitle?: () => ReactNode
}) => {
    return (
        <Board>
            <Flex
                translate
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
                {renderTitle && renderTitle()}
            </Flex>
        </Board>
    )
}

export const TitledBoard = ({
    collspaed = false,
    title,
    desc,
    renderTitle = () => null,
    children,
    ref,
}: {
    collspaed?: boolean
    renderTitle?: () => ReactNode
    children: ReactNode
    title: string
    desc?: string
    ref?: RefObject<HTMLDivElement>
}) => {
    // let [collspaed, setCollspaed] = useState(false)

    // if (collspae) {
    return !collspaed ? (
        <Fragment>
            <Head title={title} desc={desc} ref={ref}>
                <Flex translate alignItems="center">
                    {renderTitle ? (
                        renderTitle()
                    ) : (
                        <Plus
                            color="#959595"
                            size={16}
                            // onClick={() => setCollspaed(true)}
                        ></Plus>
                    )}
                </Flex>
            </Head>
            <Board>{children}</Board>
        </Fragment>
    ) : (
        <Head
            title={title}
            desc={desc}
            borderBottom="1px solid rgba(170, 170, 170, 0.5)"
        >
            <Flex translate alignItems="center">
                {renderTitle ? (
                    renderTitle()
                ) : (
                    <Plus
                        color="#959595"
                        size={16}
                        // onClick={() => setCollspaed(true)}
                    ></Plus>
                )}
            </Flex>
        </Head>
    )
    // }

    // return (
    //     <Fragment>
    //         <Head title={title} desc={desc}>
    //             {renderTitle(false)}
    //         </Head>
    //         <Board>{children}</Board>
    //     </Fragment>
    // )
}

export const ControlGrid = ({ show = true, children, ...restStyle }) =>
    !show ? null : (
        <div
            style={{
                display: 'grid',
                gridGap: '8px',
                gridTemplateColumns: '16px 36px 60px 60px',
                gridTemplateRows: '24px',
                gridTemplateAreas: `"active visual value control"`,
                ...restStyle,
            }}
        >
            {children}
        </div>
    )

export const ControlGridItem = ({
    area,
    children,
}: {
    area: string
    children: ReactNode
}) => {
    return (
        <div
            style={{
                gridArea: area,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            {children}
        </div>
    )
}
