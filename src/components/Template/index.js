import React from 'react';
import PureComponent from 'react-pure-render/component';
import CropBox from '../CropBox'
import DragBox from '../DragBox'

import CSSModules from "react-css-modules";
import styles from  './styles.module.scss';

class Template extends PureComponent {
	render() {
		return <div styleName="cropper-container">
			<div styleName="cropper-wrap-box">
				<div styleName="cropper-canvas"></div>
			</div>
			<DragBox/>
			{this.props.cropBox ? <CropBox/> : null}
		</div>
	}
}

export default CSSModules(Template, styles)
