import {zero, pointFct} from '../../records/point'

const limitSize = ({options, canvas, cropBox})=> {
	const {viewMode, minCanvasSize:_minCanvasSize, _isCropped, aspectRatio} = options.toJS();
	const isCropped = _isCropped && cropBox;
	let minCanvasSize = _minCanvasSize || zero;

	if (viewMode) {
		if (viewMode > 1) {
			minCanvasSize = minCanvasSize.max(container.get('size'));
		} else {
			if (minCanvasSize.get('x')) {
				minCanvasSize = minCanvasSize.update('x', (x) => Math.max(x, isCropped ? cropBox.get('width') : 0))
			} else if (minCanvasSize.get('y')) {
				minCanvasSize = minCanvasSize.update('y', (y) => Math.max(y, isCropped ? cropBox.get('height') : 0))
			} else if (isCropped) {
				minCanvasSize = cropBox.get('size');
			}
		}
	}

	minCanvasSize = minCanvasSize.normalizeByAspectRatio(aspectRatio);

	return canvas
		.set('minSize', minCanvasSize)
		.set('maxSize', pointFct({x: Infinity, y: Infinity}))
};

const limitPosition = ({options, canvas, container, cropBox})=> {
	const {viewMode, isCropped, isLimited} = options.toJS();

	const cropBoxOffset = cropBox.get('offset');
	const cropBoxSize = cropBox.get('size');

	if (!viewMode) {
		return canvas
			.set('minOffset', canvas.get('size').negate())
			.set('maxOffset', container.get('size'))
	} else {
		const newCanvasOffset = container.get('size').subtract(canvas.get('size'));

		let newCanvas = canvas
			.set('minOffset', zero.min(newCanvasOffset))
			.set('maxOffset', zero.max(newCanvasOffset));

		if (isCropped && isLimited) {
			let minOffset = cropBoxOffset.min(cropBoxOffset.add(cropBoxSize.subtract(newCanvas.get('size'))));
			let maxOffset = cropBoxOffset;

			if (viewMode === 2) {
				if (newCanvas.get('width') >= container.get('width')) {
					minOffset = minOffset.set('x', Math.min(0, newCanvasOffset.get('x')));
					maxOffset = maxOffset.set('x', Math.max(0, newCanvasOffset.get('x')));
				}

				if (newCanvas.get('height') >= container.get('height')) {
					minOffset = minOffset.set('y', Math.min(0, newCanvasOffset.get('y')));
					maxOffset = maxOffset.set('y', Math.max(0, newCanvasOffset.get('y')));
				}
			}

			return newCanvas
				.set('minOffset', minOffset)
				.set('maxOffset', maxOffset)
		}

		return newCanvas;
	}
};

export default ({options, canvas, container, cropBox}) => {
	const {isPositionLimited, isSizeLimited} = options.toJS();

	const sizeLimited = isSizeLimited ? limitSize({options, canvas, cropBox}) : canvas;

	return isPositionLimited ? limitPosition({options, canvas:sizeLimited, container, cropBox}) : sizeLimited;
}
