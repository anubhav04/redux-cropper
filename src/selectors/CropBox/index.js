import { createSelector } from 'reselect'
import limit from './limit'
import { canvasSelector, cropBoxSelector, containerSelector, optionsSelector } from '../share'
import { limitRecordOffset, limitRecordSize, limitRecordPoint } from '../../records/utils'

const render = (options, cropBox, container, canvas) => {
	if(!options.get('lastPassedOptions')){
		return cropBox;
	}

	let newCropBox = cropBox;

	newCropBox = limitRecordOffset(newCropBox);
	newCropBox = limitRecordSize(newCropBox);

	const newOptions = options
		.set('isPositionLimited', true)
		.set('isSizeLimited', false);

	newCropBox = limit({
		options:newOptions,
		cropBox:newCropBox,
		container,
		canvas
	});

	newCropBox = limitRecordPoint('offset')(newCropBox);

	return newCropBox.set('oldOffset', newCropBox.get('offset'));
};

export default createSelector(
	optionsSelector,
	cropBoxSelector,
	containerSelector,
	canvasSelector,
	render
)
