import styled from 'styled-components'
import { PlusSquare } from 'react-feather'

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

const CategoryInfo = ({ title, desc }: { title: string; desc: string }) => {
    return (
        <CategoryWrapper>
            <PlusSquare />
            <CategortTitle>{title}</CategortTitle>
            <CategoryDesc>{desc}</CategoryDesc>
        </CategoryWrapper>
    )
}

export default () => {
    const Placeholder = () => {
        return CategoryInfo({
            title: 'Find and insert anything',
            desc: 'Open a folder and insert components.',
        })
    }

    return (
        <>
            <Container>
                <Placeholder></Placeholder>
            </Container>
        </>
    )
}
