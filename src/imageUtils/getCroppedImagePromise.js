import { zero, one, pointFromSize, pointFct } from '../records/point'
import { getRotatedSizes } from '../utilities'
import Immutable from 'immutable'
import { onLoadUrlPromise } from './index'

export default (obj)=>
	onLoadUrlPromise({url:obj.options.get('url')})
	.then(
		({src})=> getBlobFromSrc({obj, src, type: "image/png", quality: 1})
	)

export const getBlobFromSrc = ({obj, src, type, quality})=>{
	const options = obj.options;
	const imageElem = document.createElement("img");
	imageElem.src = src;

	let data = getData({...obj});
	const canvasSize = obj.cropData.canvas.get('size');

	const canvas = document.createElement('canvas');
	
	canvas.width = data.getIn(['size', 'x']);
	canvas.height = data.getIn(['size', 'y']);

	const context = canvas.getContext('2d');
	// context.fillStyle = "blue";
 //    context.fillRect(0, 0, canvas.width, canvas.height);

	if (options.get('fillColor')) {
		context.fillStyle = options.get('fillColor');
		context.fillRect(0, 0, canvasSize.get('x'), canvasSize.get('y'));
	}

	const drawImageParams = getDrawImageParams({imageElem, data, cropData:obj.cropData});
	
	if(typeof IS_TEST === 'undefined'){
		// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
		context.drawImage.apply(context,  drawImageParams)
	}
	
	return canvas.toDataURL(type, quality);
}

export const getDrawImageParams = ({ imageElem, cropData, data})=> {
	const sourceCanvas = getSourceCanvas({
		imageElem, 
		image: cropData.image, 
		canvasData: cropData.canvas
	});

	return [sourceCanvas, ...getDrawImageParamsParams({
		srcPoint: data.get('offset'), 
		originalSize: data.get('size'), 
		sourceSize: pointFromSize(sourceCanvas)
	})];
};

export const getDrawImageParamsParams = ({srcPoint, originalSize, sourceSize})=>{
	let args = [];
	let dstPoint = zero;
	let srcSize = zero;
	let dstSize = zero;

	if (srcPoint.get('x') <= -originalSize.get('x') ||
		srcPoint.get('x') > sourceSize.get('x')) {
		// srcPoint = srcPoint.set('x', 0);
	} 
	if (srcPoint.get('x') <= 0) {
		dstPoint = dstPoint.set('x', -srcPoint.get('x'));
		srcPoint = srcPoint.set('x', 0);
		const _width = Math.min(sourceSize.get('x'), originalSize.get('x') + srcPoint.get('x'));

		srcSize = srcSize.set('x', _width);
		dstSize = dstSize.set('x', _width);
	} else if (srcPoint.get('x') <= sourceSize.get('x')) {
		dstPoint = dstPoint.set('x', 0);

		const _width = Math.min(originalSize.get('x'), sourceSize.get('x') - srcPoint.get('x'));
		srcSize = srcSize.set('x', _width);
		dstSize = dstSize.set('x', _width);
	}

	if (srcSize.get('x') <= 0 ||
		srcPoint.get('y') <= -originalSize.get('y') ||
		srcPoint.get('y') > sourceSize.get('y')) {
		// srcPoint = srcPoint.set('y', 0);
	}
	 if (srcPoint.get('y') <= 0) {
		dstPoint = dstPoint.set('y', -srcPoint.get('y'));
		srcPoint = srcPoint.set('y', 0);

		const _width = Math.min(sourceSize.get('y'), originalSize.get('y') + srcPoint.get('y'));

		srcSize = srcSize.set('y', _width);
		dstSize = dstSize.set('y', _width);
	} else if (srcPoint.get('y') <= sourceSize.get('y')) {
		dstSize = dstSize.set('y', 0);

		const _height = Math.min(originalSize.get('y'), sourceSize.get('y') - srcPoint.get('y'));
		srcSize = srcSize.set('y', _height);
		dstSize = dstSize.set('y', _height);
	}

	args = [
		...args,
		Math.floor(srcPoint.get('x')),
		Math.floor(srcPoint.get('y')),
		Math.floor(srcSize.get('x')),
		Math.floor(srcSize.get('y'))
	];

	// Avoid "IndexSizeError" in IE and Firefox
	if (dstSize.get('x') > 0 && dstSize.get('y') > 0) {
		args = [
			...args,
			Math.floor(dstPoint.get('x')),
			Math.floor(dstPoint.get('y')),
			Math.floor(dstSize.get('x')),
			Math.floor(dstSize.get('y'))
		]
	}
	return args;
}

export const getSourceCanvasPure = ({ image, canvasData }) => {
	let canvasSize  = image.get('naturalSize')
	const rotate = image.get('rotate') || 0;
	const scale = image.get('scale');

	const rotated = getRotatedSizes({
		sizePoint: canvasSize,
		degree: rotate,
		aspectRatio: canvasData.get('size').getAspectRatio()
	});

	canvasSize = rotated;
	const translate = rotated.divideScalar(2);
	
	const offset = true ? image.get('naturalSize').negate().divideScalar(2) : zero;
	
	return {canvasSize, translate, rotate, scale, offset, resize: image.get('naturalSize')};
}

export const getSourceCanvas = ({ imageElem, image, canvasData }) => {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	const {canvasSize, translate, rotate, scale, offset, resize} = getSourceCanvasPure({ 
		imageElem, 
		image,
		canvasData
	});

	canvas.width = canvasSize.get('x');
	canvas.height = canvasSize.get('y');

	// context.fillStyle = "red";
	// context.fillRect(0 ,0, canvas.width, canvas.height);

	context.save();
	if(translate) {
		context.translate(translate.get('x'), translate.get('y'));	
	}

	if (rotate) {
		context.rotate(rotate * Math.PI / 180);
	}

	if (scale) {
		context.scale(scale.get('x'), scale.get('y'));
	}

	if(typeof IS_TEST === 'undefined') {
		context.drawImage(imageElem, offset.get('x'), offset.get('y'), resize.get('x'), resize.get('y'));
	}

    context.restore();
    
	return canvas;
};

export const getData = ({ options, cropData:{image, canvas, cropBox}, isRounded }) => {
	let data = Immutable.fromJS({
		offset: cropBox.get('offset').subtract(canvas.get('offset')),
		size: cropBox.get('size')
	});

	const ratioPoint = pointFct({
		x: image.getIn(['naturalSize', 'x']) / image.getIn(['size', 'x']),
		y: image.getIn(['naturalSize', 'y']) / image.getIn(['size', 'y'])
	})

	const onRatio = (point)=> {
		const newPoint = point.scale(ratioPoint);
		return isRounded ? newPoint.updateCoordsOnTransform(Math.round) : newPoint;
	}

	data = data
	.update('offset', onRatio)
	.update('size', onRatio);

	// data = data.setIn(['x'], 153.60000000000002)

	if (options.get('rotatable')) {
		data = data.set('rotate', image.get('rotate') || 0)
	}

	if (options.get('scalable')) {
		data = data.set('scale', image.get('scale') || one)
	}

	return data;
};
