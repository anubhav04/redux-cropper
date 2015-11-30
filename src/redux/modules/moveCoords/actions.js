import R from 'ramda'
import Immutable from 'immutable'
import { createAction, handleActions } from 'redux-actions';
import { pointFct } from '../../../records/point';
import { conditionalAC } from '../../../actions/utils';
import { enabledAC } from '../../../actions/conditions'
import { CROP_END, CROP_MOVE, CROP_START } from './constants';
import {
	actionEast,
	actionWest,
	actionSouth,
	actionNorth,
	actionSouthEast,
	actionSouthWest,
	actionNorthEast,
	actionNorthWest
} from '../cropbox/direction'

import {
	ACTION_SOUTH,
	ACTION_EAST,
	ACTION_SOUTH_WEST,
	ACTION_NORTH,
	ACTION_WEST,
	ACTION_NORTH_WEST,
	ACTION_NORTH_EAST,
	ACTION_SOUTH_EAST
} from '../../../constants/direction';

const movingAC = conditionalAC((obj, state)=>{
	return state.moveCoords.get('action')
});

export const cropStart = enabledAC((event) =>
	(dispatch, getState) => {
		const {container, cropBox} = getState();
		let action = event.target.getAttribute("data-action");

		if (!action) {
			action = 'ACTION_MOVE';
		}

		const originalEvent = event.originalEvent;

		dispatch(createAction(CROP_START)({
			start: pointFct({
				x: event.pageX || originalEvent && originalEvent.pageX,
				y: event.pageY || originalEvent && originalEvent.pageY
			}),
			action
		}))
});

export const cropMove = R.compose(enabledAC, movingAC)((event) => {
		return (dispatch, getState) => {
			const originalEvent = event.originalEvent;
			event.preventDefault();

			dispatch(createAction(CROP_MOVE)({
				end: pointFct({
					x: event.pageX || originalEvent && originalEvent.pageX,
					y: event.pageY || originalEvent && originalEvent.pageY
				})
			}));

			dispatch(change());
		}
	}
);

export const cropEnd = R.compose(enabledAC, movingAC)((event)=> createAction(CROP_END)());

const change = R.compose(enabledAC, movingAC)(()=>
	(dispatch, getState) => {
		const {moveCoords, options} = getState();
		const aspectRatio = options.get('options').get('aspectRatio');
		const action = moveCoords.get('action');

		const range = moveCoords.get('end')
			.subtract(moveCoords.get('start'));

		const actionACMap = {
			[ACTION_EAST]: actionEast,
			[ACTION_WEST]: actionWest,
			[ACTION_SOUTH]: actionSouth,
			[ACTION_NORTH]: actionNorth,
			[ACTION_SOUTH_EAST]: actionSouthEast,
			[ACTION_SOUTH_WEST]: actionSouthWest,
			[ACTION_NORTH_EAST]: actionNorthEast,
			[ACTION_NORTH_WEST]: actionNorthWest,
			ACTION_MOVE: createAction('ACTION_MOVE'),
			ACTION_ALL: createAction('ACTION_ALL')
		};

		let rangeAspected = aspectRatio ? range
			.set('y', range.get('y') * aspectRatio)
			.set('x', range.get('x') / aspectRatio) : null;

		dispatch(actionACMap[action]({
			range,
			rangeAspected,
			aspectRatio
		}));

		dispatch(createAction('CROP_UPDATED')(getState()))
	}
);
