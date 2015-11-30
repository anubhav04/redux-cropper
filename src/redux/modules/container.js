import Immutable from 'immutable'

import { handleActions } from 'redux-actions'
import { mergeReducer } from './utils'
import { pointFromSize, pointFromOffset } from '../../records/point';

export default handleActions(
	{
		INIT_CONTAINER: (state, {payload:{size, minSize}})=>{
			console.log(size);
			console.log(minSize);
			return state.set('size', size.max(minSize))
		}
	},
	Immutable.fromJS({
		size: null
	})
)
