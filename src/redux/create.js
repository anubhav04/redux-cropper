import React, { Component } from 'react';
import { createStore, compose, applyMiddleware } from 'redux';
import { batchedUpdatesMiddleware } from 'redux-batched-updates';
import reducer from './modules/reducer';
import init from './init';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import Immutable from 'immutable';

const actionToJS = (action) => {
		const payload = action.payload
		if(payload){
			var newPayload = {};
			for (var i of Object.keys(payload)) {
				if (Immutable.Iterable.isIterable(payload[i])) {
					newPayload[i] = payload[i].toJS();
				} else {
					newPayload[i] = payload[i];
				}
			}	
			action.payload = newPayload;
		}
		
		return action;
	}

const stateToJS = (state) => {
		var newState = {};
		for (var i of Object.keys(state)) {
			if (Immutable.Iterable.isIterable(state[i])) {
				newState[i] = state[i].toJS();
			} else {
				newState[i] = state[i];
			}
		}
		return newState;
	}

const loggerMiddleware = createLogger({
	transformer: stateToJS,
	actionTransformer: actionToJS
});

export default ({isDebug})=> {
	const middlewares = [promiseMiddleware, thunkMiddleware];

	if(isDebug) {
		middlewares.push(loggerMiddleware)
	}

	const finalCreateStore = compose(
		applyMiddleware.apply(null, middlewares)
	)(createStore);

	const store = finalCreateStore(reducer);

	if (isDebug || module.hot) {
		module.hot.accept('./modules/reducer', () =>
			store.replaceReducer(require('./modules/reducer'))
		);
	}

	init(store);

	return store;
}
