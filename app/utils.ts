import { EditorState, Path, StateName, Component, Mould } from './types'
import { useSelector } from 'react-redux'
import nanoid from 'nanoid'
import data from './initialData'

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

export const isDuplicateMould = (state: EditorState, mouldName: string) =>
    !!state.moulds.find((m) => m.name === mouldName)

export const getDefaultMouldName = (state: EditorState) => {
    const len = state.moulds.length
    let mouldName = `mould${len}`
    if (isDuplicateMould(state, mouldName)) {
        mouldName = `mould${len}` + nanoid(2)
    }
    if (isDuplicateMould(state, mouldName)) {
        mouldName = `mould${len}` + nanoid(2)
    }
    if (isDuplicateMould(state, mouldName)) {
        mouldName = `mould${len}` + nanoid(2)
    }
    // repeat only 2 times avoid endless loop
    if (isDuplicateMould(state, mouldName)) {
        throw Error(`Cannot find a available mould name.`)
    }

    return mouldName
}

export const isDuplicateState = (mould: Mould, stateName: string) =>
    Object.keys(mould.states).includes(stateName)

export const getDefaultStateName = (mould: Mould) => {
    const len = Object.keys(mould.states).length
    let stateName = `state${len}`
    if (isDuplicateState(mould, stateName)) {
        stateName = `state${len}${nanoid(2)}`
    }
    if (isDuplicateState(mould, stateName)) {
        stateName = `state${len}${nanoid(2)}`
    }
    if (isDuplicateState(mould, stateName)) {
        stateName = `state${len}${nanoid(2)}`
    }
    if (isDuplicateState(mould, stateName)) {
        throw Error(`Cannot find a available state name.`)
    }

    return stateName
}
