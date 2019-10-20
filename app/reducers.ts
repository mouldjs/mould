import { handleMoveWorkspace, handleZoomWorkspace } from './Workspaces'
import { handleModifyMouldTree } from './Mould'
import {
    handleSelectComponent,
    handleAddInput,
    handleRemoveInput,
    handleModifyInputControler,
    handleAddScope,
    handleRemoveScope,
    handleAddState,
    handleRemoveState,
} from './appShell'

export default [
    handleMoveWorkspace,
    handleZoomWorkspace,
    handleModifyMouldTree,
    handleSelectComponent,
    handleAddInput,
    handleRemoveInput,
    handleModifyInputControler,
    handleAddScope,
    handleRemoveScope,
    handleAddState,
    handleRemoveState,
]
