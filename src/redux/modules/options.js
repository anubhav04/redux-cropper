import { createAction, handleActions } from 'redux-actions';
import R from 'ramda'
import Immutable from 'immutable'
import { init } from '../../actions/init'
import { rotate } from '../../actions/rotate'
import { resize, resizeWidth, resizeHeight } from '../../actions/handlers'
import { pointFromSize } from '../../records/point';
import { diff } from 'deep-diff';

const NEW_OPTIONS = 'NEW_OPTIONS';

export const newOptions = (obj)=> {
	const {onRedux, ...rest} = obj;
	return (dispatch, getState)=> {
		const {options} = getState();
		const lastPassedOptions = options.get('lastPassedOptions');

		if(!lastPassedOptions){
			dispatch(newOptionsNoCheck(rest))
			return;
		}
		const newOptions = Immutable.fromJS(rest)

		if (Immutable.is(lastPassedOptions, newOptions)) {
			return;
		}

		dispatch(newOptionsNoCheck(rest, diff(lastPassedOptions.toJS(), newOptions.toJS())))
	}
};

const isPropertyEdited = (diff, propName)=>{
	const [{kind, lhs, rhs, path}] = diff;

	return kind === 'E' && path[0] === propName
}

export const newOptionsNoCheck = (obj, diff)=> {
	return (dispatch)=> {
		dispatch(createAction(NEW_OPTIONS)(obj));

		if(diff && diff.length == 1) {
			const [{rhs}] = diff;

			if(isPropertyEdited(diff, "rotate")){
				return dispatch(rotate(rhs));
			}

			if(isPropertyEdited(diff, "width")){
				return dispatch(resizeWidth(rhs));
			}

			if(isPropertyEdited(diff, "height")){
				return dispatch(resizeHeight(rhs));
			}
		}

		dispatch(init())
	}
};

const initialState = Immutable.fromJS({
	lastPassedOptions: null,
	options: {
		// Define the view mode of the cropper
		viewMode: 0, // 0, 1, 2, 3
		// Define the dragging mode of the cropper
		dragMode: 'crop', // 'crop', 'move' or 'none'
		// Define the aspect ratio of the crop box
		aspectRatio: null,
		// An object with the previous cropping result data
		data: null,
		// A jQuery selector for adding extra containers to preview
		preview: '',
		// Rebuild when resize the window
		responsive: true,
		// Check if the target image is cross origin
		checkCrossOrigin: true,
		// Show the black modal
		modal: true,
		// Show the dashed lines for guiding
		guides: true,
		// Show the center indicator for guiding
		center: true,
		// Show the white modal to highlight the crop box
		highlight: true,
		// Show the grid background
		background: true,
		// Enable to crop the image automatically when initialize
		autoCrop: true,
		// Define the percentage of automatic cropping area when initializes
		autoCropArea: 0.8,
		// Enable to move the image
		movable: true,
		// Enable to rotate the image
		rotatable: true,
		// Enable to scale the image
		scalable: true,
		// Enable to zoom the image
		zoomable: true,
		// Enable to zoom the image by dragging touch
		zoomOnTouch: true,
		// Enable to zoom the image by wheeling mouse
		zoomOnWheel: true,
		// Define zoom ratio when zoom the image by wheeling mouse
		wheelZoomRatio: 0.01,
		// Enable to move the crop box
		cropBoxMovable: true,
		// Enable to resize the crop box
		cropBoxResizable: true,
		// Toggle drag mode between "crop" and "move" when click twice on the cropper
		toggleDragModeOnDblclick: true,
		// Size limitation
		minCanvasWidth: 0,
		minCanvasHeight: 0,
		minCropBoxWidth: 0,
		minCropBoxHeight: 0,
		minContainerWidth: 200,
		minContainerHeight: 100,
		// Shortcuts of events
		build: null,
		built: null,
		cropstart: null,
		cropmove: null,
		cropend: null,
		crop: null,
		zoom: null
	}
});

const updateOption = (state, name, value)=> {
	let newValue = value;
	if (name === 'aspectRatio') {
		newValue = Math.max(0, newValue) || NaN
	}
	if (name === 'viewMode') {
		newValue = Math.max(0, Math.min(3, Math.round(newValue))) || 0
	}
	return state.set(name, newValue);
};

export default handleActions({
		NEW_OPTIONS: (state, {payload}) => state
			.update('options', (options)=> R.reduce(
				(oldState, [name, value])=>updateOption(oldState, name, value)
			)(options, R.toPairs(payload)))
			.set('lastPassedOptions', Immutable.fromJS(payload))
	},
	initialState
)
