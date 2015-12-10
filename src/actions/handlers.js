import R from 'ramda'
import { createAction, handleActions } from 'redux-actions';
import { conditionalAC } from './utils';
import { enabledAC } from './conditions';
import { ACTION_ZOOM } from '../constants/actions';
import { getOffscreenCroppedImagePromise } from './getCroppedCanvas';
import { rotate } from './rotate';
import { initContainer } from './init';
import { pointFromSize } from '../records/point';

export const dblClick = () =>
	(dispatch, getState)=> {
		const {options} = getState();
		const {options:{toggleDragModeOnDblclick}} = options.toJS();

		if (!options.toggleDragModeOnDblclick) {
			return
		} 
	};

export const resizeWidth = (width)=>
	(dispatch, getState)=>{
		dispatch(resize({
			width,
			height: getState().options.getIn(['options', 'height'])
		}))
	}

export const resizeHeight = (height)=>
	(dispatch, getState)=>{
		dispatch(resize({
			height,
			width: getState().options.getIn(['options', 'width'])
		}))
	}

export const resize = enabledAC(({width, height}) =>
	(dispatch, getState)=> {
		const {canvas, cropBox, container} = getState();

		const ratio = container.getIn(['size', 'x']) / width;

		// Resize when width changed or height changed
		if (ratio !== 1 || container.getIn(['size', 'y']) !== height) {
			dispatch(initContainer(pointFromSize({width, height})));
			// dispatch(createAction('SET_CANVAS_DATA')({
			// 	offset: canvas.get('offset').scaleScalar(ratio), 
			// 	size: canvas.get('size').scaleScalar(ratio)
			// }));
			// dispatch(createAction('SET_CROP_BOX_DATA')({
			// 	offset: cropBox.get('offset').scaleScalar(ratio), 
			// 	size: cropBox.get('size').scaleScalar(ratio)
			// }))
		}
	}
);

export const zoomableAC = conditionalAC((obj, state)=> !state.options.get('zoomable') || !state.options.get('zoomOnWheel'));

export const wheel = R.compose(enabledAC)
((event) =>
	(dispatch, getState) => {
		const {options} = getState();
		const {options:{wheelZoomRatio}} = options.toJS();

		const originalEvent = event.originalEvent;
		const e = originalEvent || event;
		const ratio = Number(wheelZoomRatio) || 0.1;
		let delta = 1;

		event.preventDefault();

		if (e.deltaY) {
			delta = e.deltaY > 0 ? 1 : -1;
		} else if (e.wheelDelta) {
			delta = -e.wheelDelta / 120;
		} else if (e.detail) {
			delta = e.detail > 0 ? 1 : -1;
		}

		let newRatio = Number(-delta * ratio);

		newRatio = newRatio < 0 ? 1 / (1 - newRatio) : 1 + newRatio;

		dispatch(zoom(newRatio));
	}
);

export const zoom = (ratio) =>
	(dispatch, getState) => {
		const {image} = getState()
		dispatch(createAction('ACTION_ZOOM')(ratio));
		dispatch(rotate(image.get('rotate')));
	}

export const getBlob = (cb) =>
	(dispatch, getState)=> {
		const {options:_options, image, canvas, cropBox} = getState();
		const options = _options.get('options');

		getOffscreenCroppedImagePromise({
			options,
			cropData:{
				image, canvas, cropBox
			},
			isRounded:false
		}).then((img)=>{
			cb(img)
		});
	};
