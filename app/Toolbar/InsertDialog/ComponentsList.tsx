import styled from 'styled-components'
import { Codepen } from 'react-feather'

const Container = styled.div({
    borderRight: '1px solid #aaa',
    flexGrow: 1,
    padding: '5px 10px',
    height: '100%',
    maxWidth: '260px',
    maxHeight: '100%',
})

const CategoryTitle = styled.div({
    padding: '15px 15px 10px 0',
    fontSize: '12px',
    fontWeight: 600,
})

const Item = styled.div({
    display: 'flex',
    alignItems: 'center',
    padding: '10px 10px',
})

const ItemInfo = styled.div({
    marginLeft: '10px',
})

const ItemTitle = styled.p({
    fontSize: '12px',
    fontWeight: 600,
    color: '#000',
    marginBottom: 3,
})

const ItemDesc = styled.p({
    fontSize: '12px',
    color: '#aaa',
    marginBottom: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    maxWidth: '150px',
    textOverflow: 'ellipsis',
})

export default () => {
    return (
        <Container>
            <CategoryTitle>Explore</CategoryTitle>
            <Item>
                <Codepen></Codepen>
                <ItemInfo>
                    <ItemTitle>Frames</ItemTitle>
                    <ItemDesc>for an artboard and layout</ItemDesc>
                </ItemInfo>
            </Item>
        </Container>
    )
}
