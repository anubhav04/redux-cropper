import {zero} from '../../records/point'

const limitSize = ({options, cropBox, container, canvas})=> {
	const {isLimited, aspectRatio} = options;
	let minCropBoxSize;
	let maxCropBoxSize;

	minCropBoxSize = options.minCropBoxSize || zero;

	// The min/maxCropBoxWidth/Height must be less than container.get('width')/Height
	minCropBoxSize = minCropBoxSize.min(container);
	maxCropBoxSize = container.min(isLimited ? canvas.get('size') : container);

	if (aspectRatio) {
		minCropBoxSize = minCropBoxSize.normalizeByAspectRatio(aspectRatio);
		maxCropBoxSize = maxCropBoxSize.normalizeByAspectRatio(aspectRatio);
	}

	// The minWidth/Height must be less than maxWidth/Height
	return cropBox
		.set('minSize', minCropBoxSize.min(maxCropBoxSize))
		.set('maxSize', maxCropBoxSize)
};

const limitPosition = ({options, cropBox, container, canvas})=> options.isLimited ?
	cropBox
		.set('minOffset', zero.max(canvas.get('offset')))
		.set('maxOffset', container.get('size').min(canvas.get('offset').add(canvas.get('size')).subtract(cropBox.get('size'))))
	:
	cropBox
		.set('minOffset', zero)
		.set('maxOffset', container.get('size').subtract(cropBox.get('size')));

export default ({options:_options, cropBox, container, canvas}) => {
	const options = _options.toJS();
	const {isPositionLimited, isSizeLimited} = options;

	const sizeLimited = isSizeLimited ? limitSize({options, cropBox, container, canvas}) : cropBox;
	return isPositionLimited ? limitPosition({options, cropBox:sizeLimited, container, canvas}) : sizeLimited;
}
