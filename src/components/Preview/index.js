import React from 'react';
import PureComponent from 'react-pure-render/component';
import {getTransform} from  '../../utilities';
import Preview from  './Preview';

// if (options.responsive) {
//       $window.on(EVENT_RESIZE, (this._resize = proxy(this.resize, this)));
//     }

export default class SimplePreview extends PureComponent {
	render() {
		const {
			divSize,
			image: {
				size: imageSize,
				rotate,
				scale
				},
			url,
			cropBox: {
				size: cropBoxSize,
				offset: cropBoxOffset
				}
			} = this.props;

		let newDivSize = divSize;
		let ratio = 1;

		if (cropBoxSize.get('x')) {
			ratio = divSize.get('x') / cropBoxSize.get('x');
			newDivSize = newDivSize.set('y', cropBoxSize.get('y') * ratio)
		}

		if (cropBoxSize.get('y') && newHeight > divSize.get('y')) {
			ratio = divSize.get('y') / cropBoxSize.get('y');

			newDivSize = newDivSize
				.set('x', cropBoxSize.get('x') * ratio)
				.set('y', divSize.get('y'))
		}

		const newCropBoxOffset = cropBoxOffset.negate().scaleScalar(ratio);

		const newProps = {
			divStyle: newDivSize.getSize(),
			imgStyle: {
				...imageSize.scaleScalar(ratio).getSize(),
				marginLeft: newCropBoxOffset.get('x'),
				marginTop: newCropBoxOffset.get(''),
				transform: getTransform({rotate, scale: scale.toJS()})
			},
			url
		};

		return <Preview {...newProps}/>
	}
}
