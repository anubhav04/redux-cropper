import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect'
import { CanvasSelector, CropBoxSelector, ImageSelector, optionsSelector, containerSelector} from '../selectors';
import * as actionDirections from '../redux/modules/cropbox/direction';
import * as dragboxActions from '../redux/modules/dragbox';
import * as moveCoordsActions from '../redux/modules/moveCoords/actions';
import * as handlers from '../actions/handlers';
import ImageContainer from '../components/ImageContainer';
import { pointFromSize, pointFct, pointFromOffset } from '../records/point';

const allSelector = createStructuredSelector({
	testImg: (state)=>state.test,
	canvasData: (state)=>state.canvas,
	containerData: (state)=>state.container,
	cropBoxData: (state)=>state.cropBox,
	myState: (state)=>state.myState,
	imageData: (state)=>state.image,
	options: optionsSelector
});

class ConnectedAll extends Component {
	render() {
		const {
			canvasData,
			containerData,
			options,
			cropBoxData,
			imageData,
			actionEast,
			actionWest,
			actionSouth,
			actionNorth,
			actionSouthEast,
			actionSouthWest,
			actionNorthEast,
			actionNorthWest,
			wheel,
			cropStart,
			cropMove,
			cropEnd,
			myState
		} = this.props;

		const actionDirections = {
			actionEast,
			actionWest,
			actionSouth,
			actionNorth,
			actionSouthEast,
			actionSouthWest,
			actionNorthEast,
			actionNorthWest
		};

		const handlers = {
			wheel
		};

		const cropperActions = {
			cropStart,
			cropMove,
			cropEnd
		};

		if(!options || !myState.get('isInited')){
			return <div/>;
		}

		const {guides, center, cropBoxResizable, url} = options.toJS();

		const container = Immutable.fromJS({
			wrapBox: {
				canvas: canvasData,
				image: imageData,
				url: url
			},
			cropBox: {
				options: {
					guides,
					center,
					cropBoxResizable
				},
				viewBox: {
					canvasOffset: canvasData.get('offset'),
					cropBoxOffset: cropBoxData.get('offset'),
					image: imageData,
					url: url
				},
				cropBox: cropBoxData
			},
			container: containerData
		});

		return (
				<ImageContainer
					handlers={handlers}
					cropperActions={cropperActions}
					options={options.toJS()}
					style={{}}
					container={container}
					actionDirections={actionDirections}/>
		);
	}
}

export default connect(
	allSelector,
	{
		...actionDirections,
		...handlers,
		...moveCoordsActions,
		...dragboxActions
	}
)(ConnectedAll);
