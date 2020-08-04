import styled from 'styled-components'
import { PlusSquare } from 'react-feather'
import MouldApp from '../../../mould'
import { reduce, values } from 'lodash'
import { Button } from '@blueprintjs/core'
import { useCurrentMould } from '../../utils'
import { useDispatch } from 'react-redux'
import { waitingForCreating } from '../../appShell'

const atomicComponents = values(MouldApp.components).filter(
    (c) => c.category.name === 'Atomic'
)

const Container = styled.div({
    display: 'flex',
    flexDirection: 'column',
    padding: '5px',
    width: 'calc(100% - 260px)',
    maxHeight: '100%',
})

const CategoryWrapper = styled.div({
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
})

const CategortTitle = styled.p({
    fontSize: '13px',
    fontWeight: 600,
    marginTop: '5px',
})

const CategoryDesc = styled.p({
    fontSize: '12px',
    fontWeight: 'normal',
    marginTop: '5px',
})

export default ({
    currentItem,
    onClose,
}: {
    currentItem: string
    onClose: () => void
}) => {
    const dispatch = useDispatch()
    const currentMould = useCurrentMould()

    const CategoryInfo = ({
        title,
        desc,
        btnCallback,
    }: {
        title: string
        desc: string
        btnCallback?: () => void
    }) => {
        return (
            <CategoryWrapper>
                <PlusSquare />
                <CategortTitle>{title}</CategortTitle>
                <CategoryDesc>{desc}</CategoryDesc>
                {btnCallback && (
                    <Button
                        type="button"
                        intent="primary"
                        onClick={btnCallback}
                        outlined={false}
                    >
                        Insert
                    </Button>
                )}
            </CategoryWrapper>
        )
    }

    const Placeholder = () => {
        return CategoryInfo({
            title: 'Find and insert anything',
            desc: 'Open a folder and insert components.',
        })
    }

    const HasntRegisteredHolder = () => {
        return CategoryInfo({
            title: 'Did not register content in this block',
            desc: '',
        })
    }

    const formattedAtomicComponents = reduce(
        atomicComponents,
        (res, cur) => {
            if (cur.type !== 'Kit' && cur.type !== 'Mould') {
                res[cur.type] = () =>
                    CategoryInfo({
                        title: cur.type,
                        desc: `Insert component ${cur.type} under currentMould`,
                        btnCallback: () => {
                            const waitingParams: {
                                mouldName: string
                                injectedKitName: string
                            } = {
                                mouldName: '',
                                injectedKitName: '',
                            }
                            if (currentMould) {
                                waitingParams.mouldName = currentMould.name
                            }
                            waitingParams.injectedKitName = cur.type
                            onClose()
                            dispatch(waitingForCreating(waitingParams))
                        },
                    })
            }
            return res
        },
        {}
    )

    const components = {
        ...formattedAtomicComponents,
        Button: () =>
            CategoryInfo({
                title: 'Button',
                desc: 'Button',
            }),
    }
    const Current = components[currentItem]

    return (
        <>
            <Container>
                {currentItem ? (
                    Current ? (
                        <Current />
                    ) : (
                        <HasntRegisteredHolder />
                    )
                ) : (
                    <Placeholder />
                )}
            </Container>
        </>
    )
}
