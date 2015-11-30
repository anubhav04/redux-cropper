import { createAction, handleActions } from 'redux-actions';
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

import Immutable from 'immutable'

const SET_SIZE = 'SET_SIZE';

export const actionEast = createAction(ACTION_EAST);
export const actionNorth = createAction(ACTION_NORTH);
export const actionWest = createAction(ACTION_WEST);
export const actionSouth = createAction(ACTION_SOUTH);
export const actionNorthEast = createAction(ACTION_NORTH_EAST);
export const actionNorthWest = createAction(ACTION_NORTH_WEST);
export const actionSouthWest = createAction(ACTION_SOUTH_WEST);
export const actionSouthEast = createAction(ACTION_SOUTH_EAST);

export default {
	// Move crop box
	ACTION_ALL: (state, {payload:{range:{x, y}}}) => (state
			.updateIn(['offset', 'x'], (left)=>left + x)
			.updateIn(['offset', 'y'], (top)=>top + y)
	),
	[ACTION_EAST]: (state, {payload:{aspectRatio, range, rangeAspected}}) => {
		let newState = state.updateIn(['size', 'x'], (width)=> width + range.get('x'));

		if (aspectRatio) {
			newState = newState
				.updateIn(['size', 'y'], ()=> state.getIn(['size', 'x']) / aspectRatio)
				.updateIn(['offset', 'y'], (top)=> top - rangeAspected.get('y') / 2)
		}

		return newState
	},
	[ACTION_NORTH]: (state, {payload:{aspectRatio, rangeAspected, range}}) => {
		let newState = state
			.updateIn(['size', 'y'], (height)=> height - range.get('y'))
			.updateIn(['offset', 'y'], (top)=> top + range.get('y'));

		if (aspectRatio) {
			return newState
				.setIn(['size', 'x'], newState.getIn(['size', 'y']) * aspectRatio)
				.updateIn(['offset', 'x'], (left)=> left + rangeAspected.get('x') / 2);
		}

		return newState
	},
	[ACTION_WEST]: (state, {payload:{aspectRatio, range, rangeAspected}}) => {
		const newState = state
			.updateIn(['size', 'x'], (width)=> width - range.get('x'))
			.updateIn(['offset', 'x'], (left)=>left + range.get('x'));

		if (aspectRatio) {
			return newState
				.updateIn(['size', 'y'], ()=> newState.getIn(['size', 'x']) / aspectRatio)
				.updateIn(['offset', 'y'], (top)=>top + rangeAspected.get('y') / 2);
		}

		return newState;
	},
	[ACTION_SOUTH]: (state, {payload:{aspectRatio, range, rangeAspected}}) => {
		const newState = state
			.updateIn(['size', 'y'], (height)=>height + range.get('y'));

		if (aspectRatio) {
			return newState
				.updateIn(['size', 'x'], ()=> newState.getIn(['size', 'y']) * aspectRatio)
				.updateIn(['offset', 'x'], (left)=> left - rangeAspected.get('x') / 2);
		}

		return newState;
	},
	[ACTION_NORTH_EAST]: (state, {payload:{aspectRatio, range}}) => {
		let newState = state;
		if (aspectRatio) {
			const newHeight = newState.getIn(['size', 'y']) - range.get('y');

			return newState
				.updateIn(['size', 'y'], ()=> newHeight)
				.updateIn(['offset', 'y'], (top)=>top + range.get('y'))
				.updateIn(['size', 'x'], ()=> newHeight * aspectRatio)

		} else {
			const right = newState.getIn(['offset', 'x']) + newState.getIn(['size', 'x']);
			if ((range.get('x') >= 0 && right < newState.get('maxSize').get('x')) || range.get('x') < 0) {
				newState = newState.updateIn(['size', 'x'], (width)=> width + range.get('x'));
			}

			if ((range.get('y') <= 0 && newState.getIn(['offset', 'y']) > newState.get('minSize').get('y')) || range.get('y') > 0) {
				newState = newState
					.updateIn(['size', 'y'], (height)=>height - range.get('y'))
					.updateIn(['offset', 'y'], (top)=>top + range.get('y'))
			}

			return newState;
		}
	},
	[ACTION_NORTH_WEST]: (state, {payload:{aspectRatio,rangeAspected, range}}) => {
		let newState = state;
		if (aspectRatio) {
			const newHeight = newState.getIn(['size', 'y']) - range.get('y');

			return newState
				.updateIn(['size', 'y'], (height)=> height - range.get('y'))
				.updateIn(['offset', 'y'], (top)=> top + range.get('y'))
				.updateIn(['size', 'x'], ()=> newHeight * aspectRatio)
				.updateIn(['offset', 'x'], (left)=> left + rangeAspected.get('x'))
		} else {
			if ((range.get('x') <= 0 && newState.getIn(['offset', 'x']) > newState.get('minSize').get('x')) || range.get('x') > 0) {
				newState = newState
					.updateIn(['size', 'x'], (width)=> width - range.get('x'))
					.updateIn(['offset', 'x'], (left)=>left + range.get('x'));
			}

			if ((range.get('y') <= 0 && newState.getIn(['offset', 'y']) > newState.get('minSize').get('y')) || range.get('y') > 0) {
				newState = newState
					.updateIn(['size', 'y'], (height)=> height - range.get('y'))
					.updateIn(['offset', 'y'], (top)=> top + range.get('y'))
			}

			return newState;
		}
	},
	[ACTION_SOUTH_WEST]: (state, {payload:{aspectRatio, range}}) => {
		let newState = state;
		if (aspectRatio) {
			const newWidth = newState.getIn(['size', 'x']) - range.get('x');

			return newState
				.updateIn(['size', 'y'], ()=> newWidth)
				.updateIn(['offset', 'x'], (left)=>left + range.get('x'))
				.updateIn(['size', 'y'], ()=> newWidth / aspectRatio)
		} else {
			if ((range.get('x') <= 0 && newState.getIn(['offset', 'x']) > newState.get('minSize').get('x')) || range.get('x') > 0) {
				newState = newState
					.updateIn(['size', 'x'], (width)=>width - range.get('x'))
					.updateIn(['offset', 'x'], (left)=>left + range.get('x'));
			}

			const bottom = newState.getIn(['offset', 'y']) + newState.getIn(['size', 'y']);
			if ((range.get('y') >= 0 && bottom < newState.get('maxSize').get('y')) || range.get('y') < 0) {
				newState = newState.updateIn(['size', 'y'], (height)=>height + range.get('y'));
			}

			return newState;
		}
	},
	[ACTION_SOUTH_EAST]: (state, {payload:{aspectRatio, range}}) => {
		let newState = state;
		if (aspectRatio) {
			const newWidth = newState.getIn(['size', 'x']) + range.get('x');

			return newState
				.updateIn(['size', 'x'], ()=> newWidth)
				.updateIn(['size', 'y'], ()=> newWidth / aspectRatio)
		} else {
			const right = newState.getIn(['offset', 'x']) + newState.getIn(['size', 'x']);
			if ((range.get('x') >= 0 && right < newState.get('maxSize').get('x')) || range.get('x') < 0) {
				newState = newState.updateIn(['size', 'x'], (width)=> width + range.get('x'));
			}

			const bottom = newState.getIn(['offset', 'y']) + newState.getIn(['size', 'y']);
			if ((range.get('y') >= 0 && bottom < newState.get('maxSize').get('y')) || range.get('y') < 0) {
				newState = newState.updateIn(['size', 'y'], (height)=> height + range.get('y'));
			}
			return newState;
		}
	}
}
