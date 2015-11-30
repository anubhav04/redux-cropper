import React from 'react';
import PureComponent from 'react-pure-render/component';
import CSSModules from "react-css-modules";
import styles from  './styles.scss';

class CropperFace extends PureComponent {
	render() {
		// const {cropBoxMovable, highlight, movable} = this.props;

		// if (!cropBoxMovable) {
		//   // Sync drag mode to crop box when it is not movable(#300)
		//   this.$face.
		//   data(DATA_ACTION, mode).
		//   toggleClass(CLASS_CROP, croppable).
		//   toggleClass(CLASS_MOVE, movable);
		// }

		// if (!highlight) {
		//   $face.addClass(CLASS_INVISIBLE);
		// }
		// if (cropBoxMovable) {
		//   $face.addClass(CLASS_MOVE).data(DATA_ACTION, ACTION_ALL);
		// }

		// if (movable && cropBoxMovable) {
		//   // Turn to move the canvas when the crop box is equal to the container
		//   this.$face.data(DATA_ACTION, (cropBox.width === containerWidth && cropBox.height === containerHeight) ? ACTION_MOVE : ACTION_ALL);
		// }

		return <span styleName="cropper-face cropper-move" data-action='ACTION_ALL'></span>
	}
}

export default CSSModules(CropperFace, styles, {allowMultiple:true})
