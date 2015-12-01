import React from 'react';
import PureComponent from 'react-pure-render/component';

import CSSModules from "react-css-modules";
import styles from  './styles.module.scss';
import WrapBox from '../WrapBox'
import CropBox from '../CropBox'
import DragBox from '../DragBox'

class Container extends PureComponent {
	render() {
		const {container, actionDirections} = this.props;

		return <div styleName="cropper-container cropper-bg"
								style={container.getIn(['container', 'size']).getSize()}>
			<WrapBox wrapBox={container.get('wrapBox')} />
			<DragBox modal={true}/>
			<CropBox cropBox={container.get('cropBox')} actionDirections={actionDirections}/>
		</div>
	}
}

export default CSSModules(Container, styles, {allowMultiple: true})
