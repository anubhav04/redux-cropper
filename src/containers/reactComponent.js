import React, { Component } from 'react';
import create from '../redux/create';
import ConnectedAll from './ConnectedAll';
import { reduxToReact } from 'redux-as-component';
import { init } from '../actions/init';
import { rotate } from '../actions/rotate';
import { getBlob } from '../actions/handlers';

export default (reduxToReact(
	{
		onCropperReduxUpdate: ({
			image, 
			cropBox, 
			myState, 
			canvas
		})=>({
			image, 
			cropBox, 
			myState, 
			canvas
		})
	},
	{
		rotate : rotate,
		'@default' : init
	},
	{
		getBlob,
	},
	create,
	{isDebug: true},
	ConnectedAll
))
