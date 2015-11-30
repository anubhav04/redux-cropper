import React from 'react';
import PureComponent from 'react-pure-render/component';
import ViewBox from '../ViewBox'
import CropperFace from '../CropperFace'
import perf from 'react-perf-component'
import {
	ACTION_SOUTH,
	ACTION_EAST,
	ACTION_SOUTH_WEST,
	ACTION_NORTH,
	ACTION_WEST,
	ACTION_NORTH_WEST,
	ACTION_NORTH_EAST,
	ACTION_SOUTH_EAST
} from '../../constants/direction';
import CSSModules from "react-css-modules";
import styles from  './styles.scss';

class CropBox extends PureComponent {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		const {cropBox} = this.props;

		const options = cropBox.get('options');
		const viewBox = cropBox.get('viewBox');
		const cropBoxData = cropBox.get('cropBox');

		const { guides, center, cropBoxResizable } = options.toJS();

		return <div styleName="cropper-crop-box"
								style={{...cropBoxData.get('size').getSize(), ...cropBoxData.get('offset').getOffset()}}>
			<ViewBox viewBox={viewBox}/>
			{guides ? (<div>
				<span styleName="cropper-dashed dashed-h"/>
				<span styleName="cropper-dashed dashed-v"/>
			</div>) : null}
			{center ? <span styleName="cropper-center"/> : null}
			<CropperFace/>
			{cropBoxResizable ?
				(<div>
					<span styleName="cropper-line line-e" data-action={ACTION_EAST}/>
					<span styleName="cropper-line line-n" data-action={ACTION_NORTH}/>
					<span styleName="cropper-line line-w" data-action={ACTION_WEST}/>
					<span styleName="cropper-line line-s" data-action={ACTION_SOUTH}/>
					<span styleName="cropper-point point-e" data-action={ACTION_EAST}/>
					<span styleName="cropper-point point-n" data-action={ACTION_NORTH}/>
					<span styleName="cropper-point point-w" data-action={ACTION_WEST}/>
					<span styleName="cropper-point point-s" data-action={ACTION_SOUTH}/>
					<span styleName="cropper-point point-ne" data-action={ACTION_NORTH_EAST}/>
					<span styleName="cropper-point point-nw" data-action={ACTION_NORTH_WEST}/>
					<span styleName="cropper-point point-sw" data-action={ACTION_SOUTH_WEST}/>
					<span styleName="cropper-point point-se" data-action={ACTION_SOUTH_EAST}/>
				</div>) : null
			}
		</div>
	}
}

export default CSSModules(CropBox, styles, {allowMultiple: true})
