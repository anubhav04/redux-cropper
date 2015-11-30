import React, { Component } from 'react';

import create from '../redux/create';
import ConnectedAll from './ConnectedAll';

export default (options)=>{
	const store = create(options);

	class Cropper extends Component {
		render() {
			return (
				<div>
					<ConnectedAll options={this.props} store={store}/>
				</div>
			);
		}
	}
	return Cropper;
}

//<DebugPanel top right bottom>
//<DevTools store={store}
//					monitor={LogMonitor}
//					visibleOnLoad={true}/>
//</DebugPanel>
