import { handleMoveWorkspace, handleZoomWorkspace } from './Workspaces'
import {
    handleSelectComponent,
    handleAddInput,
    handleRemoveInput,
    handleModifyInputDescription,
    handleAddScope,
    handleRemoveScope,
    handleAddState,
    handleRemoveState,
    handleResizeView,
    handleAddMould,
    handleModifyMouldTree,
} from './appShell'

export default [
    handleMoveWorkspace,
    handleZoomWorkspace,
    handleModifyMouldTree,
    handleSelectComponent,
    handleAddInput,
    handleRemoveInput,
    handleModifyInputDescription,
    handleAddScope,
    handleRemoveScope,
    handleAddState,
    handleRemoveState,
    handleResizeView,
    handleAddMould,
]
