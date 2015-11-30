import R from 'ramda';

import { conditionalAC } from '../../actions/utils';
import { enabledAC } from '../../actions/conditions';
import { ACTION_CROP, ACTION_MOVE, ACTION_NONE } from '../../constants/actions';

export const isLoadedAC = conditionalAC((obj, getState)=>getState().myState.get('isLoaded'));

export const setDragMode = R.compose(enabledAC, isLoadedAC)((mode) =>
	(dispatch, getState)=> {
		let newMode = mode;
		const {movable} = getState();

		const croppable = newMode === ACTION_CROP;
		const dragBoxMovable = movable && newMode === ACTION_MOVE;
		newMode = (croppable || dragBoxMovable) ? mode : ACTION_NONE;

		dispatch(SET_DRAG_MODE)({croppable, dragBoxMovable, mode: newMode})
	}
);

export const dblclick = enabledAC(() =>
	(dispatch, getState) => {
		const { hasCLASS_CROP } = getState();

		hasCLASS_CROP ? dispatch(setDragMode(ACTION_MOVE)) : dispatch(setDragMode(ACTION_CROP));
	}
);
