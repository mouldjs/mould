import React from 'react'
import { Input } from '@modulz/radix'
import { Cell, TitledBoard } from '../inspector/FormComponents'

export const GeneralStyleInspector = ({ style, requestUpdateProps }) => {
    return (
        <>
            <TitledBoard title="Space" collspae>
                <Cell label="ml">
                    <Input
                        style={{ background: 'hsl(210,10%,99%)' }}
                        value={style.marginLeft || 0}
                        onChange={e =>
                            requestUpdateProps({
                                marginLeft: parseInt(e.target.value),
                            })
                        }
                    ></Input>
                </Cell>
                <Cell label="mt">
                    <Input
                        style={{ background: 'hsl(210,10%,99%)' }}
                        value={style.marginTop || 0}
                        onChange={e =>
                            requestUpdateProps({
                                marginTop: parseInt(e.target.value),
                            })
                        }
                    ></Input>
                </Cell>
                <Cell label="mr">
                    <Input
                        style={{ background: 'hsl(210,10%,99%)' }}
                        value={style.marginRight || 0}
                        onChange={e =>
                            requestUpdateProps({
                                marginRight: parseInt(e.target.value),
                            })
                        }
                    ></Input>
                </Cell>
                <Cell label="mb">
                    <Input
                        style={{ background: 'hsl(210,10%,99%)' }}
                        value={style.marginBottom || 0}
                        onChange={e =>
                            requestUpdateProps({
                                marginBottom: parseInt(e.target.value),
                            })
                        }
                    ></Input>
                </Cell>
                <Cell label="pl">
                    <Input
                        style={{ background: 'hsl(210,10%,99%)' }}
                        value={style.paddingLeft || 0}
                        onChange={e =>
                            requestUpdateProps({
                                paddingLeft: parseInt(e.target.value),
                            })
                        }
                    ></Input>
                </Cell>
                <Cell label="pt">
                    <Input
                        style={{ background: 'hsl(210,10%,99%)' }}
                        value={style.paddingTop || 0}
                        onChange={e =>
                            requestUpdateProps({
                                paddingTop: parseInt(e.target.value),
                            })
                        }
                    ></Input>
                </Cell>
                <Cell label="pr">
                    <Input
                        style={{ background: 'hsl(210,10%,99%)' }}
                        value={style.paddingRight || 0}
                        onChange={e =>
                            requestUpdateProps({
                                paddingRight: parseInt(e.target.value),
                            })
                        }
                    ></Input>
                </Cell>
                <Cell label="pb">
                    <Input
                        style={{ background: 'hsl(210,10%,99%)' }}
                        value={style.paddingBottom || 0}
                        onChange={e =>
                            requestUpdateProps({
                                paddingBottom: parseInt(e.target.value),
                            })
                        }
                    ></Input>
                </Cell>
            </TitledBoard>
        </>
    )
}
