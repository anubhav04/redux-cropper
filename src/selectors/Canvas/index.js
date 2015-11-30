import { createSelector } from 'reselect'
import limit from './limit'
import Immutable from 'immutable'
import { getRotatedSizes } from '../../utilities'
import { optionsSelector, canvasSelector, containerSelector, cropBoxSelector, imageSelector } from '../share'
import { limitRecordOffset, limitRecordSize } from '../../records/utils'

//const rotate = (options, canvas, container, cropBox, image)=> {
//	// Computes rotated sizes with image sizes
//	let rotated = getRotatedSizes({sizePoint: image.get('size'), degree: image.rotate});
//
//	let aspectRatio = rotated.getAspectRatio();
//
//	const rotate = image.get('rotate');
//
//	if (aspectRatio !== canvas.aspectRatio) {
//		const topLeft = canvas.get('offset')
//			.subtract(rotated.subtract(canvas.rect.get('size')))
//			.divideScalar(2);
//
//		let newNaturalSize = image.naturalSize;
//
//		// Computes rotated sizes with natural image sizes
//		if (rotate % 180) {
//			newNaturalSize = getRotatedSizes({sizePoint: image.get('naturalSize'), degree: rotate});
//		}
//
//		let newCanvas = canvas
//			.merge(topLeft.getOffset())
//			.merge(rotated.getSize())
//			.set('aspectRatio', aspectRatio)
//			.set('naturalSize', newNaturalSize);
//
//		const newOptions = options
//			.set('isPositionLimited', true)
//			.set('isSizeLimited', false);
//
//		const res = limit(newOptions, newCanvas, container, cropBox);
//
//		return res
//	}
//};

const render = (options, canvas, container, cropBox) => {

};

export default createSelector(
	optionsSelector,
	canvasSelector,
	containerSelector,
	cropBoxSelector,
	imageSelector,
	render
)
