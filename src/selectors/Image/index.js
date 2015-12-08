import { createSelector } from 'reselect'
import { getRotatedSizes, getTransform } from '../../utilities'
import { canvasSelector, imageSelector } from '../share'
import {zero} from '../../records/point'

const render = (canvas, image) => {
	let newImage = image;

	const reversed = newImage.get('rotate') ? getRotatedSizes({
		sizePoint: newImage.get('size'),
		degree: newImage.get('rotate'),
		aspectRatio: newImage.get('aspectRatio'),
		isReversed: true
	}) : null;

	return reversed ?
		newImage
			.set('size', reversed)
			.set('offset', canvas.get('offset').subtract(reversed).divideScalar(2))
		:
		newImage
			.set('size', canvas.get('size'))
			.set('offset', zero);
};

export default createSelector(
	canvasSelector,
	imageSelector,
	render
)

