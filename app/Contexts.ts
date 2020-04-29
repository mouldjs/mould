import { createContext } from 'react'
import { Mould, View } from './types'

export const MouldContext = createContext<Mould | null>(null)

export const ViewContext = createContext<View | null>(null)
