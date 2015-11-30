import React, { Component } from 'react';

import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Provider } from 'react-redux';
import create from '../redux/create';
import ConnectedAll from './ConnectedAll';

const store = create();

export default class App extends Component {
	render() {
		return (
			<div>
				<Provider store={store}>
					{() => <ConnectedAll options={this.props}/> }
				</Provider>
			</div>
		);
	}
}

//<DebugPanel top right bottom>
//<DevTools store={store}
//					monitor={LogMonitor}
//					visibleOnLoad={true}/>
//</DebugPanel>
