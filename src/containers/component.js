import React, { Component } from 'react';

import create from '../redux/create';
import ConnectedAll from './ConnectedAll';

export default class Cropper extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
	}

	componentDidMount() {
		const reduxOptions = this.props.reduxOptions ? this.props.reduxOptions : {};
		const store = create(reduxOptions);

		this.setState({store})

		if(this.props.onRedux) {
			this.props.onRedux(store)
		}
	}

	render() {
		if(!this.state.store){
			return null;
		}
		return (
			<ConnectedAll options={this.props.options} store={this.state.store}/>
		);
	}
}

//<DebugPanel top right bottom>
//<DevTools store={store}
//					monitor={LogMonitor}
//					visibleOnLoad={true}/>
//</DebugPanel>
