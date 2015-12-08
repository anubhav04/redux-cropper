import { createAction, handleActions } from 'redux-actions';
import Immutable from 'immutable'
import {
	ACTION_SOUTH,
	ACTION_EAST,
	ACTION_SOUTH_WEST,
	ACTION_NORTH,
	ACTION_WEST,
	ACTION_NORTH_WEST,
	ACTION_NORTH_EAST,
	ACTION_SOUTH_EAST,
	ACTION_ALL
} from '../../../constants/actions';
import {zero} from '../../../records/point';
import direction from './direction';
import limit from '../../../selectors/CropBox/limit';
import { limitRecordPoint } from '../../../records/utils';
import { pointFromSize, pointFromOffset } from '../../../records/point';

export const init = (state, {payload:{options:_options, canvas, cropBox, container}}) => {
	const options = _options.get('options');

	const aspectRatio = options.get('aspectRatio');
	const autoCropArea = Number(options.get('autoCropArea')) || 0.8;

	let newCropBox = cropBox
	//newCropBox = newCropBox.set('size', canvas.get('size'));
	newCropBox = newCropBox.set('maxSize', container.get('size'));
	newCropBox = newCropBox.set('minSize', zero);

	return newCropBox
	    .set('size', container.get('size'))
		.set('offset', zero);

	if (aspectRatio) {
		newCropBox = newCropBox.normalizeByAspectRatio(aspectRatio);
	}

	const newOptions = options
		.set('isPositionLimited', true)
		.set('isSizeLimited', true);

	newCropBox = limit({
		options: newOptions,
		cropBox: newCropBox,
		container,
		canvas
	});

	const newOldTopLeft = canvas.get('offset')
		.add(
			(canvas.get('size').subtract(newCropBox.get('size')))
				.divideScalar(2)
		);
	newCropBox = newCropBox
		.set('oldOffset', newOldTopLeft.get('offset'))
		.set('size', limitRecordPoint('size')(newCropBox));

	// The width of auto crop area must large than "minWidth", and the height too. (#164)
	return newCropBox
		.update('size', (size)=>newCropBox.get('minSize').max(size.scaleScalar(autoCropArea)))

};

export const actionCrop = (range, offset) =>
	(dispatch, getState)=> {
		const {x, y} = range;
		const {cropBox, moveCoods} = getState();

		let newOffset = moveCoods.get('start').subtract(offset);
		let size = cropBox.get('minSize');

		if (x > 0) {
			dispatch(createAction(y > 0 ? ACTION_SOUTH_EAST : ACTION_NORTH_EAST))
		} else if (x < 0) {
			newOffset = newOffset.update('x', (left)=>left - size.get('x'));
			dispatch(createAction(y > 0 ? ACTION_SOUTH_WEST : ACTION_NORTH_WEST))
		}

		if (y < 0) {
			newOffset = newOffset.update('y', (top)=>top - size.get('y'))
		}

		dispatch(createAction(RAW_SET_CROPBOX_DATA), {offset: newOffset, size, show: true});
	};


export default handleActions({
		...direction,
		RAW_SET_CROPBOX_DATA: (state, payload) => state.merge(payload),
		SET_CROPBOX_DATA: (state, {payload:{data:{left, top, width, height}}}) => {
			const aspectRatio = state.get('aspectRatio');
			let isWidthChanged;
			let isHeightChanged;

			let newState = state;

			if (isNumber(left)) {
				newState = newState.setIn(['offset', 'x'], left);
			}

			if (isNumber(top)) {
				newState = newState.setIn(['offset', 'y'], top);
			}

			if (isNumber(width) && width !== state.width) {
				isWidthChanged = true;
				newState = newState.setIn(['size', 'x'], width);
			}

			if (isNumber(height) && height !== state.height) {
				isHeightChanged = true;
				newState = newState.setIn(['size', 'y'], height);
			}

			if (aspectRatio) {
				if (isWidthChanged) {
					newState = newState.setIn(['size', 'y'], newState.get('width') / aspectRatio);
				} else if (isHeightChanged) {
					newState = newState.setIn(['size', 'x'], newState.get('height') * aspectRatio);
				}
			}

			return newState;
		},
		ACTION_ALL: (state, {payload:{range:{x, y}}}) => state
			.updateIn(['offset', 'x'], (left)=>left + x)
			.updateIn(['offset', 'y'], (top)=>top + y),
		SET_ASPECT_RATIO: (state, {payload:{aspectRatio}}) => {
			// 0 -> NaN
			const newAspectRatio = Math.max(0, aspectRatio) || NaN;
		},
		INIT_CROP_BOX: init
	},
	Immutable.fromJS({
		size: pointFromSize({
			width: 0,
			height: 0
		}),
		offset: pointFromOffset({
			left: 0,
			top: 0
		})
	})
)


