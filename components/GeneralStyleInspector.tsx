import React from 'react'
import { Input } from '@modulz/radix'
import { Cell, TitledBoard } from '../inspector/FormComponents'

export const GeneralStyleInspector = ({ style, requestUpdateProps }) => {
    const space = (
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
    )
    const color = (
        <TitledBoard title="Color" collspae>
            <Cell label="color">
                <Input
                    style={{ background: 'hsl(210,10%,99%)' }}
                    value={style.color || ''}
                    onChange={e =>
                        requestUpdateProps({
                            color: e.target.value,
                        })
                    }
                ></Input>
            </Cell>
            <Cell label="opacity">
                <Input
                    style={{ background: 'hsl(210,10%,99%)' }}
                    value={style.opacity || ''}
                    onChange={e =>
                        requestUpdateProps({
                            opacity: e.target.value,
                        })
                    }
                ></Input>
            </Cell>
            <Cell label="opacity">
                <Input
                    style={{ background: 'hsl(210,10%,99%)' }}
                    value={style.opacity || ''}
                    onChange={e =>
                        requestUpdateProps({
                            opacity: e.target.value,
                        })
                    }
                ></Input>
            </Cell>
            <Cell label="background">
                <Input
                    style={{ background: 'hsl(210,10%,99%)' }}
                    value={style.background || ''}
                    onChange={e =>
                        requestUpdateProps({
                            background: e.target.value,
                        })
                    }
                ></Input>
            </Cell>
        </TitledBoard>
    )
    const typography = (
        <TitledBoard title="Typography" collspae>
            <Cell label="fontFamily">
                <Input
                    style={{ background: 'hsl(210,10%,99%)' }}
                    value={style.fontFamily || ''}
                    onChange={e =>
                        requestUpdateProps({
                            fontFamily: e.target.value,
                        })
                    }
                ></Input>
            </Cell>
            <Cell label="fontSize">
                <Input
                    style={{ background: 'hsl(210,10%,99%)' }}
                    value={style.fontSize || ''}
                    onChange={e =>
                        requestUpdateProps({
                            fontSize: e.target.value,
                        })
                    }
                ></Input>
            </Cell>
            <Cell label="fontWeight">
                <Input
                    style={{ background: 'hsl(210,10%,99%)' }}
                    value={style.fontWeight || ''}
                    onChange={e =>
                        requestUpdateProps({
                            fontWeight: e.target.value,
                        })
                    }
                ></Input>
            </Cell>
            <Cell label="lineHeight">
                <Input
                    style={{ background: 'hsl(210,10%,99%)' }}
                    value={style.lineHeight || ''}
                    onChange={e =>
                        requestUpdateProps({
                            lineHeight: e.target.value,
                        })
                    }
                ></Input>
            </Cell>
            <Cell label="letterSpacing">
                <Input
                    style={{ background: 'hsl(210,10%,99%)' }}
                    value={style.letterSpacing || ''}
                    onChange={e =>
                        requestUpdateProps({
                            letterSpacing: e.target.value,
                        })
                    }
                ></Input>
            </Cell>
            <Cell label="textAlign">
                <Input
                    style={{ background: 'hsl(210,10%,99%)' }}
                    value={style.textAlign || ''}
                    onChange={e =>
                        requestUpdateProps({
                            textAlign: e.target.value,
                        })
                    }
                ></Input>
            </Cell>
            <Cell label="fontStyle">
                <Input
                    style={{ background: 'hsl(210,10%,99%)' }}
                    value={style.fontStyle || ''}
                    onChange={e =>
                        requestUpdateProps({
                            fontStyle: e.target.value,
                        })
                    }
                ></Input>
            </Cell>
        </TitledBoard>
    )

    return (
        <>
            {space}
            {color}
            {typography}
        </>
    )
}
