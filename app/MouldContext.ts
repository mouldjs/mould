import { createContext } from 'react'
import { Mould } from './types'

const MouldContext = createContext<Mould | null>(null)

export default MouldContext
