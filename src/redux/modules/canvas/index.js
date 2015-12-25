import { createAction, handleActions } from 'redux-actions';
import limit from '../../../selectors/Canvas/limit';
import Immutable from 'immutable'
import { pointFromSize, pointFromOffset, zero } from '../../../records/point'
import { limitRecordOffset, limitRecordSize } from '../../../records/utils'
import { getRotatedSizes } from '../../../utilities';

const initialState = Immutable.fromJS({
	size: pointFromSize({
		width: 697.1539393939408,
		height: 392.14909090909174
	}),
	offset: pointFromOffset({
		left: 0.4230303030295204,
		top: -4.831690603168681e-13
	}),
	naturalSize: {
		x: 400,
		y: 300
	},
	zoomable: true,
	isDisabled: false
});

/**
 * Zoom the canvas with a relative ratio
 *
 * @param {Number} ratio
 */
const zoom = (canvas, ratio) => {
	return zoomTo(canvas, canvas.getIn(['size', 'x']) * ratio / canvas.getIn(['naturalSize', 'x']));
};

/**
 * Zoom the canvas to an absolute ratio
 *
 * @param {Number} ratio
 */
const zoomTo = (canvas, ratio) => {
	let newCanvas = canvas;

	newCanvas = newCanvas.set('size', canvas.get('naturalSize').scaleScalar(Number(ratio)));

	const val = (newCanvas.get('size').subtract(canvas.get('size')))
					.divideScalar(2);

	newCanvas = newCanvas.update('offset', (oldOffset)=> oldOffset.subtract(val))

	return newCanvas;
};

/**
 * Set the canvas position and size with new data
 *
 * @param {Object} data
 */
const setCanvasData = (state, {left, top, width, height})=> {
	let newState = state;
	const aspectRatio = newState.get('aspectRatio');

	if (isNumber(left)) {
		newState = newState.updateIn(['offset', 'x'], ()=>left);
	}

	if (isNumber(top)) {
		newState = newState.updateIn(['offset', 'y'], ()=>top);
	}

	if (isNumber(width)) {
		return newState.updateIn(['size', 'x'], ()=>width)
			.updateIn(['size', 'y'], ()=>width / aspectRatio);
	} else if (isNumber(height)) {
		return newState.updateIn(['size', 'y'], ()=>height)
			.updateIn(['size', 'x'], ()=>height * aspectRatio);
	}

	return newState;
};

export const init = (state, {payload:{options, image, cropBox, container}})=> {
	const viewMode = options.getIn(['options', 'viewMode']);

	let newCanvas = Immutable.fromJS({
		minOffset: zero,
		maxOffset: container.get('size'),
		naturalSize: image.get('naturalSize'),
		aspectRatio: image.get('aspectRatio'),
		size: container.get('size')
	});

	//const updateSize = (canvas, prop, value)=>
	//	canvas.update('size', (size)=> size.set(prop, value))

	//if (container.getIn(['size', 'y']) * image.get('aspectRatio') > container.getIn(['size', 'x'])) {
	//	if (viewMode === 3) {
	//		newCanvas = updateSize(newCanvas, 'x', container.getIn(['size', 'y']) * image.get('aspectRatio'));
	//	} else {
	//		newCanvas = updateSize(newCanvas, 'y', container.getIn(['size', 'x']) / image.get('aspectRatio'));
	//	}
	//} else {
	//	if (viewMode === 3) {
	//		newCanvas = updateSize(newCanvas, 'y', container.getIn(['size', 'x']) / image.get('aspectRatio'));
	//	} else {
	//		newCanvas = updateSize(newCanvas, 'y', container.getIn(['size', 'y']) * image.get('aspectRatio'));
	//	}
	//}

	const newOldTopLeft = container.get('size').subtract(newCanvas.get('size')).divideScalar(2);

	newCanvas = newCanvas
		.set('oldOffset', newOldTopLeft)
		.set('offset', newOldTopLeft);

	const newOptions = options
		.set('isPositionLimited', true)
		.set('isSizeLimited', true)
		.set('isLimited', (viewMode === 1 || viewMode === 2));

	return limit({
		options: newOptions,
		canvas: newCanvas,
		container,
		cropBox
	})
};

const rotate = (canvas, options, container, cropBox, image)=> {
	// Computes rotated sizes with image sizes
	let rotated = getRotatedSizes({sizePoint: image.get('size'), degree: image.get('rotate')});
	let aspectRatio = rotated.getAspectRatio();
	const rotate = image.get('rotate');

	// if (aspectRatio !== canvas.get('aspectRatio')) {
		const topLeft = rotated.subtract(canvas.get('size')).divideScalar(2);
		let newNaturalSize = image.get('naturalSize');

		// Computes rotated sizes with natural image sizes
		if (rotate % 180) {
			newNaturalSize = getRotatedSizes({sizePoint: image.get('naturalSize'), degree: rotate});
		}

		let newCanvas = canvas
			.update('offset', (offset)=>offset.subtract(topLeft))
			.set('size', rotated)
			.set('aspectRatio', aspectRatio)
			.set('naturalSize', newNaturalSize);

		const newOptions = options
			.set('isPositionLimited', true)
			.set('isSizeLimited', false);

		newCanvas = limit({
			options:newOptions, 
			canvas:newCanvas, 
			container, 
			cropBox
		});

		return newCanvas
	// }
	return canvas
};

export default handleActions({
		ROTATE_CANVAS: (state, {payload:{options, container, cropBox, image}}) => rotate(state, options, container, cropBox, image),
		INIT_CANVAS: init,
		SET_CANVAS_DATA: (state, {payload}) => setCanvasData(state, payload),
		SET_CANVAS_RAW: (state, {payload}) => payload,
		ACTION_ZOOM: (state, {payload:ratio}) => zoom(state, ratio),
		// ACTION_ZOOM_BY_COORDS: (state, {payload:{start, start2, end, end2}}) => {
		// 	const x1 = Math.abs(start.get('x') - start2.get('x'));
		// 	const y1 = Math.abs(start.get('y') - start2.get('y'));
		// 	const x2 = Math.abs(end.get('x') - end2.get('x'));
		// 	const y2 = Math.abs(end.get('y') - end2.get('y'));

		// 	const z1 = Math.sqrt(x1 * x1 + y1 * y1);
		// 	const z2 = Math.sqrt(x2 * x2 + y2 * y2);

		// 	const ratio = (z2 - z1) / z1;

		// 	return zoom(state, ratio);
		// },
		ACTION_MOVE: (state, {payload:{range}}) => {
			return state
				.updateIn(['offset', 'x'], (left)=>left + range.get('x'))
				.updateIn(['offset', 'y'], (top)=>top + range.get('y'));
		},
		CROP_UPDATED:(state, {payload:{options, container, cropBox}}) => {
			if(!options.get('lastPassedOptions')){
				return state;
			}
			let newCanvas = state;

			newCanvas = limitRecordOffset(newCanvas);
			
			newCanvas = limitRecordSize(newCanvas);

			const newOptions = options
				.set('isPositionLimited', true)
				.set('isSizeLimited', false);

			newCanvas = limit({
				options:newOptions,
				canvas:newCanvas,
				container,
				cropBox
			});

			// const newOldTopLeft = newCanvas.get('offset')
			// 	.max(newCanvas.get('minOffset'))
			// 	.min(newCanvas.get('maxOffset'));

			// const res = newCanvas
			// 	.set('oldOffset', newOldTopLeft)
			// 	.set('offset', newOldTopLeft);

			// console.log(JSON.stringify(res.get('offset')))

			return newCanvas;
		}
	},
	initialState
)
