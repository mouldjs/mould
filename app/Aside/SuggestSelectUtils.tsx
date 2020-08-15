import { ItemPredicate, ItemRenderer } from '@blueprintjs/select'
import { MenuItem } from '@blueprintjs/core'

export type Property = string
export type Scope = string
export type Target = Property | Scope

function escapeRegExpChars(text: string) {
    return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')
}

function highlightText(text: string, query: string) {
    let lastIndex = 0
    const words = query
        .split(/\s+/)
        .filter((word) => word.length > 0)
        .map(escapeRegExpChars)
    if (words.length === 0) {
        return [text]
    }
    const regexp = new RegExp(words.join('|'), 'gi')
    const tokens: React.ReactNode[] = []
    while (true) {
        const match = regexp.exec(text)
        if (!match) {
            break
        }
        const length = match[0].length
        const before = text.slice(lastIndex, regexp.lastIndex - length)
        if (before.length > 0) {
            tokens.push(before)
        }
        lastIndex = regexp.lastIndex
        tokens.push(<strong key={lastIndex}>{match[0]}</strong>)
    }
    const rest = text.slice(lastIndex)
    if (rest.length > 0) {
        tokens.push(rest)
    }
    return tokens
}

export const doFilter: ItemPredicate<Target> = (
    query,
    target,
    _index,
    exactMatch
) => {
    const normalizedTitle = target.toLowerCase()
    const normalizedQuery = query.toLowerCase()

    if (exactMatch) {
        return normalizedTitle === normalizedQuery
    } else {
        return (
            `${target}. ${normalizedTitle} ${target}`.indexOf(
                normalizedQuery
            ) >= 0
        )
    }
}

export const doRenderItem: ItemRenderer<Target> = (
    target,
    { handleClick, modifiers, query }
) => {
    if (!modifiers.matchesPredicate) {
        return null
    }
    const text = `${target}`
    return (
        <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            key={target}
            onClick={handleClick}
            text={highlightText(text, query)}
        />
    )
}

export const suggestSelectProps = (items) => {
    return {
        itemPredicate: doFilter,
        itemRenderer: doRenderItem,
        items,
    }
}

export function isTargetEqual(targetA: Target, targetB: Target) {
    return targetA.toLowerCase() === targetB.toLowerCase()
}

export const renderCreateTargetOption = (
    query: string,
    active: boolean,
    handleClick: React.MouseEventHandler<HTMLElement>
) => (
    <MenuItem
        icon="add"
        text={`Create "${query}"`}
        active={active}
        onClick={handleClick}
        shouldDismissPopover={false}
    />
)

export function createTarget(iptVal: string): Target {
    return iptVal
}
