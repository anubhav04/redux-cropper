import React from 'react';
import PureComponent from 'react-pure-render/component';

export default class Preview extends PureComponent {
	render() {
		const {divStyle, imgStyle, url, styleName} = this.props;

		return <div style={{...divStyle, overflow:'hidden'}} className={styleName}>
			<img style={imgStyle} src={url}/>
		</div>
	}
}
