import { createTick } from '../lib/tick'
import { getStore } from './store'
import { selectComponent } from './appShell'
import { Path } from './types'

export const tick = createTick<Path[]>((data) => {
    getStore().dispatch(selectComponent({ pathes: data }))
})
