import { createAction, handleActions } from 'redux-actions';
import Immutable from 'immutable'
import { mergeReducer } from './utils';
import { pointFromSize, pointFromOffset, pointFct } from '../../records/point';

const scaleY = (scaleY) =>
	(dispatch, getState)=> {
		const {image} = getState();
		const scaleX = image.get('scaleX');
		dispatch(createAction(SCALE, {scaleX: isNumber(scaleX) ? scaleX : 1, scaleY}))
	};

const scaleX = (scaleX) =>
	(dispatch, getState)=> {
		const {image} = getState();
		const scaleY = image.get('scaleY');
		dispatch(createAction(SCALE, {scaleX, scaleY: isNumber(scaleY) ? scaleY : 1}))
	};

const scale = (state, scaleX, scaleY) =>{
	let newScaleX = scaleX;
	let newScaleY = scaleY ? scaleY : scaleX;
	let newState = state;

	if (newScaleX) {
		newState = newState.setIn(['scale', 'x'], newScaleX);
	}

	if (newScaleY) {
		newState = newState.setIn(['scale', 'y'], newScaleY);
	}
	return newState;
}

export default handleActions({
		SET_STATE_IMAGE: (state, {payload:{
			  aspectRatio,
				rotate,
				naturalSize,
				size
			}
		})=> {
				return state
					.set('rotate', rotate)
					.set('naturalSize', naturalSize)
					.set('size', size)
					.set('aspectRatio', aspectRatio ? aspectRatio : naturalSize.getAspectRatio())
			},
		ACTION_ZOOM: (state, {payload:ratio}) => scale(state, ratio)
	},
	Immutable.fromJS({
		aspectRatio: null,
		naturalSize : null,
		size: null,
		offset: pointFromOffset({
			left: 0,
			top: 0
		}),
		scale: pointFct({
			x: 1,
			y: 1
		}),
		rotate:0
	})
)
