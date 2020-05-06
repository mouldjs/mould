import { Flex, Text, Card } from '@modulz/radix'
import Components from '@components'

const KitItem = ({ type, name, isList }) => {
    const plugin = Components.find((c) => c.type === type)
    const Icon = plugin?.icon

    return (
        <Card p={0} mb={5} sx={{ position: 'relative' }}>
            <Flex justifyContent="space-between" p={10} pl={20}>
                <Flex alignItems="center" width="100%">
                    <Icon></Icon>
                    <Flex
                        width="100%"
                        ml="5px"
                        flexDirection="column"
                        justifyContent="space-between"
                    >
                        <div
                            style={{
                                position: 'relative',
                                maxWidth: '80px',
                                marginBottom: '15px',
                                fontSize: '14px',
                            }}
                        >
                            {name}
                        </div>
                        <Text
                            as="p"
                            mt={10}
                            sx={{
                                color: '#aaa',
                                fontStyle: 'italic',
                                marginTop: 0,
                            }}
                        >
                            - {isList ? 'isList' : 'isSingle'}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    )
}

export default KitItem
