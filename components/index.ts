import {
    Type,
    Image as ImageIcon,
    Layers,
    Box,
    Italic,
    Package,
} from 'react-feather'
// import Hello from './Hello'
import Image, { imageProps } from './Image'
import Stack, { stackProps } from './Stack'
import Mould, { mouldProps } from './Mould'
import Text, { textProps } from './Text'
import Input, { inputProps } from './Input'
import Root, { rootProps } from './Root'
import { AtomicComponent } from '../app/types'

export default [
    // Hello,
    {
        type: 'Text',
        component: Text,
        icon: Type,
        propType: textProps,
    },
    {
        type: 'Image',
        component: Image,
        icon: ImageIcon,
        propType: imageProps,
    },
    {
        type: 'Stack',
        component: Stack,
        icon: Layers,
        propType: stackProps,
    },
    {
        type: 'Mould',
        component: Mould,
        icon: Box,
        propType: mouldProps,
    },
    {
        type: 'Input',
        component: Input,
        icon: Italic,
        propType: inputProps,
    },
    {
        type: 'Root',
        component: Root,
        icon: Package,
        propType: rootProps,
    },
] as AtomicComponent[]
