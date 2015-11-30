import React from 'react';
import PureComponent from 'react-pure-render/component';

import CSSModules from "react-css-modules";
import styles from  './styles.scss';

class DragBox extends PureComponent {
	render() {
		const {modal} = this.props;

		let styles = "cropper-drag-box cropper-crop";

		return <div styleName={modal ? styles + ' cropper-modal' : styles}></div>
	}
}

export default CSSModules(DragBox, styles, {allowMultiple: true})
