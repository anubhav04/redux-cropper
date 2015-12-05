import Immutable from 'immutable'

import { handleActions } from 'redux-actions'
import { mergeReducer } from './utils'
import { pointFromSize, pointFromOffset } from '../../records/point';

export const init = (state, {payload:{size, minSize}})=>state.set('size', size.max(minSize))

export default handleActions(
	{
		INIT_CONTAINER: init
	},
	Immutable.fromJS({
		size: null
	})
)
