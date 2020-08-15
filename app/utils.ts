import { useEffect } from 'react'
import { EditorState, Path, StateName, Component, Mould } from './types'
import { useSelector } from 'react-redux'
import nanoid from 'nanoid'
import data from './initialData'
import { useWheel } from 'react-use-gesture'
import { find, reduce, values } from 'lodash'

export const initialData = (data as any) as EditorState

export const useIsSelectedMould = (mouldName: string) => {
    const currentComponentPath = useSelector(
        (state: EditorState) => state.selection || []
    )[0]

    return currentComponentPath[0] === mouldName
}

export const useIsSelectedState = (mouldName: string, stateName: StateName) => {
    const currentComponentPath = useSelector(
        (state: EditorState) => state.selection || []
    )[0]

    return (
        currentComponentPath[0] === mouldName &&
        currentComponentPath[1] === stateName
    )
}

export const useIsSelectedPath = (path: Path) => {
    const currentPath = useSelector((state: EditorState) => state.selection)

    return (
        path !== undefined &&
        currentPath !== undefined &&
        [currentPath[0].join('/'), currentPath[1].join('/')].join('+') ===
            [path[0].join('/'), path[1].join('/')].join('+')
    )
}

export const useIsIncludePath = (path: Path) => {
    const currentPath = useSelector((state: EditorState) => state.selection)

    return (
        path !== undefined &&
        currentPath !== undefined &&
        [currentPath[0].join('/'), currentPath[1].join('/')]
            .join('+')
            .includes([path[0].join('/'), path[1].join('/')].join('+'))
    )
}

export const rootTree = (props: object, children: Component[]) => {
    return {
        type: 'Root',
        props,
        children,
    }
}

export const useCurrentMould = () => {
    const mould = useSelector((state: EditorState) => {
        if (!state.selection) {
            return
        }

        return findMould(state, state.selection[0][0])
    })

    return mould
}

export const useCurrentState = () => {
    const selection = useSelector((state: EditorState) => state.selection)

    if (!selection) {
        return
    }

    return selection[0][1]
}

export const useCurrentNode: () => {
    node: Component | null
    isRoot: boolean
} = () => {
    const selection = useSelector((state: EditorState) => state.selection)
    const state = useSelector((state: EditorState) => state)

    const currentStatePath = selection && selection[0]
    const currentMould =
        currentStatePath && ensureMould(state, currentStatePath[0])
    const currentState =
        currentStatePath &&
        currentMould &&
        currentMould.states[currentStatePath[1]]
    let target: Component | null = null
    let isRoot: boolean = false
    if (currentState && currentStatePath) {
        const currentNodePath = selection![1]
        if (currentNodePath && !currentNodePath.length) {
            isRoot = true
            target = currentState
        }

        if (currentNodePath && currentNodePath.length) {
            isRoot = false
            target = reduce(
                currentNodePath,
                (res: any, cur) => {
                    if (!values(res).length) {
                        res = currentState
                    }

                    res = res.children![cur]
                    return res
                },
                {}
            )
        }
    }

    return {
        isRoot,
        node: target,
    }
}

export const useCurrentDebuggingView = () => {
    return useSelector((state: EditorState) => {
        if (state.debugging && state.debugging[0]) {
            const [mouldName, stateName] = state.debugging[0]

            return find(
                state.views,
                (v) => v.mouldName === mouldName && v.state === stateName
            )
        }
    })
}

export const useCurrentView = () => {
    const view = useSelector((state: EditorState) => {
        if (!state.selection) {
            return
        }

        const [currentMould, currentState] = state.selection[0]
        return Object.values(state.views).find(
            (v) => v.state === currentState && v.mouldName === currentMould
        )
    })

    return view
}

export const pathToString = (path: Path) =>
    path[0].join('/') + '/' + path[1].join('-')

export const viewPathToString = (path: Path) => path[0].join('/')

//Abc Cba -> abc-cba
export const nameToParam = (name: string): string => {
    return name.toLowerCase().split(' ').join('-')
}

export const useIsDraggingComponent = () =>
    useSelector((state: EditorState) => state.isDragging)

export const findMould = (state: EditorState, mouldName: string) =>
    state.moulds.find((m) => m.name === mouldName)

export const ensureMould = (state: EditorState, mouldName: string) => {
    const mould = findMould(state, mouldName)
    if (!mould) {
        throw Error(`Mould '${mouldName}' was not found.`)
    }

    return mould
}

export const deleteMould = (state: EditorState, mouldName: string) => {
    const mouldIndex = state.moulds.findIndex((m) => m.name === mouldName)
    if (mouldIndex === -1) {
        throw Error(`Mould '${mouldName}' was not found to delete.`)
    }

    return state.moulds.splice(mouldIndex, 1)
}

const INCREMENTED = {}

const incrementedId = (field) => {
    if (!INCREMENTED[field]) {
        INCREMENTED[field] = 1
    }

    return INCREMENTED[field]++
}

export const isDuplicateMould = (state: EditorState, mouldName: string) =>
    !!state.moulds.find((m) => m.name === mouldName)

export const getDefaultMouldName = (state: EditorState) => {
    const len = state.moulds.length
    let mouldName = `mould${len}`
    while (isDuplicateMould(state, mouldName)) {
        mouldName = `mould${len}_${incrementedId('mould')}`
    }

    return mouldName
}

export const isDuplicateState = (mould: Mould, stateName: string) =>
    Object.keys(mould.states).includes(stateName)

export const getDefaultStateName = (mould: Mould) => {
    const len = Object.keys(mould.states).length
    let stateName = `state${len}`
    while (isDuplicateState(mould, stateName)) {
        stateName = `state${len}_${incrementedId('state')}`
    }

    return stateName
}

export const useSimulateScroll = (ref) => {
    const bind = useWheel(
        ({ event, delta: [, dy] }) => {
            if (ref && ref.current) {
                ref.current.scrollTop += dy
            }

            event && event.stopPropagation()
        },
        {
            domTarget: ref,
        }
    )

    useEffect(() => {
        bind()
    }, [bind])
}

export const ensureTreeNodeByPath = (tree: Component, path: number[]) => {
    let ref = tree
    path.forEach((p) => {
        if (!ref.children) {
            throw Error(`Path:${path} is not exist in tree: ${tree}`)
        }
        ref = ref.children[p]
        if (!ref) {
            throw Error(`Path:${path} is not exist in tree: ${tree}`)
        }
    })

    return ref
}
