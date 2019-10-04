import { createContext, useContext } from 'react'

const MouldContext = createContext(false)

export const useEditable = () => {
    return useContext(MouldContext)
}

export default MouldContext
