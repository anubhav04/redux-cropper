import React, { Component } from 'react';

import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Provider } from 'react-redux';
import create from '../redux/create';
import ConnectedAll from './ConnectedAll';

const store = create();

export default class App extends Component {
	render() {
		return (
				<ConnectedAll options={this.props} store={store}/>
		);
	}
}

//<DebugPanel top right bottom>
//<DevTools store={store}
//					monitor={LogMonitor}
//					visibleOnLoad={true}/>
//</DebugPanel>
