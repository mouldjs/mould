import { EditorState, Path, StateName, MouldID, Component } from './types'
import { useSelector } from 'react-redux'
import data from './initialData'

export const initialData = (data as any) as EditorState

export const useIsSelectedMould = (mouldId: MouldID) => {
    const currentComponentPath = useSelector(
        (state: EditorState) => state.selection || []
    )[0]

    return currentComponentPath[0] === mouldId
}

export const useIsSelectedState = (mouldId: MouldID, stateName: StateName) => {
    const currentComponentPath = useSelector(
        (state: EditorState) => state.selection || []
    )[0]

    return (
        currentComponentPath[0] === mouldId &&
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
    const moulds = useSelector((state: EditorState) => {
        return state.moulds
    })
    const selection = useSelector((state: EditorState) => {
        return state.selection
    })

    if (!selection) {
        return
    }

    return moulds[selection[0][0]]
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
