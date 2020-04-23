import {
    Type,
    Image as ImageIcon,
    Layers,
    Box,
    Italic,
    Package,
} from 'react-feather'
import { AtomicComponent } from '../app/types'
// import Hello from './Hello'
import Image, { imageProps } from './Image'
import Stack, { stackProps } from './Stack'
import Mould from './Mould'
import Text, { textProps } from './Text'
import Input, { inputProps } from './Input'
import Kit from './Kit'

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
    },
    {
        type: 'Input',
        component: Input,
        icon: Italic,
        propType: inputProps,
    },
    {
        type: 'Kit',
        component: Kit,
    },
] as AtomicComponent[]
