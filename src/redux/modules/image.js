import { createAction, handleActions } from 'redux-actions';
import Immutable from 'immutable'
import { mergeReducer } from './utils';
import { pointFromSize, pointFromOffset, pointFct, zero } from '../../records/point';
import { getRotatedSizes } from '../../utilities';

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
		newState = newState.updateIn(['scale', 'x'],(x)=>x * newScaleX);
	}

	if (newScaleY) {
		newState = newState.updateIn(['scale', 'y'],(y)=>y * newScaleY);
	}
	return newState;
}

export const init = (state, {payload:{aspectRatio, rotate, naturalSize, size}})=> state
					.set('rotate', rotate)
					.set('naturalSize', naturalSize)
					.set('size', size)
					.set('aspectRatio', aspectRatio ? aspectRatio : naturalSize.getAspectRatio())

const rotate = (image, canvas) => {
	let newImage = image;

	const reversed = newImage.get('rotate') ? getRotatedSizes({
		sizePoint: canvas.get('size'),
		degree: newImage.get('rotate'),
		aspectRatio: newImage.get('aspectRatio'),
		isReversed: true
	}) : null;

	return reversed ?
		newImage
			// .set('size', reversed)
			.set('offset', canvas.get('size').subtract(reversed).divideScalar(2))
		:
		newImage
			// .set('size', canvas.get('size'))
			.set('offset', zero);
};					

export default handleActions({
		RESIZE_IMAGE: (state, {payload}) => state.set('size', payload),
		SET_ROTATE: (state, {payload}) => state.set('rotate', payload),
		SET_STATE_IMAGE: init,
		ROTATE_IMAGE: (state, {payload:{canvas}}) => rotate(state, canvas),
		ACTION_ZOOM: (state, {payload:ratio}) => scale(state, ratio),
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
