import React, { Component } from 'react';
import { createStore, compose, applyMiddleware } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { batchedUpdatesMiddleware } from 'redux-batched-updates';
import { Provider } from 'react-redux';
import reducer from './modules/reducer';
import init from './init';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import Immutable from 'immutable';

const loggerMiddleware = createLogger({
	transformer: (state) => {
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
});

export default ()=> {
	const finalCreateStore = compose(
		applyMiddleware(promiseMiddleware, thunkMiddleware, loggerMiddleware),
		devTools(),
		persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
	)(createStore);

	const store = finalCreateStore(reducer);

	if (module.hot) {
		module.hot.accept('./modules/reducer', () =>
			store.replaceReducer(require('./modules/reducer'))
		);
	}

	init(store);

	return store;
}
