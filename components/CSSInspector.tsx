import React from 'react'
import dynamic from 'next/dynamic'
import analyze from 'react-style-editor/lib/utils/analyze'
// import str from 'react-style-editor/lib/utils/stringify'
import { TitledBoard } from '../inspector/FormComponents'
import { CSSProperties } from '../lib/zodTypes'
import { ComponentProps } from '../app/types'

const StyleEditor = dynamic(() => import('react-style-editor'), {
    ssr: false,
    loading: () => null,
}) as any

function hyphenate(str) {
    return (str + '').replace(/[A-Z]/g, function(match) {
        return '-' + match.toLowerCase()
    })
}

const convertReactStyleToCSS = (style: ComponentProps) =>
    `style{${Object.keys(style)
        .map(k => `${hyphenate(k)}:${style[k]};`)
        .join('')}}`

function camelize(str) {
    return (str + '').replace(/-\D/g, function(match) {
        return match.charAt(1).toUpperCase()
    })
}

// const convertCSSToReactStyle = (cssObject) =>

function pick(obj, keys) {
    return keys
        .map(k => (k in obj ? { [k]: obj[k] } : {}))
        .reduce((res, o) => Object.assign(res, o), {})
}

const pickStyle = obj => pick(obj, Object.keys(CSSProperties._def.shape))

export const CSSInspector = ({ style, requestUpdateProps }) => {
    style = pickStyle(style)
    if (Object.keys(style).length === 0) {
        style = undefined
    }
    const css = style ? convertReactStyleToCSS(style) : 'style{color}'

    return (
        <TitledBoard title="Style" collspae>
            <StyleEditor
                // defaultValue={css}
                onChange={css => {
                    const rules = analyze(css) as any[]
                    const styleRule = rules.find(
                        rule =>
                            rule.type === 'rule' &&
                            rule.isValid &&
                            rule.selector.trim() === 'style'
                    )
                    if (styleRule) {
                        const reactStyle = styleRule.kids.reduce(
                            (prev, curr) => {
                                if (curr.type === 'declaration') {
                                    const p = curr.property.trim()
                                    if (p) {
                                        return {
                                            ...prev,
                                            ...{
                                                [camelize(
                                                    p
                                                )]: curr.value.trim(),
                                            },
                                        }
                                    }

                                    return prev
                                }
                            },
                            {}
                        )
                        if (reactStyle) {
                            requestUpdateProps(
                                Object.keys(reactStyle).length
                                    ? reactStyle
                                    : undefined
                            )
                        }
                    }
                }}
                value={css}
                output="pretty"
            ></StyleEditor>
        </TitledBoard>
    )
}
