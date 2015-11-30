import { combineReducers } from 'redux';
import { createAction, handleActions } from 'redux-actions';
import { filterActions } from 'redux-ignore';

import canvas from './canvas';
import cropBox from './cropbox';
import container from './container';
import image from './image';
import myState from './myState';
import options from './options';
import moveCoords from './moveCoords';

const test = handleActions({ SET_CROPPED_IMG: (state, {payload}) => payload}, {});

export default combineReducers({
	canvas,
	cropBox,
	container,
	image,
	myState,
	options,
	moveCoords,
	test
});
