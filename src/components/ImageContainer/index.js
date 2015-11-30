import React from 'react';
import PureComponent from 'react-pure-render/component';

import CSSModules from "react-css-modules";
import styles from  './styles.scss';
import Container from '../Container';

// if (options.responsive) {
//       $window.on(EVENT_RESIZE, (this._resize = proxy(this.resize, this)));
//     }

class ImageContainer extends PureComponent {
	render() {
		const {
			container,
			actionDirections,
			style,
			handlers,
			cropperActions
			} = this.props;

		const {cropStart, cropMove, cropEnd} = cropperActions;
		const {wheel, dblClick} = handlers;

		return <div style={style}
								onMouseDown={cropStart}
								onMouseMove={cropMove}
								onMouseUp={cropEnd}
								onDoubleClick={dblClick}
								onWheel={wheel}>
			<img src={container.getIn(['cropBox','viewBox','url'])} styleName="cropper-hidden"/>
			<Container container={container}
				actionDirections={actionDirections}/>
		</div>
	}
}

export default CSSModules(ImageContainer, styles, {allowMultiple: true})
