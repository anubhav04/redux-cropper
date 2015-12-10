import { createAction } from 'redux-actions';
import { pointFromSize, pointFromOffset, pointFct } from '../records/point';
import { INIT_CONTAINER, INIT_CANVAS, INIT_CROP_BOX } from '../constants/init';

export const initImage = ({naturalSize, size}) =>
	(dispatch, getState)=> {
		const {options:_options} = getState();
		const options = _options.get('options');

		dispatch(createAction('SET_STATE_IMAGE')({
			aspectRatio: options.get('aspectRatio'),
			rotate: options.get('rotate'),
			naturalSize,
			size
		}));
	};

export const initContainer = (size) =>
	(dispatch, getState)=> {
		const {options} = getState();
		const {minContainerWidth, minContainerHeight} = options;

		let width = minContainerWidth || 0;
		let height = minContainerHeight || 0;

		dispatch(createAction(INIT_CONTAINER)({
			size,
			minSize: pointFromSize({width, height})
		}))
	};

export const initCanvas = () =>
	(dispatch, getState)=> {
		const {options, image, cropBox, container} = getState();
		dispatch(createAction(INIT_CANVAS)({options: options, image, cropBox, container}));
	};

export const initCropBox = () =>
	(dispatch, getState)=> {
		const {options, canvas, cropBox, container} = getState();
		dispatch(createAction(INIT_CROP_BOX)({options: options, canvas, cropBox, container}))
	};

export const init = () =>
	(dispatch, getState)=> {
		const {options, myState} = getState();
		//if(myState.get('isInited')){
		//	return;
		//}
		const size = pointFromSize(options.get('options').toJS());

		dispatch(initImage({naturalSize: pointFromSize({
			width: 1280,
			height: 720
		}), size}));
		dispatch(initContainer(size));
		dispatch(initCanvas());
		dispatch(initCropBox());

		dispatch(createAction('NEW_MY_STATE')({isInited: true}));
	};
