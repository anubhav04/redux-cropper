import R from 'ramda'
import { createAction, handleActions } from 'redux-actions';
import { conditionalAC } from './utils';
import { enabledAC } from './conditions';
import { ACTION_ZOOM } from '../constants/actions';
import { getOffscreenCroppedImagePromise } from './getCroppedCanvas';

export const dblClick = () =>
	(dispatch, getState)=> {
		const {options} = getState();
		const {options:{toggleDragModeOnDblclick}} = options.toJS();

		if (!options.toggleDragModeOnDblclick) {
			return
		}
	};

const transformImObj = (func) =>
	R.compose(
		(notIm)=>Immutable.fromJS,
		R.toPairs,
		R.map(func),
		R.toPairs,
		(im)=>im.toJS());

export const resize = enabledAC(({width, height}) =>
	(dispatch, getState)=> {
		const {options} = getState();
		const {options:{canvas, cropBox, container}} = options.toJS();

		const ratio = container.getIn(['size', 'x']) / width;

		// Resize when width changed or height changed
		if (ratio !== 1 || container.getIn(['size', 'y']) !== height) {
			dispatch(createAction(SET_CANVAS_DATA)(transformImObj((n)=>n * ratio)(canvas)));
			dispatch(createAction(SET_CROP_BOX_DATA)(transformImObj((n)=>n * ratio)(cropBox)))
		}
	}
);

export const zoomableAC = conditionalAC((obj, state)=> !state.options.get('zoomable') || !state.options.get('zoomOnWheel'));

export const wheel = R.compose(zoomableAC, enabledAC)
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

		dispatch(createAction('ACTION_ZOOM')(newRatio));
	}
);

export const clickSubmit = () =>
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
				dispatch(createAction('SET_CROPPED_IMG')(img))
			});
	};
