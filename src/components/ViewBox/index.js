import React from 'react';
import PureComponent from 'react-pure-render/component';


import {getTransform} from '../../utilities';
import styles from  './styles.module.scss';
import Preview from  '../Preview/Preview';

export default class ViewBox extends PureComponent {
	render() {
		const {viewBox} = this.props;

		const url = viewBox.get('url');
		const cropBoxOffset = viewBox.get('cropBoxOffset');
		const canvasOffset = viewBox.get('canvasOffset');
		const image = viewBox.get('image');

		const offset = cropBoxOffset
			.subtract(canvasOffset)
			.subtract(image.get('offset'))
			.negate();

		const newProps = {
			styleName: styles['cropper-view-box'],
			imgStyle: {
				...image.get('size').getSize(),
				marginLeft: offset.get('x'),
				marginTop: offset.get('y'),
				transform: getTransform({rotate:image.get('rotate'), scale:image.get('scale')})
			},
			url
		};

		return <Preview {...newProps}/>
	}
}
