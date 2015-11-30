import React from 'react';
import PureComponent from 'react-pure-render/component';
import {getTransform} from  '../../utilities';
import {pointFromSize} from  '../../records/point';
import Immutable from  'immutable';
import Preview from  './Preview';

// if (options.responsive) {
//       $window.on(EVENT_RESIZE, (this._resize = proxy(this.resize, this)));
//     }

export default class SimplePreview extends PureComponent {
	render() {
		const {
			divSize,
			image,
			url,
			cropBox
			} = this.props;

		if(!image || !cropBox){
			return <div/>
		}

		let newDivSize = Immutable.Iterable.isIterable(divSize) ? divSize : pointFromSize(divSize);
		let ratio = 1;

		if (cropBox.getIn(['size', 'x'])) {
			ratio = newDivSize.get('x') / cropBox.getIn(['size', 'x']);
			newDivSize = newDivSize.set('y', cropBox.getIn(['size', 'y']) * ratio)
		}

		if (cropBox.getIn(['size', 'y']) && image.getIn(['naturalSize', 'y']) > newDivSize.get('y')) {
			ratio = newDivSize.get('y') / cropBox.getIn(['size', 'y']);

			newDivSize = newDivSize
				.set('x', cropBox.getIn(['size', 'x']) * ratio)
				.set('y', newDivSize.get('y'))
		}

		const newCropBoxOffset = cropBox.get('offset').negate().scaleScalar(ratio);

		const newProps = {
			divStyle: newDivSize.getSize(),
			imgStyle: {
				...image.get('size').scaleScalar(ratio).getSize(),
				marginLeft: newCropBoxOffset.get('x'),
				marginTop: newCropBoxOffset.get('y'),
				transform: getTransform({rotate:image.get('rotate'), scale: image.get('scale').toJS()})
			},
			url
		};

		return <Preview {...newProps}/>
	}
}
